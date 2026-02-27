]633;E;echo "# MERATH ISLAMIC INHERITANCE CALCULATOR - COMPLETE PROJECT DUMP";978f32a9-aacb-47a6-9b42-62424ad0221c]633;C# MERATH ISLAMIC INHERITANCE CALCULATOR - COMPLETE PROJECT DUMP
Generated on: Fri Feb 27 21:04:47 UTC 2026

# Project Structure
```
.
├── __tests__
│   ├── audit-log.test.ts
│   ├── audit-trail.test.ts
│   ├── components.test.ts
│   ├── debug-calculation.test.ts
│   ├── debug-edge-cases.test.ts
│   ├── hooks.test.ts
│   ├── inheritance.test.ts
│   ├── integration.test.ts
│   ├── performance.test.ts
│   └── real-world-scenarios.test.ts
├── assets
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash.png
├── components
│   ├── ui
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── DesignSystemComponents.tsx
│   │   └── Input.tsx
│   ├── AuditTrailCard.tsx
│   ├── CalculationButton.tsx
│   ├── CalculationHistory.tsx
│   ├── DisclaimersModal.tsx
│   ├── EstateInput.tsx
│   ├── HeirSelector.tsx
│   ├── MadhhabSelector.tsx
│   └── ResultsDisplay.tsx
├── lib
│   ├── context
│   │   ├── SettingsContext.tsx
│   │   └── ThemeProvider.tsx
│   ├── design
│   │   └── theme.ts
│   ├── errors
│   │   └── ErrorHandler.ts
│   ├── export
│   │   └── PDFExporter.ts
│   ├── i18n
│   │   ├── locales
│   │   │   ├── ar.json
│   │   │   ├── de.json
│   │   │   ├── en.json
│   │   │   ├── fr.json
│   │   │   ├── tr.json
│   │   │   └── ur.json
│   │   └── index.ts
│   ├── inheritance
│   │   ├── audit-log.ts
│   │   ├── audit-trail-manager.ts
│   │   ├── constants.ts
│   │   ├── enhanced-engine-complete.ts
│   │   ├── fraction.ts
│   │   ├── hijab-system.ts
│   │   ├── hooks.ts
│   │   ├── index.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── legal
│   │   └── Disclaimers.ts
│   ├── performance
│   │   ├── bundle-analyzer.ts
│   │   ├── optimization.ts
│   │   └── utils.ts
│   └── validation
│       └── InputValidator.ts
├── navigation
│   ├── RootNavigator.tsx
│   ├── index.ts
│   ├── linking.ts
│   └── types.ts
├── screens
│   ├── AboutScreen.tsx
│   ├── AuditTrailScreen.tsx
│   ├── CalculatorScreen.tsx
│   ├── HistoryScreen.tsx
│   └── SettingsScreen.tsx
├── support documents
│   ├── ANDROID_APP_ALIGNMENT_ANALYSIS.md
│   ├── API_DOCUMENTATION.md
│   ├── ARCHITECTURE.md
│   ├── ASSESSMENT_COMPLETE.md
│   ├── ASSESSMENT_SUMMARY.md
│   ├── AUDIT_COMPLETION_SUMMARY.md
│   ├── BUILD_AND_DEPLOYMENT_APPROVED.md
│   ├── BUILD_IN_PROGRESS.md
│   ├── BUILD_RESTART_WITH_FIXES.md
│   ├── CODESPACES_BUILD_GUIDE.md
│   ├── COMPATIBILITY_AUDIT.md
│   ├── COMPLETE_IMPLEMENTATION_GUIDE.md
│   ├── COMPLETION_REPORT.md
│   ├── COMPREHENSIVE_ANALYSIS.md
│   ├── COMPREHENSIVE_PROFESSIONAL_REVIEW.md
│   ├── COMPREHENSIVE_SUMMARY.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── DEPLOYMENT_READY_ACTION_PLAN.md
│   ├── DEVELOPMENT_FINAL_BRIEF.md
│   ├── DEVELOPMENT_GUIDE.md
│   ├── DEVELOPMENT_PLAN.md
│   ├── DEVELOPMENT_START.md
│   ├── DOCUMENTATION_INDEX.md
│   ├── ENGINEERING_AUDIT_COMPLETE.md
│   ├── EXECUTIVE_SUMMARY.md
│   ├── EXPERT_ANALYSIS_AND_RECOMMENDATIONS.md
│   ├── EXPERT_REVIEW_SUMMARY.md
│   ├── FAQ.md
│   ├── FINAL_EXPERT_SUMMARY.md
│   ├── FINAL_PHASE4_REPORT.md
│   ├── FREE_PLAN_BUILD_GUIDE.md
│   ├── GITHUB_PUSH_COMPLETE.md
│   ├── HTML_COMPARISON_REPORT.md
│   ├── IMPLEMENTATION_PROGRESS_V1.md
│   ├── INDEX.md
│   ├── INSTALLATION_GUIDE.md
│   ├── INTEGRATION_COMPLETE.md
│   ├── INTEGRATION_GUIDE.md
│   ├── INTEGRATION_PLAN.md
│   ├── Merath_Cluade_Pro7.html
│   ├── PHASES_1_2_COMPLETE.md
│   ├── PHASES_1_4_COMPLETION_SUMMARY.md
│   ├── PHASE_1_COMPLETION_SUMMARY.md
│   ├── PHASE_2_TESTSUITE.md
│   ├── PHASE_3_AUDITLOG.md
│   ├── PHASE_3_SUMMARY.md
│   ├── PHASE_4_COMPLETE.md
│   ├── PHASE_4_IMPLEMENTATION_SUMMARY.md
│   ├── PHASE_5_1_AUDIT_TRAIL_STATUS.md
│   ├── PHASE_5_COMPLETE.md
│   ├── PHASE_6_COMPLETE.md
│   ├── PHASE_6_COMPLETION_SUMMARY.md
│   ├── PHASE_6_FILES.md
│   ├── PHASE_6_FINAL_REPORT.md
│   ├── PHASE_6_FINAL_STATUS.md
│   ├── PHASE_6_INTEGRATION.md
│   ├── PHASE_6_QUICK_REF.md
│   ├── PHASE_6_SUMMARY.md
│   ├── PHASE_7_BUILD_IN_PROGRESS.md
│   ├── PHASE_7_BUILD_MONITORING.md
│   ├── PHASE_7_DEPLOYMENT.md
│   ├── PHASE_7_KICKOFF.md
│   ├── PHASE_7_PLAN.md
│   ├── PRE_APK_CHECKLIST.md
│   ├── PRE_BUILD_CLEARANCE.md
│   ├── PRE_BUILD_VERIFICATION.md
│   ├── PROJECT_STRUCTURE_AUDIT_REPORT.md
│   ├── QUICK_REFERENCE.md
│   ├── QUICK_START_30DAY_PLAN.md
│   ├── QUICK_START_GUIDE.md
│   ├── README_ENHANCED.md
│   ├── README_NEW.md
│   ├── REVIEW_INDEX.md
│   ├── STATUS.md
│   ├── STATUS_PHASE4.md
│   ├── STATUS_PHASE6.md
│   ├── TECHNICAL_IMPLEMENTATION_GUIDE.md
│   ├── TESTING_GUIDE.md
│   ├── TEST_CONFIRMATION_PHASE6.md
│   ├── TEST_REPORT.md
│   ├── VERIFICATION_CHECKLIST.md
│   ├── audit_project.sh
│   ├── build.sh
│   ├── cleanup-console.mjs
│   ├── design.md
│   ├── remove-console.js
│   ├── remove-console.mjs
│   ├── todo.md
│   ├── todo.md.backup
│   └── version_checker.sh
├── App.tsx
├── README.md
├── app.config.ts
├── build-and-deploy.sh
├── drizzle.config.ts
├── eas.json
├── eslint.config.js
├── metro.config.cjs
├── package-lock.json
├── package.json
├── project_dump_updated.md
├── test-gcd-fix.ts
├── tsconfig.json
└── vitest.config.ts

19 directories, 166 files
```

# Package Information
## package.json
```json
{
  "name": "app-template",
  "version": "1.1.3",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "cross-env EXPO_USE_METRO_WORKSPACE_ROOT=1 npx expo start --android",
    "dev:metro": "cross-env EXPO_USE_METRO_WORKSPACE_ROOT=1 npx expo start --android",
    "build": "expo build:android",
    "start": "expo start --android",
    "check": "tsc --noEmit",
    "lint": "expo lint",
    "format": "prettier --write .",
    "test": "vitest run",
    "db:push": "drizzle-kit generate && drizzle-kit migrate",
    "android": "expo run:android",
    "qr": "node scripts/generate_qr.mjs"
  },
  "dependencies": {
    "@expo/vector-icons": "^15.0.3",
    "@react-native-async-storage/async-storage": "^2.1.2",
    "@react-navigation/bottom-tabs": "^7.4.0",
    "@react-navigation/elements": "^2.6.3",
    "@react-navigation/native": "^7.1.8",
    "@shopify/react-native-skia": "2.2.12",
    "@tanstack/react-query": "^5.60.0",
    "@trpc/client": "^11.8.1",
    "@trpc/react-query": "^11.8.1",
    "@trpc/server": "^11.8.1",
    "axios": "^1.12.0",
    "cookie": "^1.0.2",
    "dotenv": "^16.4.7",
    "drizzle-orm": "^0.44.5",
    "expo": "~54.0.32",
    "expo-av": "~16.0.8",
    "expo-constants": "~18.0.12",
    "expo-dev-client": "~6.0.20",
    "expo-file-system": "^19.0.21",
    "expo-font": "~14.0.11",
    "expo-haptics": "~15.0.8",
    "expo-image": "~3.0.11",
    "expo-keep-awake": "~15.0.8",
    "expo-linking": "~8.0.10",
    "expo-notifications": "~0.32.9",
    "expo-print": "^15.0.8",
    "expo-router": "~6.0.22",
    "expo-secure-store": "~15.0.8",
    "expo-sharing": "^14.0.8",
    "expo-splash-screen": "~31.0.12",
    "expo-status-bar": "~3.0.9",
    "expo-symbols": "~1.0.8",
    "expo-system-ui": "~6.0.9",
    "expo-web-browser": "~15.0.10",
    "express": "^4.21.2",
    "i18next": "^23.16.8",
    "jose": "6.1.0",
    "mysql2": "^3.15.0",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-i18next": "^13.5.0",
    "react-native": "0.81.5",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-reanimated": "~4.1.1",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-svg": "15.12.1",
    "react-native-web": "~0.21.0",
    "react-native-worklets": "^0.5.1",
    "superjson": "^1.13.3",
    "victory-native": "^41.20.2",
    "zod": "^4.1.12"
  },
  "devDependencies": {
    "@expo/ngrok": "^4.1.3",
    "@types/cookie": "^0.6.0",
    "@types/express": "^4.17.21",
    "@types/node": "^22.8.1",
    "@types/qrcode": "^1.5.6",
    "@types/react": "~19.1.0",
    "@vitest/ui": "^4.0.16",
    "concurrently": "^9.1.0",
    "cross-env": "^7.0.3",
    "drizzle-kit": "^0.31.8",
    "esbuild": "^0.25.0",
    "eslint": "^9.25.0",
    "eslint-config-expo": "~10.0.0",
    "prettier": "^3.6.2",
    "qrcode": "^1.5.4",
    "tsx": "^4.19.1",
    "typescript": "~5.9.2",
    "vitest": "^4.0.16",
    "yaml": "^2.8.2"
  }
}
```

# Core Configuration Files
## tsconfig.json
```json
{
  "extends": "expo/tsconfig.base.json",
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true,
    "types": ["node", "vitest/globals"],
    "paths": {
      "@/*": ["./*"],
      "@shared/*": ["./shared/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"],
  "exclude": ["node_modules", "dist"]
}
```

# Source Files
## ./components/AuditTrailCard.tsx
```typescript
/**
 * @file AuditTrailCard.tsx
 * @description Individual Audit Trail Entry Card Component
 * Phase 5.1: Advanced Features - Calculation History Card
 *
 * Displays a single calculation entry with key metrics
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { AuditLogEntry } from '../lib/inheritance/audit-log';
import { AuditTrailManager } from '../lib/inheritance/audit-trail-manager';
import { PDFExporter } from '../lib/export/PDFExporter';

export interface AuditTrailCardProps {
  entry: AuditLogEntry;
  onPress?: (entry: AuditLogEntry) => void;
  onExport?: (entry: AuditLogEntry) => void;
  onDelete?: (entryId: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (entryId: string) => void;
}

/**
 * Audit Trail Card Component
 * Displays calculation history entry with actions
 */
export function AuditTrailCard({
  entry,
  onPress,
  onExport,
  onDelete,
  isFavorite = false,
  onToggleFavorite,
}: AuditTrailCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const formatted = AuditTrailManager.formatEntryForDisplay(entry);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const timestamp = new Date().toLocaleDateString('ar-SA');
      const filename = `تقرير-${entry.madhab}-${timestamp}`;

      // Create a minimal calculation result from audit entry
      const calculationResult = {
        madhab: entry.madhab || 'hanafi',
        madhhabName: entry.madhab || 'الحنفي',
        success: true,
        shares: entry.result?.shares || [],
        confidence: entry.result?.confidence || 100,
        calculationTime: entry.metadata?.duration || 0,
        awlApplied: entry.result?.awlApplied || false,
        raddApplied: entry.result?.raddApplied || false,
        blockedHeirs: entry.result?.blockedHeirs || [],
        specialCases: entry.result?.specialCases || { 
          awl: false, 
          auled: 0, 
          radd: false, 
          hijabTypes: [] 
        },
        steps: entry.result?.steps || [],
      };

      await PDFExporter.generateAndShare(calculationResult, {
        filename,
        includeCalculationSteps: true,
        theme: 'light',
      });

      onExport?.(entry);
      Alert.alert('تم بنجاح', 'تم تصدير التقرير بنجاح');
    } catch (error) {
      Alert.alert(
        'خطأ',
        error instanceof Error ? error.message : 'فشل في تصدير التقرير'
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'تأكيد الحذف',
      'هل تريد حذف هذا السجل؟ لا يمكن التراجع عن هذا الإجراء.',
      [
        { text: 'إلغاء', onPress: () => {} },
        {
          text: 'حذف',
          onPress: () => onDelete?.(entry.id || ''),
          style: 'destructive',
        },
      ]
    );
  };

  const handleToggleFavorite = () => {
    onToggleFavorite?.(entry.id || '');
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(entry)}
      activeOpacity={0.7}
    >
      {/* Header Row */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.madhab}>{formatted.madhab}</Text>
          <Text style={styles.date}>{formatted.date}</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
          >
            <Text style={styles.favoriteIcon}>
              {isFavorite ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Info Row */}
      <View style={styles.cardBody}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>المبلغ</Text>
          <Text style={styles.infoValue}>{formatted.estate}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>الورثة</Text>
          <Text style={styles.infoValue}>{formatted.heirsCount}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>الثقة</Text>
          <Text style={[
            styles.infoValue,
            {
              color:
                (entry.result?.confidence || 0) > 90
                  ? '#4caf50'
                  : (entry.result?.confidence || 0) > 75
                    ? '#ff9800'
                    : '#f44336',
            },
          ]}>
            {formatted.confidence}
          </Text>
        </View>

        <Text style={styles.time}>{formatted.time}</Text>
      </View>

      {/* Expanded Details */}
      {isExpanded && (
        <View style={styles.expandedDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>تاريخ التسجيل:</Text>
            <Text style={styles.detailValue}>{formatted.date}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>عدد الحصص:</Text>
            <Text style={styles.detailValue}>
              {entry.result?.shares?.length || 0}
            </Text>
          </View>

          {entry.metadata?.notes && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ملاحظات:</Text>
              <Text style={styles.detailValue}>{entry.metadata.notes}</Text>
            </View>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.expandButton]}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Text style={styles.actionButtonText}>
            {isExpanded ? '▼ أقل' : '▶ المزيد'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.exportButton]}
          onPress={handleExport}
          disabled={isExporting}
        >
          <Text style={styles.actionButtonText}>
            {isExporting ? '⏳ جاري...' : '📄 تصدير'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.actionButtonText}>🗑️ حذف</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'center',
  },
  madhab: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 2,
  },
  date: {
    fontSize: 11,
    color: '#666',
  },
  favoriteButton: {
    padding: 8,
    marginLeft: 8,
  },
  favoriteIcon: {
    fontSize: 18,
  },
  cardBody: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  time: {
    fontSize: 10,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  expandedDetails: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 11,
    color: '#333',
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
  cardActions: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2
  },
  expandButton: {
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOpacity: 0.2,
    elevation: 2
  },
  exportButton: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOpacity: 0.2,
    elevation: 2
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOpacity: 0.2,
    elevation: 2
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center'
  },
});

export default AuditTrailCard;
```

## ./components/CalculationButton.tsx
```typescript
/**
 * @file CalculationButton.tsx
 * @description زر تنفيذ الحساب
 * Calculation Button Component for Phase 5
 * 
 * زر تشغيل حساب الميراث مع عرض حالة التحميل
 */

import React, { useState, useCallback } from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useCalculator } from '../lib/inheritance/hooks';
import { MadhhabType, HeirsData, EstateData } from '../lib/inheritance/types';

export interface CalculationButtonProps {
  madhab: MadhhabType;
  heirs: HeirsData;
  estate: EstateData;
  onCalculationComplete?: (success: boolean, error?: string) => void;
  disabled?: boolean;
}

/**
 * مكون زر الحساب
 * Triggers calculation and shows loading state
 */
export function CalculationButton({
  madhab,
  heirs,
  estate,
  onCalculationComplete,
  disabled = false
}: CalculationButtonProps) {
  const { calculateWithMethod, result, isCalculating, error } = useCalculator();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleCalculate = useCallback(async () => {
    try {
      setLocalError(null);

      // التحقق من صحة البيانات
      if (!madhab) {
        const msg = 'يجب اختيار المذهب الفقهي أولاً';
        setLocalError(msg);
        Alert.alert(
          'تحقق من البيانات',
          msg,
          [{ text: 'حسناً' }]
        );
        onCalculationComplete?.(false, msg);
        return;
      }

      const heirsCount = Object.values(heirs || {}).reduce((s: number, v) => s + (v || 0), 0);
      if (heirsCount === 0) {
        const msg = 'يجب إضافة واحد على الأقل من الورثة';
        setLocalError(msg);
        Alert.alert(
          'المزيد من المعلومات مطلوبة',
          msg + '\n\nتأكد من إضافة جميع الورثة في قسم "إضافة الوارثون"',
          [{ text: 'حسناً' }]
        );
        onCalculationComplete?.(false, msg);
        return;
      }

      if (estate.total <= 0) {
        const msg = 'قيمة التركة يجب أن تكون أكبر من صفر';
        setLocalError(msg);
        Alert.alert(
          'بيانات غير صحيحة',
          msg + '\n\nأدخل المبلغ الإجمالي للتركة في قسم "بيانات التركة"',
          [{ text: 'حسناً' }]
        );
        onCalculationComplete?.(false, msg);
        return;
      }

      // تنفيذ الحساب
      const result = await calculateWithMethod(madhab, heirs);
      if (result && result.success) {
        Alert.alert(
          'نجح الحساب',
          'تم حساب توزيع الميراث بنجاح. انظر النتائج أدناه.',
          [{ text: 'حسناً' }]
        );
        onCalculationComplete?.(true);
      } else {
        const errorMsg = result?.error || 'فشل الحساب';
        setLocalError(errorMsg);
        Alert.alert(
          'خطأ في الحساب',
          errorMsg,
          [{ text: 'حسناً' }]
        );
        onCalculationComplete?.(false, errorMsg);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير متوقع في الحساب';
      setLocalError(errorMessage);
      Alert.alert(
        'خطأ',
        errorMessage,
        [{ text: 'حسناً' }]
      );
      onCalculationComplete?.(false, errorMessage);
    }
  }, [madhab, heirs, estate, calculateWithMethod, onCalculationComplete]);

  const heirsCountForDisable = Object.values(heirs || {}).reduce((s: number, v) => s + (v || 0), 0);
  const isDisabled = disabled || heirsCountForDisable === 0 || estate.total <= 0 || isCalculating;
  const currentError = localError || error;
  const hasValidHeirs = heirsCountForDisable > 0;
  const hasValidEstate = estate.total > 0;

  return (
    <View style={styles.container}>
      {/* تحذيرات الحقول المفقودة */}
      {!hasValidEstate && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>⚠️ أدخل مبلغ التركة الإجمالي أولاً</Text>
        </View>
      )}
      {!hasValidHeirs && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>⚠️ أضف وارثاً واحداً على الأقل</Text>
        </View>
      )}
      
      <TouchableOpacity
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        onPress={handleCalculate}
        disabled={isDisabled}
      >
        {isCalculating ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.buttonText}>جاري الحساب...</Text>
          </View>
        ) : (
          <Text style={[styles.buttonText, isDisabled && styles.buttonTextDisabled]}>
            {isDisabled ? 'يرجى ملء البيانات أولاً' : 'حساب الميراث'}
          </Text>
        )}
      </TouchableOpacity>

      {/* رسالة الخطأ */}
      {currentError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{currentError}</Text>
        </View>
      )}

      {/* رسالة النجاح */}
      {result && result.success && !isCalculating && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>✓ تم الحساب بنجاح</Text>
        </View>
      )}

      {/* معلومات الحساب */}
      {result && (
        <View style={styles.resultInfo}>
          <Text style={styles.resultInfoTitle}>معلومات الحساب:</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>الحالة:</Text>
            <Text style={[styles.resultValue, result.success ? styles.successValue : styles.errorValue]}>
              {result.success ? 'نجح' : 'فشل'}
            </Text>
          </View>
          {result.error && (
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>الخطأ:</Text>
              <Text style={styles.resultValue}>{result.error}</Text>
            </View>
          )}
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>المذهب:</Text>
            <Text style={styles.resultValue}>{result.madhab}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    // Professional color matching HTML primary (#4F46E5)
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    // Enhanced shadow elevation for depth
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6
  },
  buttonDisabled: {
    backgroundColor: '#cbd5e1',
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    opacity: 1
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
  buttonTextDisabled: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b'
  },
  warningBox: {
    backgroundColor: '#fff3e0',
    borderLeftWidth: 4,
    borderLeftColor: '#f57c00',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: '#f57c00',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2
  },
  warningText: {
    color: '#e65100',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'right'
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorContainer: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
    shadowColor: '#d32f2f',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1
  },
  errorText: {
    fontSize: 13,
    color: '#c62828',
    fontWeight: '500',
    textAlign: 'right'
  },
  successContainer: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
    shadowColor: '#4caf50',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1
  },
  successText: {
    fontSize: 13,
    color: '#2e7d32',
    fontWeight: '600',
    textAlign: 'right'
  },
  resultInfo: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  resultInfoTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right'
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingVertical: 4
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666'
  },
  resultValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600'
  },
  successValue: {
    color: '#2e7d32'
  },
  errorValue: {
    color: '#d32f2f'
  }
});

export default CalculationButton;
```

## ./components/CalculationHistory.tsx
```typescript
/**
 * @file CalculationHistory.tsx
 * @description سجل الحسابات السابقة
 * Calculation History Component for Phase 5
 * 
 * عرض وإدارة السجل الشامل للعمليات والحسابات
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useAuditLog } from '../lib/inheritance/hooks';
import { MadhhabType } from '../lib/inheritance/types';

export interface CalculationHistoryProps {
  onEntrySelect?: (entryId: string) => void;
}

/**
 * مكون سجل الحسابات
 * Displays and manages audit log history
 */
export function CalculationHistory({ onEntrySelect }: CalculationHistoryProps) {
  const { auditLog } = useAuditLog();
  const [selectedMadhab, setSelectedMadhab] = useState<MadhhabType | 'all'>('all');
  const [searchText, setSearchText] = useState('');
  const [showStats, setShowStats] = useState(false);

  const stats = useMemo(() => {
    return auditLog?.getStats();
  }, [auditLog]);

  const filteredEntries = useMemo(() => {
    if (!auditLog) return [];

    let entries = auditLog.getAllEntries();

    // تصفية حسب المذهب
    if (selectedMadhab !== 'all') {
      entries = entries.filter(e => e.madhab === selectedMadhab);
    }

    // تصفية حسب البحث
    if (searchText.trim()) {
      entries = entries.filter(e => {
        const searchLower = searchText.toLowerCase();
        return (
          e.madhab.toLowerCase().includes(searchLower) ||
          e.metadata.notes?.toLowerCase().includes(searchLower) ||
          e.id.includes(searchText)
        );
      });
    }

    return entries;
  }, [auditLog, selectedMadhab, searchText]);

  const handleExport = useCallback(() => {
    if (!auditLog) return;
    const json = auditLog.exportAsJSON();
    // في تطبيق حقيقي، سيتم حفظ الملف أو مشاركته
    console.log('Export Data:', json);
  }, [auditLog]);

  const handleClearHistory = useCallback(() => {
    if (auditLog && confirm('هل أنت متأكد من حذف السجل بالكامل؟')) {
      auditLog.clearAll();
    }
  }, [auditLog]);

  const handleDeleteEntry = useCallback((entryId: string) => {
    if (auditLog && confirm('هل أنت متأكد من حذف هذا الإدخال؟')) {
      auditLog.deleteEntry(entryId);
    }
  }, [auditLog]);

  if (!auditLog) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>فشل تحميل السجل</Text>
      </View>
    );
  }

  const entries = auditLog.getAllEntries();

  return (
    <ScrollView style={styles.container}>
      {/* رأس السجل */}
      <View style={styles.header}>
        <Text style={styles.title}>سجل الحسابات</Text>
        <Text style={styles.subtitle}>Calculation History</Text>
      </View>

      {/* شريط البحث والتصفية */}
      <View style={styles.filterBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="بحث..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* تصفية حسب المذهب */}
      <View style={styles.madhhabFilter}>
        <Text style={styles.filterLabel}>تصفية حسب المذهب:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.madhhabFilterList}>
          {['all', 'hanafi', 'maliki', 'shafii', 'hanbali'].map(madhab => (
            <TouchableOpacity
              key={madhab}
              style={[
                styles.madhhabFilterButton,
                selectedMadhab === madhab && styles.madhhabFilterButtonActive
              ]}
              onPress={() => setSelectedMadhab(madhab as any)}
            >
              <Text
                style={[
                  styles.madhhabFilterButtonText,
                  selectedMadhab === madhab && styles.madhhabFilterButtonTextActive
                ]}
              >
                {madhab === 'all' ? 'الكل' : madhab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* الإحصائيات */}
      <TouchableOpacity
        style={styles.statsToggle}
        onPress={() => setShowStats(!showStats)}
      >
        <Text style={styles.statsToggleText}>
          {showStats ? '▼ الإحصائيات' : '▶ الإحصائيات'}
        </Text>
      </TouchableOpacity>

      {showStats && stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>إجمالي العمليات:</Text>
            <Text style={styles.statValue}>{stats.totalEntries}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>العمليات الناجحة:</Text>
            <Text style={styles.statValue}>{stats.successfulOperations}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>العمليات الفاشلة:</Text>
            <Text style={styles.statValue}>{stats.failedOperations}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>معدل النجاح:</Text>
            <Text style={[styles.statValue, { color: '#4caf50' }]}>
              {(stats.successRate * 100).toFixed(1)}%
            </Text>
          </View>

          {stats.madhabs && Object.keys(stats.madhabs).length > 0 && (
            <View style={styles.madhhabStats}>
              <Text style={styles.madhhabStatsTitle}>استخدام المذاهب:</Text>
              {Object.entries(stats.madhabs).map(([madhab, count]) => (
                <View key={madhab} style={styles.madhhabStatRow}>
                  <Text style={styles.madhhabStatLabel}>{madhab}:</Text>
                  <Text style={styles.madhhabStatValue}>{count}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* قائمة الإدخالات */}
      <View style={styles.entriesHeader}>
        <Text style={styles.entriesHeaderText}>
          {filteredEntries.length > 0 ? `${filteredEntries.length} من ${entries.length} إدخال` : 'لا توجد إدخالات'}
        </Text>
      </View>

      {filteredEntries.length > 0 ? (
        <View style={styles.entriesList}>
          {filteredEntries.map((entry, index) => (
            <View key={entry.id} style={[styles.entryItem, index % 2 === 1 && styles.entryItemAlternate]}>
              <View style={styles.entryContent}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryMadhab}>{entry.madhab}</Text>
                  <Text style={[
                    styles.entrySuccess,
                    entry.metadata.success ? styles.entrySuccessTrue : styles.entrySuccessFalse
                  ]}>
                    {entry.metadata.success ? '✓ نجح' : '✗ فشل'}
                  </Text>
                </View>

                <Text style={styles.entryTimestamp}>
                  {new Date(entry.timestamp).toLocaleString('ar-SA')}
                </Text>

                {entry.metadata.notes && (
                  <Text style={styles.entryNotes}>{entry.metadata.notes}</Text>
                )}

                <View style={styles.entryDetails}>
                  <Text style={styles.entryDetail}>
                    الوارثون: {Object.keys(entry.heirs).length}
                  </Text>
                  {entry.metadata.duration && (
                    <Text style={styles.entryDetail}>
                      المدة: {entry.metadata.duration}ms
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.entryActions}>
                <TouchableOpacity
                  style={styles.entryActionButton}
                  onPress={() => onEntrySelect?.(entry.id)}
                >
                  <Text style={styles.entryActionButtonText}>عرض</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.entryActionButton, styles.entryActionButtonDelete]}
                  onPress={() => handleDeleteEntry(entry.id)}
                >
                  <Text style={styles.entryActionButtonDeleteText}>حذف</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>لا توجد سجلات مطابقة</Text>
        </View>
      )}

      {/* أزرار الإجراءات */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleExport}>
          <Text style={styles.actionButtonText}>تصدير السجل</Text>
        </TouchableOpacity>

        {entries.length > 0 && (
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonDelete]}
            onPress={handleClearHistory}
          >
            <Text style={styles.actionButtonDeleteText}>مسح السجل</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 20
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right'
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginTop: 20
  },
  filterBar: {
    paddingHorizontal: 16,
    marginBottom: 12
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#333',
    backgroundColor: '#fff',
    textAlign: 'right'
  },
  madhhabFilter: {
    paddingHorizontal: 16,
    marginBottom: 12
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right'
  },
  madhhabFilterList: {
    flexDirection: 'row'
  },
  madhhabFilterButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1976d2',
    marginLeft: 6,
    backgroundColor: '#fff'
  },
  madhhabFilterButtonActive: {
    backgroundColor: '#1976d2'
  },
  madhhabFilterButtonText: {
    fontSize: 11,
    color: '#1976d2',
    fontWeight: '500'
  },
  madhhabFilterButtonTextActive: {
    color: '#fff'
  },
  statsToggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8
  },
  statsToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1976d2'
  },
  statsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1976d2'
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#b3e5fc'
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333'
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1976d2'
  },
  madhhabStats: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#b3e5fc'
  },
  madhhabStatsTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    textAlign: 'right'
  },
  madhhabStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  madhhabStatLabel: {
    fontSize: 11,
    color: '#333'
  },
  madhhabStatValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1976d2'
  },
  entriesHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 4
  },
  entriesHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'right'
  },
  entriesList: {
    marginHorizontal: 16,
    marginBottom: 16
  },
  entryItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  entryItemAlternate: {
    backgroundColor: '#f9f9f9'
  },
  entryContent: {
    flex: 1
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  entryMadhab: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1976d2'
  },
  entrySuccess: {
    fontSize: 11,
    fontWeight: '600'
  },
  entrySuccessTrue: {
    color: '#4caf50'
  },
  entrySuccessFalse: {
    color: '#d32f2f'
  },
  entryTimestamp: {
    fontSize: 11,
    color: '#999',
    marginBottom: 6
  },
  entryNotes: {
    fontSize: 11,
    color: '#666',
    marginBottom: 6,
    fontStyle: 'italic',
    textAlign: 'right'
  },
  entryDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  entryDetail: {
    fontSize: 10,
    color: '#999',
    marginLeft: 12
  },
  entryActions: {
    flexDirection: 'row',
    gap: 6,
    marginLeft: 8
  },
  entryActionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#e3f2fd',
    borderRadius: 4,
    alignItems: 'center'
  },
  entryActionButtonDelete: {
    backgroundColor: '#ffebee'
  },
  entryActionButtonText: {
    fontSize: 10,
    color: '#1976d2',
    fontWeight: '600'
  },
  entryActionButtonDeleteText: {
    fontSize: 10,
    color: '#d32f2f',
    fontWeight: '600'
  },
  emptyState: {
    marginHorizontal: 16,
    paddingVertical: 40,
    alignItems: 'center'
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999'
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1976d2',
    borderRadius: 6,
    alignItems: 'center'
  },
  actionButtonDelete: {
    backgroundColor: '#d32f2f'
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff'
  },
  actionButtonDeleteText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff'
  }
});

export default CalculationHistory;
```

## ./components/DisclaimersModal.tsx
```typescript
/**
 * @file DisclaimersModal.tsx
 * @description Legal Disclaimers & Privacy Policy Modal Component
 * Phase 3: Legal Compliance & User Acceptance
 *
 * Displays legal disclaimers, privacy policy, and terms of service
 * with user acceptance tracking
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert
} from 'react-native';
import { LEGAL_DISCLAIMERS, getDisclaimer } from '../lib/legal/Disclaimers';

export interface DisclaimersModalProps {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
  showPrivacyPolicy?: boolean;
}

type DisclaimerTab = 'disclaimer' | 'privacy' | 'terms';

/**
 * Disclaimers Modal Component
 * Displays legal disclaimers with tab navigation for different content
 */
export function DisclaimersModal({
  visible,
  onAccept,
  onDecline,
  showPrivacyPolicy = false
}: DisclaimersModalProps) {
  const [activeTab, setActiveTab] = useState<DisclaimerTab>('disclaimer');
  const [acceptedAll, setAcceptedAll] = useState(false);

  const handleAccept = useCallback(() => {
    if (!acceptedAll) {
      Alert.alert(
        'تأكيد القبول',
        'يجب عليك قراءة وقبول جميع الشروط والأحكام للمتابعة',
        [{ text: 'حسناً', onPress: () => {} }]
      );
      return;
    }

    onAccept();
  }, [acceptedAll, onAccept]);

  const handleDecline = useCallback(() => {
    Alert.alert(
      'تأكيد الرفض',
      'إذا رفضت الشروط، لن تتمكن من استخدام التطبيق. هل أنت متأكد؟',
      [
        { text: 'الاستمرار', onPress: () => {} },
        {
          text: 'أرفض',
          onPress: onDecline,
          style: 'destructive'
        }
      ]
    );
  }, [onDecline]);

  const getTabContent = () => {
    switch (activeTab) {
      case 'disclaimer':
        return getDisclaimer('main');
      case 'privacy':
        return getDisclaimer('privacy');
      case 'terms':
        return getDisclaimer('terms');
      default:
        return getDisclaimer('main');
    }
  };

  const getTabLabel = (tab: DisclaimerTab) => {
    switch (tab) {
      case 'disclaimer':
        return 'إخلاء المسؤولية';
      case 'privacy':
        return 'سياسة الخصوصية';
      case 'terms':
        return 'الشروط والأحكام';
      default:
        return 'إخلاء المسؤولية';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={() => {}} // Prevent dismiss by back button
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>القوانين والشروط</Text>
          <Text style={styles.headerSubtitle}>Terms & Conditions</Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          {(['disclaimer', 'privacy', 'terms'] as DisclaimerTab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.tabActive
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabLabel,
                activeTab === tab && styles.tabLabelActive
              ]}>
                {getTabLabel(tab)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content Scroll Area */}
        <ScrollView
          style={styles.contentScroll}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.content}>
            <Text style={styles.contentText}>
              {getTabContent()}
            </Text>
          </View>
        </ScrollView>

        {/* Acceptance Checkbox */}
        <View style={styles.acceptanceContainer}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              acceptedAll && styles.checkboxChecked
            ]}
            onPress={() => setAcceptedAll(!acceptedAll)}
          >
            {acceptedAll && (
              <Text style={styles.checkboxMark}>✓</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.acceptanceText}>
            أوافق على جميع الشروط والأحكام وسياسة الخصوصية
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.declineButton, !acceptedAll && styles.declineButtonDisabled]}
            onPress={handleDecline}
          >
            <Text style={styles.declineButtonText}>رفض</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.acceptButton,
              !acceptedAll && styles.acceptButtonDisabled
            ]}
            onPress={handleAccept}
            disabled={!acceptedAll}
          >
            <Text style={styles.acceptButtonText}>قبول واستمرار</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976d2',
    textAlign: 'center',
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  tabNavigation: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: 8
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    alignItems: 'center'
  },
  tabActive: {
    borderBottomColor: '#1976d2',
    backgroundColor: '#f5f5f5'
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center'
  },
  tabLabelActive: {
    color: '#1976d2',
    fontWeight: '700'
  },
  contentScroll: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  content: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  contentText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 20,
    textAlign: 'right'
  },
  acceptanceContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#fff'
  },
  checkboxChecked: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2'
  },
  checkboxMark: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff'
  },
  acceptanceText: {
    fontSize: 12,
    color: '#333',
    flex: 1,
    textAlign: 'right',
    fontWeight: '500'
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 20,
    gap: 8
  },
  declineButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d32f2f',
    alignItems: 'center'
  },
  declineButtonDisabled: {
    opacity: 0.5
  },
  declineButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#d32f2f'
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1976d2',
    borderRadius: 6,
    alignItems: 'center'
  },
  acceptButtonDisabled: {
    backgroundColor: '#90caf9',
    opacity: 0.6
  },
  acceptButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff'
  }
});

export default DisclaimersModal;
```

## ./components/EstateInput.tsx
```typescript
/**
 * @file EstateInput.tsx
 * @description مكون إدخال بيانات التركة
 * Estate Input Component for Phase 5
 * 
 * استقبال بيانات التركة الشرعية من المستخدم
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useCalculator } from '../lib/inheritance/hooks';
import { EstateData } from '../lib/inheritance/types';
import { EstateValidator } from '../lib/validation/InputValidator';
import type { ValidationResult } from '../lib/validation/InputValidator';

export interface EstateInputProps {
  onEstateChange?: (estate: EstateData) => void;
  initialEstate?: EstateData;
}

/**
 * مكون إدخال التركة
 * Allows users to input estate financial data
 */
export function EstateInput({ onEstateChange, initialEstate }: EstateInputProps) {
  const { estateData, updateEstateData } = useCalculator();

  const [total, setTotal] = useState(initialEstate?.total.toString() || estateData.total.toString());
  const [funeral, setFuneral] = useState((initialEstate?.funeral ?? initialEstate?.funeralCosts ?? estateData.funeral ?? estateData.funeralCosts ?? 0).toString());
  const [debts, setDebts] = useState((initialEstate?.debts ?? estateData.debts ?? 0).toString());
  const [will, setWill] = useState((initialEstate?.will ?? initialEstate?.willAmount ?? estateData.will ?? estateData.willAmount ?? 0).toString());
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  // Memoize current estate data
  const currentEstate = useMemo(() => ({
    total: parseFloat(total) || 0,
    funeral: parseFloat(funeral) || 0,
    debts: parseFloat(debts) || 0,
    will: parseFloat(will) || 0
  }), [total, funeral, debts, will]);

  // Validate on any change
  const validateAndUpdate = useCallback((estate: EstateData) => {
    // Run validation
    const result = EstateValidator.validate(estate);
    setValidationResult(result);

    // Update only if valid
    if (result.isValid) {
      updateEstateData(estate);
      onEstateChange?.(estate);
    }
  }, [updateEstateData, onEstateChange]);

  const handleTotalChange = useCallback((text: string) => {
    setTotal(text);
    validateAndUpdate({
      total: parseFloat(text) || 0,
      funeral: parseFloat(funeral) || 0,
      debts: parseFloat(debts) || 0,
      will: parseFloat(will) || 0
    });
  }, [funeral, debts, will, validateAndUpdate]);

  const handleFuneralChange = useCallback((text: string) => {
    setFuneral(text);
    validateAndUpdate({
      total: parseFloat(total) || 0,
      funeral: parseFloat(text) || 0,
      debts: parseFloat(debts) || 0,
      will: parseFloat(will) || 0
    });
  }, [total, debts, will, validateAndUpdate]);

  const handleDebtsChange = useCallback((text: string) => {
    setDebts(text);
    validateAndUpdate({
      total: parseFloat(total) || 0,
      funeral: parseFloat(funeral) || 0,
      debts: parseFloat(text) || 0,
      will: parseFloat(will) || 0
    });
  }, [total, funeral, will, validateAndUpdate]);

  const handleWillChange = useCallback((text: string) => {
    setWill(text);
    validateAndUpdate({
      total: parseFloat(total) || 0,
      funeral: parseFloat(funeral) || 0,
      debts: parseFloat(debts) || 0,
      will: parseFloat(text) || 0
    });
  }, [total, funeral, debts, validateAndUpdate]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>بيانات التركة</Text>
      <Text style={styles.subtitle}>Estate Financial Data</Text>

      {/* إجمالي التركة */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>إجمالي التركة</Text>
        <TextInput
          style={styles.input}
          placeholder="Total Estate"
          placeholderTextColor="#999"
          value={total}
          onChangeText={handleTotalChange}
          keyboardType="decimal-pad"
          editable={true}
        />
      </View>

      {/* تكاليف الجنازة */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>تكاليف الجنازة</Text>
        <TextInput
          style={styles.input}
          placeholder="Funeral Costs"
          placeholderTextColor="#999"
          value={funeral}
          onChangeText={handleFuneralChange}
          keyboardType="decimal-pad"
        />
      </View>

      {/* الديون */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>الديون</Text>
        <TextInput
          style={styles.input}
          placeholder="Debts"
          placeholderTextColor="#999"
          value={debts}
          onChangeText={handleDebtsChange}
          keyboardType="decimal-pad"
        />
      </View>

      {/* الوصية */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>الوصية (اختياري)</Text>
        <TextInput
          style={styles.input}
          placeholder="Will (Optional)"
          placeholderTextColor="#999"
          value={will}
          onChangeText={handleWillChange}
          keyboardType="decimal-pad"
        />
      </View>

      {/* Reset Button */}
      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => {
          setTotal('0');
          setFuneral('0');
          setDebts('0');
          setWill('0');
          updateEstateData({ total: 0, funeral: 0, debts: 0, will: 0 });
          setValidationResult(null);
          Alert.alert('تم', 'تم مسح جميع البيانات');
        }}
      >
        <Text style={styles.resetButtonText}>↺ مسح البيانات</Text>
      </TouchableOpacity>

      {/* Validation Feedback */}
      {validationResult && (
        <>
          {validationResult.errors.length > 0 && (
            <View style={styles.validationContainer}>
              {validationResult.errors.map((error, index) => (
                <View key={`error-${index}`} style={styles.errorItem}>
                  <Text style={styles.errorIcon}>❌</Text>
                  <View style={styles.errorContent}>
                    <Text style={styles.errorMessage}>{error.userMessage}</Text>
                    {error.suggestion && (
                      <Text style={styles.errorSuggestion}>{error.suggestion}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
          
          {validationResult.warnings.length > 0 && (
            <View style={styles.warningContainer}>
              {validationResult.warnings.map((warning, index) => (
                <View key={`warning-${index}`} style={styles.warningItem}>
                  <Text style={styles.warningIcon}>⚠️</Text>
                  <View style={styles.warningContent}>
                    <Text style={styles.warningMessage}>{warning.userMessage}</Text>
                    {warning.suggestion && (
                      <Text style={styles.warningSuggestion}>{warning.suggestion}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {validationResult.isValid && validationResult.errors.length === 0 && (
            <View style={styles.successContainer}>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={styles.successMessage}>تم التحقق من البيانات بنجاح</Text>
            </View>
          )}
        </>
      )}

      {/* ملخص التركة */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>ملخص التركة</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>إجمالي التركة:</Text>
          <Text style={styles.summaryValue}>{parseFloat(total) || 0}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>- تكاليف الجنازة:</Text>
          <Text style={styles.summaryValue}>{parseFloat(funeral) || 0}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>- الديون:</Text>
          <Text style={styles.summaryValue}>{parseFloat(debts) || 0}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>- الوصية:</Text>
          <Text style={styles.summaryValue}>{parseFloat(will) || 0}</Text>
        </View>
        <View style={[styles.summaryRow, styles.summaryRowHighlight]}>
          <Text style={[styles.summaryLabel, styles.summaryLabelHighlight]}>صافي التركة:</Text>
          <Text style={[styles.summaryValue, styles.summaryValueHighlight]}>
            {((parseFloat(total) || 0) - (parseFloat(funeral) || 0) - (parseFloat(debts) || 0) - (parseFloat(will) || 0)).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'right'
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
    textAlign: 'right'
  },
  inputGroup: {
    marginBottom: 12
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    textAlign: 'right'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
    textAlign: 'right'
  },
  validationContainer: {
    marginVertical: 12
  },
  errorItem: {
    flexDirection: 'row',
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8
  },
  errorIcon: {
    fontSize: 18,
    marginRight: 12
  },
  errorContent: {
    flex: 1
  },
  errorMessage: {
    fontSize: 13,
    fontWeight: '500',
    color: '#d32f2f',
    textAlign: 'right',
    marginBottom: 4
  },
  errorSuggestion: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    fontStyle: 'italic'
  },
  warningContainer: {
    marginVertical: 12
  },
  warningItem: {
    flexDirection: 'row',
    backgroundColor: '#fff3e0',
    borderLeftWidth: 4,
    borderLeftColor: '#f57c00',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8
  },
  warningIcon: {
    fontSize: 18,
    marginRight: 12
  },
  warningContent: {
    flex: 1
  },
  warningMessage: {
    fontSize: 13,
    fontWeight: '500',
    color: '#f57c00',
    textAlign: 'right',
    marginBottom: 4
  },
  warningSuggestion: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    fontStyle: 'italic'
  },
  successContainer: {
    flexDirection: 'row',
    backgroundColor: '#e8f5e9',
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
    borderRadius: 6,
    padding: 12,
    marginVertical: 12,
    alignItems: 'center'
  },
  successIcon: {
    fontSize: 18,
    color: '#4caf50',
    marginRight: 12
  },
  successMessage: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4caf50',
    textAlign: 'right',
    flex: 1
  },
  summary: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 6,
    marginTop: 12
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
    textAlign: 'right'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  summaryLabel: {
    fontSize: 12,
    color: '#333',
    textAlign: 'right'
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976d2'
  },
  summaryRowHighlight: {
    borderTopWidth: 2,
    borderTopColor: '#1976d2',
    paddingTop: 8,
    marginTop: 8,
    backgroundColor: '#bbdefb',
    padding: 8,
    borderRadius: 4
  },
  summaryLabelHighlight: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0d47a1'
  },
  summaryValueHighlight: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0d47a1'
  },
  resetButton: {
    backgroundColor: '#667eea',
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700'
  }
});

export default EstateInput;
```

## ./components/HeirSelector.tsx
```typescript
/**
 * @file HeirSelector.tsx
 * @description اختيار الوارثون
 * Heir Selection Component for Phase 5
 * 
 * إضافة وإدارة الوارثون بشكل ديناميكي
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useHeirs } from '../lib/inheritance/hooks';
import type { HeirsData, HeirType } from '../lib/inheritance/types';
import { HeirValidator } from '../lib/validation/InputValidator';
import type { ValidationResult } from '../lib/validation/InputValidator';

export interface HeirSelectorProps {
  onHeirsChange?: (heirs: HeirsData) => void;
}

// Base heir type with common properties
interface BaseHeirCategoryItem {
  key: HeirType;
  label: string;
  labelEn: string;
  type: "fard" | "asaba" | "both" | "blood";
  badge: string;
  shareInfo: string;
  emoji: string;
}

// Heir type with maxCount (for wives, etc.)
interface HeirWithMaxCount extends BaseHeirCategoryItem {
  maxCount: number;
}

// Union type for all possible heir configurations
type HeirCategoryItem = BaseHeirCategoryItem | HeirWithMaxCount;

// Type guard to check if heir has maxCount
const hasMaxCount = (heir: HeirCategoryItem): heir is HeirWithMaxCount => {
  return 'maxCount' in heir && typeof (heir as HeirWithMaxCount).maxCount === 'number';
};

// Heir categories with visual hierarchy and badges
const HEIR_CATEGORIES: Array<{
  id: string;
  name: string;
  titleEn: string;
  icon: string;
  type: 'primary' | 'secondary' | 'tertiary';
  description: string;
  collapsible: boolean;
  badge?: string;
  heirs: HeirCategoryItem[];
}> = [
  {
    id: 'spouses',
    name: '⭐ الأساسيون - الزوجان',
    titleEn: '⭐ Primary - Spouses',
    icon: '💑',
    type: 'primary',
    description: 'الزوج والزوجة - يرثون دائماً',
    collapsible: false,
    heirs: [
      { 
        key: 'husband' as HeirType, 
        label: 'الزوج', 
        labelEn: 'Husband',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '½ أو ¼',
        emoji: '👨‍❤️‍👨',
        maxCount: 1
      },
      { 
        key: 'wife' as HeirType, 
        label: 'الزوجة', 
        labelEn: 'Wife',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '¼ أو ⅛',
        emoji: '👩‍❤️‍👩',
        maxCount: 4
      },
    ]
  },
  {
    id: 'children',
    name: '⭐ الأساسيون - الأبناء',
    titleEn: '⭐ Primary - Children',
    icon: '👶',
    type: 'primary',
    description: 'الأبناء والبنات - عصبة وفرض',
    collapsible: false,
    heirs: [
      { 
        key: 'son' as HeirType, 
        label: 'الابن', 
        labelEn: 'Son',
        type: 'asaba', 
        badge: 'عصبة',
        shareInfo: 'للذكر مثل حظ الأنثيين',
        emoji: '👦'
      },
      { 
        key: 'daughter' as HeirType, 
        label: 'البنت', 
        labelEn: 'Daughter',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '½ أو ⅔',
        emoji: '👧'
      },
    ]
  },
  {
    id: 'parents',
    name: '⭐ الأساسيون - الوالدان',
    titleEn: '⭐ Primary - Parents',
    icon: '👴',
    type: 'primary',
    description: 'الأب والأم - فرض وتعصيب',
    collapsible: false,
    heirs: [
      { 
        key: 'father' as HeirType, 
        label: 'الأب', 
        labelEn: 'Father',
        type: 'both', 
        badge: 'فرض + تعصيب',
        shareInfo: '⅙ أو الباقي',
        emoji: '👨‍🦳'
      },
      { 
        key: 'mother' as HeirType, 
        label: 'الأم', 
        labelEn: 'Mother',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '⅙ أو ⅓',
        emoji: '👩‍🦳'
      },
    ]
  },
  {
    id: 'grandparents',
    name: '🔹 الأجداد',
    titleEn: '🔹 Grandparents',
    icon: '👵',
    type: 'secondary',
    description: 'الأجداد والجدات',
    collapsible: true,
    badge: 'فرض',
    heirs: [
      { 
        key: 'grandfather' as HeirType, 
        label: 'الجد', 
        labelEn: 'Grandfather',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '⅙',
        emoji: '👴'
      },
      { 
        key: 'grandmother_mother' as HeirType, 
        label: 'الجدة لأم', 
        labelEn: 'Grandmother (Maternal)',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '⅙',
        emoji: '👵'
      },
      { 
        key: 'grandmother_father' as HeirType, 
        label: 'الجدة لأب', 
        labelEn: 'Grandmother (Paternal)',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '⅙',
        emoji: '👵'
      },
    ]
  },
  {
    id: 'grandchildren',
    name: '🔹 الأحفاد',
    titleEn: '🔹 Grandchildren',
    icon: '🧒',
    type: 'secondary',
    description: 'أبناء الابن',
    collapsible: true,
    badge: 'عصبة / فرض',
    heirs: [
      { 
        key: 'grandson' as HeirType, 
        label: 'ابن الابن', 
        labelEn: 'Grandson',
        type: 'asaba', 
        badge: 'عصبة',
        shareInfo: 'عصبة',
        emoji: '👦'
      },
      { 
        key: 'granddaughter' as HeirType, 
        label: 'بنت الابن', 
        labelEn: 'Granddaughter',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '½ أو ⅔ أو ⅙',
        emoji: '👧'
      },
    ]
  },
  {
    id: 'siblings',
    name: '🔹 الإخوة والأخوات',
    titleEn: '🔹 Siblings',
    icon: '👫',
    type: 'secondary',
    description: 'الإخوة الأشقاء ولأب ولأم',
    collapsible: true,
    badge: 'عصبة / فرض',
    heirs: [
      { 
        key: 'full_brother' as HeirType, 
        label: 'الأخ الشقيق', 
        labelEn: 'Full Brother',
        type: 'asaba', 
        badge: 'عصبة',
        shareInfo: 'عصبة',
        emoji: '👨'
      },
      { 
        key: 'full_sister' as HeirType, 
        label: 'الأخت الشقيقة', 
        labelEn: 'Full Sister',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '½ أو ⅔',
        emoji: '👩'
      },
      { 
        key: 'paternal_brother' as HeirType, 
        label: 'الأخ لأب', 
        labelEn: 'Paternal Brother',
        type: 'asaba', 
        badge: 'عصبة',
        shareInfo: 'عصبة',
        emoji: '👨'
      },
      { 
        key: 'paternal_sister' as HeirType, 
        label: 'الأخت لأب', 
        labelEn: 'Paternal Sister',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '½ أو ⅔ أو ⅙',
        emoji: '👩'
      },
      { 
        key: 'maternal_brother' as HeirType, 
        label: 'الأخ لأم', 
        labelEn: 'Maternal Brother',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '⅙ أو ⅓',
        emoji: '👨'
      },
      { 
        key: 'maternal_sister' as HeirType, 
        label: 'الأخت لأم', 
        labelEn: 'Maternal Sister',
        type: 'fard', 
        badge: 'فرض',
        shareInfo: '⅙ أو ⅓',
        emoji: '👩'
      },
    ]
  },
  {
    id: 'nephews_uncles',
    name: '📌 أبناء الإخوة والأعمام',
    titleEn: '📌 Nephews & Uncles',
    icon: '👨‍👦',
    type: 'tertiary',
    description: 'العصبات البعيدة',
    collapsible: true,
    badge: 'عصبة',
    heirs: [
      { 
        key: 'full_nephew' as HeirType, 
        label: 'ابن الأخ الشقيق', 
        labelEn: 'Full Nephew',
        type: 'asaba', 
        badge: 'عصبة',
        shareInfo: 'عصبة',
        emoji: '👶'
      },
      { 
        key: 'paternal_nephew' as HeirType, 
        label: 'ابن الأخ لأب', 
        labelEn: 'Paternal Nephew',
        type: 'asaba', 
        badge: 'عصبة',
        shareInfo: 'عصبة',
        emoji: '👶'
      },
      { 
        key: 'full_uncle' as HeirType, 
        label: 'العم الشقيق', 
        labelEn: 'Full Uncle',
        type: 'asaba', 
        badge: 'عصبة',
        shareInfo: 'عصبة',
        emoji: '🧔'
      },
      { 
        key: 'paternal_uncle' as HeirType, 
        label: 'العم لأب', 
        labelEn: 'Paternal Uncle',
        type: 'asaba', 
        badge: 'عصبة',
        shareInfo: 'عصبة',
        emoji: '🧔'
      },
      { 
        key: 'full_cousin' as HeirType, 
        label: 'ابن العم الشقيق', 
        labelEn: 'Full Cousin',
        type: 'asaba', 
        badge: 'عصبة',
        shareInfo: 'عصبة',
        emoji: '👨'
      },
      { 
        key: 'paternal_cousin' as HeirType, 
        label: 'ابن العم لأب', 
        labelEn: 'Paternal Cousin',
        type: 'asaba', 
        badge: 'عصبة',
        shareInfo: 'عصبة',
        emoji: '👨'
      },
    ]
  },
  {
    id: 'blood_relatives',
    name: '📌 ذوو الأرحام',
    titleEn: '📌 Blood Relatives',
    icon: '🔗',
    type: 'tertiary',
    description: 'يرثون عند عدم وجود العصبة',
    collapsible: true,
    badge: 'ذو رحم',
    heirs: [
      { 
        key: 'daughter_son' as HeirType, 
        label: 'ابن البنت', 
        labelEn: "Daughter's Son",
        type: 'blood', 
        badge: 'ذو رحم - صنف 1',
        shareInfo: 'عند عدم العصبة',
        emoji: '👶'
      },
      { 
        key: 'daughter_daughter' as HeirType, 
        label: 'بنت البنت', 
        labelEn: "Daughter's Daughter",
        type: 'blood', 
        badge: 'ذو رحم - صنف 1',
        shareInfo: 'عند عدم العصبة',
        emoji: '👧'
      },
      { 
        key: 'sister_children' as HeirType, 
        label: 'أولاد الأخت', 
        labelEn: "Sister's Children",
        type: 'blood', 
        badge: 'ذو رحم - صنف 2',
        shareInfo: 'عند عدم العصبة',
        emoji: '👨‍👧'
      },
      { 
        key: 'maternal_uncle' as HeirType, 
        label: 'الخال', 
        labelEn: 'Maternal Uncle',
        type: 'blood', 
        badge: 'ذو رحم - صنف 3',
        shareInfo: 'عند عدم العصبة',
        emoji: '🧔'
      },
      { 
        key: 'maternal_aunt' as HeirType, 
        label: 'الخالة', 
        labelEn: 'Maternal Aunt',
        type: 'blood', 
        badge: 'ذو رحم - صنف 3',
        shareInfo: 'عند عدم العصبة',
        emoji: '👩'
      },
      { 
        key: 'paternal_aunt' as HeirType, 
        label: 'العمة', 
        labelEn: 'Paternal Aunt',
        type: 'blood', 
        badge: 'ذو رحم - صنف 4',
        shareInfo: 'عند عدم العصبة',
        emoji: '👵'
      },
    ]
  }
];

export function HeirSelector({ onHeirsChange }: HeirSelectorProps) {
  const { heirs, addHeir, updateHeir, removeHeir, clearHeirs } = useHeirs();
  const [showModal, setShowModal] = useState(false);
  const [selectedHeirType, setSelectedHeirType] = useState<HeirType>('son');
  const [selectedCount, setSelectedCount] = useState(1);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [editingHeirType, setEditingHeirType] = useState<HeirType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    spouses: true,
    children: true,
    parents: true,
    grandparents: false,
    grandchildren: false,
    siblings: false,
    nephews_uncles: false,
    blood_relatives: false
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search query to prevent excessive filtering while typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // heirs is an array of {id, key, count}
  const heirsArray = (heirs as Array<{ id: string; key: HeirType; count: number }>) || [];
  const safeHeirs: HeirsData = useMemo(() => {
    const result: HeirsData = {};
    heirsArray.forEach((heir) => {
      result[heir.key] = heir.count;
    });
    return result;
  }, [heirsArray]);

  // Memoize filtered heirs for performance - only recalculates when searchQuery changes
  const filteredHeirsByCategory = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') return null;
    
    const query = searchQuery.toLowerCase().trim();
    
    return HEIR_CATEGORIES.map(category => ({
      ...category,
      heirs: category.heirs.filter(heir => 
        heir.label.includes(query) || 
        (heir.labelEn && heir.labelEn.toLowerCase().includes(query))
      )
    })).filter(category => category.heirs.length > 0);
  }, [searchQuery]);

  // Determine which categories to display (filtered or all)
  const categoriesToDisplay = useMemo(() => {
    return filteredHeirsByCategory || HEIR_CATEGORIES;
  }, [filteredHeirsByCategory]);

  // Memoize heir entries for performance
  const heirEntries = useMemo(() => 
    heirsArray.map(h => [h.key, h.count] as [string, number]), 
    [heirsArray]
  );
  
  const totalHeirs = useMemo(() => 
    heirsArray.reduce((sum, h) => sum + (h.count || 0), 0), 
    [heirsArray]
  );

  const handleAddHeir = useCallback(() => {
    try {
      if (!selectedHeirType) {
        const errorMsg = 'يجب اختيار نوع الوارث';
        setModalError(errorMsg);
        Alert.alert('خطأ', errorMsg);
        return;
      }

      if (selectedCount < 1 || selectedCount > 100) {
        const errorMsg = 'العدد يجب أن يكون بين 1 و 100';
        setModalError(errorMsg);
        Alert.alert('خطأ', errorMsg);
        return;
      }

      if (editingHeirType) {
        const existing = heirsArray.find(h => h.key === editingHeirType);
        if (existing) {
          const ok = updateHeir(existing.id, { count: selectedCount });
          if (ok) {
            setModalError(null);
            Alert.alert('نجح', 'تم التحديث');
          } else {
            setModalError('فشل في تحديث الوارث');
            Alert.alert('خطأ', 'فشل في تحديث الوارث');
          }
        }
      } else {
        const maleHeirs = ['husband','son','grandson','father','grandfather','full_brother','paternal_brother','maternal_brother','full_nephew','paternal_nephew','full_uncle','paternal_uncle','full_cousin','paternal_cousin','maternal_uncle','daughter_son'];
        const gender = maleHeirs.includes(selectedHeirType) ? 'male' : 'female';
        const ok = addHeir({ type: selectedHeirType as string, gender: gender as 'male'|'female', count: selectedCount });
        if (ok) {
          setModalError(null);
          Alert.alert('نجح', 'تم الإضافة');
        } else {
          setModalError('فشل في إضافة الوارث (مكرر أو غير صالح)');
          Alert.alert('خطأ', 'فشل في إضافة الوارث (مكرر أو غير صالح)');
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'خطأ في إضافة الوارث';
      setModalError(errorMsg);
      Alert.alert('خطأ', errorMsg);
    }
  }, [selectedHeirType, selectedCount, safeHeirs, onHeirsChange, editingHeirType, heirsArray, addHeir, updateHeir]);

  // Helper: determine gender for heir type
  const genderFor = useCallback((key: HeirType) => {
    const maleHeirs = ['husband','son','grandson','father','grandfather','full_brother','paternal_brother','maternal_brother','full_nephew','paternal_nephew','full_uncle','paternal_uncle','full_cousin','paternal_cousin','maternal_uncle','daughter_son'];
    return maleHeirs.includes(key) ? 'male' : 'female';
  }, []);

  // Validation rules enforcement when changing counts inline
  const validateChange = useCallback((key: HeirType, newCount: number, currentMap: HeirsData) => {
    // Cannot be negative or over 100
    if (newCount < 0 || newCount > 100) return 'العدد يجب أن يكون بين 0 و 100.';
    
    // MUST have only 1 husband (max)
    if (key === 'husband' && newCount > 1) {
      return '❌ خطأ: يمكن أن يكون هناك زوج واحد فقط (الحد الأقصى 1)';
    }
    
    // Cannot have both husband and wife
    if (key === 'husband' && newCount > 0 && (currentMap['wife'] || 0) > 0) {
      return 'لا يمكن إضافة الزوج بينما هناك زوجات مسجلات. أزل الزوجات أولاً.';
    }
    if (key === 'wife' && newCount > 0 && (currentMap['husband'] || 0) > 0) {
      return 'لا يمكن إضافة زوجة مع وجود زوج مسجل. أزل الزوج أولاً.';
    }
    
    // Wife max 4
    if (key === 'wife' && newCount > 4) {
      return '❌ خطأ: الحد الأقصى للزوجات هو 4 (قال تعالى: فانكحوا ما طاب لكم من النساء...)';
    }
    
    // Single-count limits for parents/grandparents
    const singleCountHeirs = ['husband', 'father', 'mother', 'grandfather', 'grandmother', 'grandmother_mother', 'grandmother_father'];
    if (singleCountHeirs.includes(key) && newCount > 1) {
      return `❌ خطأ: يمكن أن يكون هناك واحد فقط من هذا النوع`;
    }
    
    return null;
  }, []);

  const handleIncrement = useCallback((heirKey: HeirType) => {
    const existing = heirsArray.find(h => h.key === heirKey);
    const currentMap: HeirsData = { ...safeHeirs };
    const currentCount = existing ? existing.count : 0;
    const newCount = currentCount + 1;

    const validationMsg = validateChange(heirKey, newCount, currentMap);
    if (validationMsg) {
      Alert.alert('غير مسموح', validationMsg);
      return;
    }

    if (existing) {
      updateHeir(existing.id, { count: newCount });
    } else {
      addHeir({ type: heirKey, gender: genderFor(heirKey) as 'male'|'female', count: 1 });
    }
  }, [heirsArray, safeHeirs, addHeir, updateHeir, validateChange, genderFor]);

  const handleDecrement = useCallback((heirKey: HeirType) => {
    const existing = heirsArray.find(h => h.key === heirKey);
    if (!existing) return;
    const currentMap: HeirsData = { ...safeHeirs };
    const newCount = Math.max(0, existing.count - 1);

    const validationMsg = validateChange(heirKey, newCount, currentMap);
    if (validationMsg) {
      Alert.alert('غير مسموح', validationMsg);
      return;
    }

    if (newCount === 0) {
      // remove if more than one type exists
      if (heirsArray.length > 1) {
        removeHeir(existing.id);
      } else {
        Alert.alert('غير مسموح', 'يجب أن يبقى وارث واحد على الأقل');
      }
    } else {
      updateHeir(existing.id, { count: newCount });
    }
  }, [heirsArray, safeHeirs, removeHeir, updateHeir, validateChange]);

  const handleRemoveHeir = useCallback((heirType: HeirType) => {
    const category = HEIR_CATEGORIES.find(c => 
      c.heirs.some(h => h.key === heirType)
    );
    const heir = category?.heirs.find(h => h.key === heirType);
    const heirLabel = heir?.label || heirType;
    
    Alert.alert(
      'تأكيد الحذف',
      `هل تريد حذف ${heirLabel}؟`,
      [
        { text: 'إلغاء', onPress: () => {} },
        {
          text: 'حذف',
          onPress: () => {
            const existing = heirsArray.find(h => h.key === heirType);
            if (!existing) {
              Alert.alert('خطأ', 'الوارث غير موجود');
              return;
            }
            const ok = removeHeir(existing.id);
            if (ok) {
              const newMap: HeirsData = { ...safeHeirs };
              delete newMap[heirType];
              const validation = HeirValidator.validate(newMap);
              setValidationResult(validation);
              onHeirsChange?.(newMap);
              Alert.alert('نجح', `تم حذف ${heirLabel} بنجاح`);
            } else {
              Alert.alert('خطأ', 'فشل في حذف الوارث');
            }
          }
        }
      ]
    );
  }, [safeHeirs, onHeirsChange, heirsArray, removeHeir]);

  const handleEditHeir = useCallback((heirType: HeirType) => {
    const current = heirsArray.find(h => h.key === heirType);
    const currentCount = current ? current.count : (safeHeirs[heirType] || 1);
    setEditingHeirType(heirType);
    setSelectedHeirType(heirType);
    setSelectedCount(currentCount);
    setModalError(null);
    setShowModal(true);
  }, [safeHeirs, heirsArray]);

  const handleClearAll = useCallback(() => {
    Alert.alert(
      'مسح الكل',
      'هل تريد مسح جميع الوارثون؟',
      [
        { text: 'إلغاء', onPress: () => {} },
        {
          text: 'مسح',
          onPress: () => {
            clearHeirs();
            const validation = HeirValidator.validate({});
            setValidationResult(validation);
            onHeirsChange?.({});
            Alert.alert('تم', 'تم مسح جميع الورثة');
          }
        }
      ]
    );
  }, [clearHeirs, onHeirsChange]);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }, []);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity 
          style={styles.searchToggle}
          onPress={() => setShowSearch(!showSearch)}
        >
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
        
        {showSearch && (
          <TextInput
            style={styles.searchInput}
            placeholder="بحث عن وارث..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        )}
      </View>

      {/* Validation Errors/Warnings */}
      {validationResult && validationResult.errors.length > 0 && (
        <View style={[styles.feedbackContainer, styles.feedbackErrorContainer]}>
          {validationResult.errors.map((error, index) => (
            <View key={`error-${index}`} style={styles.feedbackItem}>
              <Text style={styles.feedbackIcon}>❌</Text>
              <View style={styles.feedbackText}>
                <Text style={styles.feedbackUserMessage}>{error.userMessage}</Text>
                {error.suggestion && (
                  <Text style={styles.feedbackSuggestion}>{error.suggestion}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {validationResult && validationResult.warnings.length > 0 && (
        <View style={[styles.feedbackContainer, styles.feedbackWarningContainer]}>
          {validationResult.warnings.map((warning, index) => (
            <View key={`warning-${index}`} style={styles.feedbackItem}>
              <Text style={styles.feedbackIcon}>⚠️</Text>
              <View style={styles.feedbackText}>
                <Text style={styles.feedbackUserMessage}>{warning.userMessage}</Text>
                {warning.suggestion && (
                  <Text style={styles.feedbackSuggestion}>{warning.suggestion}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Heir Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.categoriesTitle}>👥 إضافة الوارثون</Text>
        <Text style={styles.categoriesSubtitle}>Add Heirs by Category</Text>

        <ScrollView style={styles.categoriesScrollView}>
          {categoriesToDisplay.map((category) => {
            const isExpanded = expandedCategories[category.id];
            
            return (
              <View key={category.id} style={styles.categoryCard}>
                {/* Category Header */}
                <TouchableOpacity
                  style={[
                    styles.categoryHeader,
                    category.type === 'primary' && styles.categoryHeaderPrimary,
                    category.type === 'secondary' && styles.categoryHeaderSecondary,
                    category.type === 'tertiary' && styles.categoryHeaderTertiary,
                  ]}
                  onPress={() => toggleCategory(category.id)}
                  disabled={!category.collapsible}
                >
                  <View style={styles.categoryHeaderLeft}>
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <View>
                      <Text style={styles.categoryName}>{category.name}</Text>
                      <Text style={styles.categoryDescription}>{category.description}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.categoryHeaderRight}>
                    {category.badge && (
                      <View style={[
                        styles.categoryBadge,
                        category.type === 'primary' && styles.categoryBadgePrimary,
                        category.type === 'secondary' && styles.categoryBadgeSecondary,
                        category.type === 'tertiary' && styles.categoryBadgeTertiary,
                      ]}>
                        <Text style={styles.categoryBadgeText}>{category.badge}</Text>
                      </View>
                    )}
                    
                    {category.collapsible && (
                      <Text style={styles.expandIcon}>
                        {isExpanded ? '▼' : '▶'}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>

                {/* Category Heirs */}
                {isExpanded && (
                  <View style={styles.categoryHeirs}>
                    {category.heirs.map((heir) => {
                      const existingHeir = heirsArray.find(h => h.key === heir.key);
                      const count = existingHeir?.count || 0;
                      
                      // Filter by debounced search query if needed
                      if (debouncedSearchQuery && !heir.label.includes(debouncedSearchQuery) && 
                          !(heir.labelEn && heir.labelEn.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))) {
                        return null;
                      }

                      return (
                        <View key={heir.key} style={styles.heirRow}>
                          <View style={styles.heirInfo}>
                            <Text style={styles.heirEmoji}>{heir.emoji}</Text>
                            <View style={styles.heirDetails}>
                              <View style={styles.heirNameContainer}>
                                <Text style={styles.heirName}>{heir.label}</Text>
                                {heir.badge && (
                                  <View style={[
                                    styles.heirBadge,
                                    heir.type === 'fard' && styles.heirBadgeFard,
                                    heir.type === 'asaba' && styles.heirBadgeAsaba,
                                    heir.type === 'both' && styles.heirBadgeBoth,
                                    heir.type === 'blood' && styles.heirBadgeBlood,
                                  ]}>
                                    <Text style={styles.heirBadgeText}>{heir.badge}</Text>
                                  </View>
                                )}
                              </View>
                              
                              {heir.shareInfo && (
                                <Text style={styles.heirShareInfo}>{heir.shareInfo}</Text>
                              )}
                              
                              {hasMaxCount(heir) && heir.maxCount && count >= heir.maxCount && (
                                <Text style={styles.heirMaxWarning}>
                                  ⚠️ الحد الأقصى {heir.maxCount}
                                </Text>
                              )}
                            </View>
                          </View>

                          <View style={styles.heirControls}>
                            <TouchableOpacity
                              style={[styles.heirControlButton, count === 0 && styles.heirControlButtonDisabled]}
                              onPress={() => handleDecrement(heir.key)}
                              disabled={count === 0}
                            >
                              <Text style={styles.heirControlButtonText}>−</Text>
                            </TouchableOpacity>

                            <View style={styles.heirCountContainer}>
                              <Text style={styles.heirCount}>{count}</Text>
                            </View>

                            <TouchableOpacity
                              style={[
                                styles.heirControlButton, 
                                styles.heirControlButtonIncrement,
                                hasMaxCount(heir) && heir.maxCount && count >= heir.maxCount ? styles.heirControlButtonDisabled : undefined
                              ]}
                              onPress={() => handleIncrement(heir.key)}
                              disabled={hasMaxCount(heir) && heir.maxCount ? count >= heir.maxCount : false}
                            >
                              <Text style={styles.heirControlButtonText}>+</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Summary Section */}
      <View style={styles.summarySection}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryIcon}>📊</Text>
          <Text style={styles.summaryTitle}>الوارثون المضافون</Text>
        </View>
        
        <View style={styles.summaryStats}>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>{heirEntries.length}</Text>
            <Text style={styles.summaryStatLabel}>أنواع</Text>
          </View>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>{totalHeirs}</Text>
            <Text style={styles.summaryStatLabel}>إجمالي</Text>
          </View>
        </View>

        {heirEntries.length > 0 && (
          <View style={styles.addedHeirsList}>
            {heirEntries.map(([heirTypeStr, count]) => {
              const heirType = heirTypeStr as HeirType;
              const category = HEIR_CATEGORIES.find(c => 
                c.heirs.some(h => h.key === heirType)
              );
              const heir = category?.heirs.find(h => h.key === heirType);
              
              return (
                <View key={heirTypeStr} style={styles.addedHeirItem}>
                  <View style={styles.addedHeirInfo}>
                    <Text style={styles.addedHeirEmoji}>{heir?.emoji || '👤'}</Text>
                    <Text style={styles.addedHeirName}>
                      {heir?.label || heirTypeStr}: {count}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeHeirButton}
                    onPress={() => handleRemoveHeir(heirType)}
                  >
                    <Text style={styles.removeHeirButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        {heirEntries.length > 0 && (
          <TouchableOpacity style={styles.clearAllBtn} onPress={handleClearAll}>
            <Text style={styles.clearAllBtnText}>🗑️ مسح الكل</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* الـ Modal لإضافة وارث جديد */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingHeirType ? 'تعديل وارث' : 'إضافة وارث جديد'}
            </Text>
            <TouchableOpacity 
              onPress={() => {
                setShowModal(false);
                setEditingHeirType(null);
              }}
            >
              </TouchableOpacity>
            </View>

            {/* اختيار نوع الوارث */}
            <Text style={styles.modalLabel}>اختر نوع الوارث:</Text>
            <ScrollView style={styles.heirTypesGrid} scrollEnabled={true}>
              {HEIR_CATEGORIES.flatMap(category => category.heirs).map(heirType => (
                <TouchableOpacity
                  key={heirType.key}
                  style={[
                    styles.heirTypeButton,
                    selectedHeirType === heirType.key && styles.heirTypeButtonSelected,
                    editingHeirType && editingHeirType !== heirType.key && styles.heirTypeButtonDisabled
                  ]}
                  onPress={() => !editingHeirType && setSelectedHeirType(heirType.key)}
                  disabled={editingHeirType !== null && editingHeirType !== heirType.key}
                >
                  <Text style={styles.heirTypeEmoji}>{heirType.emoji}</Text>
                  <Text style={[
                    styles.heirTypeLabel,
                    editingHeirType && editingHeirType !== heirType.key && { opacity: 0.5 }
                  ]}>
                    {heirType.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* اختيار العدد - Dynamic Number Input */}
            <Text style={styles.modalLabel}>اختر العدد (1-100):</Text>
            <View style={styles.countInputContainer}>
              <TouchableOpacity
                style={styles.decrementButton}
                onPress={() => setSelectedCount(Math.max(1, selectedCount - 1))}
                disabled={selectedCount <= 1}
              >
                <Text style={styles.decrementButtonText}>−</Text>
              </TouchableOpacity>
              
              <TextInput
                style={styles.countInput}
                placeholder="العدد"
                placeholderTextColor="#999"
                value={selectedCount.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text) || 0;
                  if (num >= 1 && num <= 100) {
                    setSelectedCount(num);
                  }
                }}
                keyboardType="number-pad"
                maxLength={3}
              />
              
              <TouchableOpacity
                style={styles.incrementButton}
                onPress={() => setSelectedCount(Math.min(100, selectedCount + 1))}
                disabled={selectedCount >= 100}
              >
                <Text style={styles.incrementButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            
            {/* Display current selection */}
            <View style={styles.selectedCountDisplay}>
              <Text style={styles.selectedCountText}>العدد المختار: {selectedCount}</Text>
            </View>

            {/* Modal Error Message */}
            {modalError && (
              <View style={styles.modalErrorContainer}>
                <Text style={styles.modalErrorText}>{modalError}</Text>
              </View>
            )}

            {/* أزرار الإجراء */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowModal(false);
                  setModalError(null);
                  setEditingHeirType(null);
                }}
              >
                <Text style={styles.cancelButtonText}>إلغاء</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmButton, isLoading && styles.confirmButtonDisabled]}
                onPress={handleAddHeir}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText}>
                    {editingHeirType ? 'تحديث' : 'تأكيد'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchToggle: {
    padding: 8,
  },
  searchIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    textAlign: 'right',
    marginBottom: 4,
  },
  categoriesSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginBottom: 16,
  },
  categoriesScrollView: {
    maxHeight: 500,
  },
  categoryCard: {
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
  },
  categoryHeaderPrimary: {
    backgroundColor: '#e3f2fd',
    borderLeftWidth: 4,
    borderLeftColor: '#1976d2',
  },
  categoryHeaderSecondary: {
    backgroundColor: '#f3e5f5',
    borderLeftWidth: 4,
    borderLeftColor: '#7b1fa2',
  },
  categoryHeaderTertiary: {
    backgroundColor: '#fff3e0',
    borderLeftWidth: 4,
    borderLeftColor: '#f57c00',
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  categoryIcon: {
    fontSize: 24,
    width: 32,
    textAlign: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
    textAlign: 'right',
  },
  categoryDescription: {
    fontSize: 11,
    color: '#666',
    textAlign: 'right',
  },
  categoryHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgePrimary: {
    backgroundColor: '#bbdefb',
  },
  categoryBadgeSecondary: {
    backgroundColor: '#e1bee7',
  },
  categoryBadgeTertiary: {
    backgroundColor: '#ffe0b2',
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
  },
  expandIcon: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  categoryHeirs: {
    padding: 12,
    backgroundColor: '#fff',
  },
  heirRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  heirInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  heirEmoji: {
    fontSize: 20,
    width: 30,
    textAlign: 'center',
  },
  heirDetails: {
    flex: 1,
  },
  heirNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  heirName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
  },
  heirBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  heirBadgeFard: {
    backgroundColor: '#e3f2fd',
  },
  heirBadgeAsaba: {
    backgroundColor: '#e8f5e9',
  },
  heirBadgeBoth: {
    backgroundColor: '#fff3e0',
  },
  heirBadgeBlood: {
    backgroundColor: '#fce4ec',
  },
  heirBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#333',
  },
  heirShareInfo: {
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'right',
  },
  heirMaxWarning: {
    fontSize: 9,
    color: '#f57c00',
    marginTop: 2,
  },
  heirControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heirControlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  heirControlButtonIncrement: {
    backgroundColor: '#e8f5e9',
    borderColor: '#81c784',
  },
  heirControlButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#f5f5f5',
  },
  heirControlButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  heirCountContainer: {
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heirCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1976d2',
  },
  summarySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  summaryIcon: {
    fontSize: 20,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
    flex: 1,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1976d2',
    marginBottom: 2,
  },
  summaryStatLabel: {
    fontSize: 11,
    color: '#666',
  },
  addedHeirsList: {
    maxHeight: 150,
    marginBottom: 12,
  },
  addedHeirItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 6,
  },
  addedHeirInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addedHeirEmoji: {
    fontSize: 16,
  },
  addedHeirName: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  removeHeirButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeHeirButtonText: {
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: '600',
  },
  clearAllBtn: {
    backgroundColor: '#d32f2f',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  clearAllBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6
  },
  addButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  heirsListContainer: {
    marginTop: 8
  },
  heirsListTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right'
  },
  heirsList: {
    maxHeight: 200
  },
  heirItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  heirActions: {
    flexDirection: 'row',
    gap: 6
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  statsContainer: {
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#4F46E5',
    marginTop: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  statsText: {
    fontSize: 13,
    color: '#4F46E5',
    fontWeight: '600',
    textAlign: 'right',
    marginVertical: 2
  },
  clearButton: {
    backgroundColor: '#DC2626',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: 'center'
  },
  emptyStateText: {
    fontSize: 12,
    color: '#999'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333'
  },
  modalCloseButton: {
    fontSize: 24,
    color: '#666'
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right'
  },
  heirTypesGrid: {
    maxHeight: 150,
    marginBottom: 12
  },
  heirTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1
  },
  heirTypeButtonSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  heirTypeButtonDisabled: {
    opacity: 0.5
  },
  heirTypeEmoji: {
    fontSize: 20,
    marginLeft: 8
  },
  heirTypeLabel: {
    fontSize: 13,
    color: '#333',
    flex: 1,
    textAlign: 'right'
  },
  countInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8
  },
  decrementButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4
  },
  decrementButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  countInput: {
    width: 80,
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#4F46E5',
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  incrementButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4
  },
  incrementButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  selectedCountDisplay: {
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    alignItems: 'center'
  },
  selectedCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
    textAlign: 'center'
  },
  feedbackContainer: {
    borderRadius: 6,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 0
  },
  feedbackErrorContainer: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f'
  },
  feedbackWarningContainer: {
    backgroundColor: '#fff3e0',
    borderLeftWidth: 4,
    borderLeftColor: '#f57c00'
  },
  feedbackItem: {
    flexDirection: 'row',
    marginBottom: 8
  },
  feedbackIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2
  },
  feedbackText: {
    flex: 1
  },
  feedbackUserMessage: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    textAlign: 'right',
    marginBottom: 4
  },
  feedbackSuggestion: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    fontStyle: 'italic',
    marginTop: 2
  },
  modalErrorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f'
  },
  modalErrorText: {
    color: '#d32f2f',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'right'
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151'
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4
  },
  confirmButtonDisabled: {
    backgroundColor: '#cbd5e1',
    shadowColor: '#000',
    shadowOpacity: 0
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff'
  }
});

export default HeirSelector;```

## ./components/MadhhabSelector.tsx
```typescript
/**
 * @file MadhhabSelector.tsx
 * @description مكون اختيار المذهب الفقهي
 * Madhab Selector Component for Phase 5
 * 
 * اختيار أحد المذاهب الأربعة للحساب
 */

import React, { useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useMadhab } from '../lib/inheritance/hooks';
import { MadhhabType } from '../lib/inheritance/types';

const MADHABS_INFO = {
  hanafi: {
    name: 'الحنفي',
    description: 'مذهب أبي حنيفة',
    gradient: ['#dc2626', '#ef4444'],
    lightBg: '#fef2f2',
    darkColor: '#991b1b'
  },
  maliki: {
    name: 'المالكي',
    description: 'مذهب مالك بن أنس',
    gradient: ['#7c3aed', '#8b5cf6'],
    lightBg: '#faf5ff',
    darkColor: '#6b21a8'
  },
  shafii: {
    name: 'الشافعي',
    description: 'مذهب محمد بن إدريس الشافعي',
    gradient: ['#059669', '#10b981'],
    lightBg: '#ecfdf5',
    darkColor: '#065f46'
  },
  hanbali: {
    name: 'الحنبلي',
    description: 'مذهب أحمد بن حنبل',
    gradient: ['#0284c7', '#0ea5e9'],
    lightBg: '#eff6ff',
    darkColor: '#1e40af'
  }
};

export interface MadhhabSelectorProps {
  onMadhhabChange?: (madhab: MadhhabType) => void;
}

/**
 * مكون اختيار المذهب
 * Allows users to select Islamic school of law
 */
export function MadhhabSelector({ onMadhhabChange }: MadhhabSelectorProps) {
  const { madhab, changeMadhab, getMadhhabInfo } = useMadhab();

  useEffect(() => {
    onMadhhabChange?.(madhab as MadhhabType);
  }, [madhab, onMadhhabChange]);

  const handleMadhhabChange = useCallback((newMadhab: MadhhabType) => {
    changeMadhab(newMadhab);
    onMadhhabChange?.(newMadhab);
  }, [changeMadhab, onMadhhabChange]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>اختر المذهب الفقهي</Text>
      <Text style={styles.subtitle}>Select Islamic School of Law</Text>

      <View style={styles.madhhabsGrid}>
        {(Object.keys(MADHABS_INFO) as MadhhabType[]).map(madhhabKey => {
          const madhhabInfo = MADHABS_INFO[madhhabKey];
          const isSelected = madhab === madhhabKey;

          return (
            <TouchableOpacity
              key={madhhabKey}
              style={[
                styles.madhhabCard,
                isSelected && styles.madhhabCardActive,
                { borderColor: madhhabInfo.gradient[0] }
              ]}
              onPress={() => handleMadhhabChange(madhhabKey)}
            >
              <View
                style={[
                  styles.madhhabCardHeader,
                  isSelected && { backgroundColor: madhhabInfo.gradient[0] }
                ]}
              >
                <Text
                  style={[
                    styles.madhhabCardHeaderText,
                    isSelected && styles.madhhabCardHeaderTextActive
                  ]}
                >
                  {madhhabInfo.name}
                </Text>
              </View>

              <View style={styles.madhhabCardBody}>
                <Text style={styles.madhhabDescription}>{madhhabInfo.description}</Text>
                
                {isSelected && (
                  <View style={styles.selectedIndicator}>
                    <Text style={styles.selectedIndicatorText}>✓ مختار</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* معلومات المذهب المختار */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>معلومات المذهب الحالي:</Text>
        <View style={styles.infoContent}>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>المذهب: </Text>
            <Text style={styles.infoValue}>{MADHABS_INFO[madhab as keyof typeof MADHABS_INFO]?.name}</Text>
          </Text>
          <Text style={styles.infoItem}>
            <Text style={styles.infoLabel}>الوصف: </Text>
            <Text style={styles.infoValue}>
              {MADHABS_INFO[madhab as keyof typeof MADHABS_INFO]?.description}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'right'
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
    textAlign: 'right'
  },
  madhhabsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12
  },
  madhhabCard: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    marginBottom: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  madhhabCardActive: {
    borderWidth: 3,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5
  },
  madhhabCardHeader: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
    alignItems: 'center'
  },
  madhhabCardHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151'
  },
  madhhabCardHeaderTextActive: {
    color: '#fff'
  },
  madhhabCardBody: {
    padding: 12,
    alignItems: 'center'
  },
  madhhabDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500'
  },
  selectedIndicator: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#ecfdf5',
    borderRadius: 6,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#a7f3d0'
  },
  selectedIndicatorText: {
    fontSize: 12,
    color: '#065f46',
    fontWeight: '600'
  },
  infoContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 10,
    textAlign: 'right'
  },
  infoContent: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 12
  },
  infoItem: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 8,
    textAlign: 'right'
  },
  infoLabel: {
    fontWeight: '600',
    color: '#4F46E5'
  },
  infoValue: {
    color: '#333',
    fontWeight: '500'
  }
});

export default MadhhabSelector;
```

## ./components/ResultsDisplay.tsx
```typescript
/**
 * @file ResultsDisplay.tsx
 * @description عرض النتائج والتوزيع
 * Results Display Component for Phase 5
 * 
 * عرض شامل لنتائج الحساب والتوزيع
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useResults } from '../lib/inheritance/hooks';
import type { CalculationResult } from '../lib/inheritance/types';
import { PDFExporter } from '../lib/export/PDFExporter';
import { ErrorLogger, CalculationError } from '../lib/errors/ErrorHandler';

export interface ResultsDisplayProps {
  result?: CalculationResult | null;
  onClose?: () => void;
}

/**
 * مكون عرض النتائج
 * Displays calculation results with distribution details
 */
export function ResultsDisplay({ result, onClose }: ResultsDisplayProps) {
  const hooksResults = useResults();
  const results = hooksResults?.previousResults || [];
  const [showComparison, setShowComparison] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState<number | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const currentResult = result || results[0];
  const previousResults = results.slice(1, 4);

  const stats_data = useMemo(() => {
    return {
      totalResults: results ? results.length : 0,
      currentResult: 1,
      madhabs: {}
    };
  }, [results]);

  // Handle PDF Export with error handling
  const handleExportPDF = useCallback(async () => {
    if (!currentResult || !currentResult.success) {
      setExportError('لا توجد نتائج صحيحة للتصدير');
      return;
    }

    setExportLoading(true);
    setExportError(null);

    try {
      const timestamp = new Date().toLocaleDateString('ar-SA');
      const filename = `تقرير-التركة-${timestamp}`;

      // Generate and share PDF
      await PDFExporter.generateAndShare(currentResult, {
        filename,
        includeCalculationSteps: true,
        theme: 'light'
      });

      // Log success
      ErrorLogger.logError(
        'PDF_EXPORT_SUCCESS',
        `PDF exported successfully for madhab: ${currentResult.madhhabName}`,
        'تم تصدير التقرير بنجاح',
        'info',
        { madhab: currentResult.madhhabName }
      );
      
      Alert.alert(
        'تم بنجاح',
        'تم إنشاء التقرير وفتح خيارات المشاركة'
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تصدير PDF';
      setExportError(errorMessage);

      // Log error
      ErrorLogger.logError(
        'PDF_EXPORT_ERROR',
        errorMessage,
        'حدث خطأ أثناء تصدير التقرير',
        'error',
        {
          context: 'PDF Export',
          madhab: currentResult?.madhhabName
        },
        err instanceof Error ? err.stack : undefined
      );

      Alert.alert(
        'خطأ في التصدير',
        errorMessage,
        [{ text: 'حسناً', onPress: () => setExportError(null) }]
      );
    } finally {
      setExportLoading(false);
    }
  }, [currentResult]);

  if (!currentResult || !currentResult.success) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>لا توجد نتائج</Text>
          <Text style={styles.emptyStateText}>قم بإجراء عملية حساب أولاً</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* رأس النتائج */}
      <View style={styles.header}>
        <View style={styles.madhhabBadge}>
          <Text style={styles.madhhabBadgeText}>{currentResult.madhhabName}</Text>
        </View>
        <Text style={styles.title}>نتائج التوزيع</Text>
        {currentResult.calculationTime && (
          <Text style={styles.calculationTime}>
            وقت الحساب: {currentResult.calculationTime}ms
          </Text>
        )}
      </View>

      {/* حالات خاصة */}
      {currentResult.specialCases && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>حالات خاصة</Text>
          <View style={styles.specialCases}>
            {currentResult.awlApplied && (
              <View style={styles.specialCaseItem}>
                <Text style={styles.specialCaseLabel}>العول:</Text>
                <Text style={styles.specialCaseValue}>مطبق</Text>
              </View>
            )}
            {currentResult.raddApplied && (
              <View style={styles.specialCaseItem}>
                <Text style={styles.specialCaseLabel}>الرد:</Text>
                <Text style={styles.specialCaseValue}>مطبق</Text>
              </View>
            )}
            {currentResult.blockedHeirs && 
              currentResult.blockedHeirs.length > 0 && (
              <View style={styles.hijabContainer}>
                <Text style={styles.hijabLabel}>المحجوبون:</Text>
                {currentResult.blockedHeirs.map((heir: string, idx: number) => (
                  <Text key={idx} style={styles.hijabType}>• {heir}</Text>
                ))}
              </View>
            )}
          </View>
        </View>
      )}

      {/* جدول التوزيع */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>جدول التوزيع</Text>
        <View style={styles.table}>
          {/* رأس الجدول */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>المبلغ</Text>
            <Text style={styles.tableHeaderCell}>النسبة</Text>
            <Text style={styles.tableHeaderCell}>الوارث</Text>
          </View>

          {/* صفوف الجدول */}
          {currentResult.shares && currentResult.shares.map((share: any, index: number) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                index % 2 === 1 && styles.tableRowAlternate
              ]}
            >
              <Text style={styles.tableCell}>
                {share.amount.toFixed(2)} ر.س
              </Text>
              <Text style={styles.tableCell}>
                {share.fraction.numerator}/{share.fraction.denominator}
              </Text>
              <Text style={styles.tableCell}>{share.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* الملخص المالي */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الملخص المالي</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>إجمالي التركة:</Text>
            <Text style={styles.summaryValue}>
              {currentResult.shares.reduce((sum: number, s: any) => sum + s.amount, 0).toFixed(2)} ر.س
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>مستوى الثقة:</Text>
            <Text style={[
              styles.summaryValue,
              { color: currentResult.confidence > 90 ? '#4caf50' : '#ff9800' }
            ]}>
              {currentResult.confidence}%
            </Text>
          </View>
        </View>
      </View>

      {/* خطوات الحساب */}
      {currentResult.steps && currentResult.steps.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>خطوات الحساب</Text>
          <ScrollView style={styles.stepsContainer} scrollEnabled={true}>
            {currentResult.steps.map((step: any, index: number) => (
              <View key={index} style={styles.step}>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepNumber}>{step.stepNumber}</Text>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                </View>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* النتائج السابقة */}
      {previousResults && previousResults.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>النتائج السابقة</Text>
          <ScrollView style={styles.historyContainer} scrollEnabled={true}>
            {previousResults.map((prevResult: any, index: number) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.historyItem,
                  selectedResultId === index && styles.historyItemSelected
                ]}
                onPress={() => setSelectedResultId(index)}
              >
                <Text style={styles.historyItemMadhab}>{prevResult.madhhabName}</Text>
                <Text style={styles.historyItemAmount}>
                  {prevResult.shares.reduce((sum: number, s: any) => sum + s.amount, 0).toFixed(0)} ر.س
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* زر المقارنة */}
      {previousResults && previousResults.length > 0 && (
        <TouchableOpacity
          style={styles.comparisonButton}
          onPress={() => setShowComparison(!showComparison)}
        >
          <Text style={styles.comparisonButtonText}>
            {showComparison ? '▼ مقارنة المذاهب' : '▶ مقارنة المذاهب'}
          </Text>
        </TouchableOpacity>
      )}

      {/* الإحصائيات */}
      {showComparison && stats_data && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الإحصائيات</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <Text style={styles.statValue}>{stats_data.totalResults}</Text>
              <Text style={styles.statLabel}>إجمالي الحسابات</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statValue}>{stats_data.currentResult}</Text>
              <Text style={styles.statLabel}>النتيجة الحالية</Text>
            </View>
          </View>
        </View>
      )}

      {/* زر الإغلاق */}
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>إغلاق</Text>
        </TouchableOpacity>
      )}

      {/* PDF Export Button and Error Display */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.exportButton, exportLoading && styles.exportButtonDisabled]}
          onPress={handleExportPDF}
          disabled={exportLoading || !currentResult?.success}
        >
          {exportLoading ? (
            <>
              <ActivityIndicator size="small" color="#fff" style={styles.exportButtonSpinner} />
              <Text style={styles.exportButtonText}>جاري التصدير...</Text>
            </>
          ) : (
            <>
              <Text style={styles.exportButtonIcon}>📄</Text>
              <Text style={styles.exportButtonText}>تصدير إلى PDF</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Export Error Display */}
      {exportError && (
        <View style={styles.exportErrorContainer}>
          <Text style={styles.exportErrorIcon}>❌</Text>
          <View style={styles.exportErrorContent}>
            <Text style={styles.exportErrorTitle}>خطأ في التصدير</Text>
            <Text style={styles.exportErrorMessage}>{exportError}</Text>
          </View>
          <TouchableOpacity onPress={() => setExportError(null)}>
            <Text style={styles.exportErrorClose}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 12
  },
  madhhabBadge: {
    backgroundColor: '#e3f2fd',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-end',
    marginBottom: 6
  },
  madhhabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1976d2'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 6
  },
  calculationTime: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center'
  },
  section: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    textAlign: 'right'
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center'
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6
  },
  emptyStateText: {
    fontSize: 12,
    color: '#999'
  },
  specialCases: {
    backgroundColor: '#fff3e0',
    borderRadius: 4,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ffb74d'
  },
  specialCaseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  specialCaseLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333'
  },
  specialCaseValue: {
    fontSize: 12,
    color: '#ff9800',
    fontWeight: '600'
  },
  hijabContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ffe0b2'
  },
  hijabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  hijabType: {
    fontSize: 11,
    color: '#666',
    marginVertical: 2
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden'
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1976d2',
    padding: 8
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center'
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f9f9f9'
  },
  tableRowAlternate: {
    backgroundColor: '#fff'
  },
  tableCell: {
    flex: 1,
    fontSize: 11,
    color: '#333',
    textAlign: 'center'
  },
  summaryContainer: {
    backgroundColor: '#e8f5e9',
    borderRadius: 4,
    padding: 10,
    borderWidth: 1,
    borderColor: '#81c784'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333'
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2e7d32'
  },
  stepsContainer: {
    maxHeight: 200
  },
  step: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#1976d2'
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1976d2',
    marginRight: 8
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    flex: 1
  },
  stepDescription: {
    fontSize: 11,
    color: '#666',
    textAlign: 'right'
  },
  historyContainer: {
    maxHeight: 150
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  historyItemSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1976d2'
  },
  historyItemMadhab: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976d2'
  },
  historyItemAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333'
  },
  comparisonButton: {
    marginHorizontal: 12,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1976d2'
  },
  comparisonButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976d2',
    textAlign: 'center'
  },
  statsContainer: {
    backgroundColor: '#f3e5f5',
    borderRadius: 4,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ce93d8'
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333'
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7b1fa2'
  },
  closeButton: {
    marginHorizontal: 12,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#d32f2f',
    borderRadius: 6,
    alignItems: 'center'
  },
  closeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff'
  },
  actionButtonsContainer: {
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 12,
    gap: 8
  },
  exportButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1976d2',
    borderRadius: 6,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  exportButtonDisabled: {
    backgroundColor: '#90caf9',
    opacity: 0.7
  },
  exportButtonIcon: {
    fontSize: 16,
    marginRight: 8
  },
  exportButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff'
  },
  exportButtonSpinner: {
    marginRight: 8
  },
  exportErrorContainer: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#ffebee',
    borderRadius: 6,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
    flexDirection: 'row',
    alignItems: 'center'
  },
  exportErrorIcon: {
    fontSize: 18,
    marginRight: 8
  },
  exportErrorContent: {
    flex: 1
  },
  exportErrorTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d32f2f',
    marginBottom: 2
  },
  exportErrorMessage: {
    fontSize: 11,
    color: '#c62828',
    textAlign: 'right'
  },
  exportErrorClose: {
    fontSize: 18,
    color: '#d32f2f',
    marginLeft: 8,
    fontWeight: '700'
  }
});

export default ResultsDisplay;
```

## ./components/ui/Button.tsx
```typescript
/**
 * @file components/ui/Button.tsx
 * @description Modern Material Design 3 button component
 * Replaces generic buttons with professional styling
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../lib/design/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ModernButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
}) => {
  const { theme } = useTheme();

  const getSizeStyles = (): { padding: number; fontSize: number } => {
    switch (size) {
      case 'small':
        return { padding: theme.spacing.sm, fontSize: 12 };
      case 'large':
        return { padding: theme.spacing.lg, fontSize: 16 };
      case 'medium':
      default:
        return { padding: theme.spacing.md, fontSize: 14 };
    }
  };

  const getVariantStyles = (): { backgroundColor: string; color: string } => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? '#BDBDBD' : theme.colors.primary.main,
          color: '#FFFFFF',
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? '#E0E0E0' : theme.colors.secondary.main,
          color: '#FFFFFF',
        };
      case 'tertiary':
        return {
          backgroundColor: 'transparent',
          color: theme.colors.primary.main,
        };
      case 'danger':
        return {
          backgroundColor: disabled ? '#FFCCCC' : theme.colors.error.main,
          color: '#FFFFFF',
        };
      default:
        return {
          backgroundColor: theme.colors.primary.main,
          color: '#FFFFFF',
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const buttonStyle: ViewStyle = {
    paddingVertical: sizeStyles.padding,
    paddingHorizontal: sizeStyles.padding * 1.5,
    borderRadius: theme.borderRadius.md,
    backgroundColor: variantStyles.backgroundColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.6 : 1,
    ...(fullWidth && { width: '100%' }),
    ...(variant === 'tertiary' && {
      borderWidth: 1,
      borderColor: theme.colors.primary.main,
    }),
  };

  const textStyle: TextStyle = {
    fontSize: sizeStyles.fontSize,
    fontWeight: '600',
    color: variantStyles.color,
    marginLeft: icon ? theme.spacing.sm : 0,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[buttonStyle, style]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.color} />
      ) : (
        <>
          {icon}
          <Text style={textStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
});

export default ModernButton;
```

## ./components/ui/Card.tsx
```typescript
/**
 * @file components/ui/Card.tsx
 * @description Material Design 3 Card component for elevated content
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Pressable,
} from 'react-native';
import { useTheme } from '../../lib/design/theme';

export type CardElevation = 'flat' | 'low' | 'medium' | 'high';

export interface ModernCardProps {
  children: React.ReactNode;
  elevation?: CardElevation;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  elevation = 'medium',
  onPress,
  style,
  padding,
}) => {
  const { theme } = useTheme();

  const getElevationStyles = (): ViewStyle => {
    switch (elevation) {
      case 'flat':
        return {
          shadowColor: 'transparent',
          elevation: 0,
        };
      case 'low':
        return {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.15,
          shadowRadius: 2,
          elevation: 2,
        };
      case 'high':
        return {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 8,
        };
      case 'medium':
      default:
        return {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5,
        };
    }
  };

  const cardStyle: ViewStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.lg,
    padding: padding ?? theme.spacing.md,
    ...getElevationStyles(),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          style,
          {
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
  },
});

export default ModernCard;
```

## ./components/ui/DesignSystemComponents.tsx
```typescript
/**
 * @file components/ui/DesignSystemComponents.tsx
 * @description Reusable components built on the design system
 * Professional, consistent UI components following Material Design 3
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { useTheme, Spacing, BorderRadius, Shadows, Typography } from '../../lib/design/theme';

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
}) => {
  const { theme } = useTheme();
  const styles = createButtonStyles(theme);

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.neutral.light300;
    switch (variant) {
      case 'primary':
        return theme.colors.primary.main;
      case 'secondary':
        return theme.colors.secondary.main;
      case 'tertiary':
        return theme.colors.tertiary.main;
      case 'outlined':
        return 'transparent';
      default:
        return theme.colors.primary.main;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.neutral.light400;
    switch (variant) {
      case 'outlined':
        return theme.colors.primary.main;
      default:
        return '#ffffff';
    }
  };

  const buttonStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderWidth: variant === 'outlined' ? 2 : 0,
    borderColor: variant === 'outlined' ? theme.colors.primary.main : undefined,
    paddingHorizontal: size === 'small' ? 12 : size === 'large' ? 24 : 16,
    paddingVertical: size === 'small' ? 8 : size === 'large' ? 12 : 10,
    borderRadius: BorderRadius.md,
    ...Shadows.md,
  };

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      onPress={onPress}
      style={[styles.button, buttonStyle, style]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.buttonText, { color: getTextColor() }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// ============================================================================
// CARD COMPONENT
// ============================================================================

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
  const { theme } = useTheme();
  const styles = createCardStyles(theme);

  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={onPress}
      style={[styles.card, style]}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </TouchableOpacity>
  );
};

// ============================================================================
// HEADING COMPONENT
// ============================================================================

interface HeadingProps {
  level: 1 | 2 | 3;
  children: string;
  style?: TextStyle;
}

export const Heading: React.FC<HeadingProps> = ({ level, children, style }) => {
  const { theme } = useTheme();

  const getHeadingStyle = (): TextStyle => {
    switch (level) {
      case 1:
        return { ...Typography.headline.large, color: theme.colors.primary.dark };
      case 2:
        return { ...Typography.headline.medium, color: theme.colors.primary.dark100 };
      case 3:
        return { ...Typography.headline.small, color: theme.colors.primary.main };
      default:
        return { ...Typography.headline.medium, color: theme.colors.primary.dark100 };
    }
  };

  return (
    <Text style={[getHeadingStyle(), style]}>
      {children}
    </Text>
  );
};

// ============================================================================
// BODY TEXT COMPONENT
// ============================================================================

interface BodyProps {
  children: string;
  size?: 'small' | 'medium' | 'large';
  style?: TextStyle;
}

export const Body: React.FC<BodyProps> = ({ children, size = 'medium', style }) => {
  const { theme } = useTheme();

  const getBodyStyle = (): TextStyle => {
    switch (size) {
      case 'small':
        return { ...Typography.body.small, color: theme.colors.neutral.dark200 };
      case 'large':
        return { ...Typography.body.large, color: theme.colors.neutral.dark200 };
      case 'medium':
      default:
        return { ...Typography.body.medium, color: theme.colors.neutral.dark200 };
    }
  };

  return (
    <Text style={[getBodyStyle(), style]}>
      {children}
    </Text>
  );
};

// ============================================================================
// DIVIDER COMPONENT
// ============================================================================

interface DividerProps {
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({ style }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          height: 1,
          backgroundColor: theme.colors.neutral.light200,
          marginVertical: Spacing.md,
        },
        style,
      ]}
    />
  );
};

// ============================================================================
// STYLES
// ============================================================================

const createButtonStyles = (theme: any) =>
  StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
      minWidth: 120,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '600',
      letterSpacing: 0.5,
    },
  });

const createCardStyles = (theme: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.neutral.white,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      ...Shadows.md,
    },
  });

export default {
  Button,
  Card,
  Heading,
  Body,
  Divider,
};
```

## ./components/ui/Input.tsx
```typescript
/**
 * @file components/ui/Input.tsx
 * @description Material Design 3 text input component
 */

import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
} from 'react-native';
import { useTheme } from '../../lib/design/theme';

export interface ModernInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  onIconPress?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  maxLength?: number;
}

export const ModernInput: React.FC<ModernInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  error = false,
  errorMessage,
  disabled = false,
  required = false,
  icon,
  onIconPress,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  maxLength,
}) => {
  const [focused, setFocused] = useState(false);
  const { theme } = useTheme();

  const containerStyle: ViewStyle = {
    marginBottom: theme.spacing.md,
  };

  const labelStyle: TextStyle = {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: error ? theme.colors.error.main : theme.colors.neutral.light400,
    marginBottom: theme.spacing.xs,
  };

  const inputContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: multiline ? 'flex-start' : 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: multiline ? theme.spacing.md : 0,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    backgroundColor: disabled ? '#F5F5F5' : '#FFFFFF',
    borderColor: error
      ? theme.colors.error.main
      : focused
      ? theme.colors.primary.main
      : theme.colors.secondary.main,
    marginTop: theme.spacing.xs,
  };

  const textInputStyle: TextStyle = {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.neutral.dark300,
    paddingVertical: multiline ? 0 : theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  };

  const errorStyle: TextStyle = {
    fontSize: 12,
    lineHeight: 16,
    color: theme.colors.error.main,
    marginTop: theme.spacing.xs,
  };

  return (
    <View style={[containerStyle, style]}>
      {label && (
        <Text style={labelStyle}>
          {label}
          {required && <Text style={{ color: theme.colors.error.main }}>*</Text>}
        </Text>
      )}
      <View style={inputContainerStyle}>
        <TextInput
          style={[textInputStyle, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.neutral.light400}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          editable={!disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
        />
        {icon && (
          <Pressable onPress={onIconPress} disabled={!onIconPress}>
            {icon}
          </Pressable>
        )}
      </View>
      {error && errorMessage && <Text style={errorStyle}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default ModernInput;
```

## ./lib/context/SettingsContext.tsx
```typescript
/**
 * @file lib/context/SettingsContext.ts
 * @description Global settings context for language, theme, and preferences
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../i18n';
import { ThemeMode } from '../design/theme';

export interface SettingsState {
  language: Language;
  themeMode: ThemeMode;
  notifications: boolean;
  roundingDecimals: number;
  darkModeEnabled: boolean;
  autoSave: boolean;
}

export type SettingsAction =
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_THEME'; payload: ThemeMode }
  | { type: 'SET_NOTIFICATIONS'; payload: boolean }
  | { type: 'SET_ROUNDING'; payload: number }
  | { type: 'SET_AUTO_SAVE'; payload: boolean }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'LOAD_SETTINGS'; payload: Partial<SettingsState> };

export const defaultSettings: SettingsState = {
  language: 'en',
  themeMode: 'light',
  notifications: true,
  roundingDecimals: 2,
  darkModeEnabled: false,
  autoSave: true,
};

const settingsReducer = (
  state: SettingsState,
  action: SettingsAction
): SettingsState => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_THEME':
      return { ...state, themeMode: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'SET_ROUNDING':
      return { ...state, roundingDecimals: action.payload };
    case 'SET_AUTO_SAVE':
      return { ...state, autoSave: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkModeEnabled: !state.darkModeEnabled };
    case 'LOAD_SETTINGS':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

interface SettingsContextType {
  state: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
  setLanguage: (language: Language) => void;
  setTheme: (theme: ThemeMode) => void;
  setNotifications: (enabled: boolean) => void;
  setRoundingDecimals: (decimals: number) => void;
  toggleDarkMode: () => void;
  setAutoSave: (enabled: boolean) => void;
  saveSettings: () => Promise<void>;
  loadSettings: () => Promise<void>;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(settingsReducer, defaultSettings);

  const setLanguage = useCallback((language: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  }, []);

  const setTheme = useCallback((theme: ThemeMode) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  }, []);

  const setNotifications = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_NOTIFICATIONS', payload: enabled });
  }, []);

  const setRoundingDecimals = useCallback((decimals: number) => {
    dispatch({ type: 'SET_ROUNDING', payload: decimals });
  }, []);

  const toggleDarkMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  }, []);

  const setAutoSave = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_AUTO_SAVE', payload: enabled });
  }, []);

  const saveSettings = useCallback(async () => {
    try {
      await AsyncStorage.setItem('@merath_settings', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [state]);

  const loadSettings = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem('@merath_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_SETTINGS', payload: parsed });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        state,
        dispatch,
        setLanguage,
        setTheme,
        setNotifications,
        setRoundingDecimals,
        toggleDarkMode,
        setAutoSave,
        saveSettings,
        loadSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (typeof context === 'undefined') {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
```

## ./lib/context/ThemeProvider.tsx
```typescript
/**
 * @file lib/context/ThemeProvider.tsx
 * @description Theme provider component with light/dark mode support
 * Manages theme context and persists preferences to AsyncStorage
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, ThemeMode, Theme, ThemeContext as BaseThemeContext } from '../design/theme';

interface ThemeContextValue {
  mode: ThemeMode;
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContextValue = createContext<ThemeContextValue | undefined>(undefined);

type ThemeAction =
  | { type: 'SET_MODE'; payload: ThemeMode }
  | { type: 'TOGGLE_THEME' }
  | { type: 'LOAD_FROM_STORAGE'; payload: ThemeMode };

const themeReducer = (state: ThemeMode, action: ThemeAction): ThemeMode => {
  switch (action.type) {
    case 'SET_MODE':
      return action.payload;
    case 'TOGGLE_THEME':
      return state === 'light' ? 'dark' : 'light';
    case 'LOAD_FROM_STORAGE':
      return action.payload;
    default:
      return state;
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const initialMode: ThemeMode =
    systemScheme === 'dark' ? 'dark' : 'light';

  const [mode, dispatch] = useReducer(themeReducer, initialMode);
  const theme = mode === 'light' ? lightTheme : darkTheme;

  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const saved = await AsyncStorage.getItem('@merath_theme_mode');
        if (saved === 'light' || saved === 'dark') {
          dispatch({ type: 'LOAD_FROM_STORAGE', payload: saved });
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  // Save theme preference when it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem('@merath_theme_mode', mode);
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    };

    saveThemePreference();
  }, [mode]);

  const toggleTheme = useCallback(() => {
    dispatch({ type: 'TOGGLE_THEME' });
  }, []);

  const setThemeMode = useCallback((newMode: ThemeMode) => {
    dispatch({ type: 'SET_MODE', payload: newMode });
  }, []);

  const value: ThemeContextValue = {
    mode,
    theme,
    isDark: mode === 'dark',
    toggleTheme,
    setThemeMode,
  };

  return (
    <ThemeContextValue.Provider value={value}>
      {children}
    </ThemeContextValue.Provider>
  );
};

export const useAppTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContextValue);
  if (!context) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return context;
};
```

## ./lib/design/theme.ts
```typescript
/**
 * @file lib/design/theme.ts
 * @description World-class Material Design 3 theme system with light/dark mode
 * Professional design system for Merath calculator app
 * Includes: color palettes, typography, spacing, shadows, animations
 */

import { useColorScheme } from 'react-native';
import { createContext, useContext } from 'react';

// ============================================================================
// COMPREHENSIVE COLOR PALETTE - Material Design 3
// ============================================================================

export const Colors = {
  // Primary Palette - Islamic Green (Trust, growth, nature)
  primary: {
    light: '#f0f9f6',
    lighter: '#d4f1e9',
    light50: '#a8e4d6',
    light100: '#7dd4be',
    light200: '#5cc9ac',
    main: '#2e7d32',        // Primary color
    dark100: '#2d6b2a',
    dark200: '#2a5a23',
    dark300: '#27491d',
    dark: '#1f3817',
  },
  
  // Secondary Palette - Professional Blue (Calm, stability)
  secondary: {
    light: '#f0f5ff',
    lighter: '#d9eaff',
    light50: '#b3d5ff',
    light100: '#8dbfff',
    light200: '#67aaff',
    main: '#4f9eff',        // Secondary color
    dark100: '#4680e6',
    dark200: '#3d62cd',
    dark300: '#3a59bd',
    dark: '#33439f',
  },
  
  // Tertiary Palette - Warm Gold (Energy, emphasis)
  tertiary: {
    light: '#fffbf0',
    lighter: '#ffe8cc',
    light50: '#ffd699',
    light100: '#ffc266',
    light200: '#ffb340',
    main: '#ffa500',        // Tertiary color
    dark100: '#ff9500',
    dark200: '#ff8500',
    dark300: '#e67000',
    dark: '#b35900',
  },
  
  // Neutral Palette - Professional grays
  neutral: {
    white: '#ffffff',
    light50: '#f9fafb',
    light100: '#f3f4f6',
    light200: '#e5e7eb',
    light300: '#d1d5db',
    light400: '#9ca3af',
    main: '#6b7280',
    dark100: '#4b5563',
    dark200: '#374151',
    dark300: '#1f2937',
    black: '#111827',
  },
  
  // Background & Surface colors
  background: {
    light: '#ffffff',
    lightVariant: '#f9fafb',
    dark: '#0f1419',
    darkVariant: '#1a1f2e',
  },
  
  // Semantic colors
  success: {
    light: '#e8f5e9',
    main: '#4caf50',
    dark: '#2e7d32',
  },
  warning: {
    light: '#fff3e0',
    main: '#ff9800',
    dark: '#e65100',
  },
  error: {
    light: '#ffebee',
    main: '#f44336',
    dark: '#d32f2f',
  },
  info: {
    light: '#e3f2fd',
    main: '#2196f3',
    dark: '#0d47a1',
  },
};

// ============================================================================
// TYPOGRAPHY SYSTEM - Professional hierarchy
// ============================================================================

export const Typography = {
  // Display - Large prominent headlines
  display: {
    large: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '700' as const,
      letterSpacing: 0,
    },
    medium: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '700' as const,
      letterSpacing: 0,
    },
    small: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '700' as const,
      letterSpacing: 0,
    },
  },

  // Headline - Section headings
  headline: {
    large: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '700' as const,
      letterSpacing: 0,
    },
    medium: {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: '700' as const,
      letterSpacing: 0,
    },
    small: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '700' as const,
      letterSpacing: 0,
    },
  },

  // Title - Component titles
  title: {
    large: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '700' as const,
      letterSpacing: 0.15,
    },
    medium: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600' as const,
      letterSpacing: 0.1,
    },
    small: {
      fontSize: 12,
      lineHeight: 18,
      fontWeight: '600' as const,
      letterSpacing: 0.1,
    },
  },

  // Body - Main content text
  body: {
    large: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
      letterSpacing: 0.5,
    },
    medium: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400' as const,
      letterSpacing: 0.25,
    },
    small: {
      fontSize: 12,
      lineHeight: 18,
      fontWeight: '400' as const,
      letterSpacing: 0.4,
    },
  },

  // Label - Buttons, labels, small text
  label: {
    large: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500' as const,
      letterSpacing: 0.1,
    },
    medium: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500' as const,
      letterSpacing: 0.5,
    },
    small: {
      fontSize: 11,
      lineHeight: 16,
      fontWeight: '500' as const,
      letterSpacing: 0.5,
    },
  },
};

// ============================================================================
// SPACING SYSTEM - 8pt base grid
// ============================================================================

export const Spacing = {
  xs: 4,      // 4px
  sm: 8,      // 8px
  md: 12,     // 12px
  lg: 16,     // 16px
  xl: 24,     // 24px
  xxl: 32,    // 32px
  xxxl: 48,   // 48px
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// ============================================================================
// SHADOWS
// ============================================================================

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};

// ============================================================================
// ANIMATIONS - Transition timings
// ============================================================================

export const Animations = {
  quick: 150,     // Quick interactions
  standard: 300,  // Standard animations
  slow: 500,      // Slower animations
};

// ============================================================================
// COMPONENT SPECIFICATIONS
// ============================================================================

export const Components = {
  button: {
    height: 44,
    minWidth: 120,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  input: {
    height: 44,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  card: {
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
};

// ============================================================================
// THEME HOOK - With context support for manual theme override
// ============================================================================

export const ThemeContext = createContext<{
  mode: ThemeMode;
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
} | null>(null);

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary: {
    light: string;
    lighter: string;
    light50: string;
    light100: string;
    light200: string;
    main: string;
    dark100: string;
    dark200: string;
    dark300: string;
    dark: string;
  };
  secondary: typeof Colors.secondary;
  tertiary: typeof Colors.tertiary;
  neutral: typeof Colors.neutral;
  background: typeof Colors.background;
  success: typeof Colors.success;
  warning: typeof Colors.warning;
  error: typeof Colors.error;
  info: typeof Colors.info;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  typography: typeof Typography;
  spacing: typeof Spacing;
  borderRadius: typeof BorderRadius;
  shadows: typeof Shadows;
  animations: typeof Animations;
  components: typeof Components;
}

// ============================================================================
// LIGHT THEME
// ============================================================================

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    ...Colors,
  } as ThemeColors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  animations: Animations,
  components: Components,
};

// ============================================================================
// DARK THEME
// ============================================================================

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    ...Colors,
  } as ThemeColors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  animations: Animations,
  components: Components,
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback to system theme if context not available
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';
    const theme = isDark ? darkTheme : lightTheme;
    return {
      mode: isDark ? 'dark' as const : 'light' as const,
      theme,
      isDark,
      toggleTheme: () => {},
    };
  }
  return context;
}
```

## ./lib/errors/ErrorHandler.ts
```typescript
/**
 * Comprehensive Error Handler
 * Phase 1: Advanced Error Management & User Feedback
 * 
 * Provides centralized error handling with user-friendly messages
 * and detailed logging for debugging
 */

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  severity: ErrorSeverity;
  timestamp: Date;
  context?: Record<string, any>;
  stack?: string;
}

export class ErrorLogger {
  private static errors: AppError[] = [];
  private static maxErrors = 1000;

  /**
   * Log an error with context
   */
  static logError(
    code: string,
    message: string,
    userMessage: string,
    severity: ErrorSeverity = 'error',
    context?: Record<string, any>,
    stack?: string
  ): AppError {
    const error: AppError = {
      code,
      message,
      userMessage,
      severity,
      timestamp: new Date(),
      context,
      stack,
    };

    // Store in memory
    this.errors.push(error);

    // Keep only last N errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log to console in development
    if (__DEV__) {
      console.error(`[${severity.toUpperCase()}] ${code}`, {
        message,
        userMessage,
        context,
        stack,
      });
    }

    return error;
  }

  /**
   * Get all logged errors
   */
  static getErrors(
    severity?: ErrorSeverity,
    limit?: number
  ): AppError[] {
    let filtered = this.errors;

    if (severity) {
      filtered = filtered.filter(e => e.severity === severity);
    }

    if (limit) {
      filtered = filtered.slice(-limit);
    }

    return filtered;
  }

  /**
   * Clear error log
   */
  static clearErrors(): void {
    this.errors = [];
  }

  /**
   * Export errors as JSON
   */
  static exportAsJSON(): string {
    return JSON.stringify(this.errors, null, 2);
  }
}

/**
 * Custom Error Class
 */
export class CalculationError extends Error {
  constructor(
    public code: string,
    public userMessage: string,
    message: string,
    severity: ErrorSeverity = 'error'
  ) {
    super(message);
    this.name = 'CalculationError';

    ErrorLogger.logError(code, message, userMessage, severity, {}, new Error().stack);
  }
}

export class ValidationError extends Error {
  constructor(
    public field: string,
    public userMessage: string,
    message: string
  ) {
    super(message);
    this.name = 'ValidationError';

    ErrorLogger.logError(
      `VALIDATION_ERROR:${field}`,
      message,
      userMessage,
      'warning',
      { field },
      new Error().stack
    );
  }
}

export class EstateCalculationError extends CalculationError {
  constructor(message: string, userMessage: string) {
    super('ESTATE_CALC_ERROR', userMessage, message, 'error');
  }
}

export class HeirValidationError extends ValidationError {
  constructor(field: string, userMessage: string, message: string) {
    super(field, userMessage, message);
  }
}

/**
 * Error Recovery Strategies
 */
export class ErrorRecovery {
  static async handleEstateError(error: Error): Promise<void> {
    if (error instanceof EstateCalculationError) {
      console.warn(`Estate Calculation Issue: ${error.userMessage}`);
      // Notify user
      return;
    }

    // Generic estate error
    ErrorLogger.logError(
      'ESTATE_ERROR',
      error.message,
      'Unable to process estate data. Please check your inputs.',
      'error'
    );
  }

  static async handleHeirError(error: Error): Promise<void> {
    if (error instanceof HeirValidationError) {
      console.warn(`Heir Validation Issue: ${error.userMessage}`);
      return;
    }

    ErrorLogger.logError(
      'HEIR_ERROR',
      error.message,
      'Unable to process heir data. Please verify the information.',
      'error'
    );
  }

  static async handleCalculationError(error: Error): Promise<void> {
    if (error instanceof CalculationError) {
      console.error(`Calculation Error: ${error.userMessage}`);
      return;
    }

    ErrorLogger.logError(
      'CALCULATION_ERROR',
      error.message,
      'An error occurred during calculation. Please try again.',
      'critical'
    );
  }
}

/**
 * Error Context Manager
 */
export class ErrorContext {
  private context: Record<string, any> = {};

  setContext(key: string, value: any): void {
    this.context[key] = value;
  }

  getContext(): Record<string, any> {
    return { ...this.context };
  }

  clear(): void {
    this.context = {};
  }
}

// Declare __DEV__ for development mode detection
declare const __DEV__: boolean;
```

## ./lib/export/PDFExporter.ts
```typescript
/**
 * PDF Export Service
 * Phase 1: Complete PDF Export Functionality
 * 
 * Generates professional PDF reports of inheritance calculations
 */

import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { CalculationResult, HeirShare } from '../inheritance/types';

export interface PDFExportOptions {
  filename?: string;
  includeCalculationSteps?: boolean;
  includeAuditLog?: boolean;
  theme?: 'light' | 'dark';
}

export class PDFExporter {
  /**
   * Generate HTML for PDF
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
            border-left: 4px solid #1F71BA;
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
            border-left: 4px solid #FF9800;
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
            text-align: right;
            font-weight: bold;
          }

          td {
            padding: 12px;
            border-bottom: 1px solid ${borderColor};
            text-align: right;
          }

          tr:nth-child(even) {
            background-color: #f9f9f9;
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
            border-left: 4px solid #1F71BA;
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
            margin-left: 40px;
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
            border-left: 4px solid #FF6F00;
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
              <span class="metadata-value">${result.calculationTime?.toFixed(2)} ms</span>
            </div>
            <div class="metadata-row">
              <span class="metadata-label">حالة الحساب:</span>
              <span class="metadata-value">${result.success ? '✓ نجح' : '✗ فشل'}</span>
            </div>
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
                  <th>المبلغ (ر.س)</th>
                  <th>النسبة المئوية</th>
                  <th>الحصة</th>
                  <th>الوارث</th>
                </tr>
              </thead>
              <tbody>
                ${result.shares
                  .map(
                    (share: HeirShare) => `
                  <tr>
                    <td class="amount">${share.amount.toFixed(2)}</td>
                    <td class="percentage">${(share.percentage || 0).toFixed(2)}%</td>
                    <td>
                      ${
                        share.fraction
                          ? `${share.fraction.numerator}/${share.fraction.denominator}`
                          : '-'
                      }
                    </td>
                    <td class="heir-name">${share.name}</td>
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
                  ${result.shares.reduce((sum: number, s: HeirShare) => sum + s.amount, 0).toFixed(2)} ر.س
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
                      <span class="step-title">${step.description || 'خطوة'}</span>
                    </div>
                    <div class="step-content">
                      ${step.detail || ''}
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

      return pdf.uri;
    } catch (error) {
      console.error('PDF Export Error:', error);
      throw new Error('Failed to generate PDF: ' + (error as Error).message);
    }
  }

  /**
   * Share PDF with other apps
   */
  static async sharePDF(pdfUri: string, filename: string = 'inheritance-report'): Promise<void> {
    try {
      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'مشاركة تقرير التركة',
      });
    } catch (error) {
      console.error('PDF Share Error:', error);
      throw new Error('Failed to share PDF: ' + (error as Error).message);
    }
  }

  /**
   * Save PDF to device storage
   */
  static async savePDF(pdfUri: string, filename: string): Promise<string> {
    try {
      // Create a safe filename
      const safeFilename = filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      
      // Use the PDF URI directly (it's already saved by Print.printToFileAsync)
      // The URI returned is already in the app's cache/document directory
      return pdfUri;
    } catch (error) {
      console.error('PDF Save Error:', error);
      throw new Error('Failed to save PDF: ' + (error as Error).message);
    }
  }

  /**
   * Generate and share PDF
   */
  static async generateAndShare(
    result: CalculationResult,
    options: PDFExportOptions = {}
  ): Promise<void> {
    try {
      const filename = options.filename || `merath-${Date.now()}`;

      // Generate PDF
      const pdfUri = await this.exportToPDF(result, { ...options, filename });

      // Share PDF
      await this.sharePDF(pdfUri, filename);
    } catch (error) {
      console.error('Generate and Share Error:', error);
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
    try {
      const filename = options.filename || `merath-${Date.now()}`;

      // Generate PDF
      const pdfUri = await this.exportToPDF(result, { ...options, filename });

      // Save PDF
      const savedPath = await this.savePDF(pdfUri, filename);

      return savedPath;
    } catch (error) {
      console.error('Generate and Save Error:', error);
      throw error;
    }
  }
}
```

## ./lib/i18n/index.ts
```typescript
/**
 * @file lib/i18n/index.ts
 * @description Internationalization setup with i18next
 * Supports: English, Urdu, Turkish, French, German, Arabic
 */

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as en from './locales/en.json';
import * as ur from './locales/ur.json';
import * as tr from './locales/tr.json';
import * as fr from './locales/fr.json';
import * as de from './locales/de.json';
import * as ar from './locales/ar.json';

// Language resources
const resources = {
  en: { translation: en },
  ur: { translation: ur },
  tr: { translation: tr },
  fr: { translation: fr },
  de: { translation: de },
  ar: { translation: ar },
};

i18next
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: 'en',
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18next;

export const languages = {
  en: { name: 'English', nativeName: 'English', rtl: false },
  ur: { name: 'Urdu', nativeName: 'اردو', rtl: true },
  tr: { name: 'Turkish', nativeName: 'Türkçe', rtl: false },
  fr: { name: 'French', nativeName: 'Français', rtl: false },
  de: { name: 'German', nativeName: 'Deutsch', rtl: false },
  ar: { name: 'Arabic', nativeName: 'العربية', rtl: true },
} as const;

export type Language = keyof typeof languages;
```

## ./lib/inheritance/audit-log.ts
```typescript
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
```

## ./lib/inheritance/audit-trail-manager.ts
```typescript
/**
 * Audit Trail Manager
 * Phase 5.1: Advanced Features - Audit Trail Data Management
 *
 * Provides utilities for filtering, sorting, and searching
 * calculation history
 */

import { AuditLogEntry } from './audit-log';

export interface FilteredAuditResult {
  entries: AuditLogEntry[];
  total: number;
  filtered: number;
}

export interface AuditTrailFilters {
  madhab?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
  minEstate?: number;
  maxEstate?: number;
}

export interface SortOption {
  field: 'timestamp' | 'madhab' | 'total' | 'confidence';
  order: 'asc' | 'desc';
}

/**
 * Audit Trail Manager - Handles filtering, sorting, and search
 */
export class AuditTrailManager {
  /**
   * Filter audit log entries by various criteria
   */
  static filterEntries(
    entries: AuditLogEntry[],
    filters: AuditTrailFilters
  ): FilteredAuditResult {
    let filtered = [...entries];

    // Filter by madhab
    if (filters.madhab) {
      filtered = filtered.filter(
        (entry) => entry.madhab?.toLowerCase() === filters.madhab?.toLowerCase()
      );
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(
        (entry) => new Date(entry.timestamp) >= filters.dateFrom!
      );
    }

    if (filters.dateTo) {
      const endOfDay = new Date(filters.dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (entry) => new Date(entry.timestamp) <= endOfDay
      );
    }

    // Filter by estate amount range
    if (filters.minEstate !== undefined) {
      filtered = filtered.filter(
        (entry) => (entry.estate?.total || 0) >= filters.minEstate!
      );
    }

    if (filters.maxEstate !== undefined) {
      filtered = filtered.filter(
        (entry) => (entry.estate?.total || 0) <= filters.maxEstate!
      );
    }

    // Search term (searches in madhab and description)
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter((entry) => {
        const madhab = entry.madhab?.toLowerCase() || '';
        const notes = entry.metadata?.notes?.toLowerCase() || '';
        return madhab.includes(term) || notes.includes(term);
      });
    }

    return {
      entries: filtered,
      total: entries.length,
      filtered: filtered.length,
    };
  }

  /**
   * Sort audit log entries
   */
  static sortEntries(
    entries: AuditLogEntry[],
    sortOption: SortOption
  ): AuditLogEntry[] {
    const sorted = [...entries];

    sorted.sort((a, b) => {
      let compareValue = 0;

      switch (sortOption.field) {
        case 'timestamp':
          compareValue =
            new Date(a.timestamp).getTime() -
            new Date(b.timestamp).getTime();
          break;

        case 'madhab':
          compareValue = (a.madhab || '').localeCompare(b.madhab || '', 'ar');
          break;

        case 'total':
          compareValue = (a.estate?.total || 0) - (b.estate?.total || 0);
          break;

        case 'confidence':
          compareValue = (a.result?.confidence || 0) - (b.result?.confidence || 0);
          break;

        default:
          compareValue = 0;
      }

      return sortOption.order === 'asc' ? compareValue : -compareValue;
    });

    return sorted;
  }

  /**
   * Get unique madhabs from entries
   */
  static getUniqueMadhabs(entries: AuditLogEntry[]): string[] {
    const madhabs = new Set(entries.map((e) => e.madhab).filter(Boolean));
    return Array.from(madhabs).sort();
  }

  /**
   * Get statistics for audit entries
   */
  static getStatistics(entries: AuditLogEntry[]): {
    totalCalculations: number;
    averageEstate: number;
    averageConfidence: number;
    dateRange: { from: Date; to: Date } | null;
    madhabs: { [key: string]: number };
  } {
    if (entries.length === 0) {
      return {
        totalCalculations: 0,
        averageEstate: 0,
        averageConfidence: 0,
        dateRange: null,
        madhabs: {},
      };
    }

    const madhabs: { [key: string]: number } = {};
    let totalEstate = 0;
    let totalConfidence = 0;
    let minDate: Date | null = null;
    let maxDate: Date | null = null;

    entries.forEach((entry) => {
      // Count madhabs
      if (entry.madhab) {
        madhabs[entry.madhab] = (madhabs[entry.madhab] || 0) + 1;
      }

      // Sum estate and confidence
      totalEstate += entry.estate?.total || 0;
      totalConfidence += entry.result?.confidence || 0;

      // Track date range
      const entryDate = new Date(entry.timestamp);
      if (!minDate || entryDate < minDate) {
        minDate = entryDate;
      }
      if (!maxDate || entryDate > maxDate) {
        maxDate = entryDate;
      }
    });

    return {
      totalCalculations: entries.length,
      averageEstate: totalEstate / entries.length,
      averageConfidence: totalConfidence / entries.length,
      dateRange:
        minDate && maxDate ? { from: minDate, to: maxDate } : null,
      madhabs,
    };
  }

  /**
   * Export entries as JSON
   */
  static exportAsJSON(entries: AuditLogEntry[]): string {
    return JSON.stringify(
      {
        exportDate: new Date().toISOString(),
        totalEntries: entries.length,
        entries,
      },
      null,
      2
    );
  }

  /**
   * Format audit entry for display
   */
  static formatEntryForDisplay(entry: AuditLogEntry): {
    date: string;
    time: string;
    madhab: string;
    estate: string;
    heirsCount: number;
    confidence: string;
  } {
    const date = new Date(entry.timestamp);
    const dateStr = date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeStr = date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      date: dateStr,
      time: timeStr,
      madhab: entry.madhab || 'غير محدد',
      estate: `${(entry.estate?.total || 0).toFixed(0)} ر.س`,
      heirsCount: Object.values(entry.heirs || {}).reduce(
        (sum: number, count: number | undefined) => sum + (count || 0),
        0
      ),
      confidence: `${(entry.result?.confidence || 0).toFixed(0)}%`,
    };
  }
}

export default AuditTrailManager;
```

## ./lib/inheritance/constants.ts
```typescript
/**
 * قاعدة البيانات الفقهية الشاملة
 * Comprehensive Fiqh Database
 * 
 * تحتوي على جميع القواعس والأحكام الفقهية للمذاهب الأربعة
 */

import { MadhhabConfig, MadhhabRules } from './types';

export const FIQH_DATABASE = {
  // ====== معلومات المذاهب ======
  madhabs: {
    shafii: {
      code: 'shafii' as const,
      name: 'المذهب الشافعي',
      description: 'المذهب الشافعي - من أشهر المذاهب الإسلامية',
      color: '#FF6B6B',
      icon: '🕌',
      rules: {
        grandfather_with_siblings: 'hijab' as const,
        mother_with_father_children: 'sixth' as const,
        mother_with_father_only: 'third' as const,
        spouse_radd: false,
        umariyyah_rule: 'first' as const
      } as MadhhabRules
    },
    hanafi: {
      code: 'hanafi' as const,
      name: 'المذهب الحنفي',
      description: 'المذهب الحنفي - الأكثر اتباعاً',
      color: '#4ECDC4',
      icon: '📖',
      rules: {
        grandfather_with_siblings: 'musharak' as const,
        mother_with_father_children: 'sixth' as const,
        mother_with_father_only: 'third' as const,
        spouse_radd: true,
        umariyyah_rule: 'first' as const
      } as MadhhabRules
    },
    maliki: {
      code: 'maliki' as const,
      name: 'المذهب المالكي',
      description: 'المذهب المالكي - المذهب الرسمي للمغرب',
      color: '#45B7D1',
      icon: '⚖️',
      rules: {
        grandfather_with_siblings: 'musharak' as const,
        mother_with_father_children: 'sixth' as const,
        mother_with_father_only: 'third' as const,
        spouse_radd: true,
        umariyyah_rule: 'first' as const
      } as MadhhabRules
    },
    hanbali: {
      code: 'hanbali' as const,
      name: 'المذهب الحنبلي',
      description: 'المذهب الحنبلي - المذهب الرسمي للسعودية',
      color: '#F7DC6F',
      icon: '📜',
      rules: {
        grandfather_with_siblings: 'hijab' as const,
        mother_with_father_children: 'sixth' as const,
        mother_with_father_only: 'third' as const,
        spouse_radd: false,
        umariyyah_rule: 'first' as const
      } as MadhhabRules
    }
  } as Record<string, MadhhabConfig>,

  // ====== الفروض الأساسية ======
  provisions: {
    husband: {
      name: 'الزوج',
      arabicName: 'الزوج',
      shares: {
        without_children: { numerator: 1, denominator: 2 },  // 1/2
        with_children: { numerator: 1, denominator: 4 }      // 1/4
      }
    },
    wife: {
      name: 'الزوجة',
      arabicName: 'الزوجة',
      shares: {
        without_children: { numerator: 1, denominator: 4 },  // 1/4
        with_children: { numerator: 1, denominator: 8 }      // 1/8
      }
    },
    son: {
      name: 'الابن',
      arabicName: 'الابن',
      type: 'asaba',  // عصبة
      shares: {}
    },
    daughter: {
      name: 'البنت',
      arabicName: 'البنت',
      shares: {
        alone: { numerator: 1, denominator: 2 },              // 1/2
        with_sister: { numerator: 2, denominator: 3 }        // 2/3
      }
    },
    father: {
      name: 'الأب',
      arabicName: 'الأب',
      shares: {
        with_children: { numerator: 1, denominator: 6 },     // 1/6
        without_children: 'asaba'                             // عصبة
      }
    },
    mother: {
      name: 'الأم',
      arabicName: 'الأم',
      shares: {
        with_children: { numerator: 1, denominator: 6 },     // 1/6
        without_children: { numerator: 1, denominator: 3 }   // 1/3
      }
    },
    grandfather: {
      name: 'الجد',
      arabicName: 'الجد الأب',
      shares: {
        with_children: { numerator: 1, denominator: 6 },     // 1/6
        without_children: 'asaba'                             // عصبة
      }
    },
    grandmother: {
      name: 'الجدة',
      arabicName: 'الجدة الأب',
      shares: {
        default: { numerator: 1, denominator: 6 }            // 1/6
      }
    },
    full_brother: {
      name: 'الأخ الشقيق',
      arabicName: 'الأخ الشقيق',
      type: 'asaba'
    },
    full_sister: {
      name: 'الأخت الشقيقة',
      arabicName: 'الأخت الشقيقة',
      shares: {
        alone: { numerator: 1, denominator: 2 },              // 1/2
        with_sister: { numerator: 2, denominator: 3 }        // 2/3
      }
    }
  },

  // ====== قواعس الحجب ======
  hijabRules: {
    shafii: [
      {
        hijabber: 'son',
        hijabbed: ['full_brother', 'full_sister', 'half_brother_paternal', 'half_sister_paternal', 'nephew_from_brother', 'niece_from_brother'],
        type: 'complete' as const
      },
      {
        hijabber: 'father',
        hijabbed: ['grandfather'],
        type: 'complete' as const
      },
      {
        hijabber: 'mother',
        hijabbed: ['grandmother'],
        type: 'complete' as const
      },
      {
        hijabber: 'father',
        hijabbed: ['mother'],
        type: 'partial' as const,
        reason: 'from_third_to_sixth'
      }
    ],
    hanafi: [
      {
        hijabber: 'son',
        hijabbed: ['full_brother', 'half_brother_paternal'],
        type: 'complete' as const
      },
      {
        hijabber: 'father',
        hijabbed: ['grandfather'],
        type: 'complete' as const
      }
    ],
    maliki: [
      {
        hijabber: 'son',
        hijabbed: ['full_brother', 'half_brother_paternal'],
        type: 'complete' as const
      },
      {
        hijabber: 'father',
        hijabbed: ['grandfather'],
        type: 'complete' as const
      }
    ],
    hanbali: [
      {
        hijabber: 'son',
        hijabbed: ['full_brother', 'half_brother_paternal'],
        type: 'complete' as const
      },
      {
        hijabber: 'father',
        hijabbed: ['grandfather'],
        type: 'complete' as const
      }
    ]
  },

  // ====== الحالات الخاصة ======
  specialCases: {
    umariyyah: {
      description: 'العمرية: حالة خاصة للأم مع الأب والزوج/الزوجة',
      shafii: 'third_of_remainder' as const,
      hanafi: 'third_of_remainder' as const,
      maliki: 'sixth' as const,
      hanbali: 'third_of_remainder' as const
    },
    awl: {
      description: 'العول: عندما يتجاوز مجموع الفروض التركة'
    },
    radd: {
      description: 'الرد: عندما يبقى من التركة بعد الفروض'
    }
  },

  // ====== الثوابت الحسابية ======
  constants: {
    PRECISION: 10,           // دقة الحساب العشرية
    TOLERANCE: 0.0001,       // هامش التفاوت المسموح
    MIN_AMOUNT: 0.01,        // الحد الأدنى للمبلغ
    DEFAULT_ESTATE: 120000   // التركة الافتراضية للاختبار
  }
};

// ====== دالة مساعدة للحصول على معلومات المذهب ======
export function getMadhhabConfig(madhab: string): MadhhabConfig | null {
  return (FIQH_DATABASE.madhabs as any)[madhab] || null;
}

// ====== دالة مساعدة للحصول على قواعس الحجب ======
export function getHijabRules(madhab: string): any[] {
  return (FIQH_DATABASE.hijabRules as any)[madhab] || [];
}

// ====== دالة مساعدة للتحقق من صحة المذهب ======
export function isValidMadhab(madhab: string): boolean {
  return madhab in FIQH_DATABASE.madhabs;
}
```

## ./lib/inheritance/enhanced-engine-complete.ts
```typescript
/**
 * Enhanced Inheritance Calculation Engine - Complete Islamic Law Implementation
 * Full implementation of all features from original Merath_Cluade_Pro7.html
 * 
 * تحتوي على جميع قواعد الفروض والعصبات والحالات الخاصة الكاملة
 * شاملة لجميع المذاهب الأربعة (حنفي، مالكي، شافعي، حنبلي)
 */

import { FractionClass } from './fraction';
import type { EstateData, HeirsData, MadhhabType, CalculationResult, HeirShare } from './types';
import { HijabSystem } from './hijab-system';

interface HeirShareObject {
  key: string;
  name: string;
  type: string;
  fraction: FractionClass;
  count: number;
  reason: string;
  addToExisting?: boolean;
}

// Add state interface with confidenceFactors
interface EngineState {
  blockedHeirs: string[];
  hijabTypes: string[];
  awlApplied: boolean;
  raddApplied: boolean;
  bloodRelativesApplied: boolean;
  confidenceFactors: string[];
}

export class EnhancedInheritanceCalculationEngine {
  private madhab: MadhhabType;
  private estate: EstateData;
  private heirs: HeirsData;
  private hijabSystem: HijabSystem;
  private steps: Array<{ step: string; description: string; code: string; data?: unknown }> = [];
  private specialCases: Array<{ type: string; name: string; description: string }> = [];
  private state: EngineState = {
    blockedHeirs: [],
    hijabTypes: [],
    awlApplied: false,
    raddApplied: false,
    bloodRelativesApplied: false,
    confidenceFactors: []
  };

  constructor(madhab: MadhhabType, estate: EstateData, heirs: HeirsData) {
    this.madhab = madhab;
    this.estate = {
      total: estate.total || 0,
      funeral: estate.funeral || 0,
      debts: estate.debts || 0,
      will: estate.will || 0
    };
    this.heirs = this.normalizeHeirs(heirs);
    this.hijabSystem = new HijabSystem(madhab);
  }

  /**
   * Main calculation flow - matches HTML's 13-step process
   */
  calculate(): CalculationResult {
    const startTime = performance.now();
    const steps: string[] = [];
    
    try {
      // Step 1: Validate inputs
      const validation = this.validateInput();
      if (!validation.valid) {
        const endTime = performance.now();
        const calcSteps = steps.map((s, i) => ({
          stepNumber: i + 1,
          title: s,
          description: '',
          action: 'validate',
          details: {},
          timestamp: new Date().toISOString()
        }));

        return {
          success: false,
          madhab: this.madhab,
          madhhabName: this.madhab,
          shares: [],
          confidence: 0,
          confidenceFactors: [],
          steps: calcSteps,
          calculationTime: endTime - startTime,
          error: validation.error,
          specialCases: { awl: false, auled: 0, radd: false, hijabTypes: [] }
        };
      }
      steps.push('التحقق من البيانات: validate');

      // Step 2: Calculate net estate (total - funeral - debts - will)
      const netEstate = this.calculateNetEstate();
      steps.push('حساب التركة الصافية: estate_calculation');

      // Step 3: Apply hijab (blocking rules)
      const hijabResult = this.hijabSystem.applyHijab(this.heirs);
      const validHeirs = hijabResult.heirs;
      const hijabLog = hijabResult.log || [];
      this.state.blockedHeirs = hijabLog;
      steps.push('تطبيق الحجب: hijab');

      // Step 4: Compute fixed shares (fards)
      const fixedShares = this.computeFixedShares(validHeirs);
      steps.push('الفروض: fixed_shares');

      // Step 5: Apply awl if needed
      const totalFixed = this.sumFractions(fixedShares.map(s => s.fraction));
      let adjustedFixed = fixedShares;
      
      if (totalFixed.toDecimal() > 1) {
        adjustedFixed = this.applyAwl(fixedShares, totalFixed);
        this.state.awlApplied = true;
        steps.push('الأول: awl');
      }

      // Step 6: Calculate remainder
      const remainder = new FractionClass(1, 1).subtract(totalFixed);
      steps.push('حساب الباقي: remainder');

      // Step 7: Compute asaba distribution
      const asabaShares = this.computeAsaba(adjustedFixed, remainder, validHeirs);
      steps.push('العصبات: asaba');

      // Step 8: Merge fixed + asaba shares
      const allShares = this.mergeShares(adjustedFixed, asabaShares);
      steps.push('دمج الفروض والعصبات: merge');

      // Step 9: Recalculate total & remainder
      const totalAllShares = this.sumFractions(allShares.map(s => s.fraction));
      const finalRemainder = new FractionClass(1, 1).subtract(totalAllShares);
      steps.push('إعادة حساب الباقي: recalculate');

      // Step 10: Apply radd if remainder > 0 and no asaba
      let finalShares = allShares;
      if (finalRemainder.toDecimal() > 0.0001 && asabaShares.length === 0) {
        finalShares = this.applyRadd(allShares, finalRemainder);
        this.state.raddApplied = true;
        steps.push('الرد: radd');
      }

      // Step 11: Distribute to blood relatives if still remainder
      if (finalRemainder.toDecimal() > 0.0001 && asabaShares.length === 0) {
        const bloodDistribution = this.distributeToBloodRelatives(finalShares, finalRemainder);
        finalShares = bloodDistribution.shares;
        if (bloodDistribution.bloodRelatives.length > 0) {
          this.state.bloodRelativesApplied = true;
          this.specialCases.push({
            type: 'blood_relatives',
            name: 'ذوو الأرحام',
            description: 'توزيع الباقي على ذوي الأرحام'
          });
          steps.push('ذوو الأرحام: blood_relatives');
        }
      }

      // Step 12: Convert to amounts
      const results = this.calculateFinalAmounts(finalShares, netEstate);
      steps.push('تحويل للمبالغ: amounts');

      // Step 13: Calculate confidence score
      const confidence = this.calculateConfidence(results, validHeirs);
      steps.push('حساب مستوى الثقة: confidence');

      const endTime = performance.now();
      const calcSteps = steps.map((s, i) => ({
        stepNumber: i + 1,
        title: s,
        description: '',
        action: 'info',
        details: {},
        timestamp: new Date().toISOString()
      }));

      const special: import('./types').SpecialCases = {
        awl: this.specialCases.some(sc => sc.type === 'awl'),
        auled: 0,
        radd: this.specialCases.some(sc => sc.type === 'radd'),
        hijabTypes: hijabLog
      };

      return {
        success: true,
        madhab: this.madhab,
        madhhabName: this.madhab,
        shares: results,
        netEstate: netEstate,
        confidence,
        confidenceFactors: this.state.confidenceFactors,
        steps: calcSteps,
        calculationTime: endTime - startTime,
        specialCases: special,
        awlApplied: this.state.awlApplied,
        raddApplied: this.state.raddApplied,
        bloodRelativesApplied: this.state.bloodRelativesApplied,
        blockedHeirs: this.state.blockedHeirs
      };
    } catch (error) {
      const endTime = performance.now();
      const calcSteps = steps.map((s, i) => ({
        stepNumber: i + 1,
        title: s,
        description: '',
        action: 'error',
        details: {},
        timestamp: new Date().toISOString()
      }));

      return {
        success: false,
        madhab: this.madhab,
        madhhabName: this.madhab,
        shares: [],
        confidence: 0,
        confidenceFactors: ['حدث خطأ في الحساب'],
        steps: calcSteps,
        calculationTime: endTime - startTime,
        error: `خطأ في الحساب: ${(error as Error).message}`,
        specialCases: { awl: false, auled: 0, radd: false, hijabTypes: [] }
      };
    }
  }

  /**
   * Step 2: Calculate net estate (deduct will, funeral, debts)
   */
  private calculateNetEstate(): number {
    let net = this.estate.total;
    net -= this.estate.funeral || 0;
    net -= this.estate.debts || 0;

    // Enforce will ≤ 1/3 of (total - funeral - debts)
    const remainderAfterFuneral = this.estate.total - (this.estate.funeral || 0) - (this.estate.debts || 0);
    const maxWill = remainderAfterFuneral / 3;
    const actualWill = Math.min(this.estate.will || 0, maxWill);
    
    net -= actualWill;

    return Math.max(0, net);
  }

  /**
   * Step 3: Apply hijab (blocking rules)
   */
  private applyHijab(heirs: HeirsData): HeirsData {
    const result = this.hijabSystem.applyHijab(heirs);
    return result.heirs;
  }

  /**
   * Step 4: Compute fixed shares (fards)
   */
  private computeFixedShares(heirs: HeirsData): HeirShareObject[] {
    const shares: HeirShareObject[] = [];
    const hasDescendants = this.hasDescendants(heirs);

    // Special case: Umariyyah (spouse + both parents)
    const isUmariyyah = this.isUmariyyah(heirs);

    // ===== SPOUSE =====
    if (heirs.husband && heirs.husband > 0) {
      const fraction = hasDescendants ? new FractionClass(1, 4) : new FractionClass(1, 2);
      shares.push({
        key: 'husband',
        name: 'الزوج',
        type: 'فرض',
        fraction,
        count: 1,
        reason: hasDescendants ? '¼ مع وجود الفرع الوارث' : '½ بدون فرع وارث'
      });
    }

    if (heirs.wife && heirs.wife > 0) {
      const fraction = hasDescendants ? new FractionClass(1, 8) : new FractionClass(1, 4);
      shares.push({
        key: 'wife',
        name: heirs.wife > 1 ? 'الزوجات' : 'الزوجة',
        type: 'فرض',
        fraction,
        count: heirs.wife || 0,
        reason: hasDescendants ? '⅛ مع الفرع الوارث' : '¼ بدون فرع'
      });
    }

    // ===== MOTHER =====
    if (heirs.mother && heirs.mother > 0) {
      let fraction: FractionClass;
      let reason: string;

      if (isUmariyyah) {
        // Umariyyah: mother gets 1/3 of remainder after spouse
        fraction = new FractionClass(1, 6); // 1/3 × 1/2 or 1/3 × 3/4
        reason = 'ثلث الباقي (العمرية)';
      } else if (hasDescendants) {
        fraction = new FractionClass(1, 6);
        reason = '⅙ مع وجود فرع';
      } else if (this.getSiblingsCount(heirs) >= 2) {
        fraction = new FractionClass(1, 6);
        reason = '⅙ مع جمع إخوة';
      } else {
        fraction = new FractionClass(1, 3);
        reason = '⅓ بدون فرع أو إخوة';
      }

      shares.push({
        key: 'mother',
        name: 'الأم',
        type: 'فرض',
        fraction,
        count: 1,
        reason
      });
    }

    // ===== DAUGHTERS (no sons) =====
    if (heirs.daughter && heirs.daughter > 0 && (!heirs.son || heirs.son === 0)) {
      const fraction = heirs.daughter === 1 ? new FractionClass(1, 2) : new FractionClass(2, 3);
      shares.push({
        key: 'daughter',
        name: heirs.daughter > 1 ? 'البنات' : 'البنت',
        type: 'فرض',
        fraction,
        count: heirs.daughter || 0,
        reason: heirs.daughter === 1 ? '½' : '⅔'
      });
    }

    // ===== GRANDDAUGHTERS (no sons, no grandsons) =====
    if (heirs.granddaughter && heirs.granddaughter > 0 && 
        (!heirs.grandson || heirs.grandson === 0) && 
        (!heirs.son || heirs.son === 0)) {
      
      if (heirs.daughter === 0) {
        const fraction = heirs.granddaughter === 1 ? new FractionClass(1, 2) : new FractionClass(2, 3);
        shares.push({
          key: 'granddaughter',
          name: heirs.granddaughter > 1 ? 'بنات الابن' : 'بنت الابن',
          type: 'فرض',
          fraction,
          count: heirs.granddaughter || 0,
          reason: heirs.granddaughter === 1 ? '½' : '⅔'
        });
      } else if (heirs.daughter === 1) {
        // 1/6 as completion to 2/3 with one daughter
        shares.push({
          key: 'granddaughter',
          name: heirs.granddaughter > 1 ? 'بنات الابن' : 'بنت الابن',
          type: 'فرض',
          fraction: new FractionClass(1, 6),
          count: heirs.granddaughter || 0,
          reason: '⅙ تكملة للثلثين'
        });
      }
    }

    // ===== SISTERS (no brothers, no male descendants) =====
    if ((heirs.full_sister || 0) > 0 && (!heirs.full_brother || heirs.full_brother === 0)) {
      if (!hasDescendants && !heirs.father && !heirs.grandfather) {
        const fraction = heirs.full_sister === 1 ? new FractionClass(1, 2) : new FractionClass(2, 3);
        shares.push({
          key: 'full_sister',
          name: (heirs.full_sister || 0) > 1 ? 'الأخوات الشقيقات' : 'الأخت الشقيقة',
          type: 'فرض',
          fraction,
          count: heirs.full_sister || 0,
          reason: heirs.full_sister === 1 ? '½' : '⅔'
        });
      }
    }

    // ===== PATERNAL SISTERS (similar logic) =====
    if ((heirs.half_sister_paternal || 0) > 0 && 
        (!heirs.full_brother || heirs.full_brother === 0) &&
        (!heirs.half_brother_paternal || heirs.half_brother_paternal === 0)) {
      if (!hasDescendants && !heirs.father && !heirs.grandfather && !heirs.full_sister) {
        const fraction = heirs.half_sister_paternal === 1 ? new FractionClass(1, 2) : new FractionClass(2, 3);
        shares.push({
          key: 'half_sister_paternal',
          name: (heirs.half_sister_paternal || 0) > 1 ? 'الأخوات لأب' : 'الأخت لأب',
          type: 'فرض',
          fraction,
          count: heirs.half_sister_paternal || 0,
          reason: heirs.half_sister_paternal === 1 ? '½' : '⅔'
        });
      }
    }

    // ===== MATERNAL SIBLINGS =====
    const maternalCount = (heirs.half_brother_maternal || 0) + (heirs.half_sister_maternal || 0);
    if (maternalCount > 0 && !hasDescendants && !heirs.father && !heirs.grandfather) {
      const fraction = maternalCount === 1 ? new FractionClass(1, 6) : new FractionClass(1, 3);
      shares.push({
        key: 'maternal_siblings',
        name: 'الإخوة لأم',
        type: 'فرض',
        fraction,
        count: maternalCount || 0,
        reason: maternalCount === 1 ? '⅙' : '⅓'
      });
    }

    return shares;
  }

  /**
   * Step 5: Apply awl (augmentation of denominator)
   */
  private applyAwl(
    shares: HeirShareObject[],
    totalFraction: FractionClass
  ): HeirShareObject[] {
    this.specialCases.push({
      type: 'awl',
      name: 'الأول',
      description: 'تقليل الأنصباء بنسبة متساوية عند زيادة الفروض على التركة'
    });

    return shares.map(share => ({
      ...share,
      fraction: share.fraction.divide(totalFraction)
    }));
  }

  /**
   * Step 7: Compute asaba (residuary distribution)
   */
  private computeAsaba(
    fixedShares: HeirShareObject[],
    remainder: FractionClass,
    heirs: HeirsData
  ): HeirShareObject[] {
    if (remainder.toDecimal() <= 0.0001) {
      return [];
    }

    const asabaShares: HeirShareObject[] = [];

    // Hierarchy of asaba:
    // 1. Sons (2:1 ratio with daughters)
    if (heirs.son && heirs.son > 0) {
      const totalHeads = heirs.son * 2 + (heirs.daughter || 0);
      const sonWeight = heirs.son * 2;
      const daughterWeight = heirs.daughter || 0;

      if (sonWeight > 0) {
        asabaShares.push({
          key: 'son',
          name: 'الابن',
          type: 'تعصيب',
          fraction: remainder.multiply(new FractionClass(sonWeight, totalHeads)),
          count: heirs.son || 0,
          reason: `${heirs.son} ابن(ة) يرثون الباقي`
        });
      }

      if (daughterWeight > 0) {
        asabaShares.push({
          key: 'daughter',
          name: 'البنت',
          type: 'تعصيب',
          fraction: remainder.multiply(new FractionClass(daughterWeight, totalHeads)),
          count: heirs.daughter || 0,
          reason: 'البنات مع الابن'
        });
      }

      return asabaShares;
    }

    // 2. Grandsons and granddaughters
    if (heirs.grandson && heirs.grandson > 0) {
      const totalHeads = heirs.grandson * 2 + (heirs.granddaughter || 0);
      
      asabaShares.push({
        key: 'grandson',
        name: 'ابن الابن',
        type: 'تعصيب',
        fraction: remainder.multiply(new FractionClass(heirs.grandson * 2, totalHeads)),
        count: heirs.grandson || 0,
        reason: 'ابن الابن يرث الباقي'
      });

      if (heirs.granddaughter && heirs.granddaughter > 0) {
        asabaShares.push({
          key: 'granddaughter',
          name: 'بنت الابن',
          type: 'تعصيب',
          fraction: remainder.multiply(new FractionClass(heirs.granddaughter, totalHeads)),
          count: heirs.granddaughter || 0,
          reason: 'بنات الابن مع الابن'
        });
      }

      return asabaShares;
    }

    // 3. Father
    if (heirs.father && heirs.father > 0) {
      asabaShares.push({
        key: 'father',
        name: 'الأب',
        type: 'تعصيب',
        fraction: remainder,
        count: 1,
        reason: 'الأب يرث الباقي',
        addToExisting: true
      });
      return asabaShares;
    }

    // 4. Grandfather
    if (heirs.grandfather && heirs.grandfather > 0 && !heirs.father) {
      asabaShares.push({
        key: 'grandfather',
        name: 'الجد',
        type: 'تعصيب',
        fraction: remainder,
        count: 1,
        reason: 'الجد يرث الباقي',
        addToExisting: true
      });
      return asabaShares;
    }

    // 5. Full brothers and sisters
    if (heirs.full_brother && heirs.full_brother > 0) {
      const totalHeads = heirs.full_brother * 2 + (heirs.full_sister || 0);
      
      asabaShares.push({
        key: 'full_brother',
        name: 'الأخ الشقيق',
        type: 'تعصيب',
        fraction: remainder.multiply(new FractionClass(heirs.full_brother * 2, totalHeads)),
        count: heirs.full_brother || 0,
        reason: 'الأخ الشقيق يعصب الأخت'
      });

      if (heirs.full_sister && heirs.full_sister > 0) {
        asabaShares.push({
          key: 'full_sister',
          name: 'الأخت الشقيقة',
          type: 'تعصيب',
          fraction: remainder.multiply(new FractionClass(heirs.full_sister, totalHeads)),
          count: heirs.full_sister || 0,
          reason: 'الأخت الشقيقة مع الأخ'
        });
      }

      return asabaShares;
    }

    // 6. Paternal brothers and sisters
    if (heirs.half_brother_paternal && heirs.half_brother_paternal > 0) {
      const totalHeads = heirs.half_brother_paternal * 2 + (heirs.half_sister_paternal || 0);
      
      asabaShares.push({
        key: 'half_brother_paternal',
        name: 'الأخ لأب',
        type: 'تعصيب',
        fraction: remainder.multiply(new FractionClass(heirs.half_brother_paternal * 2, totalHeads)),
        count: heirs.half_brother_paternal || 0,
        reason: 'الأخ لأب يعصب الأخت'
      });

      if (heirs.half_sister_paternal && heirs.half_sister_paternal > 0) {
        asabaShares.push({
          key: 'half_sister_paternal',
          name: 'الأخت لأب',
          type: 'تعصيب',
          fraction: remainder.multiply(new FractionClass(heirs.half_sister_paternal, totalHeads)),
          count: heirs.half_sister_paternal || 0,
          reason: 'الأخت لأب مع الأخ'
        });
      }

      return asabaShares;
    }

    // 7. Uncles
    if (heirs.uncle_paternal && heirs.uncle_paternal > 0) {
      asabaShares.push({
        key: 'uncle_paternal',
        name: 'العم',
        type: 'تعصيب',
        fraction: remainder.divide(heirs.uncle_paternal),
        count: heirs.uncle_paternal || 0,
        reason: 'العم يرث الباقي'
      });
      return asabaShares;
    }

    // 8. Cousins
    if (heirs.nephew_from_brother && heirs.nephew_from_brother > 0) {
      asabaShares.push({
        key: 'nephew_from_brother',
        name: 'ابن الأخ',
        type: 'تعصيب',
        fraction: remainder.divide(heirs.nephew_from_brother),
        count: heirs.nephew_from_brother || 0,
        reason: 'ابن الأخ يرث الباقي'
      });
      return asabaShares;
    }

    return asabaShares;
  }

  /**
   * Step 10: Apply radd (return excess to fixed-share heirs proportionally)
   */
  private applyRadd(
    shares: HeirShareObject[],
    remainder: FractionClass
  ): HeirShareObject[] {
    if (remainder.toDecimal() <= 0.0001) {
      return shares;
    }

    // Filter eligible heirs for radd (not spouses, not asaba)
    const eligible = shares.filter(
      s => s.key !== 'husband' && s.key !== 'wife' && !s.type.includes('تعصيب')
    );

    if (eligible.length === 0) {
      return shares;
    }

    this.specialCases.push({
      type: 'radd',
      name: 'الرد',
      description: 'توزيع الفائض على أصحاب الفروض'
    });

    // Calculate total of eligible fractions
    const totalEligible = this.sumFractions(eligible.map(s => s.fraction));

    if (totalEligible.toDecimal() <= 0) {
      return shares;
    }

    // Distribute remainder proportionally
    return shares.map(share => {
      if (eligible.includes(share)) {
        const proportion = share.fraction.divide(totalEligible);
        const additionalShare = remainder.multiply(proportion);
        return {
          ...share,
          fraction: share.fraction.add(additionalShare),
          type: share.type + ' + رد'
        };
      }
      return share;
    });
  }

  /**
   * Step 11: Distribute to blood relatives (ذوو الأرحام)
   */
  private distributeToBloodRelatives(
    shares: HeirShareObject[],
    remainder: FractionClass
  ): { shares: HeirShareObject[]; bloodRelatives: HeirShareObject[] } {
    const bloodRelatives: HeirShareObject[] = [];

    if (remainder.toDecimal() <= 0.0001) {
      return { shares, bloodRelatives };
    }

    const heirs = this.heirs;

    // Check for blood relatives in hierarchy order
    const bloodHeirsList = [
      { key: 'daughter_son', name: 'ابن البنت', weight: 1 },
      { key: 'daughter_daughter', name: 'بنت البنت', weight: 1 },
      { key: 'sister_children', name: 'أولاد الأخت', weight: 1 },
      { key: 'maternal_uncle', name: 'الخال', weight: 1 },
      { key: 'maternal_aunt', name: 'الخالة', weight: 1 },
      { key: 'paternal_aunt', name: 'العمة', weight: 1 }
    ];

    let firstClass: any[] = [];
    for (const heir of bloodHeirsList) {
      const count = heirs[heir.key as keyof HeirsData] as number;
      if (count && count > 0) {
        firstClass.push({ ...heir, count });
        break; // Only first class inherits
      }
    }

    if (firstClass.length === 0) {
      return { shares, bloodRelatives };
    }

    this.specialCases.push({
      type: 'blood_relatives',
      name: 'ذوو الأرحام',
      description: 'توزيع الباقي على ذوي الأرحام'
    });

    // Distribute equally among first class members
    const totalCount = firstClass.reduce((sum, h) => sum + h.count, 0);
    firstClass.forEach(heir => {
      bloodRelatives.push({
        key: heir.key,
        name: heir.name,
        type: 'ذو رحم',
        fraction: remainder.multiply(new FractionClass(heir.count, totalCount)),
        count: heir.count,
        reason: 'من ذوي الأرحام'
      });
    });

    return { shares, bloodRelatives };
  }

  /**
   * Step 12: Convert fractions to amounts
   */
  private calculateFinalAmounts(shares: HeirShareObject[], netEstate: number): HeirShare[] {
    return shares.map(share => ({
      key: share.key as any,
      name: share.name,
      type: share.type,
      count: share.count,
      amount: Math.round(share.fraction.toDecimal() * netEstate * 100) / 100,
      percentage: Math.round(share.fraction.toDecimal() * 10000) / 100,
      fraction: {
        numerator: share.fraction.getNumerator(),
        denominator: share.fraction.getDenominator()
      },
      shares: Array(share.count).fill(0).map((_, i) => ({
        person: i + 1,
        amount: Math.round((share.fraction.toDecimal() * netEstate / share.count) * 100) / 100
      }))
    }));
  }

  /**
   * Step 13: Calculate confidence score with enhanced factors
   */
  private calculateConfidence(
    results: HeirShare[],
    heirs: HeirsData
  ): number {
    let confidence = 100;
    const factors: string[] = [];

    // ===== FACTOR 1: Complexity based on number of heirs =====
    const heirCount = Object.values(heirs).filter(v => v && v > 0).length;
    if (heirCount > 8) {
      confidence -= 15;
      factors.push('عدد كبير من الورثة (أكثر من 8)');
    } else if (heirCount > 5) {
      confidence -= 10;
      factors.push('عدد متوسط من الورثة (6-8)');
    } else if (heirCount > 3) {
      confidence -= 5;
      factors.push('عدد قليل من الورثة (4-5)');
    }

    // ===== FACTOR 2: Special cases applied =====
    if (this.state.awlApplied) {
      confidence -= 8;
      factors.push('تم تطبيق العول');
    }
    
    if (this.state.raddApplied) {
      confidence -= 5;
      factors.push('تم تطبيق الرد');
    }
    
    if (this.state.bloodRelativesApplied) {
      confidence -= 10;
      factors.push('تم توزيع الباقي على ذوي الأرحام');
    }

    // ===== FACTOR 3: Multiple generations =====
    const hasChildren = heirs.son || heirs.daughter;
    const hasParents = heirs.father || heirs.mother;
    const hasGrandparents = heirs.grandfather || heirs.grandmother_mother || heirs.grandmother_father;
    
    const generationCount = (hasChildren ? 1 : 0) + (hasParents ? 1 : 0) + (hasGrandparents ? 1 : 0);
    if (generationCount >= 3) {
      confidence -= 5;
      factors.push('وجود عدة أجيال من الورثة');
    }

    // ===== FACTOR 4: Distant heirs present =====
    const distantHeirs = [
      'full_nephew', 'paternal_nephew', 'full_uncle', 'paternal_uncle',
      'full_cousin', 'paternal_cousin', 'daughter_son', 'daughter_daughter',
      'sister_children', 'maternal_uncle', 'maternal_aunt', 'paternal_aunt'
    ];
    
    const hasDistantHeirs = distantHeirs.some(key => (heirs[key as keyof HeirsData] || 0) > 0);
    if (hasDistantHeirs) {
      confidence -= 8;
      factors.push('وجود ورثة من الدرجات البعيدة');
    }

    // ===== FACTOR 5: Grandfather with siblings (madhab-specific) =====
    const hasGrandfatherWithSiblings = 
      heirs.grandfather && (heirs.full_brother || heirs.paternal_brother);
    if (hasGrandfatherWithSiblings) {
      confidence -= 5;
      factors.push('حالة الجد مع الإخوة (تختلف باختلاف المذهب)');
    }

    // ===== FACTOR 6: Multiple wives =====
    if (heirs.wife && heirs.wife > 1) {
      confidence -= 3;
      factors.push('وجود عدة زوجات');
    }

    // Ensure confidence stays within 0-100 range
    confidence = Math.max(50, Math.min(100, confidence));

    // Add confidence factors explanation
    this.state.confidenceFactors = [];
    
    if (factors.length > 0) {
      this.state.confidenceFactors = factors;
    } else {
      this.state.confidenceFactors = ['حساب بسيط - دقة عالية'];
    }

    return confidence;
  }

  /**
   * Check if estate has descendants
   */
  private hasDescendants(heirs: HeirsData): boolean {
    return (heirs.son || 0) > 0 || 
           (heirs.daughter || 0) > 0 ||
           (heirs.grandson || 0) > 0 ||
           (heirs.granddaughter || 0) > 0;
  }

  /**
   * Check if Umariyyah special case applies
   */
  private isUmariyyah(heirs: HeirsData): boolean {
    const hasSpouse = (heirs.husband || 0) > 0 || (heirs.wife || 0) > 0;
    const hasParents = (heirs.father || 0) > 0 && (heirs.mother || 0) > 0;
    const hasDescendants = this.hasDescendants(heirs);
    
    return hasSpouse && hasParents && !hasDescendants;
  }

  /**
   * Get total siblings count
   */
  private getSiblingsCount(heirs: HeirsData): number {
    return (heirs.full_brother || 0) + (heirs.full_sister || 0) +
           (heirs.half_brother_paternal || 0) + (heirs.half_sister_paternal || 0) +
           (heirs.half_brother_maternal || 0) + (heirs.half_sister_maternal || 0);
  }

  /**
   * Sum array of fractions
   */
  private sumFractions(fractions: FractionClass[]): FractionClass {
    return fractions.reduce(
      (sum, frac) => sum.add(frac),
      new FractionClass(0, 1)
    );
  }

  /**
   * Merge fixed and asaba shares
   */
  private mergeShares(
    fixedShares: HeirShareObject[],
    asabaShares: HeirShareObject[]
  ): HeirShareObject[] {
    const merged = [...fixedShares];

    asabaShares.forEach(asaba => {
      const existing = merged.find(s => s.key === asaba.key);
      if (existing && asaba.addToExisting) {
        existing.fraction = existing.fraction.add(asaba.fraction);
        existing.type = 'فرض + تعصيب';
      } else {
        merged.push(asaba);
      }
    });

    return merged;
  }

  /**
   * Normalize heir counts to valid ranges
   */
  private normalizeHeirs(heirs: HeirsData): HeirsData {
    return {
      husband: Math.min(heirs.husband || 0, 1),
      wife: Math.min(heirs.wife || 0, 4),
      son: heirs.son || 0,
      daughter: heirs.daughter || 0,
      father: Math.min(heirs.father || 0, 1),
      mother: Math.min(heirs.mother || 0, 1),
      grandfather: Math.min(heirs.grandfather || 0, 1),
      grandmother: Math.min(heirs.grandmother || 0, 1),
      full_brother: heirs.full_brother || 0,
      full_sister: heirs.full_sister || 0,
      half_brother_paternal: heirs.half_brother_paternal || 0,
      half_sister_paternal: heirs.half_sister_paternal || 0,
      half_brother_maternal: heirs.half_brother_maternal || 0,
      half_sister_maternal: heirs.half_sister_maternal || 0,
      grandson: heirs.grandson || 0,
      granddaughter: heirs.granddaughter || 0,
      nephew_from_brother: heirs.nephew_from_brother || 0,
      niece_from_brother: heirs.niece_from_brother || 0,
      uncle_paternal: heirs.uncle_paternal || 0,
      uncle_maternal: heirs.uncle_maternal || 0,
      aunt_paternal: heirs.aunt_paternal || 0,
      aunt_maternal: heirs.aunt_maternal || 0
    };
  }

  /**
   * Validate input data
   */
  private validateInput() {
    if (!this.estate.total || this.estate.total <= 0) {
      return {
        valid: false,
        error: 'يجب إدخال مبلغ إجمالي التركة'
      };
    }

    const totalHeirs = Object.values(this.heirs).filter(v => v && v > 0).length;
    if (totalHeirs === 0) {
      return {
        valid: false,
        error: 'يجب تحديد وارث واحد على الأقل'
      };
    }

    return { valid: true };
  }
}```

## ./lib/inheritance/fraction.ts
```typescript
/**
 * فئة الكسور المتقدمة لحساب المواريث الشرعي
 * Enhanced Fraction Class for Islamic Inheritance Calculations
 * 
 * تدعم العمليات الحسابية على الكسور بدقة عالية جداً
 */

import { FractionData } from './types';

export class FractionClass {
  private numerator: number;
  private denominator: number;

  constructor(numerator: number, denominator: number = 1) {
    if (denominator === 0) {
      throw new Error('المقام لا يمكن أن يكون صفراً | Denominator cannot be zero');
    }

    // تحويل الكسور السالبة
    if (denominator < 0) {
      numerator = -numerator;
      denominator = -denominator;
    }

    this.numerator = numerator;
    this.denominator = denominator;
    this.simplify();
  }

  /**
   * تبسيط الكسر إلى أبسط صورة
   * Simplify fraction to lowest terms
   */
  private simplify(): void {
    const gcd = this.gcd(Math.abs(this.numerator), this.denominator);
    this.numerator /= gcd;
    this.denominator /= gcd;
  }

  /**
   * حساب القاسم المشترك الأكبر (الخوارزمية التكرارية)
   * Calculate Greatest Common Divisor (Iterative Euclidean Algorithm)
   * 
   * Note: Using iterative instead of recursive to prevent stack overflow
   * with large denominators in edge cases (e.g., single male heir scenarios)
   */
  private gcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);
    
    // Euclidean algorithm - iterative approach
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    
    return a;
  }

  /**
   * جمع كسرين
   * Add two fractions
   */
  add(other: FractionClass): FractionClass {
    const newNumerator =
      this.numerator * other.denominator +
      other.numerator * this.denominator;
    const newDenominator =
      this.denominator * other.denominator;

    return new FractionClass(newNumerator, newDenominator);
  }

  /**
   * طرح كسرين
   * Subtract two fractions
   */
  subtract(other: FractionClass): FractionClass {
    const newNumerator =
      this.numerator * other.denominator -
      other.numerator * this.denominator;
    const newDenominator =
      this.denominator * other.denominator;

    return new FractionClass(newNumerator, newDenominator);
  }

  /**
   * ضرب الكسر برقم أو كسر آخر
   * Multiply fraction by number or another fraction
   */
  multiply(scalar: number | FractionClass): FractionClass {
    if (typeof scalar === 'number') {
      return new FractionClass(
        this.numerator * scalar,
        this.denominator
      );
    } else {
      return new FractionClass(
        this.numerator * scalar.numerator,
        this.denominator * scalar.denominator
      );
    }
  }

  /**
   * قسمة الكسر على رقم أو كسر آخر
   * Divide fraction by number or another fraction
   */
  divide(scalar: number | FractionClass): FractionClass {
    if (typeof scalar === 'number') {
      if (scalar === 0) {
        throw new Error('لا يمكن القسمة على صفر | Cannot divide by zero');
      }
      return new FractionClass(
        this.numerator,
        this.denominator * scalar
      );
    } else {
      if (scalar.numerator === 0) {
        throw new Error('لا يمكن القسمة على صفر | Cannot divide by zero');
      }
      return new FractionClass(
        this.numerator * scalar.denominator,
        this.denominator * scalar.numerator
      );
    }
  }

  /**
   * تحويل الكسر إلى عدد عشري
   * Convert fraction to decimal
   */
  toDecimal(): number {
    return this.numerator / this.denominator;
  }

  /**
   * المساواة مع كسر آخر (مع هامش تفاوت)
   * Equality check with tolerance
   */
  equals(other: FractionClass, tolerance: number = 0.001): boolean {
    return Math.abs(this.toDecimal() - other.toDecimal()) <= tolerance;
  }

  /**
   * مقارنة الكسور
   * Compare fractions
   */
  compare(other: FractionClass): number {
    const diff = this.toDecimal() - other.toDecimal();
    if (diff < -0.0001) return -1;
    if (diff > 0.0001) return 1;
    return 0;
  }

  /**
   * إرجاع الكسر كنص رياضي
   * Return as mathematical string
   */
  toString(): string {
    if (this.denominator === 1) {
      return `${this.numerator}`;
    }
    return `${this.numerator}/${this.denominator}`;
  }

  /**
   * إرجاع الكسر باللغة العربية
   * Return Arabic name of fraction
   */
  toArabicName(): string {
    const key = `${this.numerator}/${this.denominator}`;
    const arabicFractions: Record<string, string> = {
      '1/1': 'كامل التركة',
      '1/2': 'النصف',
      '1/3': 'الثلث',
      '2/3': 'الثلثان',
      '1/4': 'الربع',
      '3/4': 'ثلاثة أرباع',
      '1/6': 'السدس',
      '5/6': 'خمسة أسداس',
      '1/8': 'الثمن',
      '7/8': 'سبعة أثمان',
      '0/1': 'لا شيء'
    };
    return arabicFractions[key] || key;
  }

  /**
   * الحصول على البسط
   */
  get numeratorValue(): number {
    return this.numerator;
  }

  /**
   * الحصول على المقام
   */
  get denominatorValue(): number {
    return this.denominator;
  }

  /**
   * Get numerator (alternative method name)
   */
  getNumerator(): number {
    return this.numerator;
  }

  /**
   * Get denominator (alternative method name)
   */
  getDenominator(): number {
    return this.denominator;
  }

  /**
   * Check if fraction is positive
   */
  isPositive(): boolean {
    return this.numerator > 0;
  }

  /**
   * Check if fraction is zero
   */
  isZero(): boolean {
    return this.numerator === 0;
  }

  /**
   * Check if greater than another fraction
   */
  greaterThan(other: FractionClass): boolean {
    return this.toDecimal() > other.toDecimal();
  }

  /**
   * Check if less than another fraction
   */
  lessThan(other: FractionClass): boolean {
    return this.toDecimal() < other.toDecimal();
  }

  /**
   * Check if greater than or equal
   */
  greaterThanOrEqual(other: FractionClass): boolean {
    return this.toDecimal() >= other.toDecimal();
  }

  /**
   * Check if less than or equal
   */
  lessThanOrEqual(other: FractionClass): boolean {
    return this.toDecimal() <= other.toDecimal();
  }

  /**
   * تحويل إلى كائن بيانات
   */
  toData(): FractionData {
    return {
      numerator: this.numerator,
      denominator: this.denominator
    };
  }

  /**
   * إنشاء كسر من كائن بيانات
   */
  static fromData(data: FractionData): FractionClass {
    return new FractionClass(data.numerator, data.denominator);
  }

  /**
   * إنشاء كسر من عدد عشري
   */
  static fromDecimal(decimal: number, precision: number = 10): FractionClass {
    const denominator = Math.pow(10, precision);
    const numerator = Math.round(decimal * denominator);
    return new FractionClass(numerator, denominator);
  }
}
```

## ./lib/inheritance/hijab-system.ts
```typescript
/**
 * نظام الحجب الفقهي الشامل
 * Comprehensive Islamic Hijab (Inheritance Obstruction) System
 * 
 * يطبق جميع قواعس الحجب حسب كل مذهب إسلامي
 */

import { MadhhabType, HeirsData } from './types';
import { getHijabRules } from './constants';

export class HijabSystem {
  private madhab: MadhhabType;
  private hijabLog: string[] = [];

  constructor(madhab: MadhhabType) {
    this.madhab = madhab;
  }

  /**
   * تطبيق قواعس الحجب على الورثة
   * Apply hijab rules to heirs
   */
  applyHijab(heirs: HeirsData): { heirs: HeirsData; log: string[] } {
    this.hijabLog = [];
    const result = { ...heirs };

    // تطبيق الحجب الكامل
    this.applyCompleteHijab(result);

    // تطبيق الحجب الناقص
    this.applyPartialHijab(result);

    return {
      heirs: result,
      log: this.hijabLog
    };
  }

  /**
   * الحجب الكامل: حرمان الوارث من الميراث كلياً
   * Complete Hijab: Complete deprivation from inheritance
   */
  private applyCompleteHijab(heirs: HeirsData): void {
    const rules = getHijabRules(this.madhab);

    // قائمة الحجب الكامل
    const completeHijabRules = rules.filter(r => r.type === 'complete');

    for (const rule of completeHijabRules) {
      const hijabber = heirs[rule.hijabber];

      if (hijabber && hijabber > 0) {
        for (const hijabbed of rule.hijabbed) {
          if (heirs[hijabbed] && heirs[hijabbed]! > 0) {
            this.hijabLog.push(
              `${rule.hijabber} يحجب ${hijabbed}`,
              `${rule.hijabber} blocks ${hijabbed}`
            );
            heirs[hijabbed] = 0;
          }
        }
      }
    }

    // ===== MADHAB-SPECIFIC RULE: Grandfather with siblings =====
    const hasGrandfather = (heirs.grandfather || 0) > 0;
    const hasSiblings = (heirs.full_brother || 0) > 0 || 
                        (heirs.full_sister || 0) > 0 ||
                        (heirs.half_brother_paternal || 0) > 0 ||
                        (heirs.half_sister_paternal || 0) > 0;

    if (hasGrandfather && hasSiblings) {
      // Shafii & Hanbali: Grandfather BLOCKS siblings
      if (this.madhab === 'shafii' || this.madhab === 'hanbali') {
        this.hijabLog.push(
          `في المذهب ${this.madhab === 'shafii' ? 'الشافعي' : 'الحنبلي'}: الجد يحجب الإخوة`,
          `In ${this.madhab} madhab: Grandfather blocks siblings`
        );
        
        // Block all siblings
        heirs.full_brother = 0;
        heirs.full_sister = 0;
        heirs.half_brother_paternal = 0;
        heirs.half_sister_paternal = 0;
      }
      
      // Hanafi & Maliki: Grandfather SHARES with siblings (handled in computeAsaba, not hijab)
      else if (this.madhab === 'hanafi' || this.madhab === 'maliki') {
        this.hijabLog.push(
          `في المذهب ${this.madhab === 'hanafi' ? 'الحنفي' : 'المالكي'}: الجد يقاسم الإخوة (يعالج في العصبات)`,
          `In ${this.madhab} madhab: Grandfather shares with siblings (handled in asaba)`
        );
        // No blocking - shares will be calculated in computeAsaba
      }
    }

    // ===== Granddaughter blocking by daughters =====
    // Rule: 2+ daughters block granddaughters (unless grandson exists)
    if ((heirs.daughter || 0) >= 2 && (heirs.granddaughter || 0) > 0) {
      // Check if there's a grandson to act as co-heir
      const hasGrandson = (heirs.grandson || 0) > 0;
      
      if (!hasGrandson) {
        // No grandson, so granddaughters are blocked
        this.hijabLog.push(
          `بنتان فأكثر تحجبان بنت الابن`,
          `Two or more daughters block granddaughters`
        );
        heirs.granddaughter = 0;
      } else {
        // With grandson, granddaughters are not blocked, but will inherit as asaba
        this.hijabLog.push(
          `بنتان مع ابن الابن - بنات الابن يرثن كعصبة`,
          `Daughters with grandson - granddaughters inherit as asaba`
        );
        // No change - granddaughters will inherit with grandson in asaba
      }
    }

    // Rule: Single daughter does NOT block granddaughters
    // (granddaughters get 1/6 if daughter=1, or nothing if daughter>=2 without grandson)
    // This is handled in computeFixedShares
  }

  /**
   * الحجب الناقص: تقليل نصيب الوارث
   * Partial Hijab: Reduction in heir's share
   */
  private applyPartialHijab(heirs: HeirsData): void {
    const rules = getHijabRules(this.madhab);
    const partialHijabRules = rules.filter(r => r.type === 'partial');

    for (const rule of partialHijabRules) {
      // معالجة القواعس الخاصة
      if (rule.reason === 'from_third_to_sixth') {
        // الأب يخفض الأم من الثلث إلى السدس
        if (heirs['father'] && heirs['father']! > 0 && heirs['mother'] && heirs['mother']! > 0) {
          this.hijabLog.push(
            `الأب يخفض نصيب الأم من الثلث إلى السدس`,
            `Father reduces mother's share from 1/3 to 1/6`
          );
        }
      }
    }

    // ===== MADHAB-SPECIFIC PARTIAL HIJAB: =====
    // Some madhabs have partial reduction rules that will be handled in calculation engine
  }

  /**
   * التحقق من حق الميراث للوارث
   * Check if heir has inheritance rights
   */
  checkInheritanceRights(heir: string): boolean {
    // القائمة الكاملة للورثة المعترف بهم فقهياً
    const recognizedHeirs = [
      'husband',
      'wife',
      'son',
      'daughter',
      'father',
      'mother',
      'grandfather',
      'grandmother',
      'full_brother',
      'full_sister',
      'half_brother_paternal',
      'half_sister_paternal',
      'half_brother_maternal',
      'half_sister_maternal',
      'nephew_from_brother',
      'niece_from_brother',
      'uncle_paternal',
      'uncle_maternal',
      'aunt_paternal',
      'aunt_maternal'
    ];

    return recognizedHeirs.includes(heir);
  }

  /**
   * الحصول على سجل الحجب
   * Get hijab log
   */
  getHijabLog(): string[] {
    return this.hijabLog;
  }

  /**
   * التحقق من وجود أبناء
   * Check if there are descendants
   */
  hasDescendants(heirs: HeirsData): boolean {
    return (heirs['son'] || 0) > 0 || (heirs['daughter'] || 0) > 0;
  }

  /**
   * التحقق من وجود والد
   * Check if father exists
   */
  hasFather(heirs: HeirsData): boolean {
    return (heirs['father'] || 0) > 0;
  }

  /**
   * التحقق من وجود والدة
   * Check if mother exists
   */
  hasMother(heirs: HeirsData): boolean {
    return (heirs['mother'] || 0) > 0;
  }

  /**
   * التحقق من وجود زوج
   * Check if husband exists
   */
  hasHusband(heirs: HeirsData): boolean {
    return (heirs['husband'] || 0) > 0;
  }

  /**
   * التحقق من وجود زوجة
   * Check if wife exists
   */
  hasWife(heirs: HeirsData): boolean {
    return (heirs['wife'] || 0) > 0;
  }

  /**
   * التحقق من وجود إخوة
   * Check if siblings exist
   */
  hasSiblings(heirs: HeirsData): boolean {
    const siblings =
      (heirs['full_brother'] || 0) +
      (heirs['full_sister'] || 0) +
      (heirs['half_brother_paternal'] || 0) +
      (heirs['half_sister_paternal'] || 0);

    return siblings > 0;
  }

  /**
   * حساب عدد الذكور
   * Count males
   */
  countMales(heirs: HeirsData): number {
    return (
      (heirs['son'] || 0) +
      (heirs['father'] || 0) +
      (heirs['grandfather'] || 0) +
      (heirs['full_brother'] || 0) +
      (heirs['half_brother_paternal'] || 0) +
      (heirs['half_brother_maternal'] || 0) +
      (heirs['uncle_paternal'] || 0) +
      (heirs['uncle_maternal'] || 0)
    );
  }

  /**
   * حساب عدد الإناث
   * Count females
   */
  countFemales(heirs: HeirsData): number {
    return (
      (heirs['daughter'] || 0) +
      (heirs['mother'] || 0) +
      (heirs['grandmother'] || 0) +
      (heirs['full_sister'] || 0) +
      (heirs['half_sister_paternal'] || 0) +
      (heirs['half_sister_maternal'] || 0) +
      (heirs['aunt_paternal'] || 0) +
      (heirs['aunt_maternal'] || 0)
    );
  }

  /**
   * Get the madhab of this instance
   */
  getMadhab(): MadhhabType {
    return this.madhab;
  }
}```

## ./lib/inheritance/hooks.ts
```typescript
/**
 * Custom React Hooks for Islamic Inheritance Calculator
 * يحتوي على 5 hooks رئيسية لإدارة حالة الحسابات والنتائج والتسجيل
 * @author Merath App
 * @version 1.0.0
 */

import { useState, useCallback, useEffect } from 'react';
import { EnhancedInheritanceCalculationEngine as InheritanceCalculationEngine } from './enhanced-engine-complete';
import { AuditLog, createAuditLog, type AuditLogEntry } from './audit-log';
import { CalculationCache, PerformanceMonitor } from '../performance/optimization';
import type {
  EstateData,
  CalculationResult,
  MadhhabType,
  HeirType,
  HeirsData,
} from './types';

// ============================================================================
// 1. useCalculator Hook - إدارة حالة الحسابات الأساسية
// ============================================================================

export function useCalculator() {
  const [estateData, setEstateData] = useState<EstateData>({
    total: 0,
    funeral: 0,
    debts: 0,
    will: 0,
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateEstateData = useCallback((updates: Partial<EstateData>) => {
    setEstateData((prev) => ({
      ...prev,
      ...updates,
    }));
    setError(null);
  }, []);

  const resetCalculator = useCallback(() => {
    setEstateData({
      total: 0,
      funeral: 0,
      debts: 0,
      will: 0,
    });
    setResult(null);
    setError(null);
  }, []);

  const calculateWithMethod = useCallback(
    (madhab: MadhhabType, heirs: HeirsData) => {
      setIsCalculating(true);
      setError(null);

      try {
        if (estateData.total <= 0) {
          throw new Error('التركة يجب أن تكون أكبر من صفر');
        }

        const heirCount = Object.values(heirs).reduce(
          (sum, val) => (sum || 0) + (val || 0),
          0
        );
        if (heirCount === 0) {
          throw new Error('يجب تحديد ورثة واحد على الأقل');
        }

        // Check cache first
        const cachedResult = CalculationCache.getCalculation(madhab, estateData, heirs);
        if (cachedResult) {
          CalculationCache.recordHit(cachedResult.calculationTime || 0);
          setResult(cachedResult);
          return cachedResult;
        }

        // Perform calculation with performance monitoring
        const { result: calculationResult, duration } = PerformanceMonitor.measureSync(
          `Calculate [${madhab}]`,
          () => {
            const engine = new InheritanceCalculationEngine(madhab, estateData, heirs);
            return engine.calculate();
          }
        );

        if (!calculationResult) {
          throw new Error('فشل الحساب: لم يتم الحصول على نتيجة');
        }

        // Cache the result for future use
        CalculationCache.cacheCalculation(madhab, estateData, heirs, calculationResult, duration);
        CalculationCache.recordMiss(duration);

        setResult(calculationResult);
        return calculationResult;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'حدث خطأ غير معروف في الحساب';
        setError(errorMessage);
        setResult(null);
        return null;
      } finally {
        setIsCalculating(false);
      }
    },
    [estateData]
  );

  const getState = useCallback(
    () => ({
      estateData,
      result,
      isCalculating,
      error,
    }),
    [estateData, result, isCalculating, error]
  );

  return {
    estateData,
    result,
    isCalculating,
    error,
    updateEstateData,
    resetCalculator,
    calculateWithMethod,
    getState,
  };
}

// ============================================================================
// 2. useAuditLog Hook - الوصول لنظام التسجيل والبحث
// ============================================================================

export function useAuditLog() {
  const [auditLog] = useState(() => createAuditLog());
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const loadedEntries = auditLog.getAllEntries();
      setEntries(loadedEntries);
    } catch (err) {
      console.error('خطأ في تحميل سجل التسجيل:', err);
    } finally {
      setIsLoading(false);
    }
  }, [auditLog]);

  const logCalculation = useCallback(
    (
      madhab: MadhhabType,
      estate: EstateData,
      heirs: HeirsData,
      result: CalculationResult,
      duration?: number
    ) => {
      try {
        const entry = auditLog.logCalculation(
          madhab,
          heirs,
          estate,
          result,
          duration || 0,
          'حساب عادي'
        );
        setEntries((prev) => [...prev, entry]);
        return entry;
      } catch (err) {
        console.error('خطأ في تسجيل العملية:', err);
        return null;
      }
    },
    [auditLog]
  );

  const deleteEntry = useCallback(
    (id: string) => {
      try {
        const success = auditLog.deleteEntry(id);
        if (success) {
          setEntries((prev) => prev.filter((entry) => entry.id !== id));
        }
        return success;
      } catch (err) {
        console.error('خطأ في حذف الإدخال:', err);
        return false;
      }
    },
    [auditLog]
  );

  const searchEntries = useCallback(
    (madhab?: MadhhabType, operation?: string, limit?: number) => {
      try {
        const results = auditLog.filter({
          madhab,
          operation: operation as any,
          limit,
        });
        return results;
      } catch (err) {
        console.error('خطأ في البحث:', err);
        return [];
      }
    },
    [auditLog]
  );

  const getStats = useCallback(() => {
    try {
      return auditLog.getStats();
    } catch (err) {
      console.error('خطأ في الحصول على الإحصائيات:', err);
      return null;
    }
  }, [auditLog]);

  const clearAll = useCallback(() => {
    try {
      auditLog.clearAll();
      setEntries([]);
      return true;
    } catch (err) {
      console.error('خطأ في مسح السجل:', err);
      return false;
    }
  }, [auditLog]);

  const exportAsJSON = useCallback(() => {
    try {
      return auditLog.exportAsJSON();
    } catch (err) {
      console.error('خطأ في التصدير:', err);
      return null;
    }
  }, [auditLog]);

  const importFromJSON = useCallback(
    (jsonString: string) => {
      try {
        const imported = auditLog.importFromJSON(jsonString);
        setEntries(auditLog.getAllEntries());
        return imported;
      } catch (err) {
        console.error('خطأ في الاستيراد:', err);
        return null;
      }
    },
    [auditLog]
  );

  return {
    entries,
    isLoading,
    logCalculation,
    deleteEntry,
    searchEntries,
    getStats,
    clearAll,
    exportAsJSON,
    importFromJSON,
    auditLog,
  };
}

// ============================================================================
// 3. useResults Hook - إدارة حالة النتائج والتخزين المؤقت
// ============================================================================

export function useResults() {
  const [currentResult, setCurrentResult] = useState<CalculationResult | null>(null);
  const [previousResults, setPreviousResults] = useState<CalculationResult[]>([]);
  const [comparisonMode, setComparisonMode] = useState(false);

  const saveResult = useCallback((result: CalculationResult) => {
    setCurrentResult(result);
    setPreviousResults((prev) => {
      const updated = [result, ...prev];
      return updated.slice(0, 10);
    });
  }, []);

  const clearResults = useCallback(() => {
    setCurrentResult(null);
    setPreviousResults([]);
    setComparisonMode(false);
  }, []);

  const compareResults = useCallback(
    (result1: CalculationResult, result2: CalculationResult) => {
      const comparison = {
        isSame: true,
        differences: [] as string[],
        totalShareDifference: 0,
      };

      if (result1.madhab !== result2.madhab) {
        comparison.isSame = false;
        comparison.differences.push(
          `المذهب: ${result1.madhab} vs ${result2.madhab}`
        );
      }

      if (result1.shares.length !== result2.shares.length) {
        comparison.isSame = false;
        comparison.differences.push(
          `عدد الحصص: ${result1.shares.length} vs ${result2.shares.length}`
        );
      }

      const total1 = result1.shares.reduce((sum, s) => sum + s.amount, 0);
      const total2 = result2.shares.reduce((sum, s) => sum + s.amount, 0);
      const totalDiff = Math.abs(total1 - total2);

      if (totalDiff > 0.01) {
        comparison.isSame = false;
        comparison.differences.push(`المبلغ الإجمالي: ${total1} vs ${total2}`);
        comparison.totalShareDifference = totalDiff;
      }

      return comparison;
    },
    []
  );

  const getMostUsedMadhab = useCallback(() => {
    const madhabs: Record<MadhhabType, number> = {
      shafii: 0,
      hanafi: 0,
      maliki: 0,
      hanbali: 0,
    };

    previousResults.forEach((r) => {
      madhabs[r.madhab]++;
    });

    return (Object.entries(madhabs).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      'shafii') as MadhhabType;
  }, [previousResults]);

  const getAverageResult = useCallback(() => {
    if (previousResults.length === 0) return null;

    const totalAmount = previousResults.reduce(
      (sum, r) => sum + r.shares.reduce((s, share) => s + share.amount, 0),
      0
    );
    const avgAmount = totalAmount / previousResults.length;

    return {
      count: previousResults.length,
      averageAmount: avgAmount,
      mostUsedMadhab: getMostUsedMadhab(),
    };
  }, [previousResults, getMostUsedMadhab]);

  const getResultsStats = useCallback(() => {
    return {
      totalResults: previousResults.length,
      currentResult,
      previousResults,
      comparison:
        currentResult && previousResults.length > 1
          ? compareResults(currentResult, previousResults[1])
          : null,
      average: getAverageResult(),
    };
  }, [currentResult, previousResults, compareResults, getAverageResult]);

  return {
    currentResult,
    previousResults,
    comparisonMode,
    saveResult,
    clearResults,
    compareResults,
    getResultsStats,
    getAverageResult,
    setComparisonMode,
  };
}

// ============================================================================
// 4. useMadhab Hook - إدارة اختيار المذهب
// ============================================================================

export function useMadhab(defaultMadhab: MadhhabType = 'shafii') {
  const [madhab, setMadhab] = useState<MadhhabType>(defaultMadhab);
  const [madhabs] = useState<MadhhabType[]>([
    'shafii',
    'hanafi',
    'maliki',
    'hanbali',
  ]);

  const changeMadhab = useCallback(
    (newMadhab: MadhhabType) => {
      if (madhabs.includes(newMadhab)) {
        setMadhab(newMadhab);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('selectedMadhab', newMadhab);
          } catch (err) {
            console.warn('لا يمكن حفظ المذهب في التخزين المحلي:', err);
          }
        }
        return true;
      }
      return false;
    },
    [madhabs]
  );

  const loadSavedMadhab = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('selectedMadhab') as MadhhabType;
        if (saved && madhabs.includes(saved)) {
          setMadhab(saved);
          return saved;
        }
      } catch (err) {
        console.warn('لا يمكن تحميل المذهب المحفوظ:', err);
      }
    }
    return madhab;
  }, [madhabs, madhab]);

  const getMadhhabInfo = useCallback(() => {
    const info: Record<MadhhabType, string> = {
      shafii: 'الشافعي',
      hanafi: 'الحنفي',
      maliki: 'المالكي',
      hanbali: 'الحنبلي',
    };
    return info[madhab];
  }, [madhab]);

  const getMadhhabsList = useCallback(() => {
    const list: Record<MadhhabType, string> = {
      shafii: 'المذهب الشافعي',
      hanafi: 'المذهب الحنفي',
      maliki: 'المذهب المالكي',
      hanbali: 'المذهب الحنبلي',
    };
    return Object.entries(list).map(([value, label]) => ({
      value: value as MadhhabType,
      label,
    }));
  }, []);

  return {
    madhab,
    madhabs,
    changeMadhab,
    loadSavedMadhab,
    getMadhhabInfo,
    getMadhhabsList,
  };
}

// ============================================================================
// 5. useHeirs Hook - إدارة الورثة ديناميكياً مع منع التكرار
// ============================================================================

export function useHeirs(initialHeirs: HeirsData = {}) {
  const [heirs, setHeirs] = useState<
    Array<{ id: string; key: HeirType; count: number }>
  >(
    Object.entries(initialHeirs).map(([key, count]) => ({
      id: `heir-${key}`,
      key: key as HeirType,
      count: count || 0,
    }))
  );
  const [error, setError] = useState<string | null>(null);

  const addHeir = useCallback(
    (heir: { type: string; gender: 'male' | 'female'; count: number; relation?: string }) => {
      try {
        if (!heir.type || heir.type.trim() === '') {
          throw new Error('نوع الوارث مطلوب');
        }

        if (heir.count < 1) {
          throw new Error('عدد الورثة يجب أن يكون 1 على الأقل');
        }

        // FIX: Check for duplicate heir type
        const isDuplicate = heirs.some((h) => h.key === heir.type);
        if (isDuplicate) {
          throw new Error('هذا الوارث موجود بالفعل');
        }

        setHeirs((prev) => [
          ...prev,
          {
            id: `heir-${Date.now()}`,
            key: heir.type as HeirType,
            count: heir.count,
          },
        ]);
        setError(null);
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'خطأ غير معروف';
        setError(msg);
        return false;
      }
    },
    [heirs]
  );

  const updateHeir = useCallback((id: string, updates: { count?: number }) => {
    try {
      setHeirs((prev) =>
        prev.map((h) => (h.id === id ? { ...h, ...updates } : h))
      );
      setError(null);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'خطأ غير معروف';
      setError(msg);
      return false;
    }
  }, []);

  const removeHeir = useCallback(
    (id: string) => {
      try {
        const newHeirs = heirs.filter((h) => h.id !== id);
        if (newHeirs.length === 0) {
          throw new Error('يجب الاحتفاظ بوارث واحد على الأقل');
        }
        setHeirs(newHeirs);
        setError(null);
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'خطأ غير معروف';
        setError(msg);
        return false;
      }
    },
    [heirs]
  );

  const clearHeirs = useCallback(() => {
    setHeirs([]);
    setError(null);
  }, []);

  const validateHeirs = useCallback(() => {
    if (heirs.length === 0) {
      setError('يجب تحديد ورثة واحد على الأقل');
      return false;
    }

    const totalCount = heirs.reduce((sum, h) => sum + h.count, 0);
    if (totalCount === 0) {
      setError('يجب أن يكون هناك ورثة واحد على الأقل');
      return false;
    }

    setError(null);
    return true;
  }, [heirs]);

  const getHeirsStats = useCallback(() => {
    const stats = {
      totalCount: heirs.reduce((sum, h) => sum + h.count, 0),
      totalTypes: heirs.length,
      byGender: {
        male: 0,
        female: 0,
      },
      byType: {} as Record<HeirType, number>,
    };

    heirs.forEach((heir) => {
      stats.byType[heir.key] = (stats.byType[heir.key] || 0) + 1;
    });

    return stats;
  }, [heirs]);

  return {
    heirs,
    error,
    addHeir,
    updateHeir,
    removeHeir,
    clearHeirs,
    validateHeirs,
    getHeirsStats,
  };
}

export default {
  useCalculator,
  useAuditLog,
  useResults,
  useMadhab,
  useHeirs,
};```

## ./lib/inheritance/index.ts
```typescript
/**
 * Export All Inheritance System Components
 */
export * from './types';
export * from './constants';
export * from './fraction';
export * from './hijab-system';
export { EnhancedInheritanceCalculationEngine as InheritanceCalculationEngine } from './enhanced-engine-complete';
export * from './audit-log';
export * from './audit-trail-manager';
export * from './hooks';

// Export from utils, excluding the one that conflicts with constants
export {
  HEIR_NAMES,
  MADHAB_COLORS,
  MADHAB_ICONS,
  MADHAB_NAMES,
  isValidHeirType,
  formatCurrency,
  formatPercentage,
  lcm,
  gcd,
  generateId,
  measureTime,
  formatTime,
  validateEstateData,
  validateHeirsData,
  countTotalHeirs,
  countHeirTypes,
  sortHeirsByPriority,
  getHeirName,
  getMadhhabColor,
  getMadhhabIcon,
  getMadhhabName
} from './utils';```

## ./lib/inheritance/types.ts
```typescript
/**
 * نوع البيانات الأساسية لحاسبة المواريث الشرعية
 * Fundamental Data Types for Islamic Inheritance Calculator
 */

// ====== المذاهب الإسلامية ======
export type MadhhabType = 'shafii' | 'hanafi' | 'maliki' | 'hanbali';

// ====== أنواع الورثة ======
export type HeirType =
  | 'husband'
  | 'wife'
  | 'son'
  | 'daughter'
  | 'grandson'
  | 'granddaughter'
  | 'daughter_son'
  | 'daughter_daughter'
  | 'sister_children'
  | 'father'
  | 'mother'
  | 'grandfather'
  | 'grandmother'
  | 'grandmother_mother'
  | 'grandmother_father'
  | 'full_brother'
  | 'full_sister'
  | 'paternal_brother'
  | 'paternal_sister'
  | 'maternal_brother'
  | 'maternal_sister'
  | 'half_brother_paternal'
  | 'half_sister_paternal'
  | 'half_brother_maternal'
  | 'half_sister_maternal'
  | 'full_nephew'
  | 'paternal_nephew'
  | 'nephew_from_brother'
  | 'niece_from_brother'
  | 'full_uncle'
  | 'paternal_uncle'
  | 'maternal_uncle'
  | 'full_cousin'
  | 'paternal_cousin'
  | 'uncle_paternal'
  | 'uncle_maternal'
  | 'aunt_paternal'
  | 'aunt_maternal'
  | 'maternal_aunt'
  | 'paternal_aunt'
  | 'treasury';

// ====== بيانات التركة ======
export interface EstateData {
  total: number;        // إجمالي التركة بالريال
  funeral: number;     // تكاليف التجهيز والدفن
  funeralCosts?: number;  // تكاليف التجهيز والدفن (alternative name)
  debts: number;       // الديون المستحقة
  will: number;        // الوصية (تُحسب بثلث الباقي عادة)
  willAmount?: number;  // الوصية (alternative name)
}

// ====== بيانات الورثة ======
export interface HeirsData {
  [key: string]: number | undefined;
}

// ====== نظام الكسور ======
export interface FractionData {
  numerator: number;    // البسط
  denominator: number;  // المقام
}

// ====== حصة الوارث (Enhanced) ======
export interface HeirShare {
  heir?: string;
  key?: HeirType;
  name: string;
  count?: number;
  fraction?: FractionData;
  share?: number;
  percentage?: number;
  amount: number;
  shareType?: string;
  madhab?: MadhhabType;
  type?: string;
  shares?: Array<{
    person: number;
    amount: number;
  }>;
}

// ====== الحالات الخاصة ======
export interface SpecialCases {
  awl: boolean;
  auled: number;
  radd: boolean;
  hijabTypes: string[];
}

// ====== نتيجة الحساب (Enhanced) ======
export interface CalculationResult {
  success: boolean;
  madhab: MadhhabType;
  madhhabName: string;
  shares: HeirShare[];
  netEstate?: number;
  finalBase?: number;
  blockedHeirs?: string[];
  awlApplied?: boolean;
  raddApplied?: boolean;
  bloodRelativesApplied?: boolean;
  confidence: number;
  confidenceFactors?: string[]; // ADD THIS LINE
  steps: CalculationStep[];
  calculationTime: number;
  error?: string;
  specialCases?: SpecialCases;
  madhhabNotes?: string[];
  warnings?: string[];
}

// ====== خطوات الحساب ======
export interface CalculationStep {
  stepNumber: number;
  title: string;
  description: string;
  action: string;
  details: Record<string, any>;
  timestamp: string;
}

// ====== معلومات المذهب ======
export interface MadhhabConfig {
  code: MadhhabType;
  name: string;
  description: string;
  color: string;
  icon: string;
  rules: MadhhabRules;
}

// ====== قواعد المذهب ======
export interface MadhhabRules {
  grandfather_with_siblings: 'hijab' | 'musharak';
  mother_with_father_children: 'third_of_remainder' | 'sixth';
  mother_with_father_only: 'third' | 'sixth';
  spouse_radd: boolean;
  umariyyah_rule: 'first' | 'second';
}

// ====== حالات الاختبار ======
export interface TestCase {
  name: string;
  heirs: HeirsData;
  expected: Record<string, number>;
  tolerance?: number;
  madhab?: MadhhabType;
  description: string;
}

// ====== نتائج الاختبار ======
export interface TestResult {
  name: string;
  madhab: MadhhabType;
  passed: boolean;
  skipped: boolean;
  error?: string;
  discrepancies?: string[];
  testTime: number;
}

// ====== إدخالات السجل ======
export interface AuditEntry {
  id: string;
  timestamp: Date;
  action: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'calculation';
  message: string;
  details?: Record<string, any>;
  component?: string;
}
```

## ./lib/inheritance/utils.ts
```typescript
/**
 * دوال مساعدة وثوابت نظام المواريث
 * Helper Functions and Inheritance System Constants
 */

import { MadhhabType, HeirType } from './types';

/**
 * قائمة أسماء الورثة بالعربية
 * Matches original HTML (Merath_Cluade_Pro7.html) exactly
 */
export const HEIR_NAMES: Record<HeirType, string> = {
  husband: 'الزوج',
  wife: 'الزوجة',
  father: 'الأب',
  mother: 'الأم',
  grandfather: 'الجد',
  grandmother: 'الجدة',
  grandmother_mother: 'الجدة لأم',
  grandmother_father: 'الجدة لأب',
  son: 'الابن',
  daughter: 'البنت',
  grandson: 'ابن الابن',
  granddaughter: 'بنت الابن',
  full_brother: 'الأخ الشقيق',
  full_sister: 'الأخت الشقيقة',
  paternal_brother: 'الأخ لأب',
  paternal_sister: 'الأخت لأب',
  maternal_brother: 'الأخ لأم',
  maternal_sister: 'الأخت لأم',
  full_nephew: 'ابن الأخ الشقيق',
  paternal_nephew: 'ابن الأخ لأب',
  full_uncle: 'العم الشقيق',
  paternal_uncle: 'العم لأب',
  full_cousin: 'ابن العم الشقيق',
  paternal_cousin: 'ابن العم لأب',
  maternal_uncle: 'الخال',
  maternal_aunt: 'الخالة',
  paternal_aunt: 'العمة',
  daughter_son: 'ابن البنت',
  daughter_daughter: 'بنت البنت',
  sister_children: 'أولاد الأخت',
  half_brother_paternal: 'نصف أخ لأب',
  half_sister_paternal: 'نصف أخت لأب',
  half_brother_maternal: 'نصف أخ لأم',
  half_sister_maternal: 'نصف أخت لأم',
  nephew_from_brother: 'ابن الأخ',
  niece_from_brother: 'بنت الأخ',
  uncle_paternal: 'العم',
  uncle_maternal: 'الخال',
  aunt_paternal: 'العمة',
  aunt_maternal: 'الخالة',
  treasury: 'بيت المال'
};

/**
 * ألوان المذاهب
 */
export const MADHAB_COLORS: Record<MadhhabType, string> = {
  shafii: '#FF6B6B',
  hanafi: '#4ECDC4',
  maliki: '#45B7D1',
  hanbali: '#F7DC6F'
};

/**
 * أيقونات المذاهب
 */
export const MADHAB_ICONS: Record<MadhhabType, string> = {
  shafii: '🕌',
  hanafi: '📖',
  maliki: '⚖️',
  hanbali: '📜'
};

/**
 * أسماء المذاهب
 */
export const MADHAB_NAMES: Record<MadhhabType, string> = {
  shafii: 'المذهب الشافعي',
  hanafi: 'المذهب الحنفي',
  maliki: 'المذهب المالكي',
  hanbali: 'المذهب الحنبلي'
};

/**
 * التحقق من صحة المذهب
 */
export function isValidMadhab(madhab: any): madhab is MadhhabType {
  return ['shafii', 'hanafi', 'maliki', 'hanbali'].includes(madhab);
}

/**
 * التحقق من صحة نوع الوارث
 */
export function isValidHeirType(heir: any): heir is HeirType {
  return Object.keys(HEIR_NAMES).includes(heir);
}

/**
 * تنسيق المبلغ كعملة
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * تنسيق النسبة المئوية
 */
export function formatPercentage(decimal: number): string {
  return `${(decimal * 100).toFixed(2)}%`;
}

/**
 * حساب LCM (أقل مضاعف مشترك)
 */
export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

/**
 * حساب GCD (أكبر عامل مشترك)
 */
export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * توليد معرف فريد
 */
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * قياس وقت التنفيذ
 */
export function measureTime<T>(fn: () => T): { result: T; time: number } {
  const start = performance.now();
  const result = fn();
  const time = performance.now() - start;
  return { result, time };
}

/**
 * تنسيق الوقت بصيغة قابلة للقراءة
 */
export function formatTime(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${milliseconds.toFixed(2)}ms`;
  }
  return `${(milliseconds / 1000).toFixed(2)}s`;
}

/**
 * التحقق من صحة بيانات التركة
 */
export function validateEstateData(total: number, funeral: number, debts: number, will: number = 0): string | null {
  if (total <= 0) {
    return 'إجمالي التركة يجب أن يكون أكبر من صفر';
  }
  if (funeral < 0) {
    return 'تكاليف التجهيز لا يمكن أن تكون سالبة';
  }
  if (debts < 0) {
    return 'الديون لا يمكن أن تكون سالبة';
  }
  if (will < 0) {
    return 'الوصية لا يمكن أن تكون سالبة';
  }
  if (will > total / 3) {
    return 'الوصية لا يمكن أن تتجاوز ثلث التركة';
  }
  if (funeral + debts + will > total) {
    return 'التكاليف والديون والوصية تتجاوز إجمالي التركة';
  }
  return null;
}

/**
 * التحقق من صحة بيانات الورثة
 */
export function validateHeirsData(heirs: Record<string, number | undefined>): string | null {
  let hasHeirs = false;

  for (const [key, count] of Object.entries(heirs)) {
    if (count !== undefined) {
      if (!isValidHeirType(key)) {
        return `نوع وارث غير صحيح: ${key}`;
      }
      if (count < 0) {
        return `عدد الورثة لا يمكن أن يكون سالباً: ${key}`;
      }
      if (count > 0) {
        hasHeirs = true;
      }
    }
  }

  if (!hasHeirs) {
    return 'يجب تحديد ورثة واحد على الأقل';
  }

  return null;
}

/**
 * حساب عدد الورثة الإجمالي
 */
export function countTotalHeirs(heirs: Record<string, number | undefined>): number {
  let sum = 0;
  for (const count of Object.values(heirs)) {
    if (count !== undefined) {
      sum += count;
    }
  }
  return sum;
}

/**
 * حساب عدد أنواع الورثة
 */
export function countHeirTypes(heirs: Record<string, number | undefined>): number {
  return Object.values(heirs).filter(count => count && count > 0).length;
}

/**
 * ترتيب الورثة حسب الأولوية الفقهية
 */
export function sortHeirsByPriority(heirs: HeirType[]): HeirType[] {
  const priority: Record<HeirType, number> = {
    husband: 1,
    wife: 2,
    son: 3,
    daughter: 4,
    grandson: 3,
    granddaughter: 4,
    father: 5,
    mother: 6,
    grandfather: 7,
    grandmother: 8,
    grandmother_mother: 8,
    grandmother_father: 7,
    full_brother: 9,
    full_sister: 10,
    paternal_brother: 9,
    paternal_sister: 10,
    maternal_brother: 9,
    maternal_sister: 10,
    daughter_son: 3,
    daughter_daughter: 4,
    sister_children: 11,
    half_brother_paternal: 11,
    half_sister_paternal: 12,
    half_brother_maternal: 13,
    half_sister_maternal: 14,
    full_nephew: 15,
    paternal_nephew: 15,
    nephew_from_brother: 15,
    niece_from_brother: 16,
    full_uncle: 17,
    paternal_uncle: 17,
    uncle_paternal: 17,
    maternal_uncle: 19,
    uncle_maternal: 19,
    full_cousin: 21,
    paternal_cousin: 21,
    aunt_paternal: 18,
    paternal_aunt: 18,
    aunt_maternal: 20,
    maternal_aunt: 20,
    treasury: 100
  };

  return [...heirs].sort((a, b) => priority[a] - priority[b]);
}

/**
 * الحصول على اسم الوارث العربي
 */
export function getHeirName(heir: HeirType): string {
  return HEIR_NAMES[heir] || heir;
}

/**
 * الحصول على لون المذهب
 */
export function getMadhhabColor(madhab: MadhhabType): string {
  return MADHAB_COLORS[madhab];
}

/**
 * الحصول على أيقونة المذهب
 */
export function getMadhhabIcon(madhab: MadhhabType): string {
  return MADHAB_ICONS[madhab];
}

/**
 * الحصول على اسم المذهب
 */
export function getMadhhabName(madhab: MadhhabType): string {
  return MADHAB_NAMES[madhab];
}
```

## ./lib/legal/Disclaimers.ts
```typescript
/**
 * Legal Disclaimers & Privacy Policy
 * Phase 1: Legal Compliance
 */

export const LEGAL_DISCLAIMERS = {
  // Main disclaimer
  main: `
حاسبة المواريث الشرعية - تنويه قانوني وتخلي من المسؤولية

Islamic Inheritance Calculator - Legal Disclaimer

---

الجزء الأول: التنويهات القانونية

1. عدم الاستقلالية القانونية:
   هذا التطبيق يوفر معلومات عامة فقط ولا يعتبر مشورة قانونية أو شرعية رسمية.
   يجب عليك استشارة متخصص في الشريعة الإسلامية أو محامي قبل اتخاذ أي قرار نهائي.

2. مسؤولية الحسابات:
   - الحسابات تُجرى على أساس البيانات المدخلة من قبل المستخدم
   - نقص أو خطأ في البيانات المدخلة قد يؤدي إلى نتائج غير صحيحة
   - التطبيق لا يتحمل مسؤولية أي أخطاء حسابية ناتجة عن بيانات خاطئة

3. تنوع المذاهب الفقهية:
   - التطبيق يدعم المذاهب الأربعة (الحنفي، المالكي، الشافعي، الحنبلي)
   - النتائج قد تختلف حسب المذهب المختار
   - اختيار المذهب يعود لاجتهاد المستخدم ومذهبه الفقهي

4. الحالات الخاصة والمعقدة:
   - بعض الحالات الوراثية معقدة جداً وتتطلب مراجعة شرعية متخصصة
   - التطبيق يحاول التعامل مع معظم الحالات، لكن قد لا يغطي جميع السيناريوهات النادرة

5. عدم توفر الحماية القانونية:
   - استخدام هذا التطبيق على مسؤولية المستخدم الكاملة
   - التطبيق لا يوفر حماية قانونية أو ملزمة لأي نزاع
   - في حالة النزاع، يجب اللجوء إلى الجهات القضائية المختصة

---

Part One: Legal Disclaimers

1. Non-Professional Advice:
   This application provides general information only and does not constitute
   legal or religious counsel. You must consult with a Sharia specialist or
   lawyer before making any final decision.

2. Calculation Responsibility:
   - Calculations are performed based on data entered by the user
   - Missing or incorrect data may result in inaccurate results
   - The application is not responsible for calculation errors due to incorrect data

3. Diversity of Islamic Schools:
   - The application supports four schools (Hanafi, Maliki, Shafi'i, Hanbali)
   - Results may differ depending on the selected school
   - School selection is at the user's discretion and follows their Islamic school

4. Complex and Special Cases:
   - Some inheritance cases are complex and require specialized legal review
   - The application attempts to handle most cases but may not cover all rare scenarios

5. No Legal Protection:
   - Use of this application is at the user's complete responsibility
   - The application does not provide legal protection or enforce any disputes
   - In case of dispute, you must resort to competent courts
  `,

  // Privacy Policy
  privacy: `
سياسة الخصوصية
Privacy Policy

---

سياسة الخصوصية - حاسبة المواريث الشرعية

Personal Information We Collect:
1. Input Data:
   - Estate amounts and debts
   - Heir information and relationships
   - Madhab (Islamic school) selection

2. How We Use Your Data:
   - To perform calculations as requested
   - To save your calculation history locally on your device
   - To provide better user experience
   - To improve the application features

3. Data Protection:
   - All data is stored locally on your device
   - No data is sent to external servers without your explicit consent
   - You have full control over your data and can delete it anytime

4. Third-Party Services:
   - We use expo-print for PDF generation (processes data locally)
   - We use expo-sharing for file sharing (controlled by user)
   - These services follow their own privacy policies

5. Security:
   - We use encryption for sensitive data
   - Regular security updates are provided
   - User data is protected to the best of our ability

6. Your Rights:
   - You have the right to access your data
   - You have the right to delete your data at any time
   - You have the right to request data export
   - You can opt-out of any tracking (none enabled by default)

7. Contact Us:
   - For privacy concerns, contact: privacy@merathapp.com
   - Response time: within 7 working days

---

سياسة الخصوصية

المعلومات الشخصية التي نجمعها:
1. بيانات الإدخال:
   - مبالغ التركة والديون
   - معلومات الورثة والعلاقات
   - اختيار المذهب الفقهي

2. كيفية استخدام بياناتك:
   - إجراء الحسابات كما طلبت
   - حفظ سجل الحسابات على جهازك
   - تحسين تجربة المستخدم
   - تطوير مميزات التطبيق

3. حماية البيانات:
   - جميع البيانات مخزنة محلياً على جهازك
   - لا يتم إرسال أي بيانات إلى خوادم خارجية بدون موافقتك الصريحة
   - لديك السيطرة الكاملة على بياناتك وحق حذفها في أي وقت

4. خدمات الطرف الثالث:
   - نستخدم expo-print لإنشاء ملفات PDF (معالجة محلية)
   - نستخدم expo-sharing لمشاركة الملفات (يتحكم فيها المستخدم)
   - هذه الخدمات تتبع سياسات الخصوصية الخاصة بها

5. الأمان:
   - نستخدم التشفير للبيانات الحساسة
   - يتم توفير تحديثات أمان منتظمة
   - تتم حماية بيانات المستخدم بأقصى ما توفره قدراتنا

6. حقوقك:
   - لديك الحق في الوصول إلى بياناتك
   - لديك الحق في حذف بياناتك في أي وقت
   - لديك الحق في طلب تصدير بياناتك
   - يمكنك الامتناع عن أي تتبع (لا يوجد تتبع مفعل افتراضياً)

7. التواصل معنا:
   - للقلق بشأن الخصوصية، اتصل بنا: privacy@merathapp.com
   - وقت الاستجابة: خلال 7 أيام عمل
  `,

  // Terms of Service
  terms: `
شروط الخدمة
Terms of Service

---

1. قبول الشروط:
   باستخدامك هذا التطبيق، فأنت توافق على جميع شروط الخدمة هذه.

2. استخدام التطبيق:
   - يمكنك استخدام التطبيق فقط للأغراض المشروعة
   - يُحظر استخدام التطبيق لأي أغراض غير قانونية
   - أنت مسؤول عن سرية بيانات اعتماد حسابك

3. الملكية الفكرية:
   - جميع محتويات التطبيق محمية بموجب حقوق الطبع والنشر
   - لا يُسمح بنسخ أو توزيع المحتوى بدون إذن

4. الحدود والمسؤوليات:
   - التطبيق يُقدم "كما هو" بدون أي ضمانات
   - نحن لا نضمن عدم وجود أخطاء أو انقطاعات
   - نحن لا نتحمل مسؤولية الأضرار الناجمة عن استخدام التطبيق

5. إنهاء الخدمة:
   - يمكننا إنهاء حسابك في أي وقت لأسباب وجيهة
   - يمكنك إنهاء استخدام التطبيق في أي وقت

6. التعديلات:
   - نحتفظ بحق تعديل الشروط في أي وقت
   - التعديلات تسري فور نشرها

---

1. Acceptance of Terms:
   By using this application, you agree to all these terms of service.

2. Application Usage:
   - You may only use the application for lawful purposes
   - Use of the application for illegal purposes is prohibited
   - You are responsible for keeping your account credentials confidential

3. Intellectual Property:
   - All application content is protected by copyright
   - Copying or distributing content without permission is prohibited

4. Limitations and Liability:
   - The application is provided "as is" without warranties
   - We do not guarantee absence of errors or interruptions
   - We are not responsible for damages resulting from application use

5. Service Termination:
   - We may terminate your account at any time for valid reasons
   - You may stop using the application at any time

6. Modifications:
   - We reserve the right to modify terms at any time
   - Modifications are effective upon publication
  `,

  // Data Collection Consent
  dataConsent: `
موافقة جمع البيانات
Data Collection Consent

يوافق المستخدم على:
✓ جمع البيانات المدخلة للعمليات الحسابية
✓ حفظ سجل العمليات على الجهاز
✓ استخدام البيانات لتحسين التطبيق
✓ الكشف عن الأخطاء والمشاكل التقنية

يرفض المستخدم:
✗ بيع بياناته
✗ مشاركة بياناته مع أطراف ثالثة
✗ الاستخدامات التجارية لبياناته الشخصية

---

User consents to:
✓ Collection of data for calculations
✓ Saving operation history on device
✓ Using data to improve the application
✓ Detecting errors and technical issues

User does not consent to:
✗ Selling their data
✗ Sharing data with third parties
✗ Commercial use of their personal data
  `,
};

/**
 * Get disclaimer for specific type
 */
export function getDisclaimer(type: 'main' | 'privacy' | 'terms' | 'dataConsent'): string {
  return LEGAL_DISCLAIMERS[type];
}

/**
 * Check if user has accepted disclaimers
 */
export function hasAcceptedDisclaimers(disclaimerId: string): boolean {
  // This would typically check localStorage or secure storage
  // For now, returning false to require acceptance
  return false;
}

/**
 * Record disclaimer acceptance
 */
export function recordDisclaimerAcceptance(disclaimerId: string): void {
  // This would typically save to localStorage or secure storage
  const timestamp = new Date().toISOString();
  console.log(`Disclaimer ${disclaimerId} accepted at ${timestamp}`);
}
```

## ./lib/performance/bundle-analyzer.ts
```typescript
/**
 * @file lib/performance/bundle-analyzer.ts
 * @description Utilities for analyzing and optimizing bundle size
 */

export const bundleOptimizationTips = {
  hermes: {
    description: 'Hermes JavaScript Engine',
    benefit: 'Reduces APK size by ~30% and improves startup time',
    status: '✅ ENABLED in app.config.ts',
    impact: 'High Priority',
  },

  proguard: {
    description: 'ProGuard Code Obfuscation',
    benefit: 'Obfuscates code and removes unused code, reducing APK by ~15-20%',
    status: '✅ ENABLED in app.config.ts',
    impact: 'High Priority',
  },

  bundleSize: {
    description: 'Bundle Size Reduction',
    tips: [
      'Remove unused dependencies - audit with: npm audit',
      'Tree-shake unused exports - TypeScript compiler settings',
      'Lazy load screens and components',
      'Split large components into smaller ones',
      'Use dynamic imports for features',
    ],
  },

  imageOptimization: {
    description: 'Image Optimization',
    tips: [
      'Convert PNG to WebP format where supported',
      'Compress images using tools like ImageMagick',
      'Use expo-image for better performance',
      'Implement responsive images for different screens',
    ],
  },

  dependencies: {
    description: 'Dependency Management',
    tips: [
      'Review all dependencies regularly',
      'Replace heavy packages with lighter alternatives',
      'Keep dependencies updated for security and performance',
      'Use npm-check-updates: ncu --upgrade',
    ],
  },

  networkOptimization: {
    description: 'Network Optimization',
    tips: [
      'Minimize API calls',
      'Use caching strategies',
      'Compress API responses',
      'Implement request debouncing',
    ],
  },

  memoryOptimization: {
    description: 'Memory Optimization',
    tips: [
      'Avoid memory leaks - unsubscribe from observables',
      'Limit cache sizes',
      'Release resources in cleanup functions',
      'Monitor memory usage in DevTools',
    ],
  },
};

// Target APK sizes
export const apkTargets = {
  min: {
    name: 'Minimal',
    size: 50,
    description: 'Stripped down version with essential features only',
  },
  optimal: {
    name: 'Optimal',
    size: 85,
    description: 'All features with good compression',
  },
  full: {
    name: 'Full',
    size: 120,
    description: 'All features, all languages, all assets',
  },
};

/**
 * Analyze bundle size optimization strategies
 */
export function analyzeBundleOptimization(currentSizeInMB: number): {
  currentSize: number;
  targetSize: number;
  reductionNeeded: number;
  percentReduction: number;
  recommendations: string[];
} {
  const targetSize = apkTargets.optimal.size;
  const reductionNeeded = currentSizeInMB - targetSize;
  const percentReduction = (reductionNeeded / currentSizeInMB) * 100;

  const recommendations: string[] = [];

  if (currentSizeInMB > 150) {
    recommendations.push(
      '⚠️ APK is significantly larger than recommended. Implement all optimizations.'
    );
    recommendations.push('Enable Hermes engine (already enabled)');
    recommendations.push('Enable ProGuard/R8 (already enabled)');
  }

  if (currentSizeInMB > 100) {
    recommendations.push('Review and remove unused dependencies');
    recommendations.push('Implement code splitting for screens');
    recommendations.push('Optimize and compress images');
  }

  if (percentReduction > 0) {
    recommendations.push(
      `Target: ${targetSize}MB (reduce by ${reductionNeeded.toFixed(1)}MB or ${percentReduction.toFixed(1)}%)`
    );
  } else {
    recommendations.push('✅ Within target size!');
  }

  return {
    currentSize: currentSizeInMB,
    targetSize,
    reductionNeeded: Math.max(0, reductionNeeded),
    percentReduction: Math.max(0, percentReduction),
    recommendations,
  };
}

/**
 * Get optimization checklist
 */
export function getOptimizationChecklist() {
  return [
    { item: 'Enable Hermes engine', done: true, estimatedSavings: '30%' },
    { item: 'Enable ProGuard/R8', done: true, estimatedSavings: '15-20%' },
    { item: 'Remove unused dependencies', done: false, estimatedSavings: '5-10%' },
    { item: 'Implement lazy loading', done: false, estimatedSavings: '3-5%' },
    { item: 'Optimize images', done: false, estimatedSavings: '10-15%' },
    { item: 'Code splitting', done: false, estimatedSavings: '5%' },
    { item: 'Tree-shake unused exports', done: false, estimatedSavings: '2-5%' },
  ];
}

export default {
  bundleOptimizationTips,
  apkTargets,
  analyzeBundleOptimization,
  getOptimizationChecklist,
};
```

## ./lib/performance/optimization.ts
```typescript
/**
 * Performance Optimization Module
 * Phase 4: Application Performance & Optimization
 *
 * Provides utilities for memoization, performance tracking,
 * and optimization of expensive calculations
 */

import { CalculationResult, EstateData, HeirsData, MadhhabType } from '../inheritance/types';

export interface PerformanceMetrics {
  calculationTime: number;
  cacheHits: number;
  cacheMisses: number;
  memoryUsage?: number;
  timestamp: Date;
}

/**
 * Calculation Cache Manager
 * Stores and retrieves cached calculation results
 */
export class CalculationCache {
  private static cache: Map<string, CalculationResult> = new Map();
  private static metrics: PerformanceMetrics[] = [];
  private static maxCacheSize = 100;

  /**
   * Generate cache key from calculation parameters
   */
  private static generateKey(
    madhab: MadhhabType,
    estate: EstateData,
    heirs: HeirsData
  ): string {
    const estateString = Object.entries(estate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join('|');

    const heirsString = Object.entries(heirs)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join('|');

    return `${madhab}:${estateString}:${heirsString}`;
  }

  /**
   * Get cached calculation result
   */
  static getCalculation(
    madhab: MadhhabType,
    estate: EstateData,
    heirs: HeirsData
  ): CalculationResult | null {
    const key = this.generateKey(madhab, estate, heirs);
    return this.cache.get(key) || null;
  }

  /**
   * Store calculation result in cache
   */
  static cacheCalculation(
    madhab: MadhhabType,
    estate: EstateData,
    heirs: HeirsData,
    result: CalculationResult,
    calculationTime: number
  ): void {
    const key = this.generateKey(madhab, estate, heirs);

    // Enforce cache size limit
    if (this.cache.size >= this.maxCacheSize) {
      // Remove oldest entry (first one)
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, result);
    this.recordMetric(calculationTime, true);
  }

  /**
   * Track cache hit
   */
  static recordHit(calculationTime: number): void {
    this.recordMetric(calculationTime, true);
  }

  /**
   * Track cache miss
   */
  static recordMiss(calculationTime: number): void {
    this.recordMetric(calculationTime, false);
  }

  /**
   * Record performance metric
   */
  private static recordMetric(calculationTime: number, isHit: boolean): void {
    const lastMetric = this.metrics[this.metrics.length - 1];
    const newMetric: PerformanceMetrics = {
      calculationTime,
      cacheHits: (lastMetric?.cacheHits || 0) + (isHit ? 1 : 0),
      cacheMisses: (lastMetric?.cacheMisses || 0) + (isHit ? 0 : 1),
      timestamp: new Date(),
    };

    this.metrics.push(newMetric);

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  /**
   * Get performance statistics
   */
  static getStats(): {
    totalCalculations: number;
    hitRate: number;
    avgCalculationTime: number;
    cacheSize: number;
  } {
    if (this.metrics.length === 0) {
      return {
        totalCalculations: 0,
        hitRate: 0,
        avgCalculationTime: 0,
        cacheSize: 0,
      };
    }

    const lastMetric = this.metrics[this.metrics.length - 1];
    const totalCalcs = lastMetric.cacheHits + lastMetric.cacheMisses;
    const avgTime =
      this.metrics.reduce((sum, m) => sum + m.calculationTime, 0) / this.metrics.length;

    return {
      totalCalculations: totalCalcs,
      hitRate: totalCalcs > 0 ? (lastMetric.cacheHits / totalCalcs) * 100 : 0,
      avgCalculationTime: avgTime,
      cacheSize: this.cache.size,
    };
  }

  /**
   * Clear cache
   */
  static clear(): void {
    this.cache.clear();
    this.metrics = [];
  }

  /**
   * Export metrics as JSON
   */
  static exportMetrics(): string {
    return JSON.stringify(
      {
        stats: this.getStats(),
        metrics: this.metrics,
        timestamp: new Date().toISOString(),
      },
      null,
      2
    );
  }
}

/**
 * Performance Monitor
 * Tracks and logs performance metrics
 */
export class PerformanceMonitor {
  private static enabled = true;

  static enable(): void {
    this.enabled = true;
  }

  static disable(): void {
    this.enabled = false;
  }

  /**
   * Measure function execution time
   */
  static async measure<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<{ result: T; duration: number }> {
    if (!this.enabled) {
      return { result: await fn(), duration: 0 };
    }

    const startTime = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - startTime;

      if (duration > 100) {
        // Log slow operations
        console.warn(`[Performance] ${name} took ${duration.toFixed(2)}ms`);
      }

      return { result, duration };
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`[Performance Error] ${name} failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }

  /**
   * Measure synchronous function execution time
   */
  static measureSync<T>(name: string, fn: () => T): { result: T; duration: number } {
    if (!this.enabled) {
      return { result: fn(), duration: 0 };
    }

    const startTime = performance.now();
    try {
      const result = fn();
      const duration = performance.now() - startTime;

      if (duration > 50) {
        // Log slow operations (lower threshold for sync)
        console.warn(`[Performance] ${name} took ${duration.toFixed(2)}ms`);
      }

      return { result, duration };
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`[Performance Error] ${name} failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }
}

/**
 * Debounce function for optimizing frequent calculations
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delayMs);
  };
}

/**
 * Throttle function for rate-limiting operations
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limitMs: number
): (...args: Parameters<T>) => void {
  let lastRun = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastRun >= limitMs) {
      fn(...args);
      lastRun = now;
    }
  };
}

/**
 * Memoization decorator for expensive calculations
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);

    // Keep cache size reasonable (max 1000 entries)
    if (cache.size > 1000) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return result;
  }) as T;
}

export default {
  CalculationCache,
  PerformanceMonitor,
  debounce,
  throttle,
  memoize,
};
```

## ./lib/performance/utils.ts
```typescript
/**
 * @file lib/performance/index.ts
 * @description Performance monitoring and optimization utilities
 */

// Performance metrics tracking
const metrics: Map<string, number[]> = new Map();

export const performanceUtils = {
  /**
   * Measure the duration of an async function
   */
  measureAsync: async <T>(
    label: string,
    fn: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      recordMetric(label, duration);
      logIfSlow(label, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      recordMetric(label, duration);
      console.error(`${label} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  },

  /**
   * Measure the duration of a sync function
   */
  measureSync: <T>(
    label: string,
    fn: () => T
  ): T => {
    const start = performance.now();
    try {
      const result = fn();
      const duration = performance.now() - start;
      recordMetric(label, duration);
      logIfSlow(label, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      recordMetric(label, duration);
      console.error(`${label} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  },

  /**
   * Get performance statistics for a metric
   */
  getMetrics: (label?: string) => {
    if (!label) {
      const stats: Record<string, any> = {};
      metrics.forEach((values, key) => {
        stats[key] = getStats(values);
      });
      return stats;
    }

    const values = metrics.get(label);
    return values ? getStats(values) : null;
  },

  /**
   * Clear metrics
   */
  clearMetrics: (label?: string) => {
    if (label) {
      metrics.delete(label);
    } else {
      metrics.clear();
    }
  },

  /**
   * Log all metrics to console for debugging
   */
  logMetrics: () => {
    console.log('=== Performance Metrics ===');
    metrics.forEach((values, label) => {
      const stats = getStats(values);
      console.log(`${label}:`, {
        count: stats.count,
        avg: `${stats.average.toFixed(2)}ms`,
        min: `${stats.min.toFixed(2)}ms`,
        max: `${stats.max.toFixed(2)}ms`,
      });
    });
  },
};

function recordMetric(label: string, duration: number) {
  if (!metrics.has(label)) {
    metrics.set(label, []);
  }
  metrics.get(label)!.push(duration);
}

function logIfSlow(label: string, duration: number, threshold = 100) {
  if (duration > threshold) {
    console.warn(
      `⚠️ Performance Warning: ${label} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`
    );
  }
}

interface PerformanceStats {
  count: number;
  average: number;
  min: number;
  max: number;
  total: number;
}

function getStats(values: number[]): PerformanceStats {
  if (values.length === 0) {
    return { count: 0, average: 0, min: 0, max: 0, total: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const total = sorted.reduce((a, b) => a + b, 0);
  const average = total / sorted.length;

  return {
    count: sorted.length,
    average,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    total,
  };
}

// Disable console logs in production
if (__DEV__ === false) {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  // Keep console.error for critical issues
}

export default performanceUtils;
```

## ./lib/validation/InputValidator.ts
```typescript
/**
 * Enhanced Validation System with User Feedback
 * Phase 1: User-Centric Validation Messages
 * 
 * Provides detailed validation with localized, user-friendly feedback
 */

import { EstateData, HeirsData, MadhhabType } from '../inheritance/types';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationMessage[];
  warnings: ValidationMessage[];
}

export interface ValidationMessage {
  field: string;
  userMessage: string;
  technicalMessage: string;
  severity: 'error' | 'warning';
  suggestion?: string;
}

/**
 * Estate Validation with User Messages
 */
export class EstateValidator {
  static validate(estate: EstateData): ValidationResult {
    const errors: ValidationMessage[] = [];
    const warnings: ValidationMessage[] = [];

    // CRITICAL FIX: Validate total estate - must be > 0
    if (!estate.total || estate.total <= 0) {
      errors.push({
        field: 'estate.total',
        userMessage: 'يجب إدخال المبلغ الإجمالي للتركة (أكبر من صفر)',
        technicalMessage: 'Estate total must be a positive number',
        severity: 'error',
        suggestion: 'أدخل المبلغ الإجمالي للتركة (مثل: 100000)',
      });
    }

    // Validate funeral costs
    if (estate.funeral && estate.funeral < 0) {
      errors.push({
        field: 'estate.funeral',
        userMessage: 'تكاليف التجهيز لا يمكن أن تكون سالبة',
        technicalMessage: 'Funeral costs cannot be negative',
        severity: 'error',
        suggestion: 'أدخل مبلغ موجب أو اترك الحقل فارغاً',
      });
    }

    // Validate debts
    if (estate.debts && estate.debts < 0) {
      errors.push({
        field: 'estate.debts',
        userMessage: 'الديون لا يمكن أن تكون سالبة',
        technicalMessage: 'Debts cannot be negative',
        severity: 'error',
        suggestion: 'أدخل مبلغ موجب أو اترك الحقل فارغاً',
      });
    }

    // Validate will amount
    if (estate.will && estate.will < 0) {
      errors.push({
        field: 'estate.will',
        userMessage: 'الوصية لا يمكن أن تكون سالبة',
        technicalMessage: 'Will amount cannot be negative',
        severity: 'error',
        suggestion: 'أدخل مبلغ موجب أو اترك الحقل فارغاً',
      });
    }

    // Only proceed with additional validation if total is valid
    if (estate.total && estate.total > 0) {
      // Validate will does not exceed 1/3 of total estate
      if (estate.will && estate.will > estate.total / 3) {
        errors.push({
          field: 'estate.will',
          userMessage: 'الوصية لا يمكن أن تتجاوز ثلث التركة',
          technicalMessage: 'Will cannot exceed 1/3 of total estate per Islamic law',
          severity: 'error',
          suggestion: `الحد الأقصى للوصية: ${(estate.total / 3).toFixed(2)} (ثلث التركة)`,
        });
      }

      // Check if debts/funeral/will exceed total
      const deductions = (estate.funeral || 0) + (estate.debts || 0) + (estate.will || 0);
      if (deductions > estate.total) {
        errors.push({
          field: 'estate.total',
          userMessage: 'مجموع الديون والتكاليف والوصية لا يمكن أن يتجاوز التركة',
          technicalMessage: 'Total deductions cannot exceed estate',
          severity: 'error',
          suggestion: 'تأكد من أن الديون والتكاليف والوصية أقل من أو تساوي التركة الإجمالية',
        });
      }

      // Warning: Large deductions
      if (deductions > estate.total * 0.5) {
        warnings.push({
          field: 'estate.total',
          userMessage: 'الديون والتكاليف تشكل أكثر من 50% من التركة',
          technicalMessage: 'Large deductions detected',
          severity: 'warning',
          suggestion: 'تحقق من صحة المبالغ',
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

/**
 * Heir Validation with User Messages
 */
export class HeirValidator {
  static validate(heirs: HeirsData): ValidationResult {
    const errors: ValidationMessage[] = [];
    const warnings: ValidationMessage[] = [];

    // Check if heirs object is empty
    if (!heirs || Object.keys(heirs).length === 0) {
      errors.push({
        field: 'heirs',
        userMessage: 'يجب إضافة واحد على الأقل من الورثة',
        technicalMessage: 'At least one heir must be specified',
        severity: 'error',
        suggestion: 'أضف الورثة الذين سيتقاسمون التركة',
      });
    }

    // Validate each heir
    for (const [heirKey, count] of Object.entries(heirs)) {
      if (count === undefined || count === null) {
        continue;
      }

      if (typeof count !== 'number' || count < 0) {
        errors.push({
          field: `heirs.${heirKey}`,
          userMessage: `العدد غير صحيح للوارث: ${heirKey}`,
          technicalMessage: `Invalid count for heir: ${heirKey}`,
          severity: 'error',
          suggestion: 'أدخل عدد موجب من الورثة',
        });
      }

      if (count > 100) {
        warnings.push({
          field: `heirs.${heirKey}`,
          userMessage: `عدد كبير جداً من الورثة: ${count}`,
          technicalMessage: `Unusual heir count: ${count}`,
          severity: 'warning',
          suggestion: 'تحقق من صحة عدد الورثة',
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate incompatible heir combinations
   */
  static validateCombinations(heirs: HeirsData): ValidationMessage[] {
    const messages: ValidationMessage[] = [];

    const hasHusband = heirs.husband && heirs.husband > 0;
    const hasWife = heirs.wife && heirs.wife > 0;
    const hasFather = heirs.father && heirs.father > 0;
    const hasMother = heirs.mother && heirs.mother > 0;

    // Warning: Both spouses
    if (hasHusband && hasWife) {
      messages.push({
        field: 'heirs.spouses',
        userMessage: 'التحقق: يوجد زوج وزوجة',
        technicalMessage: 'Both husband and wife detected',
        severity: 'warning',
        suggestion: 'تأكد من صحة بيانات الزوجين',
      });
    }

    return messages;
  }
}

/**
 * Madhab Validation
 */
export class MadhhabValidator {
  static validate(madhab: MadhhabType): ValidationResult {
    const errors: ValidationMessage[] = [];
    const validMadhabs: MadhhabType[] = ['hanafi', 'maliki', 'shafii', 'hanbali'];

    if (!validMadhabs.includes(madhab)) {
      errors.push({
        field: 'madhab',
        userMessage: 'يجب اختيار مذهب فقهي صحيح',
        technicalMessage: `Invalid madhab: ${madhab}`,
        severity: 'error',
        suggestion: 'اختر بين: الحنفي، المالكي، الشافعي، الحنبلي',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
    };
  }
}

/**
 * Comprehensive Input Validator
 */
export class InputValidator {
  static validateAll(
    madhab: MadhhabType,
    estate: EstateData,
    heirs: HeirsData
  ): ValidationResult {
    const results: ValidationResult[] = [];

    results.push(MadhhabValidator.validate(madhab));
    results.push(EstateValidator.validate(estate));
    results.push(HeirValidator.validate(heirs));

    const combinationMessages = HeirValidator.validateCombinations(heirs);

    const allErrors = results.flatMap(r => r.errors);
    const allWarnings = [
      ...results.flatMap(r => r.warnings),
      ...combinationMessages,
    ];

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
    };
  }

  /**
   * Get user-friendly message summary
   */
  static getMessageSummary(result: ValidationResult): string {
    if (result.isValid && result.warnings.length === 0) {
      return 'تم التحقق من البيانات بنجاح ✓';
    }

    let summary = '';

    if (result.errors.length > 0) {
      summary += `❌ ${result.errors.length} خطأ:\n`;
      result.errors.forEach(e => {
        summary += `• ${e.userMessage}\n`;
        if (e.suggestion) {
          summary += `  💡 ${e.suggestion}\n`;
        }
      });
    }

    if (result.warnings.length > 0) {
      summary += `\n⚠️ ${result.warnings.length} تحذير:\n`;
      result.warnings.forEach(w => {
        summary += `• ${w.userMessage}\n`;
        if (w.suggestion) {
          summary += `  💡 ${w.suggestion}\n`;
        }
      });
    }

    return summary;
  }
}```

## ./navigation/RootNavigator.tsx
```typescript
/**
 * Root Navigator Configuration
 * Phase 6: App Integration & Navigation
 * 
 * Main navigation orchestration with bottom tab navigation
 * Integrates all screens and navigation flows
 */

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { I18nManager, Platform } from 'react-native';

// Types
import type { RootStackParamList, TabParamList } from './types';
import { linking } from './linking';

// Screens
import CalculatorScreen from '../screens/CalculatorScreen';
import HistoryScreen from '../screens/HistoryScreen';
import AuditTrailScreen from '../screens/AuditTrailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';

// Initialize RTL once at module load time
let rtlInitialized = false;
if (!rtlInitialized && Platform.OS !== 'web') {
  I18nManager.forceRTL(true);
  rtlInitialized = true;
}

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Tab Navigator
 * Provides bottom tab navigation between main screens
 */
export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: '#1F2937',
        },
        headerTitleAlign: 'center',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'calculator';

          if (route.name === 'Calculator') {
            iconName = focused ? 'calculator' : 'calculator-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'AuditTrail') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'About') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#9CA3AF',
        lazy: true,
      })}
    >
      <Tab.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={{
          title: 'حاسبة المواريث',
          tabBarLabel: 'الحاسبة',
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'سجل العمليات',
          tabBarLabel: 'السجل',
        }}
      />
      <Tab.Screen
        name="AuditTrail"
        component={AuditTrailScreen}
        options={{
          title: 'سجل التدقيق',
          tabBarLabel: 'التدقيق',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'الإعدادات',
          tabBarLabel: 'الإعدادات',
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'حول التطبيق',
          tabBarLabel: 'حول',
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * Root Navigator
 * Main navigation container with stack for handling modals/errors
 */
export function RootNavigator() {
  const [isReady, setIsReady] = useState(false);
  const navigationRef = React.useRef<any>(null);

  return (
    <NavigationContainer 
      ref={navigationRef}
      linking={linking}
      onReady={() => {
        setIsReady(true);
      }}
      fallback={
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      }
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="MainApp"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default RootNavigator;
```

## ./navigation/index.ts
```typescript
/**
 * Navigation Module Exports
 * Phase 6: App Integration & Navigation
 * 
 * Central export point for all navigation-related modules
 */

export { RootNavigator, TabNavigator } from './RootNavigator';
export * from './types';
export { linking, getDeepLink } from './linking';
```

## ./navigation/linking.ts
```typescript
/**
 * Deep Linking Configuration
 * Phase 6: App Integration & Navigation
 * 
 * Configures URL schemes and deep linking routes
 */

import { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from './types';

/**
 * Linking configuration for deep linking support
 * Supports merath:// scheme and https://merath.app domain
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['merath://', 'https://merath.app', 'https://www.merath.app'],
  config: {
    screens: {
      MainApp: '/',
      Details: 'details/:id',
      Error: 'error/:message',
    },
  },
};

/**
 * Deep link route examples:
 * 
 * merath://
 * merath://details/xyz789
 * merath://error/not-found
 * 
 * https://merath.app/
 * https://merath.app/details/xyz789
 * https://merath.app/error/not-found
 */

export const getDeepLink = (screen: string, params?: Record<string, string>): string => {
  let url = `merath://${screen}`;
  
  if (params) {
    const queryString = new URLSearchParams(params).toString();
    url += `?${queryString}`;
  }
  
  return url;
};
```

## ./navigation/types.ts
```typescript
/**
 * Navigation Type Definitions
 * Phase 6: App Integration & Navigation
 * 
 * Defines all navigation types and parameter lists for the app
 */

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

/**
 * Root Stack Parameter List
 * Defines top-level navigation screens
 */
export type RootStackParamList = {
  MainApp: undefined;
  Details: { id: string };
  Error: { message: string };
};

/**
 * Tab Parameter List
 * Defines bottom tab screens
 */
export type TabParamList = {
  Calculator: undefined;
  History: undefined;
  AuditTrail: undefined;
  Settings: undefined;
  About: undefined;
};

/**
 * Calculator Tab Param List
 * Specific parameters for calculator navigation
 */
export type CalculatorParamList = {
  Main: undefined;
  Results: { calculationId: string };
};

/**
 * Navigation Props Type
 * For use in any bottom tab screen
 */
export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;

/**
 * Stack Navigation Props Type
 * For use in any stack screen
 */
export type StackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Calculator Navigation Props
 */
export type CalculatorNavigationProp = NativeStackNavigationProp<CalculatorParamList>;

/**
 * Generic navigation prop extractor
 * Usage: type Props = { navigation: NavigationOf<ScreenName> }
 */
export type NavigationOf<T extends keyof TabParamList> = BottomTabNavigationProp<
  TabParamList,
  T
>;

/**
 * Route Props Types
 */
export type CalculatorRouteParams = {
  route: import('@react-navigation/native').RouteProp<CalculatorParamList, 'Results'>;
};
```

## ./screens/AboutScreen.tsx
```typescript
/**
 * About Screen
 * Phase 6: App Integration & Navigation
 * 
 * Information about the application, features, and version
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface AboutScreenProps {
  navigation?: any;
}

export default function AboutScreen({ navigation }: AboutScreenProps) {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>حاسبة المواريث الشرعية</Text>
        <Text style={styles.version}>الإصدار 1.0.0</Text>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>حول التطبيق</Text>
        <Text style={styles.description}>
          تطبيق شامل وموثوق لحساب المواريث وفقاً لأحكام الشريعة الإسلامية. يدعم التطبيق المذاهب الفقهية الأربعة (الحنفي، المالكي، الشافعي، والحنبلي) مع دعم كامل للحالات الشرعية المعقدة.
        </Text>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>المميزات الرئيسية</Text>
        <FeatureItem title="حسابات دقيقة" description="حسابات شرعية دقيقة لتقسيم التركات" />
        <FeatureItem title="دعم المذاهب الأربعة" description="الحنفي والمالكي والشافعي والحنبلي" />
        <FeatureItem title="حالات شرعية شاملة" description="دعم العول والرد والحجب والتعصيب" />
        <FeatureItem title="سجل العمليات" description="تتبع كامل للعمليات والحسابات" />
        <FeatureItem title="واجهة سهلة الاستخدام" description="تصميم بديهي وسهل التنقل" />
        <FeatureItem title="دعم اللغة العربية" description="دعم كامل للعربية والتخطيط من اليمين لليسار" />
      </View>

      {/* Fiqh Methods */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>المذاهب الفقهية المدعومة</Text>
        <MethodItem name="المذهب الحنفي" scholar="أبو حنيفة النعمان" />
        <MethodItem name="المذهب المالكي" scholar="مالك بن أنس" />
        <MethodItem name="المذهب الشافعي" scholar="محمد بن إدريس الشافعي" />
        <MethodItem name="المذهب الحنبلي" scholar="أحمد بن حنبل" />
      </View>

      {/* Special Cases */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الحالات الشرعية</Text>
        <CaseItem name="العول" description="زيادة الفروض على التركة" />
        <CaseItem name="الرد" description="رد الفاضل على ذوي الفروض" />
        <CaseItem name="الحجب" description="منع الوارث أو تنقيص حده" />
        <CaseItem name="التعصيب" description="الإرث بلا حد معين" />
      </View>

      {/* Legal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الحقوق والترخيص</Text>
        <Text style={styles.text}>
          © 2026 Merath Application. جميع الحقوق محفوظة.
        </Text>
        <Text style={styles.text}>
          تم تطوير هذا التطبيق بعناية لضمان دقة الحسابات وفقاً للشريعة الإسلامية.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          شكراً لاستخدامك تطبيق حاسبة المواريث الشرعية
        </Text>
      </View>
    </ScrollView>
  );
}

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureDot} />
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

function MethodItem({ name, scholar }: { name: string; scholar: string }) {
  return (
    <View style={styles.methodItem}>
      <Text style={styles.methodName}>{name}</Text>
      <Text style={styles.methodScholar}>({scholar})</Text>
    </View>
  );
}

function CaseItem({ name, description }: { name: string; description: string }) {
  return (
    <View style={styles.caseItem}>
      <Text style={styles.caseName}>{name}</Text>
      <Text style={styles.caseDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 16,
  },
  header: {
    backgroundColor: '#4F46E5',
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    color: '#E0E7FF',
  },
  section: {
    backgroundColor: 'white',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  text: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingVertical: 8,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
    marginRight: 12,
    marginTop: 6,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  methodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  methodScholar: {
    fontSize: 13,
    color: '#6B7280',
  },
  caseItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  caseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  caseDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  footerText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});
```

## ./screens/AuditTrailScreen.tsx
```typescript
/**
 * @file AuditTrailScreen.tsx
 * @description Audit Trail / Calculation History Screen
 * Phase 5.1: Advanced Features - Comprehensive History Dashboard
 *
 * Main screen for viewing calculation history with filtering, sorting, and statistics
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useAuditLog } from '../lib/inheritance/hooks';
import { AuditTrailManager } from '../lib/inheritance/audit-trail-manager';
import { AuditLogEntry } from '../lib/inheritance/audit-log';
import AuditTrailCard from '../components/AuditTrailCard';

export interface AuditTrailScreenProps {
  onSelectEntry?: (entry: AuditLogEntry) => void;
}

type SortField = 'timestamp' | 'madhab' | 'total' | 'confidence';
type SortOrder = 'asc' | 'desc';

/**
 * Audit Trail Screen Component
 * Main history dashboard with filtering, sorting, search, and statistics
 */
export function AuditTrailScreen({ onSelectEntry }: AuditTrailScreenProps) {
  const { entries: auditEntries, isLoading } = useAuditLog();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMadhab, setSelectedMadhab] = useState<string | null>(null);
  const [dateFromText, setDateFromText] = useState('');
  const [dateToText, setDateToText] = useState('');
  const [minEstate, setMinEstate] = useState('');
  const [maxEstate, setMaxEstate] = useState('');

  // Sort State
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // UI State
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Get unique madhabs for filter options
  const uniqueMadhabs = useMemo(
    () => AuditTrailManager.getUniqueMadhabs(auditEntries),
    [auditEntries]
  );

  // Parse filter inputs
  const dateFrom = dateFromText
    ? new Date(dateFromText)
    : undefined;
  const dateTo = dateToText
    ? new Date(dateToText)
    : undefined;
  const minEstateNum = minEstate ? parseFloat(minEstate) : undefined;
  const maxEstateNum = maxEstate ? parseFloat(maxEstate) : undefined;

  // Apply filters
  const filteredResult = useMemo(() => {
    return AuditTrailManager.filterEntries(auditEntries, {
      madhab: selectedMadhab || undefined,
      dateFrom,
      dateTo,
      searchTerm: searchTerm.trim(),
      minEstate: minEstateNum,
      maxEstate: maxEstateNum,
    });
  }, [
    auditEntries,
    selectedMadhab,
    dateFrom,
    dateTo,
    searchTerm,
    minEstateNum,
    maxEstateNum,
  ]);

  // Apply sort
  const sortedEntries = useMemo(() => {
    return AuditTrailManager.sortEntries(filteredResult.entries, {
      field: sortField,
      order: sortOrder,
    });
  }, [filteredResult.entries, sortField, sortOrder]);

  // Apply favorites filter if enabled
  const displayedEntries = useMemo(() => {
    if (!favoritesOnly) return sortedEntries;
    return sortedEntries.filter((entry) => favorites.has(entry.id || ''));
  }, [sortedEntries, favoritesOnly, favorites]);

  // Calculate statistics
  const stats = useMemo(() => {
    return AuditTrailManager.getStatistics(filteredResult.entries);
  }, [filteredResult.entries]);

  const handleToggleFavorite = useCallback((entryId: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  }, []);

  const handleDeleteEntry = useCallback(
    (entryId: string) => {
      // In a real app, this would call an API to delete from database
      // For now, we'll just show a message
      Alert.alert(
        'حذف السجل',
        'سيتم حذف هذا السجل من صفحتك الشخصية',
        [
          {
            text: 'متابعة',
            onPress: () => {
              // Could dispatch action to delete entry
              setFavorites((prev) => {
                const newSet = new Set(prev);
                newSet.delete(entryId);
                return newSet;
              });
            },
          },
          { text: 'إلغاء' },
        ]
      );
    },
    []
  );

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedMadhab(null);
    setDateFromText('');
    setDateToText('');
    setMinEstate('');
    setMaxEstate('');
  }, []);

  const handleExportAll = useCallback(() => {
    const json = AuditTrailManager.exportAsJSON(displayedEntries);
    const content = JSON.stringify(json, null, 2);

    Alert.alert(
      'تصدير البيانات',
      'سيتم نسخ البيانات إلى الحافظة',
      [
        {
          text: 'موافق',
          onPress: () => {
            // In a real app, copy to clipboard and trigger share dialog
            console.log('Export data:', content);
            Alert.alert('متم', 'تم نسخ البيانات بنجاح');
          },
        },
        { text: 'إلغاء' },
      ]
    );
  }, [displayedEntries]);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>📋</Text>
      <Text style={styles.emptyStateTitle}>لا توجد حسابات سابقة</Text>
      <Text style={styles.emptyStateSubtitle}>
        ابدأ بحساب الميراث الأول لديك
      </Text>
    </View>
  );

  const renderFilterModal = () => (
    <Modal
      visible={filterModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
            <Text style={styles.modalCloseButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>تصفية البيانات</Text>
          <TouchableOpacity onPress={handleClearFilters}>
            <Text style={styles.modalClearButton}>مسح</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Search Input */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>البحث</Text>
            <TextInput
              style={styles.filterInput}
              placeholder="ابحث عن اسم أو وصف..."
              placeholderTextColor="#999"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>

          {/* Madhab Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>المذهب الفقهي</Text>
            <View style={styles.madhhabOptions}>
              <TouchableOpacity
                style={[
                  styles.madhhabOption,
                  !selectedMadhab && styles.madhhabOptionSelected,
                ]}
                onPress={() => setSelectedMadhab(null)}
              >
                <Text style={styles.madhhabOptionText}>الكل</Text>
              </TouchableOpacity>
              {uniqueMadhabs.map((madhab) => (
                <TouchableOpacity
                  key={madhab}
                  style={[
                    styles.madhhabOption,
                    selectedMadhab === madhab &&
                    styles.madhhabOptionSelected,
                  ]}
                  onPress={() => setSelectedMadhab(madhab)}
                >
                  <Text style={styles.madhhabOptionText}>{madhab}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date Range Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>النطاق الزمني</Text>
            <View style={styles.dateRangeInputs}>
              <TextInput
                style={styles.dateInput}
                placeholder="من (YYYY-MM-DD)"
                value={dateFromText}
                onChangeText={setDateFromText}
              />
              <Text style={styles.dateRangeSeparator}>→</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="إلى (YYYY-MM-DD)"
                value={dateToText}
                onChangeText={setDateToText}
              />
            </View>
          </View>

          {/* Estate Range Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>نطاق المبلغ</Text>
            <View style={styles.estateRangeInputs}>
              <TextInput
                style={styles.estateInput}
                placeholder="من"
                keyboardType="decimal-pad"
                value={minEstate}
                onChangeText={setMinEstate}
              />
              <Text style={styles.estateRangeSeparator}>-</Text>
              <TextInput
                style={styles.estateInput}
                placeholder="إلى"
                keyboardType="decimal-pad"
                value={maxEstate}
                onChangeText={setMaxEstate}
              />
            </View>
          </View>

          {/* Statistics */}
          {filteredResult.entries.length > 0 && (
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>إحصائيات</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>إجمالي</Text>
                  <Text style={styles.statValue}>
                    {filteredResult.entries.length}
                  </Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>المعدل</Text>
                  <Text style={styles.statValue}>
                    {stats.averageConfidence.toFixed(0)}%
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={styles.modalActionButton}
            onPress={() => setFilterModalVisible(false)}
          >
            <Text style={styles.modalActionButtonText}>متابعة</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>جاري تحميل السجلات...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>سجل الحسابات</Text>
        <Text style={styles.headerSubtitle}>
          {filteredResult.filtered}/{filteredResult.total} سجل
        </Text>
      </View>

      {/* Top Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={styles.actionButtonIcon}>⚙️</Text>
          <Text style={styles.actionButtonText}>تصفية</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, favoritesOnly && styles.actionButtonActive]}
          onPress={() => setFavoritesOnly(!favoritesOnly)}
        >
          <Text style={styles.actionButtonIcon}>⭐</Text>
          <Text style={styles.actionButtonText}>المفضلة</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleExportAll}
        >
          <Text style={styles.actionButtonIcon}>📥</Text>
          <Text style={styles.actionButtonText}>تصدير</Text>
        </TouchableOpacity>
      </View>

      {/* Sort Options */}
      {displayedEntries.length > 0 && (
        <View style={styles.sortBar}>
          <Text style={styles.sortLabel}>ترتيب حسب:</Text>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => {
              if (sortField === 'timestamp') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortField('timestamp');
                setSortOrder('desc');
              }
            }}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortField === 'timestamp' && styles.sortButtonTextActive,
              ]}
            >
              التاريخ {sortField === 'timestamp' && (sortOrder === 'asc' ? '⬆' : '⬇')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => {
              if (sortField === 'madhab') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortField('madhab');
                setSortOrder('asc');
              }
            }}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortField === 'madhab' && styles.sortButtonTextActive,
              ]}
            >
              المذهب {sortField === 'madhab' && (sortOrder === 'asc' ? '⬆' : '⬇')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => {
              if (sortField === 'confidence') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortField('confidence');
                setSortOrder('desc');
              }
            }}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortField === 'confidence' && styles.sortButtonTextActive,
              ]}
            >
              الثقة {sortField === 'confidence' && (sortOrder === 'asc' ? '⬆' : '⬇')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      {displayedEntries.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={displayedEntries}
          keyExtractor={(item) => item.id || item.timestamp}
          renderItem={({ item }) => (
            <AuditTrailCard
              entry={item}
              onPress={onSelectEntry}
              onDelete={handleDeleteEntry}
              isFavorite={favorites.has(item.id || '')}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={true}
        />
      )}

      {/* Filter Modal */}
      {renderFilterModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    gap: 4,
  },
  actionButtonActive: {
    backgroundColor: '#e3f2fd',
  },
  actionButtonIcon: {
    fontSize: 14,
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  sortBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sortLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666',
    marginRight: 6,
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  sortButtonText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: '#1976d2',
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  emptyStateSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalCloseButton: {
    fontSize: 24,
    color: '#999',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  modalClearButton: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 11,
    color: '#333',
  },
  madhhabOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  madhhabOption: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
  },
  madhhabOptionSelected: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  madhhabOptionText: {
    fontSize: 11,
    color: '#333',
    fontWeight: '500',
  },
  dateRangeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 10,
    color: '#333',
  },
  dateRangeSeparator: {
    fontSize: 12,
    color: '#999',
  },
  estateRangeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  estateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 10,
    color: '#333',
  },
  estateRangeSeparator: {
    fontSize: 12,
    color: '#999',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1976d2',
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  modalActionButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalActionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
});

export default AuditTrailScreen;
```

## ./screens/CalculatorScreen.tsx
```typescript
/**
 * @file screens/SettingsScreen.tsx
 * @description Professional Settings Screen with improved layout
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/design/theme';
import { useSettings } from '../lib/context/SettingsContext';
import { languages } from '../lib/i18n';

const { width } = Dimensions.get('window');

interface SettingsScreenProps {
  navigation?: any;
}

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { state, setLanguage, setTheme, setNotifications, setRoundingDecimals, setAutoSave, saveSettings } = useSettings();
  const [versionInfo] = useState('1.1.3');

  useEffect(() => {
    saveSettings();
  }, [state, saveSettings]);

  const handleLanguageChange = (lang: keyof typeof languages) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleThemeChange = (mode: 'light' | 'dark') => {
    setTheme(mode);
  };

  const handleDecimalChange = (value: number) => {
    setRoundingDecimals(Math.max(0, Math.min(6, value)));
  };

  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(t('common.error'), t('common.error'));
    }
  };

  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('settings.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('app.subtitle')}</Text>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="translate" size={24} color={theme.colors.primary.main} />
            <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          </View>
          <View style={styles.languageGrid}>
            {Object.entries(languages).map(([langCode, langInfo]) => (
              <TouchableOpacity
                key={langCode}
                style={[
                  styles.languageCard,
                  state.language === langCode && styles.languageCardActive,
                ]}
                onPress={() => handleLanguageChange(langCode as keyof typeof languages)}
              >
                <View style={styles.languageFlag}>
                  <Text style={styles.languageFlagText}>
                    {langCode === 'ar' ? '🇸🇦' :
                     langCode === 'en' ? '🇬🇧' :
                     langCode === 'ur' ? '🇵🇰' :
                     langCode === 'tr' ? '🇹🇷' :
                     langCode === 'fr' ? '🇫🇷' :
                     langCode === 'de' ? '🇩🇪' : '🌐'}
                  </Text>
                </View>
                <Text style={styles.languageNative}>{langInfo.nativeName}</Text>
                <Text style={styles.languageName}>{langInfo.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="palette" size={24} color={theme.colors.primary.main} />
            <Text style={styles.sectionTitle}>{t('settings.theme')}</Text>
          </View>
          <View style={styles.themeContainer}>
            {(['light', 'dark'] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.themeCard,
                  state.themeMode === mode && styles.themeCardActive,
                ]}
                onPress={() => handleThemeChange(mode)}
              >
                <View style={[
                  styles.themePreview,
                  mode === 'light' && styles.themePreviewLight,
                  mode === 'dark' && styles.themePreviewDark,
                ]}>
                  <View style={styles.themePreviewHeader} />
                  <View style={styles.themePreviewContent} />
                  <View style={styles.themePreviewFooter} />
                </View>
                <Text style={styles.themeLabel}>
                  {mode === 'light' ? t('settings.lightMode') :
                   mode === 'dark' ? t('settings.darkMode') :
                   t('settings.systemMode')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="cog" size={24} color={theme.colors.primary.main} />
            <Text style={styles.sectionTitle}>{t('settings.calculationPreferences')}</Text>
          </View>

          {/* Decimal places */}
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceLabel}>
              <Text style={styles.preferenceTitle}>{t('settings.precision')}</Text>
              <Text style={styles.preferenceDescription}>{state.roundingDecimals} {t('common.decimalPlaces')}</Text>
            </View>
            <View style={styles.decimalControl}>
              <TouchableOpacity
                style={styles.decimalButton}
                onPress={() => handleDecimalChange(state.roundingDecimals - 1)}
                disabled={state.roundingDecimals <= 0}
              >
                <Text style={styles.decimalButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.decimalValue}>{state.roundingDecimals}</Text>
              <TouchableOpacity
                style={styles.decimalButton}
                onPress={() => handleDecimalChange(state.roundingDecimals + 1)}
                disabled={state.roundingDecimals >= 6}
              >
                <Text style={styles.decimalButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Auto-save toggle */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabel}>
              <MaterialCommunityIcons name="content-save" size={20} color={theme.colors.neutral.dark200} />
              <Text style={styles.toggleTitle}>{t('settings.autoSave')}</Text>
            </View>
            <Switch
              value={state.autoSave}
              onValueChange={setAutoSave}
              trackColor={{ false: '#d1d5db', true: theme.colors.primary.light200 }}
              thumbColor={state.autoSave ? theme.colors.primary.main : '#f3f4f6'}
            />
          </View>

          {/* Notifications toggle */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabel}>
              <MaterialCommunityIcons name="bell" size={20} color={theme.colors.neutral.dark200} />
              <Text style={styles.toggleTitle}>{t('settings.enableNotifications')}</Text>
            </View>
            <Switch
              value={state.notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#d1d5db', true: theme.colors.primary.light200 }}
              thumbColor={state.notifications ? theme.colors.primary.main : '#f3f4f6'}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="information" size={24} color={theme.colors.primary.main} />
            <Text style={styles.sectionTitle}>{t('about.title')}</Text>
          </View>
          <View style={styles.aboutCard}>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>{t('about.version')}</Text>
              <Text style={styles.aboutValue}>{versionInfo}</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.aboutDescription}>{t('app.description')}</Text>
          </View>

          {/* Links */}
          <View style={styles.linksContainer}>
            {[
              { icon: 'web', label: t('about.website'), url: 'https://merath.app' },
              { icon: 'email', label: t('about.contact'), url: 'mailto:support@merath.app' },
              { icon: 'shield-lock', label: t('about.privacy'), url: 'https://merath.app/privacy' },
              { icon: 'file-document', label: t('about.terms'), url: 'https://merath.app/terms' },
            ].map((link) => (
              <TouchableOpacity
                key={link.label}
                style={styles.linkButton}
                onPress={() => openLink(link.url)}
              >
                <MaterialCommunityIcons name={link.icon as any} size={20} color={theme.colors.primary.main} />
                <Text style={styles.linkLabel}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('about.copyright')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background.light,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.light,
    },
    contentContainer: {
      paddingBottom: 32,
    },
    header: {
      paddingHorizontal: 20,
      paddingVertical: 24,
      backgroundColor: theme.colors.primary.main,
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.8)',
    },
    section: {
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 16,
      backgroundColor: '#ffffff',
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      gap: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1f2937',
    },
    languageGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 8,
    },
    languageCard: {
      width: (width - 64) / 3,
      aspectRatio: 0.9,
      backgroundColor: '#f9fafb',
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    languageCardActive: {
      borderColor: theme.colors.primary.main,
      backgroundColor: '#eef2ff',
    },
    languageFlag: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#e5e7eb',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    languageFlagText: {
      fontSize: 24,
    },
    languageNative: {
      fontSize: 14,
      fontWeight: '600',
      color: '#1f2937',
      textAlign: 'center',
      marginBottom: 2,
    },
    languageName: {
      fontSize: 10,
      color: '#6b7280',
      textAlign: 'center',
    },
    themeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
    },
    themeCard: {
      flex: 1,
      alignItems: 'center',
      padding: 12,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: 'transparent',
      backgroundColor: '#f9fafb',
    },
    themeCardActive: {
      borderColor: theme.colors.primary.main,
      backgroundColor: '#eef2ff',
    },
    themePreview: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: 8,
      marginBottom: 8,
      overflow: 'hidden',
    },
    themePreviewLight: {
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: '#e5e7eb',
    },
    themePreviewDark: {
      backgroundColor: '#1f2937',
    },
    themePreviewSystem: {
      backgroundColor: 'linear-gradient(45deg, #ffffff 50%, #1f2937 50%)',
    },
    themePreviewHeader: {
      height: 8,
      backgroundColor: theme.colors.primary.main,
    },
    themePreviewContent: {
      flex: 1,
      margin: 4,
      backgroundColor: '#e5e7eb',
    },
    themePreviewFooter: {
      height: 6,
      backgroundColor: '#d1d5db',
      margin: 4,
    },
    themeLabel: {
      fontSize: 12,
      fontWeight: '500',
      color: '#374151',
    },
    preferenceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
    },
    preferenceLabel: {
      flex: 1,
    },
    preferenceTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: 2,
    },
    preferenceDescription: {
      fontSize: 12,
      color: '#6b7280',
    },
    decimalControl: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    decimalButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.primary.light,
      justifyContent: 'center',
      alignItems: 'center',
    },
    decimalButtonText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.primary.main,
    },
    decimalValue: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1f2937',
      minWidth: 24,
      textAlign: 'center',
    },
    toggleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: '#f3f4f6',
    },
    toggleLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    toggleTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: '#1f2937',
    },
    aboutCard: {
      backgroundColor: '#f9fafb',
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
    },
    aboutRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    aboutLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: '#6b7280',
    },
    aboutValue: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.colors.primary.main,
    },
    divider: {
      height: 1,
      backgroundColor: '#e5e7eb',
      marginVertical: 8,
    },
    aboutDescription: {
      fontSize: 12,
      color: '#6b7280',
      lineHeight: 18,
    },
    linksContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    linkButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: theme.colors.primary.light,
    },
    linkLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.primary.main,
    },
    footer: {
      paddingHorizontal: 20,
      paddingVertical: 24,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 12,
      color: '#9ca3af',
      textAlign: 'center',
    },
  });```

## ./screens/HistoryScreen.tsx
```typescript
/**
 * History Screen
 * Phase 6: App Integration & Navigation
 * 
 * Displays calculation history and audit log
 * Integrates with CalculationHistory component
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import CalculationHistory from '../components/CalculationHistory';

interface HistoryScreenProps {
  navigation?: any;
}

export default function HistoryScreen({ navigation }: HistoryScreenProps) {
  return (
    <View style={styles.container}>
      <CalculationHistory />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});
```

## ./screens/SettingsScreen.tsx
```typescript
/**
 * @file screens/SettingsScreen.tsx
 * @description Professional Settings Screen with persistence
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/design/theme';
import { useSettings } from '../lib/context/SettingsContext';
import { languages } from '../lib/i18n';

const { width } = Dimensions.get('window');
const STORAGE_KEYS = {
  LANGUAGE: '@merath_settings_language',
  THEME: '@merath_settings_theme',
  NOTIFICATIONS: '@merath_settings_notifications',
  ROUNDING: '@merath_settings_rounding',
  AUTO_SAVE: '@merath_settings_auto_save',
};

interface SettingsScreenProps {
  navigation?: any;
}

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { state, setLanguage, setTheme, setNotifications, setRoundingDecimals, setAutoSave } = useSettings();
  const [versionInfo] = useState('1.1.3');
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        
        // Load language
        const savedLang = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
        if (savedLang && Object.keys(languages).includes(savedLang)) {
          setLanguage(savedLang as keyof typeof languages);
          i18n.changeLanguage(savedLang);
        }
        
        // Load theme
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme);
        }
        
        // Load notifications
        const savedNotifications = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
        if (savedNotifications !== null) {
          setNotifications(savedNotifications === 'true');
        }
        
        // Load rounding decimals
        const savedRounding = await AsyncStorage.getItem(STORAGE_KEYS.ROUNDING);
        if (savedRounding !== null) {
          setRoundingDecimals(parseInt(savedRounding, 10));
        }
        
        // Load auto save
        const savedAutoSave = await AsyncStorage.getItem(STORAGE_KEYS.AUTO_SAVE);
        if (savedAutoSave !== null) {
          setAutoSave(savedAutoSave === 'true');
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [setLanguage, setTheme, setNotifications, setRoundingDecimals, setAutoSave, i18n]);

  // Save settings with debounce
  const saveSettings = useCallback(async () => {
    try {
      setSaveStatus('saving');
      
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, state.language);
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, state.themeMode);
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, String(state.notifications));
      await AsyncStorage.setItem(STORAGE_KEYS.ROUNDING, String(state.roundingDecimals));
      await AsyncStorage.setItem(STORAGE_KEYS.AUTO_SAVE, String(state.autoSave));
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      Alert.alert(
        t('common.error'),
        'فشل حفظ الإعدادات. يرجى المحاولة مرة أخرى.'
      );
      setSaveStatus('idle');
    }
  }, [state]);

  // Auto-save when settings change
  useEffect(() => {
    if (!isLoading) {
      saveSettings();
    }
  }, [state, isLoading, saveSettings]);

  const handleLanguageChange = useCallback(async (lang: keyof typeof languages) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    // Save is handled by useEffect
  }, [setLanguage, i18n]);

  const handleThemeChange = useCallback((mode: 'light' | 'dark') => {
    setTheme(mode);
    // Save is handled by useEffect
  }, [setTheme]);

  const handleDecimalChange = useCallback((value: number) => {
    setRoundingDecimals(Math.max(0, Math.min(6, value)));
    // Save is handled by useEffect
  }, [setRoundingDecimals]);

  const handleNotificationToggle = useCallback((value: boolean) => {
    setNotifications(value);
    // Save is handled by useEffect
  }, [setNotifications]);

  const handleAutoSaveToggle = useCallback((value: boolean) => {
    setAutoSave(value);
    // Save is handled by useEffect
  }, [setAutoSave]);

  const openLink = useCallback(async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(t('common.error'), t('common.error'));
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('common.error'));
    }
  }, [t]);

  const styles = React.useMemo(() => createStyles(theme), [theme]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={styles.loadingText}>جاري تحميل الإعدادات...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header with save status */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('settings.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('app.subtitle')}</Text>
          {saveStatus === 'saving' && (
            <View style={styles.saveStatusContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.saveStatusText}>جاري الحفظ...</Text>
            </View>
          )}
          {saveStatus === 'saved' && (
            <View style={[styles.saveStatusContainer, styles.saveStatusSaved]}>
              <Text style={styles.saveStatusText}>✓ تم الحفظ</Text>
            </View>
          )}
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="translate" size={24} color={theme.colors.primary.main} />
            <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          </View>
          <View style={styles.languageGrid}>
            {Object.entries(languages).map(([langCode, langInfo]) => (
              <TouchableOpacity
                key={langCode}
                style={[
                  styles.languageCard,
                  state.language === langCode && styles.languageCardActive,
                ]}
                onPress={() => handleLanguageChange(langCode as keyof typeof languages)}
              >
                <View style={styles.languageFlag}>
                  <Text style={styles.languageFlagText}>
                    {langCode === 'ar' ? '🇸🇦' :
                     langCode === 'en' ? '🇬🇧' :
                     langCode === 'ur' ? '🇵🇰' :
                     langCode === 'tr' ? '🇹🇷' :
                     langCode === 'fr' ? '🇫🇷' :
                     langCode === 'de' ? '🇩🇪' : '🌐'}
                  </Text>
                </View>
                <Text style={styles.languageNative}>{langInfo.nativeName}</Text>
                <Text style={styles.languageName}>{langInfo.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="palette" size={24} color={theme.colors.primary.main} />
            <Text style={styles.sectionTitle}>{t('settings.theme')}</Text>
          </View>
          <View style={styles.themeContainer}>
            {(['light', 'dark'] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.themeCard,
                  state.themeMode === mode && styles.themeCardActive,
                ]}
                onPress={() => handleThemeChange(mode)}
              >
                <View style={[
                  styles.themePreview,
                  mode === 'light' && styles.themePreviewLight,
                  mode === 'dark' && styles.themePreviewDark,
                ]}>
                  <View style={styles.themePreviewHeader} />
                  <View style={styles.themePreviewContent} />
                  <View style={styles.themePreviewFooter} />
                </View>
                <Text style={styles.themeLabel}>
                  {mode === 'light' ? t('settings.lightMode') : t('settings.darkMode')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="cog" size={24} color={theme.colors.primary.main} />
            <Text style={styles.sectionTitle}>{t('settings.calculationPreferences')}</Text>
          </View>

          {/* Decimal places */}
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceLabel}>
              <Text style={styles.preferenceTitle}>{t('settings.precision')}</Text>
              <Text style={styles.preferenceDescription}>{state.roundingDecimals} {t('common.decimalPlaces')}</Text>
            </View>
            <View style={styles.decimalControl}>
              <TouchableOpacity
                style={styles.decimalButton}
                onPress={() => handleDecimalChange(state.roundingDecimals - 1)}
                disabled={state.roundingDecimals <= 0}
              >
                <Text style={styles.decimalButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.decimalValue}>{state.roundingDecimals}</Text>
              <TouchableOpacity
                style={styles.decimalButton}
                onPress={() => handleDecimalChange(state.roundingDecimals + 1)}
                disabled={state.roundingDecimals >= 6}
              >
                <Text style={styles.decimalButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Auto-save toggle */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabel}>
              <MaterialCommunityIcons name="content-save" size={20} color={theme.colors.neutral.dark200} />
              <Text style={styles.toggleTitle}>{t('settings.autoSave')}</Text>
            </View>
            <Switch
              value={state.autoSave}
              onValueChange={handleAutoSaveToggle}
              trackColor={{ false: '#d1d5db', true: theme.colors.primary.light200 }}
              thumbColor={state.autoSave ? theme.colors.primary.main : '#f3f4f6'}
            />
          </View>

          {/* Notifications toggle */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabel}>
              <MaterialCommunityIcons name="bell" size={20} color={theme.colors.neutral.dark200} />
              <Text style={styles.toggleTitle}>{t('settings.enableNotifications')}</Text>
            </View>
            <Switch
              value={state.notifications}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: '#d1d5db', true: theme.colors.primary.light200 }}
              thumbColor={state.notifications ? theme.colors.primary.main : '#f3f4f6'}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="information" size={24} color={theme.colors.primary.main} />
            <Text style={styles.sectionTitle}>{t('about.title')}</Text>
          </View>
          <View style={styles.aboutCard}>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>{t('about.version')}</Text>
              <Text style={styles.aboutValue}>{versionInfo}</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.aboutDescription}>{t('app.description')}</Text>
          </View>

          {/* Links */}
          <View style={styles.linksContainer}>
            {[
              { icon: 'web', label: t('about.website'), url: 'https://merath.app' },
              { icon: 'email', label: t('about.contact'), url: 'mailto:support@merath.app' },
              { icon: 'shield-lock', label: t('about.privacy'), url: 'https://merath.app/privacy' },
              { icon: 'file-document', label: t('about.terms'), url: 'https://merath.app/terms' },
            ].map((link) => (
              <TouchableOpacity
                key={link.label}
                style={styles.linkButton}
                onPress={() => openLink(link.url)}
              >
                <MaterialCommunityIcons name={link.icon as any} size={20} color={theme.colors.primary.main} />
                <Text style={styles.linkLabel}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('about.copyright')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background.light,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.light,
    },
    contentContainer: {
      paddingBottom: 32,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 12,
      fontSize: 14,
      color: theme.colors.neutral.dark200,
    },
    header: {
      paddingHorizontal: 20,
      paddingVertical: 24,
      backgroundColor: theme.colors.primary.main,
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.8)',
    },
    saveStatusContainer: {
      position: 'absolute',
      top: 16,
      right: 16,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.2)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      gap: 6,
    },
    saveStatusSaved: {
      backgroundColor: 'rgba(76, 175, 80, 0.3)',
    },
    saveStatusText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '500',
    },
    section: {
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 16,
      backgroundColor: '#ffffff',
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      gap: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1f2937',
    },
    languageGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 8,
    },
    languageCard: {
      width: (width - 64) / 3,
      aspectRatio: 0.9,
      backgroundColor: '#f9fafb',
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    languageCardActive: {
      borderColor: theme.colors.primary.main,
      backgroundColor: '#eef2ff',
    },
    languageFlag: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#e5e7eb',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    languageFlagText: {
      fontSize: 24,
    },
    languageNative: {
      fontSize: 14,
      fontWeight: '600',
      color: '#1f2937',
      textAlign: 'center',
      marginBottom: 2,
    },
    languageName: {
      fontSize: 10,
      color: '#6b7280',
      textAlign: 'center',
    },
    themeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
    },
    themeCard: {
      flex: 1,
      alignItems: 'center',
      padding: 12,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: 'transparent',
      backgroundColor: '#f9fafb',
    },
    themeCardActive: {
      borderColor: theme.colors.primary.main,
      backgroundColor: '#eef2ff',
    },
    themePreview: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: 8,
      marginBottom: 8,
      overflow: 'hidden',
    },
    themePreviewLight: {
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: '#e5e7eb',
    },
    themePreviewDark: {
      backgroundColor: '#1f2937',
    },
    themePreviewHeader: {
      height: 8,
      backgroundColor: theme.colors.primary.main,
    },
    themePreviewContent: {
      flex: 1,
      margin: 4,
      backgroundColor: '#e5e7eb',
    },
    themePreviewFooter: {
      height: 6,
      backgroundColor: '#d1d5db',
      margin: 4,
    },
    themeLabel: {
      fontSize: 12,
      fontWeight: '500',
      color: '#374151',
    },
    preferenceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
    },
    preferenceLabel: {
      flex: 1,
    },
    preferenceTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: 2,
    },
    preferenceDescription: {
      fontSize: 12,
      color: '#6b7280',
    },
    decimalControl: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    decimalButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.primary.light,
      justifyContent: 'center',
      alignItems: 'center',
    },
    decimalButtonText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.primary.main,
    },
    decimalValue: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1f2937',
      minWidth: 24,
      textAlign: 'center',
    },
    toggleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: '#f3f4f6',
    },
    toggleLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    toggleTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: '#1f2937',
    },
    aboutCard: {
      backgroundColor: '#f9fafb',
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
    },
    aboutRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    aboutLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: '#6b7280',
    },
    aboutValue: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.colors.primary.main,
    },
    divider: {
      height: 1,
      backgroundColor: '#e5e7eb',
      marginVertical: 8,
    },
    aboutDescription: {
      fontSize: 12,
      color: '#6b7280',
      lineHeight: 18,
    },
    linksContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    linkButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: theme.colors.primary.light,
    },
    linkLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.primary.main,
    },
    footer: {
      paddingHorizontal: 20,
      paddingVertical: 24,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 12,
      color: '#9ca3af',
      textAlign: 'center',
    },
  });```

# Assets and Localization
