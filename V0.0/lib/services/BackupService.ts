import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { db } from "../database/db";
import { SettingsState } from "../context/SettingsContext";

export interface BackupData {
  version: string;
  timestamp: string;
  appVersion: string;
  data: {
    settings: SettingsState | null;
    favorites: unknown[];
    auditLog: any[];
  };
}

export class BackupService {
  private static readonly BACKUP_VERSION = "1.0";
  private static readonly APP_VERSION = "1.1.3";

  static async createBackup(): Promise<{ uri: string; data: BackupData }> {
    try {
      const settingsJson = await AsyncStorage.getItem("@merath_settings_v2");
      const settings = settingsJson ? JSON.parse(settingsJson) : null;

      const favoritesJson = await AsyncStorage.getItem("@merath_favorites");
      const favorites = favoritesJson ? JSON.parse(favoritesJson) : [];

      let auditLog: any[] = [];
      if (db && db.auditLogs) {
        auditLog = await db.auditLogs.toArray();
      }

      const backupData: BackupData = {
        version: this.BACKUP_VERSION,
        timestamp: new Date().toISOString(),
        appVersion: this.APP_VERSION,
        data: { settings, favorites, auditLog },
      };

      const backupJson = JSON.stringify(backupData, null, 2);
      const fileName = `merath-backup-${new Date().toISOString().split("T")[0]}.json`;
      const fileUri = (FileSystem as any).documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, backupJson, {
        encoding: "utf8",
      });
      return { uri: fileUri, data: backupData };
    } catch (error) {
      console.error("Backup creation failed:", error);
      throw new Error("فشل إنشاء النسخة الاحتياطية");
    }
  }

  static async shareBackup(uri: string): Promise<void> {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) throw new Error("المشاركة غير متوفرة");
      await Sharing.shareAsync(uri, {
        mimeType: "application/json",
        dialogTitle: "مشاركة النسخة الاحتياطية",
      });
    } catch (error) {
      console.error("Backup sharing failed:", error);
      throw new Error("فشل مشاركة النسخة الاحتياطية");
    }
  }

  static async restoreFromBackup(): Promise<void> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      const content = await FileSystem.readAsStringAsync(file.uri, {
        encoding: "utf8",
      });
      const backupData = JSON.parse(content) as BackupData;

      if (!backupData.version || !backupData.data) {
        throw new Error("ملف النسخة الاحتياطية غير صالح");
      }

      if (backupData.data.settings) {
        await AsyncStorage.setItem(
          "@merath_settings_v2",
          JSON.stringify(backupData.data.settings),
        );
      }
      if (backupData.data.favorites) {
        await AsyncStorage.setItem(
          "@merath_favorites",
          JSON.stringify(backupData.data.favorites),
        );
      }
      if (db && db.auditLogs && backupData.data.auditLog) {
        await db.auditLogs.clear();
        await db.auditLogs.bulkPut(backupData.data.auditLog);
      }
    } catch (error) {
      console.error("Restore failed:", error);
      throw new Error("فشل استعادة البيانات: " + (error as Error).message);
    }
  }
}
