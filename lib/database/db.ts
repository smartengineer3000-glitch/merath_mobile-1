/**
 * IndexedDB Database Configuration
 * Uses Dexie.js for better IndexedDB handling
 * 
 * FIX H1: Provides offline-first, scalable storage for audit logs
 */

import Dexie, { Table } from 'dexie';
import { MadhhabType, HeirsData, EstateData, CalculationResult } from '../inheritance/types';

// Define the database entry type
export interface DBAuditLogEntry {
  id: string;                           // Primary key
  timestamp: string;                    // ISO format
  operation: 'calculate' | 'delete' | 'export' | 'import' | 'clear';
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
  // Indexed fields for faster queries
  year: number;
  month: number;
  day: number;
  success: boolean;
  duration: number;
}

export class MerathDatabase extends Dexie {
  // Table names
  auditLogs!: Table<DBAuditLogEntry, string>; // string = id type
  
  constructor() {
    super('MerathDatabase');
    
    // Define database schema
    this.version(1).stores({
      auditLogs: 'id, timestamp, madhab, operation, success, year, month, day, duration, [year+month], [madhab+success]'
    });
    
    // Version 2: Add more indexes for complex queries
    this.version(2).stores({
      auditLogs: 'id, timestamp, madhab, operation, success, year, month, day, duration, [year+month], [madhab+success], [operation+success]'
    }).upgrade(tx => {
      // Data migration if needed
      console.log('Upgrading database to version 2');
    });
  }
  
  /**
   * Clear old entries to manage storage
   */
  async clearOlderThan(days: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const oldEntries = await this.auditLogs
      .where('timestamp')
      .below(cutoffDate.toISOString())
      .toArray();
    
    await this.auditLogs.bulkDelete(oldEntries.map(e => e.id));
    
    return oldEntries.length;
  }
  
  /**
   * Get storage estimate
   */
  /**
   * Get storage estimate
   */
  async getStorageEstimate(): Promise<{ usage: number; quota: number }> {
    try {
      if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        return {
          usage: estimate.usage ?? 0,
          quota: estimate.quota ?? 0
        };
      }
    } catch (error) {
      console.warn('Failed to get storage estimate:', error);
    }
    return { usage: 0, quota: 0 };
  }
  
  /**
   * Get database statistics
   */
  async getStats(): Promise<{
    totalEntries: number;
    byMadhab: Record<string, number>;
    byOperation: Record<string, number>;
    oldestEntry: string | null;
    newestEntry: string | null;
  }> {
    const totalEntries = await this.auditLogs.count();
    
    // Get counts by madhab
    const madhabs = ['shafii', 'hanafi', 'maliki', 'hanbali'];
    const byMadhab: Record<string, number> = {};
    
    for (const madhab of madhabs) {
      byMadhab[madhab] = await this.auditLogs.where('madhab').equals(madhab as any).count();
    }
    
    // Get counts by operation
    const operations = ['calculate', 'delete', 'export', 'import', 'clear'];
    const byOperation: Record<string, number> = {};
    
    for (const op of operations) {
      byOperation[op] = await this.auditLogs.where('operation').equals(op as any).count();
    }
    
    // Get oldest and newest
    const oldest = await this.auditLogs.orderBy('timestamp').first();
    const newest = await this.auditLogs.orderBy('timestamp').last();
    
    return {
      totalEntries,
      byMadhab,
      byOperation,
      oldestEntry: oldest?.timestamp || null,
      newestEntry: newest?.timestamp || null
    };
  }
}

// Export a singleton instance
export const db = new MerathDatabase();

// export type { DBAuditLogEntry }; // Already exported

// Initialize database
db.on('ready', () => {
  console.log('[Database] MerathDatabase ready');
});

export default db;