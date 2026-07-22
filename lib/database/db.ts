/**
 * Database Configuration Stub
 *
 * IndexedDB is not available in React Native. The audit-log system
 * uses pure in-memory storage as its working backend.
 *
 * This file exports a no-op stub so existing imports remain stable.
 */

export interface DBAuditLogEntry {
  id: string;
  timestamp: string;
  operation: "calculate" | "delete" | "export" | "import" | "clear";
  madhab: string;
  heirs: Record<string, number>;
  estate: {
    total: number;
    funeral: number;
    debts: number;
    will: number;
  };
  result: any | null;
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

/**
 * Stub database — all operations are no-ops.
 * The AuditLog class detects `dbReady = false` and uses in-memory storage.
 */
export const db = {
  auditLogs: {
    async put(_entry: DBAuditLogEntry): Promise<string> {
      return "";
    },
    async delete(_id: string): Promise<void> {},
    async clear(): Promise<void> {},
    async get(_id: string): Promise<DBAuditLogEntry | undefined> {
      return undefined;
    },
    async count(): Promise<number> {
      return 0;
    },
    async toArray(): Promise<DBAuditLogEntry[]> {
      return [];
    },
    async bulkPut(_entries: DBAuditLogEntry[]): Promise<void> {},
    orderBy(_index: string) {
      return {
        reverse() {
          return {
            limit(_n: number) {
              return {
                async toArray(): Promise<DBAuditLogEntry[]> {
                  return [];
                },
              };
            },
            async toArray(): Promise<DBAuditLogEntry[]> {
              return [];
            },
          };
        },
        async first(): Promise<DBAuditLogEntry | undefined> {
          return undefined;
        },
        async last(): Promise<DBAuditLogEntry | undefined> {
          return undefined;
        },
        equals(_value: any) {
          return {
            async count(): Promise<number> {
              return 0;
            },
          };
        },
      };
    },
    where(_index: string) {
      return {
        below(_value: any) {
          return {
            async toArray(): Promise<DBAuditLogEntry[]> {
              return [];
            },
          };
        },
        equals(_value: any) {
          return {
            async count(): Promise<number> {
              return 0;
            },
          };
        },
      };
    },
  },
  on(_event: string, _callback: () => void) {},
};

export default db;
