# 📱 Merath - حاسبة المواريث الشرعية

### Islamic Inheritance Calculator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.32-black)](https://expo.dev/)
[![Tests](https://img.shields.io/badge/Tests-237%20passing-brightgreen)](https://github.com/smartengineer3000-glitch/merath_mobile)

---

## 📖 Overview

**Merath** is a comprehensive Islamic inheritance calculator that accurately computes estate distribution according to the four major Sunni schools of Islamic jurisprudence (Hanafi, Maliki, Shafi'i, Hanbali). The application implements classical Fiqh rules with modern precision, providing reliable calculations for complex inheritance scenarios.

---

## ✨ Key Features

### 🕌 Multi-Madhab Support

- **Hanafi** - Complete implementation with mushārakah rules for grandfather with siblings
- **Maliki** - Accurate rulings for all cases including special scenarios
- **Shafi'i** - Precise implementation of Shafi'i school rules
- **Hanbali** - Full support for Hanbali jurisprudence

### ⚖️ Comprehensive Inheritance Rules

- **Fixed Shares (Furūḍ)** - All Quranic shares: 1/2, 1/3, 2/3, 1/4, 1/6, 1/8, etc.
- **Residuary (ʿAṣabāt)** - Male agnatic heirs with proper prioritization
- **Blocking (Ḥujūb)** - Complete hijab rules for all heir combinations
- **Augmentation (ʿAwl)** - Automatic application when shares exceed estate
- **Return (Radd)** - Proper distribution of surplus to eligible heirs
- **Blood Relatives (Dhū al-Arḥām)** - Inheritance when no asaba exist

### 🔢 Advanced Calculation Engine

- **Fraction-based arithmetic** - Precise calculations without floating-point errors
- **Confidence scoring** - Multi-factor confidence indication (50-100%)
- **Step-by-step breakdown** - Clear explanation of calculation process
- **Madhab comparison** - Side-by-side comparison across all four schools

### 📤 Sharing & Export

- **PDF reports** - Professionally formatted inheritance reports
- **Image capture** - Share results as PNG images
- **Text sharing** - Share via any messaging app
- **Clipboard copy** - Quick copy of results

### 🌐 Internationalization

- **Arabic** - Full RTL support with complete Arabic interface
- **English** - Complete English localization
- **Urdu, Turkish, French, German** - Multi-language support

### 🎨 Professional UI/UX

- **Material Design 3** - Modern, clean interface
- **Light/Dark theme** - System-aware theming
- **Keyboard optimization** - Smooth input handling with navigation
- **Loading states** - Professional animations during initialization
- **Validation feedback** - Clear, actionable error messages

---

## 📸 Screenshots

| Calculator Screen | Results Display |   Settings   |
| :---------------: | :-------------: | :----------: |
|   [Screenshot]    |  [Screenshot]   | [Screenshot] |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

```bash
# Clone the repository
git clone https://github.com/smartengineer3000-glitch/merath_mobile.git

# Navigate to project directory
cd merath_mobile

# Install dependencies
npm install

# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

---

## 📱 Usage Guide

1. **Select Madhab**
   Choose from Hanafi, Maliki, Shafi'i, or Hanbali schools of jurisprudence.

2. **Enter Estate Details**
   - Total estate value
   - Funeral expenses (optional)
   - Outstanding debts (optional)
   - Will amount (limited to 1/3 of net estate)

3. **Add Heirs**
   Select from comprehensive list of heirs categorized by:
   - Primary heirs (spouses, children, parents)
   - Secondary heirs (grandparents, grandchildren, siblings)
   - Tertiary heirs (nephews, uncles, cousins)
   - Blood relatives (distant kin)

4. **Calculate**
   Press calculate to see:
   - Distribution table with amounts and fractions
   - Special cases (awl, radd, hijab)
   - Confidence score with explanation
   - Step-by-step calculation breakdown

5. **Compare & Share**
   - Compare results across different madhabs
   - Export as PDF, image, or text
   - Copy results to clipboard
   - Share via any installed app

---

## 📁 Project Structure

```
merath_mobile/
├── App.tsx                      # Application entry point
├── app.config.ts                # Expo configuration
├── eas.json                     # EAS Build configuration
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript configuration
├── vitest.config.ts             # Test configuration
├── metro.config.cjs             # Metro bundler config
├── eslint.config.js             # Linting rules
├── drizzle.config.ts            # Database ORM config
├── assets/                      # Images, icons, splash screen
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash.png
├── components/                  # Reusable UI components
│   ├── AuditTrailCard.tsx
│   ├── CalculationButton.tsx
│   ├── DisclaimersModal.tsx
│   ├── ErrorBoundary.tsx
│   ├── EstateInput.tsx
│   ├── HeirSelector.tsx
│   ├── LoadingScreen.tsx
│   ├── MadhhabSelector.tsx
│   ├── ResultsDisplay.tsx
│   └── ui/                      # Base UI primitives
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Input.tsx
├── lib/                         # Core logic & services
│   ├── context/                 # React Context providers
│   │   ├── SettingsContext.tsx
│   │   └── ThemeProvider.tsx
│   ├── database/                # Local database
│   │   └── db.ts
│   ├── design/                  # Theme & design tokens
│   │   └── theme.ts
│   ├── errors/                  # Error handling
│   │   └── ErrorHandler.ts
│   ├── export/                  # PDF/CSV export engines
│   │   ├── CSVExporter.ts
│   │   └── PDFExporter.ts
│   ├── firebase/                # Firebase integration
│   │   └── firebase-service.ts
│   ├── i18n/                    # Internationalization
│   │   ├── index.ts
│   │   └── locales/
│   ├── inheritance/             # Core calculation engine
│   │   ├── enhanced-engine-complete.ts  # Main engine
│   │   ├── hijab-system.ts              # Blocking rules
│   │   ├── fraction.ts                  # Fraction arithmetic
│   │   ├── hooks.ts                     # React hooks
│   │   ├── audit-log.ts                 # Audit logging
│   │   ├── audit-trail-manager.ts       # Trail management
│   │   ├── constants.ts                 # Constants
│   │   ├── types.ts                     # Type definitions
│   │   ├── utils.ts                     # Utilities
│   │   └── index.ts                     # Barrel export
│   ├── legal/                   # Legal disclaimers
│   │   └── Disclaimers.ts
│   ├── performance/             # Performance utilities
│   │   ├── bundle-analyzer.ts
│   │   ├── optimization.ts
│   │   └── utils.ts
│   ├── services/                # Business services
│   │   └── BackupService.ts
│   ├── utils/                   # General utilities
│   │   └── parsers.ts
│   ├── validation/              # Input validation
│   │   └── InputValidator.ts
│   └── icons.ts                 # Icon registry
├── navigation/                  # React Navigation setup
│   ├── RootNavigator.tsx
│   ├── linking.ts
│   ├── types.ts
│   └── index.ts
├── screens/                     # App screens
│   ├── CalculatorScreen.tsx
│   ├── MadhhabComparisonScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── AboutScreen.tsx
│   └── TestScreen.tsx
├── __tests__/                   # Unit & integration tests
│   ├── setup.ts
│   ├── hooks.test.ts
│   ├── components.test.ts
│   ├── integration.test.ts
│   ├── performance.test.ts
│   ├── inheritance.test.ts
│   ├── audit-log.test.ts
│   ├── audit-trail.test.ts
│   ├── debug-calculation.test.ts
│   ├── debug-edge-cases.test.ts
│   ├── real-world-scenarios.test.ts
│   └── special-cases.test.ts
├── e2e/                         # End-to-end tests
│   ├── calculator.e2e.js
│   ├── config.json
│   └── init.js
└── scripts/                     # Build & utility scripts
    ├── full-cleanup.sh
    ├── generate-project-dump.sh
    └── run-tests.sh
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test suite
npm test -- hooks.test.ts
```

**Test Coverage:** 237+ passing tests covering:

- Inheritance calculations across all madhabs
- Edge cases and special scenarios
- Component rendering and interactions
- Performance optimization
- Audit logging and data persistence

---

## 📊 Technical Specifications

| Component            | Technology            |
| -------------------- | --------------------- |
| Framework            | React Native 0.81.5   |
| Development Platform | Expo 54.0.32          |
| Language             | TypeScript 5.9        |
| Navigation           | React Navigation 7    |
| State Management     | React Context + Hooks |
| Testing              | Vitest 4.0            |
| PDF Generation       | Expo Print            |
| File System          | Expo FileSystem       |
| Sharing              | Expo Sharing          |
| Icons                | Expo Vector Icons     |
| Database             | Drizzle ORM           |
| Styling              | Material Design 3     |

---

## 🔒 Data Privacy

- All calculations performed locally - **No data sent to external servers**
- No tracking or analytics - **Complete user privacy**
- Optional local storage - History saved only on device
- Open source - **Fully auditable codebase**

---

## 🤝 Contributing

Contributions are welcome! Please read our Contributing Guidelines before submitting PRs.

### Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- 237+ tests must pass
- No `any` types allowed

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Classical Fiqh sources from all four madhabs
- Contributors and testers
- Open source community

---

## 📞 Contact & Support

- **Email:** support@merath.app
- **Website:** https://merath.app
- **GitHub:** [@smartengineer3000-glitch](https://github.com/smartengineer3000-glitch)
- **Issues:** [GitHub Issues](https://github.com/smartengineer3000-glitch/merath_mobile/issues)

---

## ⬇️ Download

[![Google Play](https://img.shields.io/badge/Google%20Play-Download-brightgreen)](https://play.google.com/store/apps/details?id=com.merath.app)
[![App Store](https://img.shields.io/badge/App%20Store-Download-blue)](https://apps.apple.com/app/merath/id)

---

<div dir="rtl">

## 🇸🇦 نبذة عن التطبيق

**مراث** هو تطبيق شامل لحساب المواريث وفق أحكام الشريعة الإسلامية. يدعم التطبيق المذاهب الفقهية الأربعة (الحنفي، المالكي، الشافعي، الحنبلي) مع دقة عالية في الحسابات.

### المميزات الرئيسية

- ✅ دعم كامل للمذاهب الأربعة
- ✅ حسابات دقيقة باستخدام الكسور
- ✅ تصدير التقارير بصيغ متعددة (PDF، صورة، نص)
- ✅ واجهة عربية كاملة مع دعم RTL
- ✅ شرح خطوات الحساب بالتفصيل
- ✅ حماية خصوصية كاملة - لا يتم إرسال أي بيانات
- ✅ يعمل بدون اتصال إنترنت

</div>

---

<p align="center">
  Made with ❤️ for the Ummah
</p>
