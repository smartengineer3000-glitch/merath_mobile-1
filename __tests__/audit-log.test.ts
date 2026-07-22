/**
 * اختبارات نظام تسجيل العمليات
 * Audit Log Tests
 */

import { describe, it, expect, beforeEach } from "vitest";
import { AuditLog, getAuditLogStats } from "../lib/inheritance/audit-log";
import { CalculationResult } from "../lib/inheritance/types";

describe("AuditLog System", () => {
  let auditLog: AuditLog;

  beforeEach(async () => {
    auditLog = new AuditLog(false); // بدون Local Storage للاختبار
  });

  describe("Basic Operations", () => {
    it("should create a new audit log entry", async () => {
      const entry = await auditLog.addEntry({
        operation: "calculate",
        madhab: "shafii",
        heirs: { husband: 1, daughter: 1 },
        estate: { total: 120000, funeral: 0, debts: 0, will: 0 },
        result: null,
        metadata: {
          success: true,
          duration: 5,
        },
      });

      expect(entry?.id).toBeDefined();
      expect(entry?.timestamp).toBeDefined();
      expect(entry?.operation).toBe("calculate");
      expect(entry?.madhab).toBe("shafii");
    });

    it("should get all entries", async () => {
      await auditLog.addEntry({
        operation: "calculate",
        madhab: "shafii",
        heirs: { husband: 1 },
        estate: { total: 100000, funeral: 0, debts: 0, will: 0 },
        result: null,
        metadata: { success: true },
      });

      await auditLog.addEntry({
        operation: "calculate",
        madhab: "hanafi",
        heirs: { wife: 1 },
        estate: { total: 100000, funeral: 0, debts: 0, will: 0 },
        result: null,
        metadata: { success: true },
      });

      const entries = auditLog.getAllEntries();
      expect(entries.length).toBe(2);
    });

    it("should delete a specific entry", async () => {
      const entry = await auditLog.addEntry({
        operation: "calculate",
        madhab: "shafii",
        heirs: { husband: 1 },
        estate: { total: 100000, funeral: 0, debts: 0, will: 0 },
        result: null,
        metadata: { success: true },
      });

      expect(auditLog.getAllEntries().length).toBe(1);
      const deleted = await auditLog.deleteEntry(entry.id);
      expect(deleted).toBe(true);
      expect(auditLog.getAllEntries().length).toBe(0);
    });

    it("should clear all entries", async () => {
      await auditLog.addEntry({
        operation: "calculate",
        madhab: "shafii",
        heirs: { husband: 1 },
        estate: { total: 100000, funeral: 0, debts: 0, will: 0 },
        result: null,
        metadata: { success: true },
      });

      await auditLog.addEntry({
        operation: "calculate",
        madhab: "hanafi",
        heirs: { wife: 1 },
        estate: { total: 100000, funeral: 0, debts: 0, will: 0 },
        result: null,
        metadata: { success: true },
      });

      const cleared = await auditLog.clearAll();
      expect(cleared).toBe(2);
      expect(auditLog.getAllEntries().length).toBe(0);
    });
  });

  describe("Filtering", () => {
    beforeEach(async () => {
      await auditLog.addEntry({
        operation: "calculate",
        madhab: "shafii",
        heirs: { husband: 1 },
        estate: { total: 100000, funeral: 0, debts: 0, will: 0 },
        result: null,
        metadata: { success: true },
      });

      await auditLog.addEntry({
        operation: "calculate",
        madhab: "hanafi",
        heirs: { wife: 1 },
        estate: { total: 100000, funeral: 0, debts: 0, will: 0 },
        result: null,
        metadata: { success: true },
      });

      await auditLog.addEntry({
        operation: "calculate",
        madhab: "shafii",
        heirs: { father: 1 },
        estate: { total: 100000, funeral: 0, debts: 0, will: 0 },
        result: null,
        metadata: { success: false, errorMessage: "خطأ في البيانات" },
      });
    });

    it("should filter by madhab", async () => {
      const filtered = await auditLog.filter({ madhab: "shafii" });
      expect(filtered.length).toBe(2);
    });

    it("should filter by operation", async () => {
      const filtered = await auditLog.filter({ operation: "calculate" });
      expect(filtered.length).toBe(3);
    });

    it("should filter successful operations only", async () => {
      const filtered = await auditLog.filter({ successOnly: true });
      expect(filtered.length).toBe(2);
    });

    it("should apply limit and offset", async () => {
      const filtered = await auditLog.filter({ limit: 1, offset: 0 });
      expect(filtered.length).toBe(1);
    });

    it("should combine multiple filters", async () => {
      const filtered = await auditLog.filter({
        madhab: "shafii",
        successOnly: true,
      });
      expect(filtered.length).toBe(1);
    });
  });

  describe("Statistics", () => {
    it("should calculate correct statistics", async () => {
      await auditLog.addEntry({
        operation: "calculate",
        madhab: "shafii",
        heirs: { husband: 1 },
        estate: { total: 100000, funeral: 0, debts: 0, will: 0 },
        result: null,
        metadata: { success: true },
      });

      await auditLog.addEntry({
        operation: "calculate",
        madhab: "hanafi",
        heirs: { wife: 1 },
        estate: { total: 100000, funeral: 0, debts: 0, will: 0 },
        result: null,
        metadata: { success: false },
      });

      const stats = auditLog.getStats();

      expect(stats.totalEntries).toBe(2);
      expect(stats.successfulOperations).toBe(1);
      expect(stats.failedOperations).toBe(1);
      expect(stats.successRate).toBe(50);
      expect(stats.madhabs.shafii).toBe(1);
      expect(stats.madhabs.hanafi).toBe(1);
    });

    it("should track operations statistics", async () => {
      await auditLog.addEntry({
        operation: "calculate",
        madhab: "shafii",
        heirs: { husband: 1 },
        estate: { total: 100000, funeral: 0, debts: 0, will: 0 },
        result: null,
        metadata: { success: true },
      });

      const stats = auditLog.getStats();
      expect(stats.operations.calculate).toBe(1);
    });
  });

  describe("Export Functionality", () => {
    beforeEach(async () => {
      await auditLog.addEntry({
        operation: "calculate",
        madhab: "shafii",
        heirs: { husband: 1 },
        estate: { total: 100000, funeral: 0, debts: 0, will: 0 },
        result: null,
        metadata: { success: true, duration: 5 },
      });
    });

    it("should export as JSON", async () => {
      const json = await auditLog.exportAsJSON();
      expect(json).toContain("calculate");
      expect(json).toContain("shafii");

      const parsed = JSON.parse(json);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(1);
    });

    it("should export as CSV", async () => {
      const csv = await auditLog.exportAsCSV();
      expect(csv).toContain("ID");
      expect(csv).toContain("Timestamp");
      expect(csv).toContain("Operation");
      expect(csv).toContain("calculate");
    });
  });

  describe("Import Functionality", () => {
    it("should import valid JSON data", async () => {
      await auditLog.addEntry({
        operation: "calculate",
        madhab: "shafii",
        heirs: { husband: 1 },
        estate: { total: 100000, funeral: 0, debts: 0, will: 0 },
        result: null,
        metadata: { success: true },
      });

      const json = await auditLog.exportAsJSON();
      const newLog = new AuditLog(false);
      const imported = await newLog.importFromJSON(json);

      expect(imported).toBe(1);
      expect(newLog.getAllEntries().length).toBe(1);
    });

    it("should handle invalid JSON gracefully", async () => {
      const imported = await auditLog.importFromJSON("invalid json");
      expect(imported).toBe(0);
    });

    it("should handle invalid data structure gracefully", async () => {
      const invalidData = '[{"invalid": "data"}]';
      const imported = await auditLog.importFromJSON(invalidData);
      expect(imported).toBe(0);
    });
  });

  describe("Storage Management", () => {
    it("should get storage size information", async () => {
      await auditLog.addEntry({
        operation: "calculate",
        madhab: "shafii",
        heirs: { husband: 1 },
        estate: { total: 100000, funeral: 0, debts: 0, will: 0 },
        result: null,
        metadata: { success: true },
      });

      const size = await auditLog.getStorageSize();
      expect(size.entries).toBe(1);
      expect(size.bytes).toBeGreaterThan(0);
    });

    it("should get detailed information", async () => {
      await auditLog.addEntry({
        operation: "calculate",
        madhab: "shafii",
        heirs: { husband: 1 },
        estate: { total: 100000, funeral: 0, debts: 0, will: 0 },
        result: null,
        metadata: { success: true },
      });

      const info = await auditLog.getDetailedInfo();
      expect(info.totalEntries).toBe(1);
      expect(info.stats).toBeDefined();
      expect(info.storageSize).toBeDefined();
      expect(info.timespan).toBeDefined();
    });

    it("should delete entries older than specified days", async () => {
      await auditLog.addEntry({
        operation: "calculate",
        madhab: "shafii",
        heirs: { husband: 1 },
        estate: { total: 100000, funeral: 0, debts: 0, will: 0 },
        result: null,
        metadata: { success: true },
      });

      // محاكاة تاريخ قديم
      const entries = auditLog.getAllEntries();
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 10);
      entries[0].timestamp = oldDate.toISOString();

      const deleted = await auditLog.deleteOlderThan(5);
      expect(deleted).toBe(1);
      expect(auditLog.getAllEntries().length).toBe(0);
    });
  });

  describe("Helper Functions", () => {
    it("should generate statistics summary", async () => {
      await auditLog.addEntry({
        operation: "calculate",
        madhab: "shafii",
        heirs: { husband: 1 },
        estate: { total: 100000, funeral: 0, debts: 0, will: 0 },
        result: null,
        metadata: { success: true },
      });

      const summary = await getAuditLogStats(auditLog);
      expect(summary).toContain("Total entries");
      expect(summary).toContain("Success rate");
      expect(summary).toContain("100.0%");
    });
  });

  describe("Logging Calculation", () => {
    it("should log calculation operation", async () => {
      const mockResult: CalculationResult = {
        success: true,
        madhab: "shafii",
        madhhabName: "الشافعي",
        shares: [],
        specialCases: {
          awl: false,
          auled: 0,
          radd: false,
          hijabTypes: [],
        },
        confidence: 100,
        steps: [],
        calculationTime: 5,
      };

      const entry = await auditLog.logCalculation(
        "shafii",
        { husband: 1 },
        { total: 120000, funeral: 0, debts: 0, will: 0 },
        mockResult,
        5,
        "اختبار",
      );

      expect(entry?.operation).toBe("calculate");
      expect(entry.metadata.duration).toBe(5);
      expect(entry.metadata.notes).toBe("اختبار");
      expect(entry.result?.success).toBe(true);
    });
  });
});
