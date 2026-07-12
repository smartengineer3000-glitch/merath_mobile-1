# PRODUCT.md - Merath Islamic Inheritance Calculator

## Product Overview

**Merath** is a comprehensive Islamic inheritance calculator (حاسبة المواريث الشرعية) that accurately computes estate distribution according to the four major Sunni schools of Islamic jurisprudence. The application implements classical Fiqh rules with modern computational precision, providing reliable calculations for complex inheritance scenarios.

## Target Users

### Primary Users
- **Muslim families** planning estate distribution
- **Islamic scholars** needing quick calculation verification
- **Legal professionals** handling inheritance cases
- **Students** studying Islamic inheritance law

### User Context
- Users may have limited knowledge of Fiqh rules
- Need accurate, trustworthy calculations
- Require clear explanations of distribution logic
- Want to compare different madhab rulings
- Need exportable results for legal documentation

## Core Problem Solved

Islamic inheritance law (Fara'id) involves complex rules with:
- Multiple heir categories with different rights
- Madhab-specific interpretations
- Special cases (awl, radd, hijab, etc.)
- Fraction-based arithmetic that must be precise

Manual calculation is error-prone and time-consuming. Merath automates this with scholarly accuracy.

## Engine Capabilities

### Calculation Engine Features

#### 1. Multi-Madhab Support
- **Hanafi** (المذهب الحنفي): Complete implementation with mushārakah rules
- **Maliki** (المذهب المالكي): Accurate rulings including special scenarios  
- **Shafi'i** (المذهب الشافعي): Precise implementation with special cases
- **Hanbali** (المذهب الحنبلي): Full support for Hanbali jurisprudence

#### 2. Comprehensive Inheritance Rules

**Fixed Shares (Furūḍ - الفروض)**
- Husband: 1/2 (without children) or 1/4 (with children)
- Wife: 1/4 (without children) or 1/8 (with children)
- Daughter: 1/2 (alone) or 2/3 (with sisters)
- Father: 1/6 (with children) or asaba (without children)
- Mother: 1/3 (without children/spouse) or 1/6 (with children/spouse)
- Grandfather: 1/6 (with children) or asaba (without children)
- Grandmother: 1/6 (default)
- Full sister: 1/2 (alone) or 2/3 (with sisters)
- Half-sister (paternal): 1/2 (alone) or 2/3 (with sisters)
- Maternal siblings: 1/6 (one) or 1/3 (multiple)

**Residuary Heirs (ʿAṣabāt - العصبات)**
- Sons (and grandsons) with male-preference ratio (2:1)
- Father (when no fixed share applies)
- Grandfather (when no fixed share applies)
- Full brothers (and their descendants)
- Paternal brothers (and their descendants)
- Uncles and cousins (in specific order)

**Special Cases**
- **Awl (العول)**: When shares exceed 1, all shares are reduced proportionally
- **Radd (الرد)**: When shares are less than 1, surplus returns to eligible heirs
- **Hijab (الحجب)**: Complete or partial blocking of heirs by other heirs
- **Musharraka (المشتركة)**: Special case where full and maternal siblings share
- **Akdariyya (الأكدرية)**: Special case for grandfather with sister and spouse
- **Umariyyah (العمرية)**: Special case for mother with father and spouse
- **Blood Relatives (ذوو الأرحام)**: Distribution when no asaba exist

#### 3. Advanced Calculation Features

**Fraction Arithmetic System**
- Precise fraction-based calculations (no floating-point errors)
- Overflow protection for large denominators
- Arabic fraction names (النصف، الثلث، الربع، etc.)
- Support for complex fractions (e.g., 13/24, 17/24)

**Confidence Scoring**
- Multi-factor confidence indication (50-100%)
- Factors: complexity, special cases, madhab consensus
- Helps users trust the results

**Step-by-Step Breakdown**
- Clear calculation process explanation
- Hijab (blocking) log showing which heirs were blocked
- Special case identification and explanation
- Calculation time tracking

**Madhab Comparison**
- Side-by-side comparison across all four schools
- Difference highlighting between madhabs
- Explanations for why shares differ
- Recommendations for ambiguous cases

#### 4. Data Input & Validation

**Estate Data**
- Total estate amount
- Funeral costs
- Outstanding debts
- Will/bequest (limited to 1/3 of net estate)
- Automatic net estate calculation

**Heir Categories (50+ heir types)**
- Spouses: husband, wife (up to 4)
- Children: son, daughter, grandson, granddaughter
- Parents: father, mother
- Grandparents: grandfather, grandmother (paternal/maternal)
- Siblings: full brother/sister, paternal brother/sister, maternal brother/sister
- Extended family: nephews, nieces, uncles, aunts, cousins
- Special cases: daughter's children, sister's children

**Input Validation**
- Clan-based input normalization
- Minimum/maximum value constraints
- Real-time validation feedback
- Error explanation in Arabic/English

#### 5. Audit & History System

**Calculation Logging**
- Timestamped calculation records
- Full input/output storage
- IndexedDB persistence (10,000+ entries)
- Export to JSON/CSV

**Audit Trail Management**
- Filter by madhab, date, operation type
- Search functionality
- Statistics and analytics
- Import/export capabilities

**Performance Monitoring**
- Calculation time tracking
- Cache system for repeated calculations
- Performance metrics collection

### User Interface Features

#### 1. Core Screens
- **Calculator**: Guided input for estate and heirs
- **Results**: Detailed distribution breakdown
- **Comparison**: Madhab comparison view
- **History**: Calculation audit trail
- **Settings**: Preferences and configuration

#### 2. Input Experience
- Guided stepper for complex forms
- Real-time validation
- Localized number input (Arabic numerals)
- Heir category organization
- Quick-add common scenarios

#### 3. Results Presentation
- Visual share distribution
- Amount and percentage display
- Fraction and decimal representation
- Special case indicators
- Confidence score display
- Step-by-step calculation breakdown

#### 4. Export & Sharing
- PDF report generation
- Image capture for sharing
- Text format sharing
- Clipboard copy
- Audit trail export

## Technical Architecture

### Core Engine
- **Fraction Class**: Precision arithmetic with overflow protection
- **Hijab System**: Madhab-specific blocking rules
- **Calculation Engine**: Main computation orchestrator
- **Constants Database**: Fiqh rules and madhab configurations

### React Hooks
- **useCalculator**: Core calculation state management
- **useAuditLog**: Audit trail access and management
- **useResults**: Result storage and comparison
- **useComparison**: Madhab comparison logic

### Data Persistence
- **IndexedDB**: Primary storage (via Dexie)
- **AsyncStorage**: Fallback for settings
- **Calculation Cache**: Performance optimization

### Internationalization
- **i18next**: Translation framework
- **Languages**: Arabic, English, Urdu, Turkish, French, German
- **RTL Support**: Full right-to-left layout support

## Design System

### Typography
- **Arabic**: Cairo font family
- **English**: Plus Jakarta Sans font family
- **Hierarchy**: Display, Headline, Title, Body, Label scales

### Color Palette
- **Primary**: Islamic green (#2e7d32)
- **Secondary**: Professional blue (#4f9eff)
- **Tertiary**: Warm gold (#ffa500)
- **Neutral**: Professional grays
- **Semantic**: Success, warning, error, info colors

### Spacing & Layout
- **8pt base grid**: Consistent spacing system
- **Border radius**: 4-24px scale
- **Shadows**: Material Design 3 elevation system
- **Animations**: Smooth transitions (100-300ms)

## User Journey

### Primary Flow
1. **Launch**: App loads with splash screen and font loading
2. **Onboarding**: First-time users see 3-step introduction
3. **Calculator Input**: 
   - Enter estate details (total, deductions)
   - Select heirs by category
   - Choose madhab
4. **Calculation**: Engine processes with confidence scoring
5. **Results View**: See distribution breakdown
6. **Optional Actions**: Compare madhabs, export, share

### Secondary Flows
- **History Review**: Browse past calculations
- **Settings**: Configure preferences
- **About**: Version info and legal disclaimers

## Success Metrics

### User Success
- Accurate calculations matching classical Fiqh sources
- Clear understanding of distribution logic
- Confidence in results through transparency

### Technical Success
- <100ms calculation time for typical scenarios
- 100% test coverage of core engine
- Zero fraction arithmetic errors
- Reliable data persistence

## Future Enhancements

### Planned Features
- Multi-language expansion (more languages)
- Collaboration features for family planning
- Educational content about inheritance rules
- Integration with legal document systems

## Legal & Compliance

### Disclaimers
- Results are for informational purposes only
- Consult qualified scholars for legal decisions
- App follows mainstream Sunni schools
- Local laws may override religious rules

### Data Privacy
- All calculations stored locally
- No cloud data transmission
- User controls data deletion
- Export features maintain privacy

## Version Information

- **Current Version**: V0.1
- **Engine Version**: Enhanced Inheritance Calculation Engine
- **React Native**: 0.81.5
- **Expo**: 54.0.32
- **Tests**: 237+ passing tests

## Contact & Support

- **Email**: smartengineer3000@gmail.com
- **License**: MIT License
- **Repository**: GitHub (Devlopmenteng/merath_mobile)

---

*This product documentation is maintained alongside the inheritance engine implementation and should be updated when new features or madhab rules are added.*