import Dexie, { Table } from 'dexie';
import { MadhhabType, HeirsData, EstateData, CalculationResult } from '../inheritance/types';

export interface DBAuditLogEntry {
  id: string;
  timestamp: string;
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
  year: number;
  month: number;
  day: number;
  success: boolean;
  duration: number;
}

export class MerathDatabase extends Dexie {
  auditLogs!: Table<DBAuditLogEntry, string>;
  
  constructor() {
    super('MerathDatabase');
    this.version(1).stores({
      auditLogs: 'id, timestamp, madhab, operation, success, year, month, day, duration'
    });
  }
  
  async getStorageEstimate(): Promise<{ usage: number; quota: number }> {
    try {
      if (typeof window !== 'undefined' && window.navigator?.storage?.estimate) {
        const estimate = await window.navigator.storage.estimate();
        return {
          usage: estimate.usage ?? 0,
          quota: estimate.quota ?? 0
        };
      }
    } catch (error) {
      console.warn('[Database] Failed to get storage estimate:', error);
    }
    return { usage: 0, quota: 0 };
  }
}

export const db = new MerathDatabase();
export default db;
