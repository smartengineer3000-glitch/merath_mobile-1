# Comparison & Enhancement Plan

**Date:** 2026-07-18
**Purpose:** Compare `Merath_Claude_Pro6.html` (v5.0, 5275 lines) and `Merath_Cluade_Pro7.html` (v5.0, 4138 lines) against the React Native app and propose enhancements.

---

## 1. Side-by-Side Feature Matrix

| Feature | Pro6 (HTML) | Pro7 (HTML) | RN App | Status |
|---------|-------------|-------------|--------|--------|
| **Heir Types (UI)** | 28 | 29 | 19 | Gap |
| **Grandmother Split** | Single field | 2 fields (maternal/paternal) | Single UI field, engine splits internally | Partial |
| **Deceased Gender** | Inferred from spouse | Explicit selector (unused by engine) | Not present | Gap |
| **Wife Max Count** | 4 | 4 | 3 | Gap |
| **Granddaughter as Asaba** | No (fard only) | No (fard only) | Engine: yes (asaba_with_ghayr) | RN ahead |
| **Dhawu al-Arham (UI)** | 5 types with priority | 6 types with 4 classes | Engine-only (10+ types) | Gap (UI) |
| **Extended Asabah (UI)** | 6 types | 6 types | 3 types (nephew, uncle, cousin) | Gap |
| **Musharraka** | Not implemented | Shafi'i + Maliki | Shafi'i only | Gap |
| **Akdariyya** | Not implemented | Implemented | Implemented | RN ahead |
| **Umariyyah** | Implemented | Implemented (both types) | Implemented | Equal |
| **Fard Shares** | Full | Full | Full | Equal |
| **Asaba Hierarchy** | Full | Full | Full | Equal |
| **Radd** | Full | Full | Full | Equal |
| **Awl** | Full | Full | Full | Equal |
| **Hijab Rules** | 8 categories | 12+ categories | Full per-madhab | RN ahead |
| **Fraction System** | Custom class | Custom class + overflow | FractionClass + overflow | Equal |
| **Will (Wasiyya)** | Capped at 1/3 | Capped at 1/3 | Capped at 1/3 + i18n alert | Equal |
| **Funeral/Debts** | Yes | Yes | Yes | Equal |
| **Madhab Comparison** | Side-by-side | Side-by-side + notes | Side-by-side | Equal |
| **Test Cases** | 17 (claims 200+) | ~30 (claims 200+) | 429 (vitest) | RN ahead |
| **Audit Log** | EnhancedAuditLog | Color-coded terminal | AuditLog + Dexie DB | RN ahead |
| **Export** | CSV, print, clipboard, JSON, share | CSV, print, clipboard | PDF, image, clipboard, share | RN ahead |
| **History/Search** | No | No | AsyncStorage + search + filter | RN ahead |
| **i18n Languages** | Arabic only | Arabic only | 6 languages + RTL | RN ahead |
| **Dark Mode** | No | No | Full light/dark/system | RN ahead |
| **Onboarding** | No | No | Welcome + disclaimer | RN ahead |
| **Heir Count Limits** | Wife≤4 | Wife≤4 | Husband≤1, Wife≤3, others | RN (just added) |
| **Confidence Score** | Multi-factor | Multi-factor | Multi-factor + invariant | RN ahead |

---

## 2. Key Gaps in RN App

### 2.1 Wife Max Count: 3 vs 4
Both HTML calculators allow up to 4 wives (per Quran 4:3). The RN app caps at 3.

**Recommendation:** Increase `wife.maxCount` from 3 to 4. The engine already handles multiple wives.

### 2.2 Grandmother UI: Single vs Split
Pro7 has 2 separate grandmother fields (`grandmother_mother`, `grandmother_father`). The RN app's UI shows a single "grandmother" field with max 2, but the engine internally splits them. The UI should expose the split for clarity and accuracy.

**Recommendation:** Split the grandmother UI into two fields:
- `grandmother_mother` (الجدة لأم) — maternal grandmother
- `grandmother_father` (الجدة لأب) — paternal grandmother

This matches Pro7 and is more fiqh-accurate since the two have different blocking rules.

### 2.3 Deceased Gender Field
Pro7 has an explicit deceased gender selector (though unused by its engine). This is useful for:
- UI clarity (helps user understand which heirs are applicable)
- Future engine enhancement (some opinions use deceased gender in edge cases)

**Recommendation:** Add a deceased gender selector to the calculator UI. The engine can remain gender-agnostic for now but the UI helps users think correctly about heir eligibility.

### 2.4 Extended Asabah in UI
Pro6/Pro7 expose 6 extended asabah types in the UI (full/paternal nephew, full/paternal uncle, full/paternal cousin). The RN app only has 3 (nephew, uncle, cousin) with no paternal variants.

**Recommendation:** Add paternal variants for extended asabah:
- `paternal_nephew` (ابن الأخ لأب)
- `paternal_uncle` (العم لأب)
- `paternal_cousin` (ابن العم لأب)

### 2.5 Dhawu al-Arham in UI
Both HTML calculators expose blood relatives (dhawu al-arham) in the UI with collapsible sections. The RN app handles them only in the engine.

**Recommendation:** Add a collapsible "Blood Relatives (ذوو الأرحام)" section with:
- Daughter's son (ابن البنت)
- Daughter's daughter (بنت البنت)
- Sister's children (أولاد الأخت)
- Maternal uncle (الخال)
- Maternal aunt (الخالة)
- Paternal aunt (العمة)

### 2.6 Musharraka for Maliki
Pro7 implements Musharraka (المسألة المشتركة) for both Shafi'i and Maliki. The RN app only implements it for Shafi'i.

**Recommendation:** Verify and implement Musharraka for Maliki madhab in the engine.

---

## 3. Enhancements Where RN App Is Already Ahead

These are features the RN app has that the HTML calculators don't. Listed for completeness:

| Enhancement | RN App Advantage |
|-------------|-----------------|
| 6-language i18n with RTL | HTML = Arabic only |
| Dark/light/system themes | HTML = light only |
| Persistent history with search | HTML = no history |
| PDF/image export | HTML = CSV/print only |
| Onboarding flow | HTML = none |
| 429 automated tests | HTML = 17-30 manual tests |
| Dexie audit database | HTML = in-memory only |
| Reanimated animations | HTML = CSS only |

---

## 4. Engine Differences

### 4.1 Maliki Spouse Radd Rule
| Source | Shafi'i | Hanafi | Maliki | Hanbali |
|--------|---------|--------|--------|---------|
| Pro6 | No radd | Radd | No radd | Radd |
| Pro7 | No radd | Radd | No radd | Radd |
| RN App | No radd | **Radd** | **Radd** | Radd |

**Issue:** RN app allows radd to spouse for Maliki, but both HTML calculators and standard fiqh say Maliki does NOT allow spouse radd.

**Action:** Fix `FIQH_DATABASE` for Maliki: `spouse_radd: false` (currently `true`).

### 4.2 Grandfather + Siblings (Muqasama)
| Source | Shafi'i | Hanafi | Maliki | Hanbali |
|--------|---------|--------|--------|---------|
| Pro6 | Blocks | Blocks | Shares | Shares |
| Pro7 | Blocks | Blocks | Shares | Shares |
| RN App | Blocks | Blocks | Shares | Shares |

Equal — no issue.

### 4.3 Dhawu al-Arham
| Source | Shafi'i | Hanafi | Maliki | Hanbali |
|--------|---------|--------|--------|---------|
| Pro6 | Enabled | Enabled | Disabled (bayt al-mal) | Enabled |
| Pro7 | Enabled | Enabled | Disabled (bayt al-mal) | Enabled |
| RN App | Enabled | Enabled | Disabled (bayt al-mal) | Enabled |

Equal — no issue.

---

## 5. Priority Enhancement Roadmap

### Phase 1: Engine Accuracy (Immediate)
1. **Fix Maliki spouse radd** — set `spouse_radd: false` for Maliki
2. **Increase wife max to 4** — matches Quran 4:3 and both HTML calculators

### Phase 2: UI Parity (Next Sprint)
3. **Split grandmother UI** into maternal/paternal fields
4. **Add deceased gender selector** (UI only, engine stays same)
5. **Add paternal extended asabah** — paternal_nephew, paternal_uncle, paternal_cousin

### Phase 3: Feature Parity (Future)
6. **Add dhawu al-arham UI section** — collapsible, 6 types
7. **Add Musharraka for Maliki** — match Pro7 behavior
8. **Add paternal aunt to UI** — matches both HTML calculators

### Phase 4: Polish (Optional)
9. **Add "200+ test cases" badge** to EngineTestScreen after adding more real-world scenarios
10. **Add step-by-step calculation display** — Pro6/Pro7 show numbered steps in results

---

## 6. Files to Modify

| File | Change |
|------|--------|
| `lib/inheritance/constants.ts` | Fix Maliki `spouse_radd: false` |
| `constants/heirData.ts` | Add wife maxCount=4, split grandmother, add paternal extended asabah, add dhawu al-arham |
| `screens/calculator/CalculatorScreen.tsx` | Add split grandmother UI, deceased gender, dhawu al-arham section |
| `components/heirs/HeirCategory.tsx` | Support new heir types in rendering |
| `lib/i18n/locales/*.json` | Add new i18n keys for new heir types and UI labels |
| `lib/inheritance/enhanced-engine-complete.ts` | Verify Musharraka Maliki support |

---

## 7. Decision Points

1. **Wife max 3 or 4?** Both HTML calculators use 4. Quran allows up to 4. Recommend 4.
2. **Split grandmother UI now or later?** Pro7 does it; it's more accurate. Recommend now.
3. **Deceased gender: cosmetic or functional?** Pro7's engine ignores it. Recommend cosmetic for now.
4. **How many dhawu al-arham types in UI?** Pro6 has 5, Pro7 has 6. Recommend 6 (Pro7's set).
5. **Musharraka for Maliki: implement or defer?** Pro7 implements it. Engine audit showed it was listed but possibly incomplete. Recommend verify + implement.
