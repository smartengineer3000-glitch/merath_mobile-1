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
   * إرجاع الكسر باللغة العربية مع دعم كامل لجميع حالات المواريث
   * Return comprehensive Arabic name of fraction for inheritance cases
   */
  toArabicName(): string {
    const key = `${this.numerator}/${this.denominator}`;
    
    // Comprehensive Arabic fraction names for all inheritance scenarios
  const arabicFractions: Record<string, string> = {
  // Basic fractions
  '0/1': 'لا شيء',
  '1/1': 'كامل التركة',
  '1/2': 'النصف',
  '1/3': 'الثلث',
  '2/3': 'الثلثان',
  '1/4': 'الربع',
  '3/4': 'ثلاثة أرباع',
  '1/5': 'الخمس',
  '2/5': 'خمسان',
  '3/5': 'ثلاثة أخماس',
  '4/5': 'أربعة أخماس',
  '1/6': 'السدس',
  '5/6': 'خمسة أسداس',
  '1/7': 'السبع',
  '2/7': 'سبعان',
  '3/7': 'ثلاثة أسباع',
  '4/7': 'أربعة أسباع',
  '5/7': 'خمسة أسباع',
  '6/7': 'ستة أسباع',
  '1/8': 'الثمن',
  '3/8': 'ثلاثة أثمان',
  '5/8': 'خمسة أثمان',
  '7/8': 'سبعة أثمان',
  '1/9': 'التسع',
  '2/9': 'تسعان',
  '4/9': 'أربعة أتساع',
  '5/9': 'خمسة أتساع',
  '7/9': 'سبعة أتساع',
  '8/9': 'ثمانية أتساع',
  '1/10': 'العشر',
  '3/10': 'ثلاثة أعشار',
  '7/10': 'سبعة أعشار',
  '9/10': 'تسعة أعشار',

  // Common inheritance combinations - using proper Arabic format
  '1/12': 'واحد / اثنا عشر',
  '5/12': 'خمسة / اثنا عشر',
  '7/12': 'سبعة / اثنا عشر',
  '11/12': 'أحد عشر / اثنا عشر',
  '1/24': 'واحد / أربعة وعشرون',
  '5/24': 'خمسة / أربعة وعشرون',
  '7/24': 'سبعة / أربعة وعشرون',
  '11/24': 'أحد عشر / أربعة وعشرون',
  '13/24': 'ثلاثة عشر / أربعة وعشرون',
  '17/24': 'سبعة عشر / أربعة وعشرون',
  '19/24': 'تسعة عشر / أربعة وعشرون',
  '23/24': 'ثلاثة وعشرون / أربعة وعشرون',

  // Special inheritance cases
  '2/6': 'ثلث', // Simplified from 2/6
  '3/6': 'نصف', // Simplified from 3/6
  '4/6': 'ثلثان', // Simplified from 4/6
  '2/8': 'ربع', // Simplified from 2/8
  '4/8': 'نصف', // Simplified from 4/8
  '6/8': 'ثلاثة أرباع', // Simplified from 6/8
  '3/9': 'ثلث', // Simplified from 3/9
  '6/9': 'ثلثان', // Simplified from 6/9
  '2/10': 'خمس', // Simplified from 2/10
  '4/10': 'خمسان', // Simplified from 4/10
  '5/10': 'نصف', // Simplified from 5/10
  '6/10': 'ثلاثة أخماس', // Simplified from 6/10
  '8/10': 'أربعة أخماس', // Simplified from 8/10

  // Awl (العول) cases - when denominator increases
  '2/3_1/2': 'نصف وثلثان - عول',
  '1/2_1/3': 'نصف و ثلث - عول',
  '2/3_1/4': 'ثلثان و ربع - عول',
  '1/2_1/6': 'نصف و سدس - عول',
  '2/3_1/6': 'ثلثان و سدس - عول',
  '1/3_1/6': 'ثلث و سدس - عول',
};

    // Check if we have an exact match
    if (arabicFractions[key]) {
      return arabicFractions[key];
    }

    // Handle simplified fractions that might not be in the map
    const simplified = this.simplifyToString();
    if (simplified !== key && arabicFractions[simplified]) {
      return arabicFractions[simplified];
    }

    // Handle complex fractions (return mathematical representation)
    if (this.numerator === 1) {
      return `جزء من ${this.denominator}`; // "جزء من 8" for 1/8 etc.
    } else if (this.denominator > 10) {
      return `${this.numerator} من ${this.denominator}`; // Generic for complex fractions
    }

    return key; // Fallback to mathematical notation
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

  /**
   * تبسيط الكسر وإرجاعه كنص
   * Simplify and return as string
   */
  private simplifyToString(): string {
    const simplified = new FractionClass(this.numerator, this.denominator);
    return `${simplified.numerator}/${simplified.denominator}`;
  }

  /**
   * الحصول على المقام المشترك
   * Get common denominator with another fraction
   */
  getCommonDenominator(other: FractionClass): number {
    return this.lcm(this.denominator, other.denominator);
  }

  /**
   * حساب المضاعف المشترك الأصغر
   * Calculate Least Common Multiple
   */
  private lcm(a: number, b: number): number {
    return Math.abs(a * b) / this.gcd(a, b);
  }

  /**
   * تحويل إلى كسر بمقام محدد
   * Convert to fraction with specific denominator
   */
  toDenominator(targetDenominator: number): FractionClass {
    if (targetDenominator % this.denominator !== 0) {
      throw new Error('المقام المستهدف يجب أن يكون مضاعفاً للمقام الحالي');
    }
    const multiplier = targetDenominator / this.denominator;
    return new FractionClass(this.numerator * multiplier, targetDenominator);
  }
}