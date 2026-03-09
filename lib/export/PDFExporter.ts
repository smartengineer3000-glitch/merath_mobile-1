/**
 * PDF Export Service
 * Phase 1: Complete PDF Export Functionality
 * 
 * Generates professional PDF reports of inheritance calculations
 * 
 * FIXES:
 * - C5 (🔴): Memory leak - temp files now properly cleaned up
 * - M3 (🟡): Added visual charts to PDF reports
 */

import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { CalculationResult, HeirShare } from '../inheritance/types';

export interface PDFExportOptions {
  filename?: string;
  includeCalculationSteps?: boolean;
  includeAuditLog?: boolean;
  theme?: 'light' | 'dark';
}

// ===== FIX C5: Track temporary files for cleanup =====
interface TempFile {
  uri: string;
  createdAt: number;
}

export class PDFExporter {
  // ===== FIX C5: Temp file management =====
  private static tempFiles: TempFile[] = [];
  private static readonly MAX_TEMP_AGE_MS = 30 * 60 * 1000; // 30 minutes
  private static readonly MAX_TEMP_FILES = 20; // Maximum number of temp files to keep
  
  /**
   * ===== FIX C5: Register temp file for cleanup =====
   */
  private static registerTempFile(uri: string): void {
    this.tempFiles.push({
      uri,
      createdAt: Date.now()
    });
    
    // Clean up old files
    this.cleanupOldTempFiles();
  }
  
  /**
   * ===== FIX C5: Clean up old temporary files =====
   */
  private static async cleanupOldTempFiles(): Promise<void> {
    const now = Date.now();
    const cutoff = now - this.MAX_TEMP_AGE_MS;
    
    // Separate old and new files
    const oldFiles = this.tempFiles.filter(f => f.createdAt < cutoff);
    const newFiles = this.tempFiles.filter(f => f.createdAt >= cutoff);
    
    // Update tempFiles list
    this.tempFiles = newFiles.slice(-this.MAX_TEMP_FILES);
    
    // Delete old files in background
    if (oldFiles.length > 0) {
      setTimeout(async () => {
        for (const file of oldFiles) {
          try {
            const fileInfo = await FileSystem.getInfoAsync(file.uri);
            if (fileInfo.exists) {
              await FileSystem.deleteAsync(file.uri, { idempotent: true });
              console.log(`[PDFExporter] Cleaned up temp file: ${file.uri}`);
            }
          } catch (error) {
            // Ignore cleanup errors
          }
        }
      }, 1000);
    }
  }
  
  /**
   * ===== FIX C5: Clean up specific file immediately =====
   */
  private static async cleanupFile(uri: string): Promise<void> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(uri, { idempotent: true });
        
        // Remove from temp files list
        this.tempFiles = this.tempFiles.filter(f => f.uri !== uri);
      }
    } catch (error) {
      console.warn('[PDFExporter] Failed to cleanup file:', error);
    }
  }

  /**
   * ===== FIX M3: Generate SVG pie chart =====
   */
  private static generatePieChartSVG(shares: HeirShare[], total: number): string {
    if (shares.length === 0) return '';
    
    const colors = [
      '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#EC4899', '#06B6D4', '#84CC16', '#6366F1', '#D946EF'
    ];
    
    let cumulativeAngle = 0;
    const centerX = 100;
    const centerY = 100;
    const radius = 80;
    
    let paths = '';
    let legendItems = '';
    
    shares.forEach((share, index) => {
      const percentage = (share.amount / total) * 100;
      const angle = (percentage / 100) * 360;
      
      if (angle > 0) {
        const startAngle = cumulativeAngle;
        const endAngle = cumulativeAngle + angle;
        
        const startRad = (startAngle - 90) * Math.PI / 180;
        const endRad = (endAngle - 90) * Math.PI / 180;
        
        const x1 = centerX + radius * Math.cos(startRad);
        const y1 = centerY + radius * Math.sin(startRad);
        const x2 = centerX + radius * Math.cos(endRad);
        const y2 = centerY + radius * Math.sin(endRad);
        
        const largeArcFlag = angle > 180 ? 1 : 0;
        
        const color = colors[index % colors.length];
        
        paths += `
          <path d="M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z" 
                fill="${color}" 
                stroke="white" 
                stroke-width="1"
                opacity="0.9">
            <title>${share.name}: ${percentage.toFixed(1)}% (${share.amount.toFixed(2)} ر.س)</title>
          </path>
        `;
        
        // Add legend item
        legendItems += `
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <div style="width: 12px; height: 12px; background-color: ${color}; margin-left: 8px; border-radius: 2px;"></div>
            <span style="font-size: 10px; color: #374151;">${share.name}: ${percentage.toFixed(1)}%</span>
          </div>
        `;
        
        cumulativeAngle += angle;
      }
    });
    
    return `
      <div style="display: flex; flex-direction: row; align-items: center; margin: 20px 0; padding: 16px; background-color: #f9fafb; border-radius: 12px;">
        <div style="flex: 1; min-width: 200px;">
          <svg width="200" height="200" viewBox="0 0 200 200" style="display: block; margin: 0 auto;">
            ${paths}
            <circle cx="100" cy="100" r="35" fill="white" stroke="#e5e7eb" stroke-width="1"/>
            <text x="100" y="105" text-anchor="middle" fill="#374151" font-size="12" font-weight="bold">${total.toFixed(0)}</text>
            <text x="100" y="120" text-anchor="middle" fill="#6b7280" font-size="8">ر.س</text>
          </svg>
        </div>
        <div style="flex: 1; padding-right: 20px;">
          ${legendItems}
        </div>
      </div>
    `;
  }

  /**
   * ===== FIX M3: Generate bar chart SVG =====
   */
  private static generateBarChartSVG(shares: HeirShare[], total: number): string {
    if (shares.length === 0) return '';
    
    const colors = [
      '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#EC4899', '#06B6D4', '#84CC16', '#6366F1', '#D946EF'
    ];
    
    const barHeight = 30;
    const spacing = 10;
    const chartHeight = shares.length * (barHeight + spacing);
    const maxBarWidth = 300;
    
    let bars = '';
    let labels = '';
    
    shares.forEach((share, index) => {
      const percentage = (share.amount / total) * 100;
      const barWidth = (percentage / 100) * maxBarWidth;
      const y = index * (barHeight + spacing);
      const color = colors[index % colors.length];
      
      bars += `
        <rect x="0" y="${y}" width="${barWidth}" height="${barHeight}" 
              fill="${color}" rx="4" ry="4" opacity="0.9">
          <title>${share.name}: ${percentage.toFixed(1)}% (${share.amount.toFixed(2)} ر.س)</title>
        </rect>
      `;
      
      labels += `
        <text x="${barWidth + 8}" y="${y + barHeight/2 + 4}" 
              font-size="11" fill="#374151" text-anchor="start">
          ${share.name} (${percentage.toFixed(1)}%)
        </text>
      `;
    });
    
    return `
      <div style="margin: 20px 0; padding: 16px; background-color: #f9fafb; border-radius: 12px;">
        <svg width="100%" height="${chartHeight + 20}" viewBox="0 0 ${maxBarWidth + 150} ${chartHeight + 20}" 
             style="display: block; margin: 0 auto;">
          ${bars}
          ${labels}
        </svg>
      </div>
    `;
  }

  /**
   * Generate HTML for PDF
   * ===== FIX M3: Added charts to HTML =====
   */
  private static generateHTML(
    result: CalculationResult,
    options: PDFExportOptions = {}
  ): string {
    const {
      includeCalculationSteps = true,
      theme = 'light',
      filename = 'inheritance-report',
    } = options;

    const backgroundColor = theme === 'light' ? '#ffffff' : '#f5f5f5';
    const textColor = theme === 'light' ? '#000000' : '#333333';
    const borderColor = theme === 'light' ? '#e0e0e0' : '#d0d0d0';

    const calculationTime = new Date().toLocaleString('ar-SA');
    const total = result.shares.reduce((sum: number, s: HeirShare) => sum + s.amount, 0);
    
    // ===== FIX M3: Generate charts =====
    const pieChart = this.generatePieChartSVG(result.shares, total);
    const barChart = this.generateBarChartSVG(result.shares, total);

    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${filename}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Arial', sans-serif;
            background-color: ${backgroundColor};
            color: ${textColor};
            line-height: 1.6;
            padding: 20px;
          }

          .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border: 1px solid ${borderColor};
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }

          .header {
            text-align: center;
            border-bottom: 3px solid #1F71BA;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }

          .header h1 {
            color: #1F71BA;
            font-size: 28px;
            margin-bottom: 10px;
          }

          .header h2 {
            color: #666;
            font-size: 16px;
            font-weight: normal;
          }

          .metadata {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border-right: 4px solid #1F71BA;
          }

          .metadata-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
          }

          .metadata-label {
            font-weight: bold;
            color: #333;
            min-width: 150px;
          }

          .metadata-value {
            color: #666;
          }

          .section {
            margin-bottom: 30px;
          }

          .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #1F71BA;
            border-bottom: 2px solid #1F71BA;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }

          .special-cases {
            background-color: #fffacd;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 15px;
            border-right: 4px solid #FF9800;
          }

          .special-cases h3 {
            color: #FF9800;
            margin-bottom: 10px;
            font-size: 14px;
          }

          .case-item {
            margin-bottom: 8px;
            padding: 5px;
          }

          .case-item strong {
            color: #333;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }

          th {
            background-color: #1F71BA;
            color: white;
            padding: 12px;
            text-align: center;
            font-weight: bold;
          }

          td {
            padding: 12px;
            border-bottom: 1px solid ${borderColor};
            text-align: center;
          }

          tr:nth-child(even) {
            background-color: #f9f9f9;
          }

          tr:hover {
            background-color: #f0f7ff;
          }

          .amount {
            font-weight: bold;
            color: #1F71BA;
          }

          .percentage {
            color: #666;
            font-size: 14px;
          }

          .heir-name {
            font-weight: 500;
          }

          .summary {
            background-color: #f0f7ff;
            padding: 15px;
            border-radius: 5px;
            border-right: 4px solid #1F71BA;
          }

          .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 5px 0;
          }

          .summary-label {
            font-weight: bold;
          }

          .summary-value {
            color: #1F71BA;
            font-weight: bold;
          }

          .confidence {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid ${borderColor};
          }

          .confidence-high {
            color: #4CAF50;
            font-weight: bold;
          }

          .confidence-medium {
            color: #FF9800;
            font-weight: bold;
          }

          .confidence-low {
            color: #F44336;
            font-weight: bold;
          }

          .calculation-steps {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            margin-top: 15px;
          }

          .step {
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid ${borderColor};
          }

          .step:last-child {
            border-bottom: none;
          }

          .step-number {
            background-color: #1F71BA;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-left: 10px;
          }

          .step-title {
            font-weight: bold;
            margin-bottom: 5px;
          }

          .step-content {
            margin-right: 40px;
            color: #666;
            font-size: 14px;
          }

          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid ${borderColor};
            text-align: center;
            color: #999;
            font-size: 12px;
          }

          .disclaimer {
            background-color: #fff3e0;
            padding: 15px;
            border-radius: 5px;
            border-right: 4px solid #FF6F00;
            font-size: 12px;
            color: #333;
            margin-top: 20px;
          }

          @media print {
            body {
              padding: 0;
            }

            .container {
              border: none;
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>📊 تقرير توزيع التركة</h1>
            <h2>Inheritance Distribution Report</h2>
          </div>

          <!-- Metadata -->
          <div class="metadata">
            <div class="metadata-row">
              <span class="metadata-label">المذهب الفقهي:</span>
              <span class="metadata-value">${result.madhhabName}</span>
            </div>
            <div class="metadata-row">
              <span class="metadata-label">تاريخ التقرير:</span>
              <span class="metadata-value">${calculationTime}</span>
            </div>
            <div class="metadata-row">
              <span class="metadata-label">وقت الحساب:</span>
              <span class="metadata-value">${result.calculationTime?.toFixed(2) || '0'} ms</span>
            </div>
            <div class="metadata-row">
              <span class="metadata-label">حالة الحساب:</span>
              <span class="metadata-value">${result.success ? '✓ نجح' : '✗ فشل'}</span>
            </div>
          </div>

          <!-- Visual Charts - FIX M3 -->
          <div class="section">
            <h2 class="section-title">📊 التوزيع المرئي</h2>
            ${pieChart}
            ${barChart}
          </div>

          <!-- Special Cases -->
          ${
            result.specialCases && (
              result.specialCases.awl ||
              result.specialCases.radd ||
              result.specialCases.hijabTypes.length > 0
            )
              ? `
            <div class="special-cases">
              <h3>⚠️ الحالات الشرعية الخاصة</h3>
              ${
                result.specialCases.awl
                  ? `<div class="case-item"><strong>العول:</strong> تطبيق العول على التركة</div>`
                  : ''
              }
              ${
                result.specialCases.radd
                  ? `<div class="case-item"><strong>الرد:</strong> رد الفاضل على الورثة</div>`
                  : ''
              }
              ${
                result.specialCases.hijabTypes.length > 0
                  ? `<div class="case-item"><strong>الحجب:</strong> ${result.specialCases.hijabTypes.join(', ')}</div>`
                  : ''
              }
            </div>
            `
              : ''
          }

          <!-- Distribution Table -->
          <div class="section">
            <h2 class="section-title">📋 جدول التوزيع</h2>
            <table>
              <thead>
                <tr>
                  <th>الوارث</th>
                  <th>الحصة</th>
                  <th>النسبة المئوية</th>
                  <th>المبلغ (ر.س)</th>
                </tr>
              </thead>
              <tbody>
                ${result.shares
                  .map(
                    (share: HeirShare) => `
                  <tr>
                    <td class="heir-name">${share.name}</td>
                    <td>
                      ${
                        share.fraction
                          ? `${share.fraction.numerator}/${share.fraction.denominator}`
                          : '-'
                      }
                    </td>
                    <td class="percentage">${((share.amount / total) * 100).toFixed(2)}%</td>
                    <td class="amount">${share.amount.toFixed(2)}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>

          <!-- Summary -->
          <div class="section">
            <h2 class="section-title">💰 الملخص المالي</h2>
            <div class="summary">
              <div class="summary-row">
                <span class="summary-label">إجمالي التركة المستحقة:</span>
                <span class="summary-value">
                  ${total.toFixed(2)} ر.س
                </span>
              </div>
              <div class="summary-row">
                <span class="summary-label">عدد الورثة:</span>
                <span class="summary-value">${result.shares.length}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">درجة الثقة:</span>
                <span class="summary-value ${
                  result.confidence > 95
                    ? 'confidence-high'
                    : result.confidence > 80
                      ? 'confidence-medium'
                      : 'confidence-low'
                }">
                  ${result.confidence.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <!-- Calculation Steps -->
          ${
            includeCalculationSteps && result.steps && result.steps.length > 0
              ? `
            <div class="section">
              <h2 class="section-title">📝 خطوات الحساب</h2>
              <div class="calculation-steps">
                ${result.steps
                  .slice(0, 10)
                  .map(
                    (step: any, index: number) => `
                  <div class="step">
                    <div>
                      <span class="step-number">${index + 1}</span>
                      <span class="step-title">${step.title || 'خطوة'}</span>
                    </div>
                    <div class="step-content">
                      ${step.description || ''}
                    </div>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>
            `
              : ''
          }

          <!-- Disclaimer -->
          <div class="disclaimer">
            <strong>⚠️ تنويه قانوني:</strong>
            <p>
              هذا التقرير يعتمد على البيانات المدخلة والمذهب الفقهي المختار. 
              يُنصح بالتحقق من النتائج مع متخصص في الشريعة الإسلامية قبل التنفيذ.
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>تم إنشاء هذا التقرير بواسطة تطبيق حاسبة المواريث الشرعية</p>
            <p>© 2026 Merath Application. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Export calculation to PDF
   * ===== FIX C5: Added temp file tracking =====
   */
  static async exportToPDF(
    result: CalculationResult,
    options: PDFExportOptions = {}
  ): Promise<string> {
    try {
      const { filename = 'inheritance-report' } = options;

      // Generate HTML
      const html = this.generateHTML(result, options);

      // Print to PDF
      const pdf = await Print.printToFileAsync({
        html,
        base64: false,
      });

      // ===== FIX C5: Register temp file for cleanup =====
      this.registerTempFile(pdf.uri);

      return pdf.uri;
    } catch (error) {
      console.error('PDF Export Error:', error);
      throw new Error('Failed to generate PDF: ' + (error as Error).message);
    }
  }

  /**
   * Share PDF with other apps
   * ===== FIX C5: Auto-cleanup after sharing =====
   */
  static async sharePDF(pdfUri: string, filename: string = 'inheritance-report'): Promise<void> {
    try {
      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('المشاركة غير متوفرة على هذا الجهاز');
      }

      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'مشاركة تقرير التركة',
        UTI: 'com.adobe.pdf'
      });

      // ===== FIX C5: Clean up after sharing (with delay to ensure file is released) =====
      setTimeout(() => {
        this.cleanupFile(pdfUri);
      }, 5000);
      
    } catch (error) {
      console.error('PDF Share Error:', error);
      throw new Error('فشل في مشاركة PDF: ' + (error as Error).message);
    }
  }

  /**
   * Save PDF to device storage
   */
  static async savePDF(pdfUri: string, filename: string): Promise<string> {
    try {
      // Create a safe filename
      const safeFilename = filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const finalFilename = safeFilename.endsWith('.pdf') ? safeFilename : `${safeFilename}.pdf`;
      
      // For web platform
      if (Platform.OS === 'web') {
        // Download via blob
        const response = await fetch(pdfUri);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = finalFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        // ===== FIX C5: Clean up temp file =====
        this.cleanupFile(pdfUri);
        
        return pdfUri;
      }
      
      // For native platforms, copy to documents directory
      const documentDir = FileSystem.documentDirectory;
      if (!documentDir) {
        throw new Error('لا يمكن الوصول إلى نظام الملفات');
      }
      
      const permanentPath = `${documentDir}${finalFilename}`;
      
      // Copy file to permanent location
      await FileSystem.copyAsync({
        from: pdfUri,
        to: permanentPath
      });
      
      // ===== FIX C5: Clean up temp file after copy =====
      this.cleanupFile(pdfUri);
      
      return permanentPath;
    } catch (error) {
      console.error('PDF Save Error:', error);
      throw new Error('Failed to save PDF: ' + (error as Error).message);
    }
  }

  /**
   * Generate and share PDF
   * ===== FIX C5: Complete with proper cleanup =====
   */
  static async generateAndShare(
    result: CalculationResult,
    options: PDFExportOptions = {}
  ): Promise<void> {
    let pdfUri: string | null = null;
    
    try {
      const filename = options.filename || `merath-${Date.now()}`;

      // Generate PDF
      pdfUri = await this.exportToPDF(result, { ...options, filename });

      // Share PDF
      await this.sharePDF(pdfUri, filename);
      
    } catch (error) {
      console.error('Generate and Share Error:', error);
      
      // ===== FIX C5: Clean up on error =====
      if (pdfUri) {
        await this.cleanupFile(pdfUri);
      }
      
      throw error;
    }
  }

  /**
   * Generate and save PDF
   */
  static async generateAndSave(
    result: CalculationResult,
    options: PDFExportOptions = {}
  ): Promise<string> {
    let pdfUri: string | null = null;
    
    try {
      const filename = options.filename || `merath-${Date.now()}`;

      // Generate PDF
      pdfUri = await this.exportToPDF(result, { ...options, filename });

      // Save PDF permanently
      const savedPath = await this.savePDF(pdfUri, filename);
      
      return savedPath;
      
    } catch (error) {
      console.error('Generate and Save Error:', error);
      
      // ===== FIX C5: Clean up on error =====
      if (pdfUri) {
        await this.cleanupFile(pdfUri);
      }
      
      throw error;
    }
  }

  /**
   * ===== FIX C5: Manual cleanup method for external use =====
   */
  static async cleanupAllTempFiles(): Promise<void> {
    const files = [...this.tempFiles];
    this.tempFiles = [];
    
    for (const file of files) {
      try {
        await FileSystem.deleteAsync(file.uri, { idempotent: true });
      } catch (error) {
        // Ignore individual failures
      }
    }
  }
}