import { db, DBAuditLogEntry } from '../database/db';



/**
 * نظام تسجيل العمليات الشامل
 * Comprehensive Audit Log System
 * 
 * تسجيل جميع عمليات الحساب والتعديلات مع الطوابع الزمنية والمستخدم
 */

import { MadhhabType, HeirsData, EstateData, CalculationResult } from './types';
import { generateId, formatTime } from './utils';

/**
 * بيانات مدخل السجل الواحد
 */
export interface AuditLogEntry {
  id: string;                           // معرّف فريد للسجل
  timestamp: string;                    // الطابع الزمني (ISO format)
  operation: 'calculate' | 'delete' | 'export' | 'import' | 'clear'; // نوع العملية
  madhab: MadhhabType;                  // المذهب المستخدم
  heirs: HeirsData;                     // بيانات الورثة
  estate: EstateData;                   // بيانات التركة
  result: CalculationResult | null;     // نتيجة الحساب
  userAgent?: string;                   // معلومات المستخدم
  metadata: {
    duration?: number;                  // مدة الحساب بـ ms
    success: boolean;                   // هل نجحت العملية
    errorMessage?: string;              // رسالة الخطأ إن وجدت
    notes?: string;                     // ملاحظات إضافية
  };
}

/**
 * معايير البحث والتصفية
 */
export interface AuditLogFilter {
  madhab?: MadhhabType;
  operation?: AuditLogEntry['operation'];
  dateFrom?: string;
  dateTo?: string;
  successOnly?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * إحصائيات السجل
 */
export interface AuditLogStats {
  totalEntries: number;
  successfulOperations: number;
  failedOperations: number;
  successRate: number;
  madhabs: Record<string, number>;
  operations: Record<string, number>;
  lastEntry?: AuditLogEntry;
}

/**
 * فئة نظام تسجيل العمليات
 */
export class AuditLog {
  private entries: AuditLogEntry[] = [];
  private maxEntries: number = 1000; // الحد الأقصى للسجلات
  private storageKey: string = 'merath_audit_log';
  private enableLocalStorage: boolean = true;

  constructor(enableLocalStorage: boolean = true, maxEntries: number = 1000) {
    this.enableLocalStorage = enableLocalStorage;
    this.maxEntries = maxEntries;
    if (this.enableLocalStorage) {
      this.loadFromStorage();
    }
  }

  /**
   * إضافة مدخل جديد للسجل
   */
  addEntry(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: generateId(),
      timestamp: new Date().toISOString()
    };

    this.entries.push(newEntry);

    // إبقاء السجل ضمن الحد الأقصى
    if (this.entries.length > this.maxEntries) {
      this.entries.shift(); // حذف الأقدم
    }

    // حفظ في التخزين المحلي
    if (this.enableLocalStorage) {
      this.saveToStorage();
    }

    return newEntry;
  }

  /**
   * تسجيل عملية حساب جديدة
   */
  logCalculation(
    madhab: MadhhabType,
    heirs: HeirsData,
    estate: EstateData,
    result: CalculationResult,
    duration: number,
    notes?: string
  ): AuditLogEntry {
    return this.addEntry({
      operation: 'calculate',
      madhab,
      heirs,
      estate,
      result,
      metadata: {
        duration,
        success: result.success,
        errorMessage: result.error,
        notes
      }
    });
  }

  /**
   * الحصول على جميع السجلات
   */
  getAllEntries(): AuditLogEntry[] {
    return [...this.entries];
  }

  /**
   * البحث والتصفية
   */
  filter(filterCriteria: AuditLogFilter): AuditLogEntry[] {
    let filtered = [...this.entries];

    // تصفية حسب المذهب
    if (filterCriteria.madhab) {
      filtered = filtered.filter(e => e.madhab === filterCriteria.madhab);
    }

    // تصفية حسب العملية
    if (filterCriteria.operation) {
      filtered = filtered.filter(e => e.operation === filterCriteria.operation);
    }

    // تصفية حسب التاريخ (من)
    if (filterCriteria.dateFrom) {
      const fromDate = new Date(filterCriteria.dateFrom);
      filtered = filtered.filter(e => new Date(e.timestamp) >= fromDate);
    }

    // تصفية حسب التاريخ (إلى)
    if (filterCriteria.dateTo) {
      const toDate = new Date(filterCriteria.dateTo);
      filtered = filtered.filter(e => new Date(e.timestamp) <= toDate);
    }

    // تصفية العمليات الناجحة فقط
    if (filterCriteria.successOnly) {
      filtered = filtered.filter(e => e.metadata.success);
    }

    // الترتيب: الأحدث أولاً
    filtered.reverse();

    // التطبيق الترقيمي
    if (filterCriteria.offset) {
      filtered = filtered.slice(filterCriteria.offset);
    }

    if (filterCriteria.limit) {
      filtered = filtered.slice(0, filterCriteria.limit);
    }

    return filtered;
  }

  /**
   * الحصول على سجل واحد بـ ID
   */
  getEntry(id: string): AuditLogEntry | null {
    return this.entries.find(e => e.id === id) || null;
  }

  /**
   * حذف سجل واحد
   */
  deleteEntry(id: string): boolean {
    const index = this.entries.findIndex(e => e.id === id);
    if (index >= 0) {
      this.entries.splice(index, 1);
      if (this.enableLocalStorage) {
        this.saveToStorage();
      }
      return true;
    }
    return false;
  }

  /**
   * حذف جميع السجلات
   */
  clearAll(): number {
    const count = this.entries.length;
    this.entries = [];
    if (this.enableLocalStorage) {
      this.saveToStorage();
    }
    return count;
  }

  /**
   * حذف السجلات القديمة
   */
  deleteOlderThan(days: number): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const initialLength = this.entries.length;
    this.entries = this.entries.filter(
      e => new Date(e.timestamp) > cutoffDate
    );

    if (this.enableLocalStorage) {
      this.saveToStorage();
    }

    return initialLength - this.entries.length;
  }

  /**
   * الحصول على إحصائيات السجل
   */
  getStats(): AuditLogStats {
    const stats: AuditLogStats = {
      totalEntries: this.entries.length,
      successfulOperations: 0,
      failedOperations: 0,
      successRate: 0,
      madhabs: {},
      operations: {}
    };

    for (const entry of this.entries) {
      // إحصائيات النجاح/الفشل
      if (entry.metadata.success) {
        stats.successfulOperations++;
      } else {
        stats.failedOperations++;
      }

      // إحصائيات المذاهب
      stats.madhabs[entry.madhab] = (stats.madhabs[entry.madhab] || 0) + 1;

      // إحصائيات العمليات
      stats.operations[entry.operation] = (stats.operations[entry.operation] || 0) + 1;
    }

    // حساب معدل النجاح
    if (stats.totalEntries > 0) {
      stats.successRate = (stats.successfulOperations / stats.totalEntries) * 100;
    }

    // آخر مدخل
    if (this.entries.length > 0) {
      stats.lastEntry = this.entries[this.entries.length - 1];
    }

    return stats;
  }

  /**
   * تصدير البيانات بصيغة JSON
   */
  exportAsJSON(): string {
    return JSON.stringify(this.entries, null, 2);
  }

  /**
   * تصدير البيانات بصيغة CSV
   */
  exportAsCSV(): string {
    if (this.entries.length === 0) {
      return 'ID,Timestamp,Operation,Madhab,Success,Duration,Notes\n';
    }

    const headers = 'ID,Timestamp,Operation,Madhab,Success,Duration,Notes\n';
    const rows = this.entries.map(entry => {
      const notes = entry.metadata.notes || '';
      const duration = entry.metadata.duration || '';
      return `${entry.id},"${entry.timestamp}","${entry.operation}","${entry.madhab}",${entry.metadata.success},"${duration}","${notes}"`;
    });

    return headers + rows.join('\n');
  }

  /**
   * استيراد البيانات من JSON
   */
  importFromJSON(jsonString: string): number {
    try {
      const data = JSON.parse(jsonString) as AuditLogEntry[];
      if (!Array.isArray(data)) {
        throw new Error('بيانات غير صحيحة: يجب أن تكون array');
      }

      // التحقق من صحة البيانات
      for (const entry of data) {
        if (!this.isValidEntry(entry)) {
          throw new Error('بيانات غير صحيحة في السجل');
        }
      }

      // إضافة البيانات
      this.entries.push(...data);

      // الحفاظ على الحد الأقصى
      if (this.entries.length > this.maxEntries) {
        this.entries = this.entries.slice(-this.maxEntries);
      }

      if (this.enableLocalStorage) {
        this.saveToStorage();
      }

      return data.length;
    } catch (error) {
      console.error('خطأ في الاستيراد:', error);
      return 0;
    }
  }

  /**
   * التحقق من صحة المدخل
   */
  private isValidEntry(entry: any): boolean {
    return (
      entry &&
      typeof entry.id === 'string' &&
      typeof entry.timestamp === 'string' &&
      typeof entry.operation === 'string' &&
      typeof entry.madhab === 'string' &&
      entry.metadata &&
      typeof entry.metadata.success === 'boolean'
    );
  }

  /**
   * حفظ السجلات في التخزين المحلي
   */
  private saveToStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(
          this.storageKey,
          JSON.stringify(this.entries)
        );
      }
    } catch (error) {
      console.error('خطأ في حفظ السجلات:', error);
    }
  }

  /**
   * تحميل السجلات من التخزين المحلي
   */
  private loadFromStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = window.localStorage.getItem(this.storageKey);
        if (data) {
          this.entries = JSON.parse(data) as AuditLogEntry[];
        }
      }
    } catch (error) {
      console.error('خطأ في تحميل السجلات:', error);
      this.entries = [];
    }
  }

  /**
   * الحصول على حجم التخزين المستخدم
   */
  getStorageSize(): { entries: number; bytes: number } {
    const jsonString = JSON.stringify(this.entries);
    return {
      entries: this.entries.length,
      bytes: new Blob([jsonString]).size
    };
  }

  /**
   * الحصول على معلومات تفصيلية عن السجل
   */
  getDetailedInfo(): {
    totalEntries: number;
    stats: AuditLogStats;
    storageSize: { entries: number; bytes: number };
    timespan: { from: string; to: string } | null;
  } {
    const stats = this.getStats();
    const storageSize = this.getStorageSize();

    let timespan = null;
    if (this.entries.length > 0) {
      timespan = {
        from: this.entries[0].timestamp,
        to: this.entries[this.entries.length - 1].timestamp
      };
    }

    return {
      totalEntries: this.entries.length,
      stats,
      storageSize,
      timespan
    };
  }
}

/**
 * دالة مساعدة: إنشاء مثيل واحد من AuditLog
 */
export function createAuditLog(enableLocalStorage?: boolean): AuditLog {
  return new AuditLog(enableLocalStorage);
}

/**
 * دالة مساعدة: الحصول على إحصائيات سريعة
 */
export function getAuditLogStats(log: AuditLog): string {
  const info = log.getDetailedInfo();
  return `
📊 إحصائيات السجل:
├── إجمالي السجلات: ${info.totalEntries}
├── عمليات ناجحة: ${info.stats.successfulOperations}
├── عمليات فاشلة: ${info.stats.failedOperations}
├── معدل النجاح: ${info.stats.successRate.toFixed(1)}%
├── حجم التخزين: ${(info.storageSize.bytes / 1024).toFixed(2)} KB
└── الفترة الزمنية: ${info.timespan ? `من ${info.timespan.from} إلى ${info.timespan.to}` : 'لا توجد سجلات'}
  `.trim();
}

export default AuditLog;
