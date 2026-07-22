/**
 * Comprehensive Audit Log System
 *
 * Logs all calculation operations with timestamps and user info.
 * Uses in-memory storage (React Native has no IndexedDB/localStorage).
 */

import { MadhhabType, HeirsData, EstateData, CalculationResult } from "./types";
import { generateId } from "./utils";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  operation: "calculate" | "delete" | "export" | "import" | "clear";
  madhab: MadhhabType;
  heirs: HeirsData;
  estate: EstateData;
  result: CalculationResult | null;
  userAgent?: string;
  metadata: {
    duration?: number;
    success: boolean;
    errorMessage?: string;
    notes?: string;
  };
}

export interface AuditLogFilter {
  madhab?: MadhhabType;
  operation?: AuditLogEntry["operation"];
  dateFrom?: string;
  dateTo?: string;
  successOnly?: boolean;
  limit?: number;
  offset?: number;
}

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
// Mutex lock for preventing race conditions
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

class TransactionQueue {
  private queue: (() => Promise<any>)[] = [];
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
 * Audit Log class — pure in-memory storage.
 */
export class AuditLog {
  private entries: AuditLogEntry[] = [];
  private maxEntries: number = 10000;
  private transactionQueue = new TransactionQueue();

  constructor(_enableLocalStorage: boolean = true, maxEntries: number = 10000) {
    this.maxEntries = maxEntries;
  }

  /**
   * Add a new entry
   */
  addEntry(
    entry: Omit<AuditLogEntry, "id" | "timestamp">,
  ): Promise<AuditLogEntry> {
    return this.transactionQueue.add(async () => {
      const newEntry: AuditLogEntry = {
        ...entry,
        id: generateId(),
        timestamp: new Date().toISOString(),
      };

      this.entries.push(newEntry);

      if (this.entries.length > this.maxEntries) {
        this.entries.shift();
      }

      return newEntry;
    });
  }

  /**
   * Log a calculation operation
   */
  logCalculation(
    madhab: MadhhabType,
    heirs: HeirsData,
    estate: EstateData,
    result: CalculationResult,
    duration: number,
    notes?: string,
  ): Promise<AuditLogEntry> {
    return this.addEntry({
      operation: "calculate",
      madhab,
      heirs,
      estate,
      result,
      metadata: {
        duration,
        success: result.success,
        errorMessage: result.error,
        notes,
      },
    });
  }

  /**
   * Get all entries
   */
  getAllEntries(): AuditLogEntry[] {
    return [...this.entries];
  }

  /**
   * Filter entries
   */
  async filter(filterCriteria: AuditLogFilter): Promise<AuditLogEntry[]> {
    let filtered = [...this.entries];

    if (filterCriteria.madhab) {
      filtered = filtered.filter((e) => e.madhab === filterCriteria.madhab);
    }

    if (filterCriteria.operation) {
      filtered = filtered.filter(
        (e) => e.operation === filterCriteria.operation,
      );
    }

    if (filterCriteria.dateFrom) {
      const fromDate = new Date(filterCriteria.dateFrom);
      filtered = filtered.filter((e) => new Date(e.timestamp) >= fromDate);
    }

    if (filterCriteria.dateTo) {
      const toDate = new Date(filterCriteria.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((e) => new Date(e.timestamp) <= toDate);
    }

    if (filterCriteria.successOnly) {
      filtered = filtered.filter((e) => e.metadata.success);
    }

    filtered.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    if (filterCriteria.offset) {
      filtered = filtered.slice(filterCriteria.offset);
    }

    if (filterCriteria.limit) {
      filtered = filtered.slice(0, filterCriteria.limit);
    }

    return filtered;
  }

  /**
   * Get a single entry by ID
   */
  async getEntry(id: string): Promise<AuditLogEntry | null> {
    return this.entries.find((e) => e.id === id) || null;
  }

  /**
   * Delete a single entry
   */
  async deleteEntry(id: string): Promise<boolean> {
    return this.transactionQueue.add(async () => {
      const index = this.entries.findIndex((e) => e.id === id);
      if (index >= 0) {
        this.entries.splice(index, 1);
        return true;
      }
      return false;
    });
  }

  /**
   * Clear all entries
   */
  async clearAll(): Promise<number> {
    return this.transactionQueue.add(async () => {
      const count = this.entries.length;
      this.entries = [];
      return count;
    });
  }

  /**
   * Delete entries older than N days
   */
  async deleteOlderThan(days: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const initialLength = this.entries.length;
    this.entries = this.entries.filter(
      (e) => new Date(e.timestamp) > cutoffDate,
    );

    return initialLength - this.entries.length;
  }

  /**
   * Get statistics
   */
  getStats(): AuditLogStats {
    const stats: AuditLogStats = {
      totalEntries: this.entries.length,
      successfulOperations: 0,
      failedOperations: 0,
      successRate: 0,
      madhabs: {},
      operations: {},
    };

    for (const entry of this.entries) {
      if (entry.metadata.success) {
        stats.successfulOperations++;
      } else {
        stats.failedOperations++;
      }

      stats.madhabs[entry.madhab] = (stats.madhabs[entry.madhab] || 0) + 1;
      stats.operations[entry.operation] =
        (stats.operations[entry.operation] || 0) + 1;
    }

    if (stats.totalEntries > 0) {
      stats.successRate =
        (stats.successfulOperations / stats.totalEntries) * 100;
    }

    if (this.entries.length > 0) {
      stats.lastEntry = this.entries[this.entries.length - 1];
    }

    return stats;
  }

  /**
   * Export as JSON
   */
  async exportAsJSON(): Promise<string> {
    return JSON.stringify(this.entries, null, 2);
  }

  /**
   * Export as CSV
   */
  async exportAsCSV(): Promise<string> {
    if (this.entries.length === 0) {
      return "ID,Timestamp,Operation,Madhab,Success,Duration,Notes\n";
    }

    const headers = "ID,Timestamp,Operation,Madhab,Success,Duration,Notes\n";
    const rows = this.entries.map((entry) => {
      const notes = entry.metadata.notes || "";
      const duration = entry.metadata.duration || "";
      return `${entry.id},"${entry.timestamp}","${entry.operation}","${entry.madhab}",${entry.metadata.success},"${duration}","${notes}"`;
    });

    return headers + rows.join("\n");
  }

  /**
   * Import from JSON
   */
  async importFromJSON(jsonString: string): Promise<number> {
    return this.transactionQueue.add(async () => {
      try {
        const data = JSON.parse(jsonString) as AuditLogEntry[];
        if (!Array.isArray(data)) {
          throw new Error("Invalid data: must be an array");
        }

        for (const entry of data) {
          if (!this.isValidEntry(entry)) {
            throw new Error("Invalid entry in log data");
          }
        }

        this.entries.push(...data);

        if (this.entries.length > this.maxEntries) {
          this.entries = this.entries.slice(-this.maxEntries);
        }

        return data.length;
      } catch (error) {
        console.error("Import failed:", error);
        return 0;
      }
    });
  }

  private isValidEntry(entry: any): boolean {
    return (
      entry &&
      typeof entry.id === "string" &&
      typeof entry.timestamp === "string" &&
      typeof entry.operation === "string" &&
      typeof entry.madhab === "string" &&
      entry.metadata &&
      typeof entry.metadata.success === "boolean"
    );
  }

  /**
   * Get storage size estimate
   */
  async getStorageSize(): Promise<{ entries: number; bytes: number }> {
    const jsonString = JSON.stringify(this.entries);
    const bytes = new Blob([jsonString]).size;

    return {
      entries: this.entries.length,
      bytes,
    };
  }

  /**
   * Get detailed info
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
        to: this.entries[this.entries.length - 1].timestamp,
      };
    }

    return {
      totalEntries: this.entries.length,
      stats,
      storageSize,
      timespan,
    };
  }

  /**
   * Wait for initialization (no-op, always ready)
   */
  async ready(): Promise<void> {}
}

export function createAuditLog(enableLocalStorage?: boolean): AuditLog {
  return new AuditLog(enableLocalStorage);
}

export async function getAuditLogStats(log: AuditLog): Promise<string> {
  const info = await log.getDetailedInfo();
  return `
Audit Log Stats:
  Total entries: ${info.totalEntries}
  Successful: ${info.stats.successfulOperations}
  Failed: ${info.stats.failedOperations}
  Success rate: ${info.stats.successRate.toFixed(1)}%
  Storage: ${(info.storageSize.bytes / 1024).toFixed(2)} KB
  Timespan: ${info.timespan ? `${info.timespan.from} to ${info.timespan.to}` : "No entries"}
  `.trim();
}

export default AuditLog;
