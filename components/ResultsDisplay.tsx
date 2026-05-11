/**
 * @file ResultsDisplay.tsx
 * @description عرض النتائج والتوزيع مع مشاركة متقدمة ورسوم متحركة
 * Results Display Component with Comprehensive Sharing and Animations
 * 
 * FIXES:
 * - M6 (🟡): Share preview before sharing
 * - L2 (🔵): Results counting animation
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Share,
  Platform,
  Clipboard,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '../lib/icons';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import ViewShot from 'react-native-view-shot';
import { useResults, useCalculator, type ComparisonResult } from '../lib/inheritance/hooks';
import { useAppTheme } from '../lib/context/ThemeProvider';
import type { CalculationResult } from '../lib/inheritance/types';
import { PDFExporter } from '../lib/export/PDFExporter';
import { ErrorLogger } from '../lib/errors/ErrorHandler';

export interface ResultsDisplayProps {
  result?: CalculationResult | null;
  onClose?: () => void;
}

type ShareFormat = 'pdf' | 'text' | 'image' | 'clipboard';
type ShareStatus = 'idle' | 'generating' | 'sharing' | 'success' | 'error';

// ===== FIX L2: Animated number component =====
const AnimatedNumber = ({ 
  value, 
  duration = 1000,
  format = true 
}: { 
  value: number; 
  duration?: number;
  format?: boolean;
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef<Animated.Value>(new Animated.Value(0));
  const previousValueRef = useRef(0);

  useEffect(() => {
    if (value === displayValue) return;

    const animation = animationRef.current;

    // Stop any ongoing animation
    animation.stopAnimation();

    // Start new animation
    Animated.timing(animation, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        setDisplayValue(value);
        previousValueRef.current = value;
      }
    });

    // Listen to animation progress
    const listener = animation.addListener(({ value: progress }) => {
      const newValue = previousValueRef.current + (value - previousValueRef.current) * progress;
      setDisplayValue(newValue);
    });

    return () => {
      animation.removeListener(listener);
    };
  }, [value, duration, displayValue]);

  const formattedValue = format 
    ? displayValue.toFixed(2).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)] || d)
    : Math.round(displayValue).toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)] || d);

  return <Text>{formattedValue}</Text>;
};

// ===== FIX M6: Share preview modal =====
const SharePreviewModal = ({
  visible,
  onClose,
  onConfirm,
  result,
  format,
  previewHTML,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  result: CalculationResult;
  format: ShareFormat;
  previewHTML: string;
}) => {
  const { t } = useTranslation();
  const { theme } = useAppTheme();

  const getFormatIcon = () => {
    switch (format) {
      case 'pdf': return 'file-pdf-box';
      case 'image': return 'image';
      case 'text': return 'text';
      case 'clipboard': return 'content-copy';
      default: return 'share';
    }
  };

  const getFormatName = () => {
    switch (format) {
      case 'pdf': return t('results.shareFormat.pdf');
      case 'image': return t('results.shareFormat.image');
      case 'text': return t('results.shareFormat.text');
      case 'clipboard': return t('results.shareFormat.clipboard');
      default: return t('calculator.share');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.previewOverlay}>
        <View style={[styles.previewContent, { backgroundColor: theme.colors.background.light }]}>
          <View style={styles.previewHeader}>
            <View style={styles.previewHeaderLeft}>
              <MaterialCommunityIcons name={getFormatIcon()} size={24} color={theme.colors.primary.main} />
              <Text style={styles.previewTitle}>{t('results.previewTitle', { format: getFormatName() })}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.previewScroll}>
            {format === 'pdf' ? (
              <View style={styles.previewHTML}>
                <Text style={styles.previewHTMLText}>{previewHTML.substring(0, 500)}...</Text>
              </View>
            ) : format === 'image' ? (
              <View style={styles.previewImagePlaceholder}>
                <MaterialCommunityIcons name="image" size={48} color={theme.colors.neutral.light300} />
                <Text style={styles.previewImageText}>{t('results.previewImage')}</Text>
              </View>
            ) : (
              <View style={styles.previewText}>
                <Text style={styles.previewTextContent}>{previewHTML}</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.previewActions}>
            <TouchableOpacity
              style={[styles.previewButton, styles.previewCancelButton]}
              onPress={onClose}
            >
              <Text style={styles.previewCancelText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.previewButton, styles.previewConfirmButton, { backgroundColor: theme.colors.primary.main }]}
              onPress={onConfirm}
            >
              <Text style={styles.previewConfirmText}>{t('calculator.share')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export function ResultsDisplay({ result, onClose }: ResultsDisplayProps) {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const viewShotRef = useRef<ViewShot>(null);
  const hooksResults = useResults();
  const calculator = useCalculator();
  const results = useMemo(() => hooksResults?.previousResults || [], [hooksResults]);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState<number | null>(null);
  
  // Share states
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareStatus, setShareStatus] = useState<ShareStatus>('idle');
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareFormat, setShareFormat] = useState<ShareFormat>('pdf');
  
  // ===== FIX M6: Preview state =====
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewHTML, setPreviewHTML] = useState('');

  // Export states
  const [, setExportLoading] = useState(false);
  const [madhabComparisonResults, setMadhabComparisonResults] = useState<ComparisonResult[]>([]);
  const [comparisonLoading, setComparisonLoading] = useState(false);

  // ===== FIX L2: Animation values for counting =====
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [totalAmount, setTotalAmount] = useState(0);

  // Get comparison data from the enhanced hook
  const { 
    comparisonResults, 
    generateComparisonReport,
  } = hooksResults;

  const activeComparisons = madhabComparisonResults.length > 0 ? madhabComparisonResults : comparisonResults;
  const currentResult = result || calculator.result || results[0];
  const previousResults = results.slice(1, 4);

  // ===== FIX L2: Animate entrance =====
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // ===== FIX L2: Calculate total for animation =====
  useEffect(() => {
    if (currentResult?.success) {
      const total = currentResult.shares.reduce((sum, s) => sum + s.amount, 0);
      setTotalAmount(total);
    }
  }, [currentResult]);

  const stats_data = useMemo(() => {
    return {
      totalResults: results ? results.length : 0,
      currentResult: 1,
      madhabs: {}
    };
  }, [results]);

  // Generate shareable text
  const generateShareText = useCallback((
    result: CalculationResult,
    includeDetails: boolean = true
  ): string => {
    const total = result.shares.reduce((sum, s) => sum + s.amount, 0);
    const date = new Date().toLocaleDateString('ar-SA');
    
    let text = `📊 *نتائج توزيع الميراث*\n`;
    text += `📅 التاريخ: ${date}\n`;
    text += `⚖️ المذهب: ${result.madhhabName}\n`;
    text += `💰 إجمالي التركة: ${total.toFixed(2)} ر.س\n`;
    text += `📈 مستوى الثقة: ${result.confidence}%\n\n`;
    
    if (includeDetails) {
      text += `*تفاصيل التوزيع:*\n`;
      text += `━━━━━━━━━━━━━━━━\n`;
      
      result.shares.forEach(share => {
        const percentage = ((share.amount / total) * 100).toFixed(1);
        text += `${share.name}: ${share.amount.toFixed(2)} ر.س (${percentage}%)\n`;
      });
      
      text += `━━━━━━━━━━━━━━━━\n`;
      
      // Add special cases if any
      if (result.awlApplied || result.raddApplied) {
        text += `\n*حالات خاصة:*\n`;
        if (result.awlApplied) text += `• تم تطبيق العول\n`;
        if (result.raddApplied) text += `• تم تطبيق الرد\n`;
      }
      
      if (result.blockedHeirs && result.blockedHeirs.length > 0) {
        text += `\n*المحجوبون:*\n`;
        result.blockedHeirs.forEach(heir => {
          text += `• ${heir}\n`;
        });
      }
    }
    
    text += `\nتم بواسطة تطبيق حاسبة المواريث الشرعية`;
    return text;
  }, []);

  // Generate HTML for rich sharing
  const generateShareHTML = useCallback((result: CalculationResult): string => {
    const total = result.shares.reduce((sum, s) => sum + s.amount, 0);
    const date = new Date().toLocaleDateString('ar-SA');
    
    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .card {
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .header h1 {
            color: #667eea;
            font-size: 24px;
            margin: 0;
          }
          .header h2 {
            color: #666;
            font-size: 14px;
            margin: 5px 0 0;
            font-weight: normal;
          }
          .badge {
            background: #667eea;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            display: inline-block;
            margin-bottom: 10px;
          }
          .info-grid {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            padding: 15px;
            background: #f7f9fc;
            border-radius: 15px;
          }
          .info-item {
            text-align: center;
          }
          .info-label {
            color: #666;
            font-size: 12px;
            margin-bottom: 5px;
          }
          .info-value {
            color: #333;
            font-size: 18px;
            font-weight: bold;
          }
          .table {
            margin: 20px 0;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
          }
          .table-header {
            background: #667eea;
            color: white;
            padding: 12px;
            display: flex;
            font-weight: bold;
          }
          .table-row {
            display: flex;
            padding: 12px;
            border-bottom: 1px solid #e0e0e0;
          }
          .table-row:last-child {
            border-bottom: none;
          }
          .table-cell {
            flex: 1;
            text-align: center;
          }
          .special-cases {
            background: #fff3e0;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            color: #999;
            font-size: 12px;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <span class="badge">${result.madhhabName}</span>
            <h1>نتائج توزيع الميراث</h1>
            <h2>${date}</h2>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">إجمالي التركة</div>
              <div class="info-value">${total.toFixed(2)} ر.س</div>
            </div>
            <div class="info-item">
              <div class="info-label">مستوى الثقة</div>
              <div class="info-value">${result.confidence}%</div>
            </div>
            <div class="info-item">
              <div class="info-label">عدد الورثة</div>
              <div class="info-value">${result.shares.length}</div>
            </div>
          </div>
          
          <div class="table">
            <div class="table-header">
              <div class="table-cell">الوارث</div>
              <div class="table-cell">المبلغ</div>
              <div class="table-cell">النسبة</div>
            </div>
            ${result.shares.map(share => `
              <div class="table-row">
                <div class="table-cell">${share.name}</div>
                <div class="table-cell">${share.amount.toFixed(2)} ر.س</div>
                <div class="table-cell">${((share.amount / total) * 100).toFixed(1)}%</div>
              </div>
            `).join('')}
          </div>
          
          ${(result.awlApplied || result.raddApplied || (result.blockedHeirs && result.blockedHeirs.length > 0)) ? `
            <div class="special-cases">
              <h3 style="margin:0 0 10px; color:#f57c00;">حالات خاصة</h3>
              ${result.awlApplied ? '<p>✓ تم تطبيق العول</p>' : ''}
              ${result.raddApplied ? '<p>✓ تم تطبيق الرد</p>' : ''}
              ${result.blockedHeirs && result.blockedHeirs.length > 0 ? `
                <p style="margin-top:10px;"><strong>المحجوبون:</strong></p>
                ${result.blockedHeirs.map(heir => `<p>• ${heir}</p>`).join('')}
              ` : ''}
            </div>
          ` : ''}
          
          <div class="footer">
            تم بواسطة تطبيق حاسبة المواريث الشرعية
          </div>
        </div>
      </body>
      </html>
    `;
  }, []);

  // Share to clipboard
  const shareToClipboard = useCallback(async (text: string) => {
    try {
      await Clipboard.setString(text);
      Alert.alert('تم', 'تم نسخ النتائج إلى الحافظة');
    } catch {
      throw new Error('فشل في النسخ إلى الحافظة');
    }
  }, []);

  // Share via native share dialog
  const shareViaNative = useCallback(async (content: string, type: 'text' | 'html') => {
    try {
      if (type === 'html') {
        const fileName = `merath-${Date.now()}.html`;
        
        if (Platform.OS === 'web') {
          const blob = new Blob([content], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          await Share.share({
            title: 'نتائج الميراث',
            url: url,
          });
          return;
        }
        
        const documentDir = (FileSystem as any).documentDirectory;
        if (!documentDir) {
          throw new Error('لا يمكن الوصول إلى نظام الملفات');
        }
        
        const filePath = `${documentDir}${fileName}`;
        
        await FileSystem.writeAsStringAsync(filePath, content, {
          encoding: 'utf8',
        });
        
        const isAvailable = await Sharing.isAvailableAsync();
        if (!isAvailable) {
          throw new Error('المشاركة غير متوفرة على هذا الجهاز');
        }
        
        await Sharing.shareAsync(filePath, {
          mimeType: 'text/html',
          dialogTitle: 'مشاركة نتائج الميراث',
        });
      } else {
        await Share.share({
          message: content,
          title: 'نتائج توزيع الميراث',
        });
      }
    } catch (error) {
      console.error('Share error:', error);
      throw new Error('فشل في المشاركة');
    }
  }, []);

  // Capture view as image
  const captureAsImage = useCallback(async (): Promise<string> => {
    if (!viewShotRef.current) {
      throw new Error('ViewShot ref not available');
    }
    
    try {
      const captureMethod = (viewShotRef.current as any).capture;
      if (!captureMethod) {
        throw new Error('Capture method not available');
      }
      
      const uri = await captureMethod();
      return uri as string;
    } catch (error) {
      console.error('Capture error:', error);
      throw new Error('فشل في التقاط الصورة');
    }
  }, []);

  // Share as image
  const shareAsImage = useCallback(async () => {
    try {
      const uri = await captureAsImage();
      
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('المشاركة غير متوفرة على هذا الجهاز');
      }
      
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'مشاركة صورة النتائج',
      });
    } catch (error) {
      console.error('Image share error:', error);
      throw new Error('فشل في مشاركة الصورة');
    }
  }, [captureAsImage]);

  // ===== FIX M6: Show preview before sharing =====
  const showPreview = useCallback((format: ShareFormat) => {
    if (!currentResult || !currentResult.success) {
      Alert.alert('خطأ', 'لا توجد نتائج صحيحة للمشاركة');
      return;
    }

    let previewContent = '';
    switch (format) {
      case 'text':
      case 'clipboard':
        previewContent = generateShareText(currentResult, true);
        break;
      case 'pdf':
      case 'image':
        previewContent = generateShareHTML(currentResult);
        break;
    }

    setPreviewHTML(previewContent);
    setShareFormat(format);
    setPreviewVisible(true);
  }, [currentResult, generateShareText, generateShareHTML]);

  // ===== FIX M6: Execute share after preview =====
  const executeShare = useCallback(async () => {
    setPreviewVisible(false);
    setShareModalVisible(false);
    
    setShareFormat(shareFormat);
    setShareStatus('generating');
    setShareError(null);

    try {
      switch (shareFormat) {
        case 'text': {
          const text = generateShareText(currentResult!, true);
          await shareViaNative(text, 'text');
          break;
        }
        case 'clipboard': {
          const text = generateShareText(currentResult!, true);
          await shareToClipboard(text);
          break;
        }
        case 'image': {
          await shareAsImage();
          break;
        }
        case 'pdf': {
          setExportLoading(true);
          const timestamp = new Date().toLocaleDateString('ar-SA');
          const filename = `تقرير-التركة-${timestamp}`;
          
          await PDFExporter.generateAndShare(currentResult!, {
            filename,
            includeCalculationSteps: true,
            theme: 'light'
          });
          
          ErrorLogger.logError(
            'PDF_EXPORT_SUCCESS',
            `PDF exported successfully for madhab: ${currentResult!.madhhabName}`,
            'تم تصدير التقرير بنجاح',
            'info',
            { madhab: currentResult!.madhhabName }
          );
          break;
        }
      }
      
      setShareStatus('success');
      setTimeout(() => {
        setShareStatus('idle');
      }, 1000);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'فشل في المشاركة';
      setShareError(errorMessage);
      setShareStatus('error');
      
      ErrorLogger.logError(
        'SHARE_ERROR',
        errorMessage,
        'حدث خطأ أثناء المشاركة',
        'error',
        { format: shareFormat }
      );
    } finally {
      setExportLoading(false);
    }
  }, [shareFormat, currentResult, generateShareText, shareViaNative, shareToClipboard, shareAsImage]);

  // Handle PDF Export
  const handleExportComparison = useCallback(() => {
    if (!activeComparisons || activeComparisons.length === 0) {
      Alert.alert('تنبيه', 'لا توجد نتائج مقارنة للتصدير');
      return;
    }

    generateComparisonReport(activeComparisons);
    Alert.alert('تم', 'تقرير المقارنة جاهز للتصدير');
  }, [activeComparisons, generateComparisonReport]);

  if (!currentResult || !currentResult.success) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>{t('results.noResults')}</Text>
          <Text style={styles.emptyStateText}>{t('results.performCalculation')}</Text>
        </View>
      </View>
    );
  }

  return (
    <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
      <Animated.ScrollView 
        style={[styles.container, { opacity: fadeAnim }]} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ transform: [{ translateY: slideAnim }] }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.madhhabBadge}>
            <Text style={styles.madhhabBadgeText}>{currentResult.madhhabName}</Text>
          </View>
          <Text style={styles.title}>{t('results.title')}</Text>
          {currentResult.calculationTime && (
            <Text style={styles.calculationTime}>
              {t('results.calculationTime')}: {currentResult.calculationTime}ms
            </Text>
          )}
          
          {/* Share Button */}
          <TouchableOpacity
            style={styles.headerShareButton}
            onPress={() => setShareModalVisible(true)}
          >
            <MaterialCommunityIcons name="share" size={20} color="#fff" />
            <Text style={styles.headerShareText}>{t('calculator.share')}</Text>
          </TouchableOpacity>
        </View>

        {/* Special Cases */}
        {currentResult.specialCases && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('results.specialCases')}</Text>
            <View style={styles.specialCases}>
              {currentResult.awlApplied && (
                <View style={styles.specialCaseItem}>
                  <Text style={styles.specialCaseLabel}>{t('results.awl')}:</Text>
                  <Text style={styles.specialCaseValue}>{t('results.applied')}</Text>
                </View>
              )}
              {currentResult.raddApplied && (
                <View style={styles.specialCaseItem}>
                  <Text style={styles.specialCaseLabel}>{t('results.radd')}:</Text>
                  <Text style={styles.specialCaseValue}>{t('results.applied')}</Text>
                </View>
              )}
              {currentResult.blockedHeirs && 
                currentResult.blockedHeirs.length > 0 && (
                <View style={styles.hijabContainer}>
                  <Text style={styles.hijabLabel}>{t('results.blockedHeirs')}:</Text>
                  {currentResult.blockedHeirs.map((heir: string, idx: number) => (
                    <Text key={idx} style={styles.hijabType}>• {heir}</Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* Distribution Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('results.distributionTable')}</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>{t('results.amount')}</Text>
              <Text style={styles.tableHeaderCell}>{t('results.fraction')}</Text>
              <Text style={styles.tableHeaderCell}>{t('results.heir')}</Text>
            </View>

            {/* Table Rows with Animated Numbers */}
            {currentResult.shares && currentResult.shares.map((share: any, index: number) => {
              const percentage = (share.amount / totalAmount) * 100;
              
              return (
                <View
                  key={index}
                  style={[
                    styles.tableRow,
                    index % 2 === 1 && styles.tableRowAlternate
                  ]}
                >
                  <Text style={styles.tableCell}>
                    <AnimatedNumber value={share.amount} /> ر.س
                  </Text>
                  <Text style={styles.tableCell}>
                    <AnimatedNumber value={percentage} format={false} />%
                  </Text>
                  <Text style={styles.tableCell}>{share.name}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Financial Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('results.financialSummary')}</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('estate.netEstate')}:</Text>
              <Text style={styles.summaryValue}>
                <AnimatedNumber value={totalAmount} /> ر.س
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('results.trustLevel')}:</Text>
              <Text style={[
                styles.summaryValue,
                { color: currentResult.confidence > 90 ? '#4caf50' : '#ff9800' }
              ]}>
                <AnimatedNumber value={currentResult.confidence} format={false} />%
              </Text>
            </View>
          </View>
        </View>

        {/* Calculation Steps */}
        {currentResult.steps && currentResult.steps.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('results.calculationSteps')}</Text>
            <ScrollView style={styles.stepsContainer} scrollEnabled={true}>
              {currentResult.steps.map((step: any, index: number) => (
                <View key={index} style={styles.step}>
                  <View style={styles.stepHeader}>
                    <Text style={styles.stepNumber}>{step.stepNumber}</Text>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                  </View>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Previous Results */}
        {previousResults && previousResults.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('results.previousResults')}</Text>
            <ScrollView style={styles.historyContainer} scrollEnabled={true}>
              {previousResults.map((prevResult: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.historyItem,
                    selectedResultId === index && styles.historyItemSelected
                  ]}
                  onPress={() => setSelectedResultId(index)}
                >
                  <Text style={styles.historyItemMadhab}>{prevResult.madhhabName}</Text>
                  <Text style={styles.historyItemAmount}>
                    {prevResult.shares.reduce((sum: number, s: any) => sum + s.amount, 0).toFixed(0)} ر.س
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Comparison Button */}
        {previousResults && previousResults.length > 0 && (
          <TouchableOpacity
            style={styles.comparisonButton}
            onPress={() => setShowComparison(!showComparison)}
          >
            <Text style={styles.comparisonButtonText}>
              {showComparison ? t('results.hideComparison') : t('results.showComparison')}
            </Text>
          </TouchableOpacity>
        )}

        {/* Compare Across Madhabs Button */}
        {currentResult && (
          <TouchableOpacity
            style={[styles.comparisonButton, { backgroundColor: theme.colors.secondary.main }]}
            onPress={async () => {
              setComparisonLoading(true);
              try {
                const comparisons = await calculator.compareAcrossMadhabs();
                setMadhabComparisonResults(comparisons);
                setShowComparison(true);
              } catch (error) {
                console.error('Failed to compare across madhabs:', error);
                Alert.alert('خطأ', 'فشل في مقارنة المذاهب. يرجى المحاولة لاحقاً.');
              } finally {
                setComparisonLoading(false);
              }
            }}
          >
            <Text style={styles.comparisonButtonText}>
              مقارنة المذاهب الأربعة
            </Text>
          </TouchableOpacity>
        )}

        {/* Statistics */}
        {showComparison && stats_data && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('results.statistics')}</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statRow}>
                <Text style={styles.statValue}>{stats_data.totalResults}</Text>
                <Text style={styles.statLabel}>{t('results.totalCalculations')}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statValue}>{stats_data.currentResult}</Text>
                <Text style={styles.statLabel}>{t('results.currentResult')}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Comparison Results */}
        {showComparison && activeComparisons && activeComparisons.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="compare"
                size={24}
                color={theme.colors.primary.main}
              />
<Text style={styles.sectionTitle}>{t('results.comparison')}</Text>
          </View>

          {activeComparisons.map((comparison, idx) => (
            <View key={idx} style={styles.comparisonCard}>
              <Text style={styles.comparisonTitle}>
                {t('results.compareWith', { madhab: comparison.madhhabName })}
                </Text>
                
                <View style={styles.comparisonSummary}>
                  <Text style={[
                    styles.comparisonStatus,
                    comparison.summary.isIdentical && styles.comparisonIdentical,
                    !comparison.summary.isIdentical && comparison.summary.majorDifferences === 0 && styles.comparisonMinor,
                    comparison.summary.majorDifferences > 0 && styles.comparisonMajor
                  ]}>
                    {comparison.summary.isIdentical ? '✓ متطابق' :
                     comparison.summary.majorDifferences > 0 ? '⚠️ اختلافات جوهرية' :
                     '⚠️ اختلافات طفيفة'}
                  </Text>
                  
                  {comparison.summary.recommendation && (
                    <Text style={styles.comparisonRecommendation}>
                      💡 {comparison.summary.recommendation}
                    </Text>
                  )}
                </View>

                {comparison.differences.length > 0 ? (
                  <View style={styles.differencesList}>
                    {comparison.differences.map((diff, diffIdx) => (
                      <View key={diffIdx} style={styles.differenceItem}>
                        <Text style={styles.differenceHeir}>{diff.heirName}</Text>
                        <Text style={[
                          styles.differenceAmount,
                          diff.amountDiff > 0 ? styles.differencePositive : styles.differenceNegative
                        ]}>
                          {diff.amountDiff > 0 ? '+' : ''}{diff.amountDiff.toFixed(2)} ر.س
                        </Text>
                        <Text style={styles.differenceExplanation}>
                          {diff.explanation}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noDifferences}>
                    لا توجد اختلافات في توزيع الورثة
                  </Text>
                )}
              </View>
            ))}

            {/* Export Comparison Button */}
            <TouchableOpacity
              style={styles.exportComparisonButton}
              onPress={handleExportComparison}
            >
              <MaterialCommunityIcons name="file-pdf-box" size={20} color="#fff" />
              <Text style={styles.exportComparisonText}>تصدير تقرير المقارنة</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Close Button */}
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>إغلاق</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 20 }} />
      </Animated.ScrollView>

      {/* Share Modal */}
      <Modal
        visible={shareModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>مشاركة النتائج</Text>
              <TouchableOpacity onPress={() => setShareModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {shareError && (
              <View style={styles.modalError}>
                <MaterialCommunityIcons name="alert-circle" size={20} color="#d32f2f" />
                <Text style={styles.modalErrorText}>{shareError}</Text>
              </View>
            )}

            <View style={styles.shareOptions}>
              <TouchableOpacity
                style={[styles.shareOption, shareStatus !== 'idle' && styles.shareOptionDisabled]}
                onPress={() => showPreview('pdf')}
                disabled={shareStatus !== 'idle'}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#d32f2f' }]}>
                  {shareFormat === 'pdf' && shareStatus === 'generating' ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <MaterialCommunityIcons name="file-pdf-box" size={24} color="#fff" />
                  )}
                </View>
                <Text style={styles.shareOptionText}>PDF</Text>
                <Text style={styles.shareOptionDesc}>تقرير كامل ومنسق</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.shareOption, shareStatus !== 'idle' && styles.shareOptionDisabled]}
                onPress={() => showPreview('image')}
                disabled={shareStatus !== 'idle'}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#2196f3' }]}>
                  {shareFormat === 'image' && shareStatus === 'generating' ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <MaterialCommunityIcons name="image" size={24} color="#fff" />
                  )}
                </View>
                <Text style={styles.shareOptionText}>صورة</Text>
                <Text style={styles.shareOptionDesc}>كصورة للنتائج</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.shareOption, shareStatus !== 'idle' && styles.shareOptionDisabled]}
                onPress={() => showPreview('text')}
                disabled={shareStatus !== 'idle'}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#4caf50' }]}>
                  {shareFormat === 'text' && shareStatus === 'generating' ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <MaterialCommunityIcons name="text" size={24} color="#fff" />
                  )}
                </View>
                <Text style={styles.shareOptionText}>نص</Text>
                <Text style={styles.shareOptionDesc}>مشاركة كنص</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.shareOption, shareStatus !== 'idle' && styles.shareOptionDisabled]}
                onPress={() => showPreview('clipboard')}
                disabled={shareStatus !== 'idle'}
              >
                <View style={[styles.shareIcon, { backgroundColor: '#ff9800' }]}>
                  {shareFormat === 'clipboard' && shareStatus === 'generating' ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <MaterialCommunityIcons name="content-copy" size={24} color="#fff" />
                  )}
                </View>
                <Text style={styles.shareOptionText}>نسخ</Text>
                <Text style={styles.shareOptionDesc}>نسخ إلى الحافظة</Text>
              </TouchableOpacity>
            </View>

            {shareStatus === 'success' && (
              <View style={styles.modalSuccess}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#4caf50" />
                <Text style={styles.modalSuccessText}>تمت المشاركة بنجاح</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShareModalVisible(false)}
            >
              <Text style={styles.modalCancelButtonText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ===== FIX M6: Share Preview Modal ===== */}
      <SharePreviewModal
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
        onConfirm={executeShare}
        result={currentResult}
        format={shareFormat}
        previewHTML={previewHTML}
      />
    </ViewShot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff5fb'
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
    borderRadius: 20,
    marginHorizontal: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
  },
  madhhabBadge: {
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  madhhabBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1976d2'
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
  },
  calculationTime: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  headerShareButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976d2',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 6,
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  headerShareText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    marginHorizontal: 12,
    marginBottom: 14,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    letterSpacing: 0.2,
    textAlign: 'right'
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center'
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6
  },
  emptyStateText: {
    fontSize: 12,
    color: '#999'
  },
  specialCases: {
    backgroundColor: '#fff3e0',
    borderRadius: 4,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ffb74d'
  },
  specialCaseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  specialCaseLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333'
  },
  specialCaseValue: {
    fontSize: 12,
    color: '#ff9800',
    fontWeight: '600'
  },
  hijabContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ffe0b2'
  },
  hijabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  hijabType: {
    fontSize: 11,
    color: '#666',
    marginVertical: 2
  },
  table: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    overflow: 'hidden'
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1976d2',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center'
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f8fafc'
  },
  tableRowAlternate: {
    backgroundColor: '#ffffff'
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: '#111827',
    textAlign: 'center'
  },
  summaryContainer: {
    backgroundColor: '#e8f5e9',
    borderRadius: 4,
    padding: 10,
    borderWidth: 1,
    borderColor: '#81c784'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333'
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2e7d32'
  },
  stepsContainer: {
    maxHeight: 200
  },
  step: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#1976d2'
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1976d2',
    marginRight: 8
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    flex: 1
  },
  stepDescription: {
    fontSize: 11,
    color: '#666',
    textAlign: 'right'
  },
  historyContainer: {
    maxHeight: 150
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  historyItemSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1976d2'
  },
  historyItemMadhab: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976d2'
  },
  historyItemAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333'
  },
  comparisonButton: {
    marginHorizontal: 12,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1976d2',
    alignItems: 'center',
  },
  comparisonButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1976d2',
    textAlign: 'center'
  },
  statsContainer: {
    backgroundColor: '#f3e5f5',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ce93d8'
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333'
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7b1fa2'
  },
  comparisonCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  comparisonTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1976d2',
    marginBottom: 8,
    textAlign: 'right',
  },
  comparisonSummary: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  comparisonStatus: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'right',
  },
  comparisonIdentical: {
    color: '#4caf50',
  },
  comparisonMinor: {
    color: '#ff9800',
  },
  comparisonMajor: {
    color: '#d32f2f',
  },
  comparisonRecommendation: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'right',
  },
  differencesList: {
    marginTop: 8,
  },
  differenceItem: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#1976d2',
  },
  differenceHeir: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'right',
  },
  differenceAmount: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'right',
  },
  differencePositive: {
    color: '#4caf50',
  },
  differenceNegative: {
    color: '#d32f2f',
  },
  differenceExplanation: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'right',
  },
  noDifferences: {
    fontSize: 12,
    color: '#4caf50',
    textAlign: 'center',
    paddingVertical: 8,
  },
  exportComparisonButton: {
    backgroundColor: '#1976d2',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  exportComparisonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  closeButton: {
    marginHorizontal: 12,
    marginTop: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#d32f2f',
    borderRadius: 14,
    alignItems: 'center'
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff'
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  modalError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  modalErrorText: {
    fontSize: 13,
    color: '#d32f2f',
    flex: 1,
  },
  shareOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  shareOption: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  shareOptionDisabled: {
    opacity: 0.45,
  },
  shareIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  shareOptionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  shareOptionDesc: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  modalSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    gap: 8,
  },
  modalSuccessText: {
    fontSize: 13,
    color: '#2e7d32',
    flex: 1,
  },
  modalCancelButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  modalCancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  // ===== FIX M6: Preview modal styles =====
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  previewContent: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  previewHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  previewScroll: {
    maxHeight: 300,
  },
  previewHTML: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    margin: 16,
    borderRadius: 8,
  },
  previewHTMLText: {
    fontSize: 11,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  previewImagePlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    margin: 16,
    borderRadius: 8,
    gap: 12,
  },
  previewImageText: {
    fontSize: 14,
    color: '#999',
  },
  previewText: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    margin: 16,
    borderRadius: 8,
  },
  previewTextContent: {
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
    textAlign: 'right',
  },
  previewActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  previewButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  previewCancelButton: {
    backgroundColor: '#f5f5f5',
  },
  previewConfirmButton: {
    // Dynamic color from theme
  },
  previewCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  previewConfirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ResultsDisplay;