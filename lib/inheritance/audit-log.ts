/**
 * نظام تسجيل العمليات الشامل
 * Comprehensive Audit Log System
 * 
 * تسجيل جميع عمليات الحساب والتعديلات مع الطوابع الزمنية والمستخدم
 * 
 * FIXES:
 * - C4 (🔴): Race condition protection with mutex locks and transaction queue
 * - H1 (🟠): Offline data limitation - upgraded from AsyncStorage to Dexie/IndexedDB
 */

import { MadhhabType, HeirsData, EstateData, CalculationResult } from './types';
import { generateId, formatTime } from './utils';
import { db, AuditLogEntry as DBAuditLogEntry } from '../database/db'; // We'll create this next

// ============================================================================
// FIX H1: Dexie Database Integration
// ============================================================================
// We'll create a separate database file, but for now define the interface
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

// ============================================================================
// FIX C4: Mutex lock for preventing race conditions
// ============================================================================
class Mutex {
  private locking: Promise<void> = Promise.resolve();
  private locks = 0;

  async lock(): Promise<() => void> {
    let unlockNext: () => void;
    const willLock = new Promise<void>((resolve) => (unlockNext = resolve));

    const previousLock = this.locking;
    this.locking = this.locking.then(() => willLock);
    this.locks++;

    await previousLock;
    return () => {
      unlockNext!();
      this.locks--;
      if (this.locks === 0) {
        this.locking = Promise.resolve();
      }
    };
  }

  get isLocked(): boolean {
    return this.locks > 0;
  }
}

/**
 * Transaction queue for sequential operations
 */
class TransactionQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private mutex = new Mutex();

  async add<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await operation();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.process();
    });
  }

  private async process() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const operation = this.queue.shift();
      if (operation) {
        const unlock = await this.mutex.lock();
        try {
          await operation();
        } finally {
          unlock();
        }
      }
    }

    this.processing = false;
  }
}

/**
 * فئة نظام تسجيل العمليات
 */
export class AuditLog {
  private entries: AuditLogEntry[] = []; // In-memory cache
  private maxEntries: number = 10000; // الحد الأقصى للسجلات (زيادة لاستيعاب IndexedDB)
  private storageKey: string = 'merath_audit_log';
  private enableLocalStorage: boolean = true;
  
  // ===== FIX C4: Race condition protection =====
  private transactionQueue = new TransactionQueue();
  private pendingWrites = new Map<string, Promise<void>>();
  
  // ===== FIX H1: Database ready flag =====
  private dbReady: boolean = false;
  private initPromise: Promise<void>;

  constructor(enableLocalStorage: boolean = true, maxEntries: number = 10000) {
    this.enableLocalStorage = enableLocalStorage;
    this.maxEntries = maxEntries;
    
    // ===== FIX H1: Initialize database connection =====
    this.initPromise = this.initializeDatabase();
  }

  /**
   * ===== FIX H1: Initialize IndexedDB connection =====
   */
  private async initializeDatabase(): Promise<void> {
    try {
      // Check if db is available
      if (db && typeof db.auditLogs !== 'undefined') {
        // Load existing entries from IndexedDB into memory cache
        const dbEntries = await db.auditLogs
          .orderBy('timestamp')
          .reverse()
          .limit(this.maxEntries)
          .toArray();
        
        // Convert DB entries to our format
        this.entries = dbEntries.map(this.convertFromDBEntry);
        this.dbReady = true;
        
        console.log(`[AuditLog] Loaded ${this.entries.length} entries from IndexedDB`);
      } else {
        // Fallback to localStorage only
        if (this.enableLocalStorage) {
          this.loadFromStorage();
        }
      }
    } catch (error) {
      console.error('[AuditLog] Failed to initialize database:', error);
      // Fallback to localStorage
      if (this.enableLocalStorage) {
        this.loadFromStorage();
      }
    }
  }

  /**
   * ===== FIX H1: Convert DB entry to AuditLogEntry =====
   */
  private convertFromDBEntry(dbEntry: any): AuditLogEntry {
    return {
      id: dbEntry.id,
      timestamp: dbEntry.timestamp,
      operation: dbEntry.operation,
      madhab: dbEntry.madhab,
      heirs: dbEntry.heirs,
      estate: dbEntry.estate,
      result: dbEntry.result,
      userAgent: dbEntry.userAgent,
      metadata: dbEntry.metadata
    };
  }

  /**
   * ===== FIX H1: Convert to DB entry format =====
   */
  private convertToDBEntry(entry: AuditLogEntry): any {
    return {
      id: entry.id,
      timestamp: entry.timestamp,
      operation: entry.operation,
      madhab: entry.madhab,
      heirs: entry.heirs,
      estate: entry.estate,
      result: entry.result,
      userAgent: entry.userAgent,
      metadata: entry.metadata,
      // Add indexed fields for querying
      year: new Date(entry.timestamp).getFullYear(),
      month: new Date(entry.timestamp).getMonth() + 1,
      day: new Date(entry.timestamp).getDate(),
      success: entry.metadata.success,
      duration: entry.metadata.duration || 0
    };
  }

  /**
   * إضافة مدخل جديد للسجل
   * ===== FIX C4: Protected by transaction queue =====
   */
  addEntry(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<AuditLogEntry> {
    return this.transactionQueue.add(async () => {
      const newEntry: AuditLogEntry = {
        ...entry,
        id: generateId(),
        timestamp: new Date().toISOString()
      };

      // Add to memory cache
      this.entries.push(newEntry);

      // إبقاء السجل ضمن الحد الأقصى
      if (this.entries.length > this.maxEntries) {
        const removed = this.entries.shift(); // حذف الأقدم
        // Also remove from database if using IndexedDB
        if (this.dbReady && removed) {
          await db.auditLogs.delete(removed.id).catch(() => {});
        }
      }

      // Save to persistent storage
      await this.saveEntryToStorage(newEntry);

      return newEntry;
    });
  }

  /**
   * ===== FIX H1: Save single entry to IndexedDB =====
   */
  private async saveEntryToStorage(entry: AuditLogEntry): Promise<void> {
    // Check if there's already a pending write for this ID
    const existing = this.pendingWrites.get(entry.id);
    if (existing) {
      return existing;
    }

    const writePromise = (async () => {
      try {
        if (this.dbReady) {
          // Use IndexedDB
          await db.auditLogs.put(this.convertToDBEntry(entry));
        } else if (this.enableLocalStorage) {
          // Fallback to localStorage (save all entries)
          this.saveToStorage();
        }
      } finally {
        this.pendingWrites.delete(entry.id);
      }
    })();

    this.pendingWrites.set(entry.id, writePromise);
    await writePromise;
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
  ): Promise<AuditLogEntry> {
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
   * ===== FIX H1: Enhanced filtering using IndexedDB when available =====
   */
  async filter(filterCriteria: AuditLogFilter): Promise<AuditLogEntry[]> {
    if (this.dbReady) {
      return this.filterUsingIndexedDB(filterCriteria);
    } else {
      return this.filterInMemory(filterCriteria);
    }
  }

  /**
   * ===== FIX H1: IndexedDB-based filtering (fast, indexed) =====
   */
  private async filterUsingIndexedDB(filterCriteria: AuditLogFilter): Promise<AuditLogEntry[]> {
    try {
      let query = db.auditLogs.orderBy('timestamp').reverse();

      // Apply filters
      if (filterCriteria.madhab) {
        query = query.filter(entry => entry.madhab === filterCriteria.madhab) as any;
      }

      if (filterCriteria.operation) {
        query = query.filter(entry => entry.operation === filterCriteria.operation) as any;
      }

      if (filterCriteria.successOnly !== undefined) {
        query = query.filter(entry => entry.metadata.success === filterCriteria.successOnly) as any;
      }

      if (filterCriteria.dateFrom) {
        const fromDate = new Date(filterCriteria.dateFrom);
        query = query.filter(entry => new Date(entry.timestamp) >= fromDate) as any;
      }

      if (filterCriteria.dateTo) {
        const toDate = new Date(filterCriteria.dateTo);
        toDate.setHours(23, 59, 59, 999);
        query = query.filter(entry => new Date(entry.timestamp) <= toDate) as any;
      }

      // Apply pagination
      if (filterCriteria.offset) {
        query = query.offset(filterCriteria.offset) as any;
      }

      if (filterCriteria.limit) {
        query = query.limit(filterCriteria.limit) as any;
      }

      const dbEntries = await query.toArray();
      return dbEntries.map(this.convertFromDBEntry);
    } catch (error) {
      console.error('[AuditLog] IndexedDB filter failed, falling back to memory:', error);
      return this.filterInMemory(filterCriteria);
    }
  }

  /**
   * ===== FIX H1: In-memory filtering (fallback) =====
   */
  private filterInMemory(filterCriteria: AuditLogFilter): AuditLogEntry[] {
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
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(e => new Date(e.timestamp) <= toDate);
    }

    // تصفية العمليات الناجحة فقط
    if (filterCriteria.successOnly) {
      filtered = filtered.filter(e => e.metadata.success);
    }

    // الترتيب: الأحدث أولاً
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

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
  async getEntry(id: string): Promise<AuditLogEntry | null> {
    // Check memory cache first
    const cached = this.entries.find(e => e.id === id);
    if (cached) return cached;

    // Check IndexedDB
    if (this.dbReady) {
      try {
        const dbEntry = await db.auditLogs.get(id);
        return dbEntry ? this.convertFromDBEntry(dbEntry) : null;
      } catch (error) {
        console.error('[AuditLog] Failed to get entry from DB:', error);
      }
    }

    return null;
  }

  /**
   * حذف سجل واحد
   * ===== FIX C4: Protected by transaction queue =====
   */
  async deleteEntry(id: string): Promise<boolean> {
    return this.transactionQueue.add(async () => {
      // Remove from memory cache
      const index = this.entries.findIndex(e => e.id === id);
      if (index >= 0) {
        this.entries.splice(index, 1);
      }

      // Remove from persistent storage
      try {
        if (this.dbReady) {
          await db.auditLogs.delete(id);
        } else if (this.enableLocalStorage) {
          this.saveToStorage();
        }
        return true;
      } catch (error) {
        console.error('[AuditLog] Failed to delete entry:', error);
        return false;
      }
    });
  }

  /**
   * حذف جميع السجلات
   */
  async clearAll(): Promise<number> {
    return this.transactionQueue.add(async () => {
      const count = this.entries.length;
      this.entries = [];

      try {
        if (this.dbReady) {
          await db.auditLogs.clear();
        } else if (this.enableLocalStorage) {
          this.saveToStorage();
        }
      } catch (error) {
        console.error('[AuditLog] Failed to clear entries:', error);
      }

      return count;
    });
  }

  /**
   * حذف السجلات القديمة
   */
  async deleteOlderThan(days: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const initialLength = this.entries.length;
    
    // Filter out old entries from memory
    this.entries = this.entries.filter(
      e => new Date(e.timestamp) > cutoffDate
    );

    // Delete from IndexedDB
    if (this.dbReady) {
      try {
        const oldEntries = await db.auditLogs
          .where('timestamp')
          .below(cutoffDate.toISOString())
          .toArray();
        
        await Promise.all(oldEntries.map(e => db.auditLogs.delete(e.id)));
      } catch (error) {
        console.error('[AuditLog] Failed to delete old entries:', error);
      }
    } else if (this.enableLocalStorage) {
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
  async exportAsJSON(): Promise<string> {
    let entriesToExport = this.entries;
    
    // If using IndexedDB, get all entries (not just cache)
    if (this.dbReady && this.entries.length < (await db.auditLogs.count())) {
      entriesToExport = (await db.auditLogs.toArray()).map(this.convertFromDBEntry);
    }

    return JSON.stringify(entriesToExport, null, 2);
  }

  /**
   * تصدير البيانات بصيغة CSV
   */
  async exportAsCSV(): Promise<string> {
    let entriesToExport = this.entries;
    
    if (this.dbReady && this.entries.length < (await db.auditLogs.count())) {
      entriesToExport = (await db.auditLogs.toArray()).map(this.convertFromDBEntry);
    }

    if (entriesToExport.length === 0) {
      return 'ID,Timestamp,Operation,Madhab,Success,Duration,Notes\n';
    }

    const headers = 'ID,Timestamp,Operation,Madhab,Success,Duration,Notes\n';
    const rows = entriesToExport.map(entry => {
      const notes = entry.metadata.notes || '';
      const duration = entry.metadata.duration || '';
      return `${entry.id},"${entry.timestamp}","${entry.operation}","${entry.madhab}",${entry.metadata.success},"${duration}","${notes}"`;
    });

    return headers + rows.join('\n');
  }

  /**
   * استيراد البيانات من JSON
   */
  async importFromJSON(jsonString: string): Promise<number> {
    return this.transactionQueue.add(async () => {
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

        // Add all entries
        if (this.dbReady) {
          // Batch insert for better performance
          const batch = data.map(entry => this.convertToDBEntry(entry));
          await db.auditLogs.bulkPut(batch);
          
          // Refresh memory cache
          const dbEntries = await db.auditLogs
            .orderBy('timestamp')
            .reverse()
            .limit(this.maxEntries)
            .toArray();
          this.entries = dbEntries.map(this.convertFromDBEntry);
        } else {
          // Add to memory
          this.entries.push(...data);

          // الحفاظ على الحد الأقصى
          if (this.entries.length > this.maxEntries) {
            this.entries = this.entries.slice(-this.maxEntries);
          }

          if (this.enableLocalStorage) {
            this.saveToStorage();
          }
        }

        return data.length;
      } catch (error) {
        console.error('خطأ في الاستيراد:', error);
        return 0;
      }
    });
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
   * حفظ السجلات في التخزين المحلي (localStorage fallback)
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
   * تحميل السجلات من التخزين المحلي (localStorage fallback)
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
  async getStorageSize(): Promise<{ entries: number; bytes: number }> {
    let entriesCount = this.entries.length;
    let bytes = 0;

    if (this.dbReady) {
      entriesCount = await db.auditLogs.count();
      // Estimate size (IndexedDB doesn't give exact size)
      bytes = entriesCount * 2000; // Rough estimate: 2KB per entry
    } else {
      const jsonString = JSON.stringify(this.entries);
      bytes = new Blob([jsonString]).size;
    }

    return {
      entries: entriesCount,
      bytes
    };
  }

  /**
   * الحصول على معلومات تفصيلية عن السجل
   */
  async getDetailedInfo(): Promise<{
    totalEntries: number;
    stats: AuditLogStats;
    storageSize: { entries: number; bytes: number };
    timespan: { from: string; to: string } | null;
  }> {
    const stats = this.getStats();
    const storageSize = await this.getStorageSize();

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

  /**
   * Wait for database to be ready
   */
  async ready(): Promise<void> {
    await this.initPromise;
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
export async function getAuditLogStats(log: AuditLog): Promise<string> {
  const info = await log.getDetailedInfo();
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