/**
 * i18n Configuration - Internationalization Support
 * Enables English and Arabic language support
 */

export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    // App titles
    appTitle: 'حاسبة المواريث الإسلامية',
    appSubtitle: 'Islamic Inheritance Calculator',

    // Main Navigation
    tabs: {
      calculator: 'الحاسبة',
      history: 'السجل',
      auditTrail: 'التدقيق',
      settings: 'الإعدادات',
      about: 'حول',
    },

    // Calculator Screen
    calculator: {
      title: 'حاسبة المواريث',
      subtitle: 'Islamic Inheritance Calculator',
      madhab: 'اختر المذهب الإسلامي',
      estateSectionTitle: 'بيانات التركة',
      heirsSectionTitle: 'إضافة الوارثون',
      resultsTitle: 'النتائج والتوزيع',
      calculateBtn: 'حساب الميراث',
      resetBtn: 'مسح الكل',
      completeData: 'أكمل البيانات أولاً',
    },

    // Heir Selection
    heirSelector: {
      title: 'إضافة وارث جديد',
      editTitle: 'تعديل وارث',
      selectType: 'اختر نوع الوارث',
      selectCount: 'اختر العدد (1-100)',
      selectedCount: 'العدد المختار',
      addBtn: 'تأكيد',
      editBtn: 'تحديث',
      cancelBtn: 'إلغاء',
      clearAll: 'مسح الكل',
      error: 'خطأ',
      success: 'تم بنجاح',
    },

    // Estate Input
    estateInput: {
      title: 'بيانات التركة',
      total: 'إجمالي التركة',
      funeral: 'مصاريف الجنازة',
      debts: 'الديون',
      will: 'الوصية',
      currency: 'ريال سعودي',
      placeholder: 'أدخل المبلغ',
    },

    // Results
    results: {
      title: 'النتائج والتوزيع',
      madhab: 'المذهب',
      shareAmount: 'النصيب',
      sharePercent: 'النسبة',
      total: 'الإجمالي',
      exportPDF: 'تصدير PDF',
      exportJSON: 'تصدير JSON',
      shareResult: 'مشاركة النتيجة',
    },

    // History
    history: {
      title: 'سجل العمليات',
      empty: 'لا توجد عمليات محفوظة',
      delete: 'حذف',
      export: 'تصدير',
      date: 'التاريخ',
      madhab: 'المذهب',
      amount: 'المبلغ',
      confirmDelete: 'هل تريد حذف هذا السجل؟',
    },

    // Settings
    settings: {
      title: 'الإعدادات',
      language: 'اللغة',
      theme: 'المظهر',
      darkMode: 'الوضع الليلي',
      notifications: 'التنبيهات',
      analytics: 'تحسين البيانات',
      about: 'حول التطبيق',
      privacy: 'سياسة الخصوصية',
      clearData: 'مسح جميع البيانات',
      clearDataWarning: 'سيتم حذف جميع السجلات. هل أنت متأكد؟',
    },

    // About
    about: {
      title: 'حول التطبيق',
      version: 'الإصدار',
      developer: 'المطور',
      description: 'تطبيق لحساب المواريث وفقاً للشريعة الإسلامية',
      contact: 'تواصل معنا',
      rateApp: 'قيّم التطبيق',
      shareApp: 'شارك التطبيق',
    },

    // Common
    common: {
      ok: 'حسناً',
      cancel: 'إلغاء',
      save: 'حفظ',
      delete: 'حذف',
      edit: 'تعديل',
      close: 'إغلاق',
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      success: 'تم بنجاح',
      warning: 'تنبيه',
    },

    // Disclaimers
    disclaimers: {
      title: 'إخلاء مسؤولية',
      accept: 'أوافق على جميع البنود',
      decline: 'لا أوافق',
      privacy: 'سياسة الخصوصية',
      terms: 'الشروط والأحكام',
    },
  },

  en: {
    // App titles
    appTitle: 'Islamic Inheritance Calculator',
    appSubtitle: 'Merath App',

    // Main Navigation
    tabs: {
      calculator: 'Calculator',
      history: 'History',
      auditTrail: 'Audit',
      settings: 'Settings',
      about: 'About',
    },

    // Calculator Screen
    calculator: {
      title: 'Islamic Inheritance Calculator',
      subtitle: 'حاسبة المواريث',
      madhab: 'Select Islamic School (Madhab)',
      estateSectionTitle: 'Estate Information',
      heirsSectionTitle: 'Add Heirs',
      resultsTitle: 'Results and Distribution',
      calculateBtn: 'Calculate Inheritance',
      resetBtn: 'Clear All',
      completeData: 'Please complete all data first',
    },

    // Heir Selection
    heirSelector: {
      title: 'Add New Heir',
      editTitle: 'Edit Heir',
      selectType: 'Select Heir Type',
      selectCount: 'Select Count (1-100)',
      selectedCount: 'Selected Count',
      addBtn: 'Confirm',
      editBtn: 'Update',
      cancelBtn: 'Cancel',
      clearAll: 'Clear All',
      error: 'Error',
      success: 'Success',
    },

    // Estate Input
    estateInput: {
      title: 'Estate Information',
      total: 'Total Estate',
      funeral: 'Funeral Expenses',
      debts: 'Debts',
      will: 'Wills',
      currency: 'SAR',
      placeholder: 'Enter amount',
    },

    // Results
    results: {
      title: 'Results and Distribution',
      madhab: 'Islamic School',
      shareAmount: 'Share Amount',
      sharePercent: 'Share Percentage',
      total: 'Total',
      exportPDF: 'Export PDF',
      exportJSON: 'Export JSON',
      shareResult: 'Share Result',
    },

    // History
    history: {
      title: 'Calculation History',
      empty: 'No saved calculations',
      delete: 'Delete',
      export: 'Export',
      date: 'Date',
      madhab: 'School',
      amount: 'Amount',
      confirmDelete: 'Are you sure you want to delete this record?',
    },

    // Settings
    settings: {
      title: 'Settings',
      language: 'Language',
      theme: 'Theme',
      darkMode: 'Dark Mode',
      notifications: 'Notifications',
      analytics: 'Improve Data',
      about: 'About App',
      privacy: 'Privacy Policy',
      clearData: 'Clear All Data',
      clearDataWarning: 'All records will be deleted. Are you sure?',
    },

    // About
    about: {
      title: 'About App',
      version: 'Version',
      developer: 'Developer',
      description: 'Application for calculating Islamic inheritance according to Sharia',
      contact: 'Contact Us',
      rateApp: 'Rate App',
      shareApp: 'Share App',
    },

    // Common
    common: {
      ok: 'OK',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
      warning: 'Warning',
    },

    // Disclaimers
    disclaimers: {
      title: 'Legal Disclaimer',
      accept: 'I agree to all terms',
      decline: 'I disagree',
      privacy: 'Privacy Policy',
      terms: 'Terms and Conditions',
    },
  },
};

/**
 * Get translation for a key
 */
export const t = (language: Language, key: string): string => {
  const keys = key.split('.');
  let value: any = translations[language];

  for (const k of keys) {
    value = value?.[k];
  }

  if (!value) {
    return `[${key}]`;
  }

  return value as string;
};

/**
 * Language manager hook (can be used with Context API)
 */
export const useLanguage = () => {
  return {
    ar: 'العربية',
    en: 'English',
  };
};
