/**
 * CSV Export Service
 * Phase 7: CSV Export for Inheritance Calculations
 * 
 * Exports calculation results as CSV files for spreadsheet applications
 * Matches original HTML functionality
 */

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform, Share } from 'react-native';
import { CalculationResult, HeirShare } from '../inheritance/types';

export interface CSVExportOptions {
  filename?: string;
  includeSummary?: boolean;
  includeDetails?: boolean;
}

export class CSVExporter {
  private static tempFiles: string[] = [];
  private static readonly MAX_TEMP_AGE_MS = 30 * 60 * 1000; // 30 minutes

  /**
   * Export calculation result to CSV string
   */
  static exportToCSV(result: CalculationResult, options: CSVExportOptions = {}): string {
    const {
      includeSummary = true,
      includeDetails = true
    } = options;

    const rows: string[][] = [];
    const netEstate = result.netEstate || result.shares.reduce((sum, s) => sum + s.amount, 0);

    // Add header
    rows.push(['تقرير توزيع التركة - حاسبة المواريث الشرعية']);
    rows.push(['تاريخ التقرير:', new Date().toLocaleDateString('ar-SA')]);
    rows.push(['المذهب الفقهي:', result.madhhabName]);
    rows.push(['']);
    
    // Add estate summary
    if (includeSummary) {
      rows.push(['ملخص التركة']);
      rows.push(['', 'المبلغ (ر.س)']);
      rows.push(['إجمالي التركة:', result.netEstate?.toFixed(2) || netEstate.toFixed(2)]);
      if (result.specialCases?.awl) rows.push(['ملاحظة:', 'تم تطبيق العول']);
      if (result.specialCases?.radd) rows.push(['ملاحظة:', 'تم تطبيق الرد']);
      rows.push(['']);
    }

    // Add distribution table
    if (includeDetails) {
      rows.push(['جدول توزيع الورثة']);
      rows.push(['الوارث', 'العدد', 'نوع الإرث', 'الكسر', 'النسبة %', 'المبلغ (ر.س)', 'لكل فرد (ر.س)']);
      
      result.shares.forEach(share => {
        const percentage = ((share.amount / netEstate) * 100).toFixed(2);
        const perPerson = share.amount / (share.count || 1);
        
        rows.push([
          share.name,
          (share.count || 1).toString(),
          share.type || 'فرض',
          share.fraction ? `${share.fraction.numerator}/${share.fraction.denominator}` : '-',
          percentage,
          share.amount.toFixed(2),
          perPerson.toFixed(2)
        ]);
      });
      
      rows.push(['']);
    }

    // Add blocked heirs if any
    if (result.blockedHeirs && result.blockedHeirs.length > 0) {
      rows.push(['الورثة المحجوبون']);
      rows.push(['الوارث المحجوب', 'سبب الحجب']);
      result.blockedHeirs.forEach(heir => {
        rows.push([heir, '-']);
      });
      rows.push(['']);
    }

    // Add special cases if any
    if (result.specialCases) {
      const cases = [];
      if (result.specialCases.awl) cases.push('العول');
      if (result.specialCases.radd) cases.push('الرد');
      if (result.specialCases.hijabTypes?.length) cases.push('الحجب');
      
      if (cases.length > 0) {
        rows.push(['الحالات الخاصة:', cases.join(' - ')]);
        rows.push(['']);
      }
    }

    // Add confidence score
    rows.push(['مستوى الثقة:', `${result.confidence.toFixed(1)}%`]);
    
    // Add footer
    rows.push(['']);
    rows.push(['تم إنشاء هذا التقرير بواسطة تطبيق حاسبة المواريث الشرعية']);
    rows.push(['© 2026 Merath Application. All rights reserved.']);

    // Convert to CSV with BOM for Arabic support
    return '\uFEFF' + rows.map(row => 
      row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  }

  /**
   * Export multiple calculations for comparison
   */
  static exportComparisonToCSV(results: CalculationResult[]): string {
    if (results.length === 0) return '';

    const rows: string[][] = [];
    
    rows.push(['مقارنة المذاهب الفقهية']);
    rows.push(['تاريخ التقرير:', new Date().toLocaleDateString('ar-SA')]);
    rows.push(['']);

    // Get all unique heir names
    const allHeirs = new Set<string>();
    results.forEach(r => {
      r.shares.forEach(s => allHeirs.add(s.name));
    });

    // Create header
    const header = ['الوارث', ...results.map(r => r.madhhabName)];
    rows.push(header);

    // Add each heir
    allHeirs.forEach(heirName => {
      const row = [heirName];
      results.forEach(r => {
        const share = r.shares.find(s => s.name === heirName);
        row.push(share ? share.amount.toFixed(2) : '0');
      });
      rows.push(row);
    });

    rows.push(['']);
    rows.push(['ملاحظات المقارنة:']);
    results.forEach(r => {
      if (r.specialCases?.awl || r.specialCases?.radd) {
        const cases = [];
        if (r.specialCases.awl) cases.push('عول');
        if (r.specialCases.radd) cases.push('رد');
        rows.push([`${r.madhhabName}:`, cases.join(' - ')]);
      }
    });

    return '\uFEFF' + rows.map(row => 
      row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  }

  /**
   * Register temp file for cleanup
   */
  private static registerTempFile(uri: string): void {
    this.tempFiles.push(uri);
    this.cleanupOldTempFiles();
  }

  /**
   * Clean up old temporary files
   */
  private static async cleanupOldTempFiles(): Promise<void> {
    const now = Date.now();
    
    // In a real implementation, you would check file ages
    // For now, just limit the number
    if (this.tempFiles.length > 20) {
      const toDelete = this.tempFiles.slice(0, this.tempFiles.length - 20);
      this.tempFiles = this.tempFiles.slice(-20);
      
      for (const uri of toDelete) {
        try {
          await FileSystem.deleteAsync(uri, { idempotent: true });
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    }
  }

  /**
   * Clean up specific file
   */
  private static async cleanupFile(uri: string): Promise<void> {
    try {
      await FileSystem.deleteAsync(uri, { idempotent: true });
      this.tempFiles = this.tempFiles.filter(f => f !== uri);
    } catch (error) {
      console.warn('[CSVExporter] Failed to cleanup file:', error);
    }
  }

  /**
   * Save CSV to file and share
   */
  static async shareCSV(
    result: CalculationResult,
    options: CSVExportOptions = {}
  ): Promise<void> {
    let fileUri: string | null = null;
    
    try {
      const csv = this.exportToCSV(result, options);
      const filename = options.filename || `merath-${Date.now()}.csv`;
      
      if (Platform.OS === 'web') {
        // Web: download via blob
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Try to share via Web Share API if available
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'تقرير الميراث',
              text: csv.substring(0, 500),
            });
          } catch (shareError) {
            // User cancelled or sharing not supported
          }
        }
      } else {
        // Native: save to file and share
        const fileDir = (FileSystem as any).documentDirectory;
        if (!fileDir) {
          throw new Error('لا يمكن الوصول إلى نظام الملفات');
        }
        
        fileUri = `${fileDir}${filename}`;
        await FileSystem.writeAsStringAsync(fileUri, csv, {
          encoding: 'utf8',
        });
        
        this.registerTempFile(fileUri);
        
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'text/csv',
            dialogTitle: 'مشاركة تقرير CSV',
            UTI: 'public.comma-separated-values-text'
          });
          
          // Clean up after sharing
          setTimeout(() => {
            this.cleanupFile(fileUri!);
          }, 5000);
        } else {
          // Fallback to clipboard
          await Share.share({
            message: csv,
            title: 'تقرير الميراث',
          });
        }
      }
    } catch (error) {
      console.error('[CSVExporter] Share error:', error);
      throw new Error('فشل في مشاركة ملف CSV: ' + (error as Error).message);
    }
  }

  /**
   * Share comparison CSV
   */
  static async shareComparisonCSV(results: CalculationResult[]): Promise<void> {
    if (results.length === 0) {
      throw new Error('لا توجد نتائج للمقارنة');
    }

    const csv = this.exportComparisonToCSV(results);
    const filename = `merath-comparison-${Date.now()}.csv`;
    
    if (Platform.OS === 'web') {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const fileDir = (FileSystem as any).documentDirectory;
      if (!fileDir) {
        throw new Error('لا يمكن الوصول إلى نظام الملفات');
      }
      
      const fileUri = `${fileDir}${filename}`;
      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: 'utf8',
      });
      
      this.registerTempFile(fileUri);
      
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'مشاركة مقارنة المذاهب',
        });
        
        setTimeout(() => {
          this.cleanupFile(fileUri);
        }, 5000);
      }
    }
  }

  /**
   * Save CSV to device (no share dialog)
   */
  static async saveCSV(
    result: CalculationResult,
    options: CSVExportOptions = {}
  ): Promise<string> {
    const csv = this.exportToCSV(result, options);
    const filename = options.filename || `merath-${Date.now()}.csv`;
    
    if (Platform.OS === 'web') {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      return url;
    } else {
      const fileDir = (FileSystem as any).documentDirectory;
      if (!fileDir) {
        throw new Error('لا يمكن الوصول إلى نظام الملفات');
      }
      
      const fileUri = `${fileDir}${filename}`;
      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: 'utf8',
      });
      
      return fileUri;
    }
  }

  /**
   * Clean up all temp files
   */
  static async cleanupAllTempFiles(): Promise<void> {
    const files = [...this.tempFiles];
    this.tempFiles = [];
    
    for (const uri of files) {
      try {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      } catch (error) {
        // Ignore individual failures
      }
    }
  }
}