# Merath Inheritance Engine — Pseudo-Code Reference

Complete algorithmic reference for the Islamic inheritance calculation engine.
All monetary amounts are in the estate's currency. All fractions are exact rational numbers.

---

## Table of Contents

1. [Engine Overview](#1-engine-overview)
2. [FractionClass — Rational Arithmetic](#2-fractionclass)
3. [Input Normalization & Validation](#3-input-normalization--validation)
4. [HijabSystem — Blocking Rules](#4-hijabsystem--blocking-rules)
5. [Constants & Fiqh Database](#5-constants--fiqh-database)
6. [computeFixedShares — Fard (Quranic) Shares](#6-computefixedshares--fard-quranic-shares)
7. [computeAsaba — Residue Distribution](#7-computeasaba--residue-distribution)
8. [calculateConfidence — Confidence Scoring](#8-calculateconfidence--confidence-scoring)
9. [InvariantEngine — Conservation Check](#9-invariantengine--conservation-check)
10. [EnhancedInheritanceCalculationEngine — Main Orchestrator](#10-enhancedinheritancecalculationengine--main-orchestrator)

---

## 1. Engine Overview

The main calculation pipeline in `calculate()` executes these steps in order:

```
1.  validateInput()              — Ensure estate total > 0 and at least 1 heir
2.  calculateNetEstate()         — Subtract funeral, debts, and will (max 1/3)
3.  hijabSystem.applyHijab()     — Apply blocking rules → filtered heirs
4.  Special case check:
      a. isMusharraka()  → computeMusharraka()   (al-Himariyya)
      b. isAkdariyya()   → computeAkdariyya()    (al-Akdariyya)
      c. otherwise       → computeFixedShares()   (standard fard)
5.  Check totalFixed > 1 → applyAwl() if needed  (proportional reduction)
6.  Compute remainder = 1 - totalAdjustedFixed
7.  computeAsaba()               — Distribute remainder to asaba heirs
8.  mergeShares()                — Combine fard + asaba, resolve duplicates
9.  Check final remainder:
      a. If remainder > 0 AND no asaba heirs → applyRadd() (proportional bonus)
      b. If still remainder → distributeToBloodRelatives() (dhawu al-arham)
      c. If still remainder AND radd not allowed → Bayt al-Mal (treasury)
10. calculateFinalAmounts()      — Convert fractions to currency amounts
11. InvariantEngine.assertConservation() — Verify sum ≈ 1
12. calculateConfidence()        — Compute confidence score 50-100
```

---

## 2. FractionClass

Exact rational arithmetic with overflow protection. Located in `fraction.ts`.

### `constructor(numerator, denominator)`

```
IF denominator < 0:
    flip signs of both numerator and denominator
simplify()
```

### `simplify()`

```
IF numerator == 0:
    denominator = 1, return
IF denominator > MAX_SAFE_DENOMINATOR (1e9):
    scaleDownToSafeRange(), return
gcd = safeGcd(|numerator|, denominator)
IF gcd > 1:
    numerator /= gcd
    denominator /= gcd
IF denominator still > MAX_SAFE_DENOMINATOR:
    scaleDownToSafeRange()
```

### `safeGcd(a, b)`

```
IF either operand > MAX_SAFE_INTEGER / 2:
    return approximateGcd(a, b)
WHILE b != 0:
    temp = b
    b = a % b
    a = temp
    IF NaN or Infinity detected: return 1
return a OR 1 if a == 0
```

### `approximateGcd(a, b)`

```
ratio = a / b
IF ratio is close to an integer: return b
inverseRatio = b / a
IF inverseRatio is close to an integer: return a
IF smaller < 1000: trial divide from √smaller down to 2
return 1 (no common factor found)
```

### `scaleDownToSafeRange()`

```
scaleFactor = denominator / MAX_SAFE_DENOMINATOR
numerator = round(numerator / scaleFactor)
denominator = MAX_SAFE_DENOMINATOR
re-simplify with safeGcd
```

### `add(other)`

```
newNum = this.num * other.den + other.num * this.den
newDen = this.den * other.den
IF newDen > MAX_SAFE_DENOMINATOR:
    return fromDecimal(this.toDecimal() + other.toDecimal())
return new FractionClass(newNum, newDen)
```

### `subtract(other)`

```
newNum = this.num * other.den - other.num * this.den
newDen = this.den * other.den
(same overflow guard as add)
```

### `multiply(scalar)`

```
IF scalar is number:
    (overflow guard) return new FractionClass(this.num * scalar, this.den)
ELSE (scalar is FractionClass):
    newDen = this.den * scalar.den
    (overflow guard) return new FractionClass(this.num * scalar.num, newDen)
```

### `divide(scalar)`

```
IF scalar == 0: throw error
IF scalar is number:
    (overflow guard) return new FractionClass(this.num, this.den * scalar)
ELSE:
    newDen = this.den * scalar.num
    (overflow guard) return new FractionClass(this.num * scalar.den, newDen)
```

### `fromDecimal(decimal, precision=12)`

```
IF decimal == 0: return 0/1
sign = (decimal < 0) ? -1 : 1
decimal = |decimal|
Use continued fraction algorithm:
    h1=1, h2=0, k1=0, k2=1, b=decimal
    DO:
        a = floor(b)
        update h1, h2, k1, k2 using standard recurrence
        remainder = b - a
        IF |remainder| < 1e-15 or 1/remainder is Infinity: break
        b = 1/remainder
    WHILE |decimal - h1/k1| > decimal * 1e-12
return sign * h1 / k1
```

### Other methods

- `toDecimal()` → `numerator / denominator`
- `equals(other)` → strict cross-multiplication (no tolerance)
- `compare(other)` → -1, 0, or 1 via cross-multiplication
- `toString()` → `"num/den"` or `"num"` if denom == 1
- `greaterThan`, `lessThan`, `greaterThanOrEqual`, `lessThanOrEqual` — via `compare()`

---

## 3. Input Normalization & Validation

Located in `engine-input.ts`.

### `normalizeEstateInput(estate)`

```
RETURN {
    total:     clamp(estate.total),           // ≥ 0
    funeral:   clamp(estate.funeral),         // ≥ 0
    debts:     clamp(estate.debts),           // ≥ 0
    will:      clamp(estate.will),            // ≥ 0
}
clamp(v) = max(0, Number(v) || 0)
```

### `normalizeHeirsInput(heirs)`

```
FOR each heir key in HeirsData:
    husband:      clamp(v, max=1)
    wife:         clamp(v, max=4)
    father:       clamp(v, max=1)
    mother:       clamp(v, max=1)
    grandfather:  clamp(v, max=1)
    grandmother:  clamp(v, max=1)
    all others:   clamp(v)                    // no upper limit
RETURN normalized heirs object
```

### `validateEngineInput(estate, heirs)`

```
IF estate.total <= 0:
    RETURN { valid: false, error: "يجب إدخال مبلغ إجمالي التركة" }
IF no heir has count > 0:
    RETURN { valid: false, error: "يجب تحديد وارث واحد على الأقل" }
RETURN { valid: true }
```

---

## 4. HijabSystem — Blocking Rules

Located in `hijab-system.ts`. Two phases: complete hijab (zero-out) and partial hijab (reduce).

### `applyHijab(heirs)`

```
result = copy of heirs
applyCompleteHijab(result)
applyPartialHijab(result)
RETURN { heirs: result, log: hijabLog }
```

### `applyCompleteHijab(heirs)`

#### Phase A: Standard rules from constants (FIQH_DATABASE.hijabRules[madhab])

```
FOR each rule where type == "complete":
    IF rule.hijabber exists in heirs (count > 0):
        FOR each hijabbed heir in rule.hijabbed:
            IF hijabbed heir exists:
                SET hijabbed heir count = 0
                LOG the blocking
```

#### Phase B: Grandmother split-key expansion

```
FOR each rule where hijabbed includes "grandmother":
    IF hijabber exists:
        IF grandmother_mother > 0: set to 0, log
        IF grandmother_father > 0: set to 0, log
```

#### Phase C: Grandfather with siblings (madhab-specific)

```
IF grandfather exists AND any sibling exists:
    IF madhab == "hanafi":
        Block ALL siblings (full_brother, full_sister, half_brother_paternal, half_sister_paternal)
    ELSE (shafii/maliki/hanbali):
        No blocking — grandfather SHARES with siblings (handled in computeAsaba)
```

#### Phase D: Additional blocking rules

```
2+ daughters WITHOUT grandson  → block granddaughters
Son exists                     → block maternal siblings, paternal uncles/aunts, nephews
Grandson (no son)              → block full brothers and sisters
Full brother exists            → block paternal brothers/sisters
Daughter exists                → block maternal sister
2+ granddaughters              → block paternal aunt
```

### `applyPartialHijab(heirs)`

```
FOR each rule where type == "partial":
    IF rule.reason == "from_third_to_sixth":
        IF father AND mother both exist:
            LOG "Father reduces mother from 1/3 to 1/6"
            (Actual reduction applied in computeFixedShares, not here)
```

### `getBlockedHeirs(madhab, selectedHeirs)` — Dynamic UI blocking

Mirrors the engine's hijab logic for real-time heir selection UI:

```
blocked = {}
Apply all standard complete hijab rules from constants
Expand generic "grandmother" → grandmother_mother, grandmother_father
Grandfather blocks siblings (Hanafi only)
2+ daughters block granddaughters (no grandson)
Son blocks: maternal siblings, paternal uncles/aunts, nephews
Grandson (no son) blocks full brothers/sisters
Full brother blocks paternal brothers/sisters
Daughter blocks maternal sister
2+ granddaughters block paternal aunt
RETURN blocked
```

---

## 5. Constants & Fiqh Database

Located in `constants.ts`.

### `FIQH_DATABASE.madhabs`

```
For each madhab (shafii, hanafi, maliki, hanbali):
    rules:
        grandfather_with_siblings: "musharak" | "hijab"
        mother_with_father_children: "sixth"
        mother_with_father_only: "third"
        spouse_radd: boolean       (can spouse receive radd?)
        radd_allowed: boolean      (does madhab allow radd at all?)
        umariyyah_rule: "first"
        musharraka: boolean        (does madhab recognize al-Himariyya?)
```

| Madhab  | grandfather_with_siblings | spouse_radd | radd_allowed | musharraka |
| ------- | ------------------------- | ----------- | ------------ | ---------- |
| shafii  | musharak                  | false       | false        | true       |
| hanafi  | hijab                     | true        | true         | false      |
| maliki  | musharak                  | false       | false        | true       |
| hanbali | musharak                  | true        | true         | false      |

### `FIQH_DATABASE.hijabRules`

Per-madhab arrays of `HijabRule` objects. Each rule specifies:

- `hijabber`: key of the blocking heir
- `hijabbed`: array of keys being blocked
- `type`: `"complete"` (zero-out) or `"partial"` (reduce)
- `reason`: optional string (e.g. `"from_third_to_sixth"`)

### `FIQH_DATABASE.specialCases.umariyyah`

```
shafii/hanafi/hanbali: "third_of_remainder" (1/6 when husband present)
maliki: "sixth" (always 1/6)
```

### `getHijabRules(madhab)` → returns the rule array for that madhab

### `getMadhhabConfig(madhab)` → returns the full config object

### `isValidMadhab(madhab)` → boolean check against FIQH_DATABASE.madhabs keys

---

## 6. computeFixedShares — Fard (Quranic) Shares

Located in `engine/compute-fixed-shares.ts`. Computes the Quranic fixed shares for each eligible heir.

### Inputs

```
heirs: HeirsData (post-hijab)
deps: { madhab, hasDescendants, isUmariyyah, getSiblingsCount }
```

### Husband (الزوج)

```
IF husband > 0:
    IF hasDescendants:  fraction = 1/4
    ELSE:               fraction = 1/2
    RETURN share { key: "husband", type: "فرض" }
```

### Wife (الزوجة)

```
IF wife > 0:
    IF hasDescendants:  fraction = 1/8
    ELSE:               fraction = 1/4
    RETURN share { key: "wife", type: "فرض" }
```

### Mother (الأم)

```
IF mother > 0:
    IF isUmariyyah:
        IF umariyyahRule == "sixth" OR husband exists:
            fraction = 1/6
        ELSE:
            fraction = 1/4
    ELIF hasDescendants:
        fraction = 1/6
    ELIF siblingsCount >= 2:
        fraction = 1/6
    ELSE:
        fraction = 1/3
    RETURN share { key: "mother", type: "فرض" }
```

### Father (الأب) — fard portion

```
IF father > 0 AND hasDescendants AND NOT isUmariyyah:
    fraction = 1/6
    RETURN share { key: "father", type: "فرض", reason: "⅙ with descendants" }
```

### Grandmothers (الجدة)

```
IF mother is absent (0):
    IF paternalGM AND maternalGM both exist:
        each gets 1/12 (share equally, IJMA for same-degree different-direction)
    ELIF only paternalGM: 1/6
    ELIF only maternalGM: 1/6
    ELIF generic grandmother: 1/6
```

### Daughter (البنت)

```
IF daughter > 0 AND son == 0:
    IF daughter == 1:  fraction = 1/2
    ELSE:              fraction = 2/3
```

### Granddaughter (بنت الابن)

```
IF granddaughter > 0 AND grandson == 0 AND son == 0:
    IF daughter == 0:
        IF granddaughter == 1:  fraction = 1/2
        ELSE:                   fraction = 2/3
    ELIF daughter == 1:
        fraction = 1/6 (completes the 2/3 with the daughter's 1/2)
```

### Full Sister (الأخت الشقيقة)

```
IF full_sister > 0 AND full_brother == 0:
    IF no descendants AND no father AND no grandfather:
        IF full_sister == 1:  fraction = 1/2
        ELSE:                 fraction = 2/3
```

### Paternal Half-Sister (الأخت لأب)

```
IF half_sister_paternal > 0 AND no full_brother AND no half_brother_paternal:
    IF no descendants AND no father AND no grandfather AND no full_sister:
        IF count == 1:  fraction = 1/2
        ELSE:           fraction = 2/3
```

### Maternal Siblings (الإخوة لأم)

```
maternalCount = maternal_brother + maternal_sister
IF maternalCount > 0 AND no descendants AND no father AND no grandfather:
    IF count == 1:  fraction = 1/6
    ELSE:           fraction = 1/3
```

---

## 7. computeAsaba — Residue Distribution

Located in `engine/compute-asaba.ts`. Distributes the remaining estate fraction to asaba (agnatic) heirs.

### Inputs

```
fixedShares: HeirShareObject[] (from fard computation)
remainder: FractionClass (1 - sum of adjusted fixed shares)
heirs: HeirsData (post-hijab)
deps: { madhab, getFullAndPaternalSiblingsCount, addStep }
```

### If no remainder: RETURN empty array

### Priority 1: Son (الابن) with or without daughters

```
IF son > 0:
    totalHeads = son * 2 + daughter
    sonWeight = son * 2
    daughterWeight = daughter
    son fraction = remainder * (sonWeight / totalHeads)
    daughter fraction = remainder * (daughterWeight / totalHeads)
    RETURN [son, daughter] shares
```

(Males get 2 parts, females get 1 part — per Quran 4:11)

### Priority 2: Grandson (ابن الابن) with or without granddaughters

```
IF grandson > 0:
    totalHeads = grandson * 2 + granddaughter
    grandson fraction = remainder * (grandson * 2 / totalHeads)
    granddaughter fraction = remainder * (granddaughter / totalHeads)
    RETURN [grandson, granddaughter] shares
```

### Priority 3: Father (الأب)

```
IF father > 0:
    fraction = remainder (100%)
    addToExisting = true (merges with fard 1/6 if present)
    RETURN [father]
```

### Priority 4: Grandfather (الجد) — with or without siblings

```
IF grandfather > 0 AND no father:
    siblingsCount = full_brother + full_sister + half_brother_paternal + half_sister_paternal
    madhabConfig = madhab rules
    shouldShare = (grandfather_with_siblings == "musharak")

    IF siblingsCount > 0 AND shouldShare:
        totalHeads = 2 + (full_brother * 2) + full_sister + (half_brother_paternal * 2) + half_sister_paternal
        Compute 3 options for grandfather:
            byMuqasamah = remainder * (2 / totalHeads)    // مقاسمة
            byThird = 1/3                                  // ثلث
            bySixth = 1/6                                  // سدس
        Select BEST option (highest value)
        grandfather gets bestOption
        IF best == muqasamah:
            Distribute remainder proportionally to all siblings by head count
        ELSE:
            Distribute (remainder - bestOption) proportionally to siblings
    ELIF siblingsCount > 0 AND NOT shouldShare (Hanafi):
        grandfather gets ALL remainder (blocks siblings)
    ELSE (no siblings):
        grandfather gets ALL remainder

    RETURN shares
```

### Priority 5: Full Brothers (الإخوة الأشقاء)

```
IF full_brother > 0:
    totalHeads = full_brother * 2 + full_sister
    brother fraction = remainder * (full_brother * 2 / totalHeads)
    sister fraction = remainder * (full_sister / totalHeads)
    (sister gets addToExisting = true if she also has a fard share)
    RETURN shares
```

### Priority 6: Paternal Half-Brothers (الإخوة لأب)

```
IF half_brother_paternal > 0:
    totalHeads = half_brother_paternal * 2 + half_sister_paternal
    brother fraction = remainder * (half_brother_paternal * 2 / totalHeads)
    sister fraction = remainder * (half_sister_paternal / totalHeads)
    RETURN shares
```

### Priority 7: Paternal Uncle (العم)

```
IF uncle_paternal > 0:
    fraction = remainder / uncle_paternal (equal split)
    RETURN [uncle]
```

### Priority 8: Nephew from Brother (ابن الأخ)

```
IF nephew_from_brother > 0:
    fraction = remainder / nephew_from_brother (equal split)
    RETURN [nephew]
```

---

## 8. calculateConfidence — Confidence Scoring

Located in `engine/compute-confidence.ts`. Returns a score from 50 to 100.

```
confidence = 100

DEDUCTIONS:
  heirCount > 12:         -10  (very complex family)
  heirCount > 8:           -5  (complex family)
  heirCount > 5:           -3  (moderate complexity)
  fraction total deviation > 0.01 from 1:  -30  (mathematical anomaly)
  invariantFailed:        → confidence = 0  (conservation violated)
  3+ generations present: -5  (deep lineage)
  Distant heirs present: -3  (dhawu al-arham, valid but complex)
  Grandfather with siblings: -5  (madhab-dependent, uncertain)
  Multiple wives (>1):    -3

confidence = max(50, min(100, confidence))
Store factors in state.confidenceFactors
```

---

## 9. InvariantEngine — Conservation Check

Located in `invariant.ts`.

### `assertConservations(allocations, tolerance=1e-6)`

```
total = 0
FOR each key in allocations:
    value = allocations[key].toDecimal()
    IF value is not finite: throw error for that heir
    total += value
deviation = |total - 1|
IF deviation > tolerance:
    throw error: "Conservation violated: total = {total}, expected 1.0, deviation = {deviation}"
```

---

## 10. EnhancedInheritanceCalculationEngine — Main Orchestrator

Located in `enhanced-engine-complete.ts`. The public entry point.

### `constructor(madhab, estate, heirs)`

```
this.madhab = madhab
this.estate = normalizeEstateInput(estate)
this.heirs = normalizeHeirsInput(heirs)
this.hijabSystem = new HijabSystem(madhab)
this.state = { blockedHeirs: [], awlApplied: false, raddApplied: false, ... }
```

### `calculateNetEstate()`

```
net = estate.total
net -= funeral (default 0)
net -= debts (default 0)
remainderAfterDeductions = net
maxWill = remainderAfterDeductions / 3
actualWill = min(estate.will, maxWill)
net -= actualWill
RETURN max(0, net)
```

### `isUmariyyah(heirs)`

```
hasHusband = (heirs.husband > 0)
hasBothParents = (father > 0) AND (mother > 0)
hasDescendants = (son > 0) OR (daughter > 0) OR (grandson > 0) OR (granddaughter > 0)
RETURN hasHusband AND hasBothParents AND NOT hasDescendants
```

### `isMusharraka(filteredHeirs)`

```
IF madhab does NOT support musharraka: RETURN false
h = filteredHeirs
RETURN:
    husband > 0
    AND (mother > 0 OR grandmother_mother > 0)
    AND maternal siblings >= 2
    AND full siblings exist
    AND no descendants
    AND no father
    AND no grandfather
```

### `computeMusharraka(filteredHeirs)`

```
husband gets 1/2
mother (or grandmother_mother) gets 1/6
ALL siblings (full + maternal) share 1/3 equally
RETURN [husband, mother, shared_siblings]
```

### `isAkdariyya()`

```
RETURN:
    husband > 0
    AND mother > 0
    AND grandfather > 0
    AND full_sister == 1
    AND no descendants
    AND no father
    AND no full_brother
```

### `computeAkdariyya()`

```
Fixed distribution (special case al-Akdariyya / al-Ghara'):
    husband:    9/27  (≈ 1/2)
    mother:     6/27  (≈ 1/3)
    grandfather: 8/27
    full_sister: 4/27
Set awlApplied = true (this IS an awl scenario)
RETURN shares
```

### `applyAwl(shares, totalFraction)`

```
// Awl (العول): when fard total > 1, reduce all proportionally
FOR each share in shares:
    share.fraction = share.fraction / totalFraction
RETURN adjusted shares
```

### `applyRadd(shares, remainder)`

```
// Radd (الرد): surplus returned to fard heirs when no asaba exists
IF remainder <= 0.0001: RETURN { applied: false }

IF madhab radd_allowed == false: RETURN { applied: false }

eligible = shares WHERE:
    type is NOT "تعصيب"
    AND NOT (spouse AND spouse_radd == false)
    AND NOT (spouse AND other fard heirs exist)

IF no eligible heirs: RETURN { applied: false }

totalEligible = sum of eligible fractions
FOR each eligible share:
    proportion = share.fraction / totalEligible
    additional = remainder * proportion
    share.fraction += additional
    share.type += " + رد"
RETURN { shares: updated, applied: true }
```

### `distributeToBloodRelatives(shares, remainder)`

```
// Dhawu al-arham (ذوو الأرحام): blood relatives who are not asaba
IF remainder <= 0.0001: RETURN no change

Define 9 priority classes (closest blood relation first):
    Class 1: daughter_son, daughter_daughter
    Class 2: full_nephew, nephew_from_brother
    Class 3: paternal_nephew
    Class 4: niece_from_brother
    Class 5: sister_children
    Class 6: full_cousin, paternal_cousin
    Class 7: maternal_uncle, maternal_aunt
    Class 8: aunt_paternal, paternal_aunt
    Class 9: aunt_maternal

FOR each class (highest priority first):
    classHeirs = heirs in this class with count > 0
    IF classHeirs is not empty:
        totalCount = sum of counts
        FOR each heir in classHeirs:
            fraction = remainder * (heir.count / totalCount)
            Add share { type: "ذو رحم" }
        BREAK (only one class inherits)
RETURN updated shares
```

### `mergeShares(fixedShares, asabaShares)`

```
merged = [...fixedShares]
seenKeys = set()

FOR each asaba share:
    existing = merged.find(s.key == asaba.key)

    IF seenKeys.has(asaba.key) AND no existing:
        LOG "double_asaba warning" → skip
        CONTINUE
    seenKeys.add(asaba.key)

    IF existing AND asaba.addToExisting:
        existing.fraction += asaba.fraction
        existing.type = "فرض + تعصيب"
    ELIF existing AND NOT addToExisting:
        LOG "asaba_dropped warning" → skip
    ELSE:
        merged.push(asaba)

RETURN merged
```

### `calculateFinalAmounts(shares, netEstate)`

```
FOR each share:
    amount = round(fraction.toDecimal() * netEstate * 100) / 100
    percentage = round(fraction.toDecimal() * 10000) / 100
    fraction = { numerator, denominator }
    shares[] = array of per-person amounts (amount / count for each)
RETURN HeirShare[]
```

### Helper methods

```
hasDescendants():
    son > 0 OR daughter > 0 OR grandson > 0 OR granddaughter > 0

getFullAndPaternalSiblingsCount():
    full_brother + full_sister + half_brother_paternal + half_sister_paternal

getSiblingsCount(heirs):
    full_brother + full_sister + half_brother_paternal + half_sister_paternal
    + maternal_brother + maternal_sister

getMaternalSiblingsCount():
    maternal_brother + maternal_sister

getFullSiblingsCount():
    full_brother + full_sister

sumFractions(fractions):
    reduce with FractionClass.add(), starting from 0/1
```

---

_Generated from source files in `lib/inheritance/`. Last updated: 2026-07-23._
