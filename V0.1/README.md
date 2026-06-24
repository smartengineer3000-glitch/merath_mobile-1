# 📱 **Merath - حاسبة المواريث الشرعية**

### Islamic Inheritance Calculator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.32-black)](https://expo.dev/)
[![Tests](https://img.shields.io/badge/Tests-237%20passing-brightgreen)](https://github.com/Devlopmenteng/merath_mobile)

---

## 📖 **Overview**

**Merath** is a comprehensive Islamic inheritance calculator that accurately computes estate distribution according to the four major Sunni schools of Islamic jurisprudence (Hanafi, Maliki, Shafi'i, Hanbali). The application implements classical Fiqh rules with modern precision, providing reliable calculations for complex inheritance scenarios.

---

## ✨ **Key Features**

### 🕌 **Multi-Madhab Support**

- **Hanafi** - Complete implementation with mushārakah rules for grandfather with siblings
- **Maliki** - Accurate rulings for all cases including special scenarios
- **Shafi'i** - Precise implementation of Shafi'i school rules
- **Hanbali** - Full support for Hanbali jurisprudence

### ⚖️ **Comprehensive Inheritance Rules**

- **Fixed Shares (Furūḍ)** - All Quranic shares: 1/2, 1/3, 2/3, 1/4, 1/6, 1/8, etc.
- **Residuary (ʿAṣabāt)** - Male agnatic heirs with proper prioritization
- **Blocking (Ḥujūb)** - Complete hijab rules for all heir combinations
- **Augmentation (ʿAwl)** - Automatic application when shares exceed estate
- **Return (Radd)** - Proper distribution of surplus to eligible heirs
- **Blood Relatives (Dhū al-Arḥām)** - Inheritance when no asaba exist

### 🔢 **Advanced Calculation Engine**

- **Fraction-based arithmetic** - Precise calculations without floating-point errors
- **Confidence scoring** - Multi-factor confidence indication (50-100%)
- **Step-by-step breakdown** - Clear explanation of calculation process
- **Madhab comparison** - Side-by-side comparison across all four schools

### 📤 **Sharing & Export**

- **PDF reports** - Professionally formatted inheritance reports
- **Image capture** - Share results as PNG images
- **Text sharing** - Share via any messaging app
- **Clipboard copy** - Quick copy of results

### 🌐 **Internationalization**

- **Arabic** - Full RTL support with complete Arabic interface
- **English** - Complete English localization
- **Urdu, Turkish, French, German** - Multi-language support

### 🎨 **Professional UI/UX**

- **Material Design 3** - Modern, clean interface
- **Light/Dark theme** - System-aware theming
- **Keyboard optimization** - Smooth input handling with navigation
- **Loading states** - Professional animations during initialization
- **Validation feedback** - Clear, actionable error messages

---

## 📸 **Screenshots**

| Calculator Screen | Results Display |   Settings   |
| :---------------: | :-------------: | :----------: |
|   [Screenshot]    |  [Screenshot]   | [Screenshot] |

---

## 🚀 **Quick Start**

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

```bash
# Clone the repository
git clone https://github.com/Devlopmenteng/merath_mobile.git

# Navigate to project directory
cd merath_mobile-1/V0.1

# Install dependencies
npm install

# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
📱 Usage Guide
1. Select Madhab
Choose from Hanafi, Maliki, Shafi'i, or Hanbali schools of jurisprudence.

2. Enter Estate Details
Total estate value

Funeral expenses (optional)

Outstanding debts (optional)

Will amount (limited to 1/3 of net estate)

3. Add Heirs
Select from comprehensive list of heirs categorized by:

Primary heirs (spouses, children, parents)

Secondary heirs (grandparents, grandchildren, siblings)

Tertiary heirs (nephews, uncles, cousins)

Blood relatives (distant kin)

4. Calculate
Press calculate to see:

Distribution table with amounts and fractions

Special cases (awl, radd, hijab)

Confidence score with explanation

Step-by-step calculation breakdown

5. Compare & Share
Compare results across different madhabs

Export as PDF, image, or text

Copy results to clipboard

Share via any installed app
  # 237+ unit tests
🧪 Testing
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test suite
npm test -- hooks.test.ts
Test Coverage: 237 passing tests covering:

Inheritance calculations across all madhabs

Edge cases and special scenarios

Component rendering and interactions

Performance optimization

Audit logging and data persistence
📊 Technical Specifications
Component	Technology
Framework	React Native 0.81.5
Development Platform	Expo 54
Language	TypeScript 5.9
Navigation	React Navigation 7
State Management	React Context + Hooks
Testing	Vitest 4.0
PDF Generation	Expo Print
File System	Expo FileSystem
Sharing	Expo Sharing
Icons	Expo Vector Icons
🔒 Data Privacy
All calculations performed locally - No data sent to external servers

No tracking or analytics - Complete user privacy

Optional local storage - History saved only on device

Open source - Fully auditable codebase

🤝 Contributing
Contributions are welcome! Please read our Contributing Guidelines before submitting PRs.

Development Process
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit changes (git commit -m 'Add amazing feature')

Push to branch (git push origin feature/amazing-feature)

Open a Pull Request

Coding Standards
TypeScript strict mode enabled

ESLint + Prettier for code formatting

237+ tests must pass

No any types allowed

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Classical Fiqh sources from all four madhabs

Contributors and testers

Open source community

📞 Contact & Support
Email: smartengineer3000@gmail.com

GitHub: @Devlopmenteng

Issues: GitHub Issues


📱 Download
https://img.shields.io/badge/Google%2520Play-Download-brightgreen
https://img.shields.io/badge/App%2520Store-Download-blue

<div dir="rtl">
🇸🇦 نبذة عن التطبيق
مراث هو تطبيق شامل لحساب المواريث وفق أحكام الشريعة الإسلامية. يدعم التطبيق المذاهب الفقهية الأربعة (الحنفي، المالكي، الشافعي، الحنبلي) مع دقة عالية في الحسابات.

المميزات الرئيسية
دعم كامل للمذاهب الأربعة

حسابات دقيقة باستخدام الكسور

تصدير التقارير بصيغ متعددة (PDF، صورة، نص)

واجهة عربية كاملة مع دعم RTL

شرح خطوات الحساب بالتفصيل

Made with ❤️ for the Ummah
```
