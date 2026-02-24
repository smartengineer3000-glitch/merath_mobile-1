/**
 * @file OnboardingScreen.tsx
 * @description Onboarding Tutorial Screen
 * Phase 7: User Experience - Onboarding
 * 
 * Guides first-time users through app features with interactive tutorial
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'مرحبا بك في حاسبة المواريث',
    description: 'تطبيق شامل لحساب المواريث وفقاً للشريعة الإسلامية والمذاهب الأربعة',
    icon: 'leaf',
    color: '#4CAF50',
  },
  {
    id: 'madhab',
    title: 'اختر المذهب الإسلامي',
    description: 'حدد المذهب الذي تفضله: الحنفي أو المالكي أو الشافعي أو الحنبلي',
    icon: 'book',
    color: '#2196F3',
  },
  {
    id: 'estate',
    title: 'أدخل بيانات التركة',
    description: 'أضف إجمالي التركة والديون ومصاريف الجنازة والوصايا',
    icon: 'cash',
    color: '#FF9800',
  },
  {
    id: 'heirs',
    title: 'أضف الوارثون',
    description: 'حدد أنواع الوارثين وعددهم (الأزواج، الأبناء، الآباء، إلخ)',
    icon: 'people',
    color: '#F44336',
  },
  {
    id: 'calculate',
    title: 'احسب التوزيع',
    description: 'اضغط هنا للحصول على نتائج التوزيع الصحيحة وفقاً للشريعة الإسلامية',
    icon: 'calculator',
    color: '#9C27B0',
  },
  {
    id: 'results',
    title: 'عرض النتائج',
    description: 'شاهد تفصيل التوزيع لكل وارث مع إمكانية التصدير والمشاركة',
    icon: 'pie-chart',
    color: '#00BCD4',
  },
];

export interface OnboardingScreenProps {
  onComplete: () => void;
}

/**
 * Onboarding Tutorial Screen
 * Guides users through app features on first launch
 */
export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  const handleNext = useCallback(() => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  }, [currentStep, onComplete]);

  const handleSkip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: step.color }]} />
        </View>

        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>تخطي (Skip)</Text>
        </TouchableOpacity>

        {/* Step Counter */}
        <Text style={styles.stepCounter}>
          {currentStep + 1} من {ONBOARDING_STEPS.length}
        </Text>

        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: step.color + '20' }]}>
          <Ionicons name={step.icon as any} size={80} color={step.color} />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: step.color }]}>
          {step.title}
        </Text>

        {/* Description */}
        <Text style={styles.description}>
          {step.description}
        </Text>

        {/* Additional Info for Each Step */}
        <View style={styles.infoBox}>
          {renderStepInfo(step.id)}
        </View>

        {/* Spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        {/* Previous Button */}
        {currentStep > 0 && (
          <TouchableOpacity
            style={styles.prevButton}
            onPress={handlePrev}
          >
            <Ionicons name="arrow-back" size={20} color="#666" />
            <Text style={styles.prevButtonText}>السابق</Text>
          </TouchableOpacity>
        )}

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: step.color }]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === ONBOARDING_STEPS.length - 1 ? 'ابدأ الآن' : 'التالي'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/**
 * Render step-specific information
 */
function renderStepInfo(stepId: string) {
  const infoMap: Record<string, React.ReactNode> = {
    welcome: (
      <>
        <Text style={styles.infoTitle}>✨ ما يميز التطبيق:</Text>
        <Text style={styles.infoBullet}>• دعم المذاهب الفقهية الأربعة</Text>
        <Text style={styles.infoBullet}>• حسابات دقيقة وموثوقة</Text>
        <Text style={styles.infoBullet}>• واجهة سهلة الاستخدام</Text>
        <Text style={styles.infoBullet}>• تصدير النتائج بصيغ متعددة</Text>
      </>
    ),
    madhab: (
      <>
        <Text style={styles.infoTitle}>المذاهب المدعومة:</Text>
        <Text style={styles.infoBullet}>• الحنفي - مدرسة الإمام أبي حنيفة</Text>
        <Text style={styles.infoBullet}>• المالكي - مدرسة الإمام مالك</Text>
        <Text style={styles.infoBullet}>• الشافعي - مدرسة الإمام الشافعي</Text>
        <Text style={styles.infoBullet}>• الحنبلي - مدرسة الإمام أحمد بن حنبل</Text>
      </>
    ),
    estate: (
      <>
        <Text style={styles.infoTitle}>بيانات التركة تشمل:</Text>
        <Text style={styles.infoBullet}>• إجمالي قيمة التركة</Text>
        <Text style={styles.infoBullet}>• مصاريف الجنازة والتجهيز</Text>
        <Text style={styles.infoBullet}>• الديون المترتبة على المتوفى</Text>
        <Text style={styles.infoBullet}>• الوصايا (إن وجدت)</Text>
      </>
    ),
    heirs: (
      <>
        <Text style={styles.infoTitle}>أنواع الوارثين:</Text>
        <Text style={styles.infoBullet}>• المرحلة الأولى: أصحاب الفروض</Text>
        <Text style={styles.infoBullet}>• المرحلة الثانية: العصبات</Text>
        <Text style={styles.infoBullet}>• المرحلة الثالثة: ذوو الأرحام</Text>
      </>
    ),
    calculate: (
      <>
        <Text style={styles.infoTitle}>الخطوة الأساسية:</Text>
        <Text style={styles.infoBullet}>• تأكد من جميع البيانات صحيحة</Text>
        <Text style={styles.infoBullet}>• اضغط على زر "حساب الميراث"</Text>
        <Text style={styles.infoBullet}>• انتظر لحظة لمعالجة البيانات</Text>
      </>
    ),
    results: (
      <>
        <Text style={styles.infoTitle}>في النتائج، يمكنك:</Text>
        <Text style={styles.infoBullet}>• عرض نصيب كل وارث</Text>
        <Text style={styles.infoBullet}>• تصدير النتائج كـ PDF</Text>
        <Text style={styles.infoBullet}>• حفظ في السجل للرجوع لاحقاً</Text>
        <Text style={styles.infoBullet}>• مشاركة النتائج مع الآخرين</Text>
      </>
    ),
  };

  return infoMap[stepId] || null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  skipButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  stepCounter: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginBottom: 32,
    fontWeight: '500',
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  infoBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  infoBullet: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    lineHeight: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  prevButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  prevButtonText: {
    marginLeft: 8,
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  nextButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
    marginRight: 8,
  },
});

export default OnboardingScreen;
