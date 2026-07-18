/**
 * فئة الكسور المتقدمة لحساب المواريث الشرعي
 * Enhanced Fraction Class for Islamic Inheritance Calculations
 *
 * تدعم العمليات الحسابية على الكسور بدقة عالية جداً
 *
 * FIXES:
 * - C6 (🔴): Fraction simplification overflow protection for large denominators (>1e9)
 */

import { FractionData } from "./types";

export class FractionClass {
  private numerator: number;
  private denominator: number;

  private static readonly MAX_SAFE_DENOMINATOR = 1_000_000_000;
  private static readonly SIMPLIFY_THRESHOLD = 1_000_000;
  private static readonly TOLERANCE = 1e-10;

  constructor(numerator: number, denominator: number = 1) {
    if (denominator === 0) {
      throw new Error(
        "المقام لا يمكن أن يكون صفراً | Denominator cannot be zero",
      );
    }

    if (denominator < 0) {
      numerator = -numerator;
      denominator = -denominator;
    }

    this.numerator = numerator;
    this.denominator = denominator;

    this.simplify();
  }

  private simplify(): void {
    if (this.numerator === 0) {
      this.denominator = 1;
      return;
    }

    if (this.denominator > FractionClass.MAX_SAFE_DENOMINATOR) {
      this.scaleDownToSafeRange();
      return;
    }

    const gcd = this.safeGcd(Math.abs(this.numerator), this.denominator);

    if (gcd > 1) {
      this.numerator /= gcd;
      this.denominator /= gcd;
    }

    if (this.denominator > FractionClass.MAX_SAFE_DENOMINATOR) {
      this.scaleDownToSafeRange();
    }
  }

  private safeGcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);

    if (a > Number.MAX_SAFE_INTEGER / 2 || b > Number.MAX_SAFE_INTEGER / 2) {
      return this.approximateGcd(a, b);
    }

    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;

      if (isNaN(a) || isNaN(b) || !isFinite(a) || !isFinite(b)) {
        return 1;
      }
    }

    return a || 1;
  }

  private approximateGcd(a: number, b: number): number {
    const ratio = a / b;

    if (Math.abs(ratio - Math.round(ratio)) < FractionClass.TOLERANCE) {
      return b;
    }

    const inverseRatio = b / a;
    if (
      Math.abs(inverseRatio - Math.round(inverseRatio)) <
      FractionClass.TOLERANCE
    ) {
      return a;
    }

    const smaller = Math.min(a, b);
    if (smaller < 1000) {
      for (let i = Math.floor(Math.sqrt(smaller)); i > 1; i--) {
        if (a % i === 0 && b % i === 0) {
          return i;
        }
      }
    }

    return 1;
  }

  private scaleDownToSafeRange(): void {
    if (this.denominator <= FractionClass.MAX_SAFE_DENOMINATOR) return;

    const scaleFactor = this.denominator / FractionClass.MAX_SAFE_DENOMINATOR;

    this.numerator = Math.round(this.numerator / scaleFactor);
    this.denominator = FractionClass.MAX_SAFE_DENOMINATOR;

    const gcd = this.safeGcd(Math.abs(this.numerator), this.denominator);
    if (gcd > 1) {
      this.numerator /= gcd;
      this.denominator /= gcd;
    }
  }

  add(other: FractionClass): FractionClass {
    const newNumerator =
      this.numerator * other.denominator + other.numerator * this.denominator;
    const newDenominator = this.denominator * other.denominator;

    if (Math.abs(newDenominator) > FractionClass.MAX_SAFE_DENOMINATOR) {
      const decimal = this.toDecimal() + other.toDecimal();
      return FractionClass.fromDecimal(decimal, 12);
    }

    return new FractionClass(newNumerator, newDenominator);
  }

  subtract(other: FractionClass): FractionClass {
    const newNumerator =
      this.numerator * other.denominator - other.numerator * this.denominator;
    const newDenominator = this.denominator * other.denominator;

    if (Math.abs(newDenominator) > FractionClass.MAX_SAFE_DENOMINATOR) {
      const decimal = this.toDecimal() - other.toDecimal();
      return FractionClass.fromDecimal(decimal, 12);
    }

    return new FractionClass(newNumerator, newDenominator);
  }

  multiply(scalar: number | FractionClass): FractionClass {
    if (typeof scalar === "number") {
      if (
        Math.abs(this.denominator) >
        FractionClass.MAX_SAFE_DENOMINATOR / Math.abs(scalar)
      ) {
        const decimal = this.toDecimal() * scalar;
        return FractionClass.fromDecimal(decimal, 12);
      }

      return new FractionClass(this.numerator * scalar, this.denominator);
    } else {
      const newDenominator = this.denominator * scalar.denominator;
      if (Math.abs(newDenominator) > FractionClass.MAX_SAFE_DENOMINATOR) {
        const decimal = this.toDecimal() * scalar.toDecimal();
        return FractionClass.fromDecimal(decimal, 12);
      }

      return new FractionClass(
        this.numerator * scalar.numerator,
        newDenominator,
      );
    }
  }

  divide(scalar: number | FractionClass): FractionClass {
    if (typeof scalar === "number") {
      if (scalar === 0) {
        throw new Error("لا يمكن القسمة على صفر | Cannot divide by zero");
      }

      if (
        Math.abs(this.denominator * scalar) > FractionClass.MAX_SAFE_DENOMINATOR
      ) {
        const decimal = this.toDecimal() / scalar;
        return FractionClass.fromDecimal(decimal, 12);
      }

      return new FractionClass(this.numerator, this.denominator * scalar);
    } else {
      if (scalar.numerator === 0) {
        throw new Error("لا يمكن القسمة على صفر | Cannot divide by zero");
      }

      const newDenominator = this.denominator * scalar.numerator;
      if (Math.abs(newDenominator) > FractionClass.MAX_SAFE_DENOMINATOR) {
        const decimal = this.toDecimal() / scalar.toDecimal();
        return FractionClass.fromDecimal(decimal, 12);
      }

      return new FractionClass(
        this.numerator * scalar.denominator,
        newDenominator,
      );
    }
  }

  toDecimal(): number {
    return this.numerator / this.denominator;
  }

  // 🔴 HARDENED: strict rational equality (no tolerance)
  equals(other: FractionClass): boolean {
    return (
      this.numerator * other.denominator === other.numerator * this.denominator
    );
  }

  // 🔴 HARDENED: strict comparison (no tolerance)
  compare(other: FractionClass): number {
    const left = this.numerator * other.denominator;
    const right = other.numerator * this.denominator;

    if (left < right) return -1;
    if (left > right) return 1;
    return 0;
  }

  private assertValidState(): void {
    if (
      !Number.isFinite(this.numerator) ||
      !Number.isFinite(this.denominator)
    ) {
      throw new Error("Invalid fraction state");
    }

    if (this.denominator === 0) {
      throw new Error("Zero denominator not allowed");
    }
  }

  toString(): string {
    if (this.denominator === 1) {
      return `${this.numerator}`;
    }
    return `${this.numerator}/${this.denominator}`;
  }

  toData(): FractionData {
    return {
      numerator: this.numerator,
      denominator: this.denominator,
    };
  }

  static fromData(data: FractionData): FractionClass {
    return new FractionClass(data.numerator, data.denominator);
  }

  static fromDecimal(decimal: number, precision: number = 12): FractionClass {
    if (decimal === 0) return new FractionClass(0);

    const sign = decimal < 0 ? -1 : 1;
    decimal = Math.abs(decimal);

    let h1 = 1,
      h2 = 0;
    let k1 = 0,
      k2 = 1;
    let b = decimal;

    do {
      const a = Math.floor(b);
      let aux = h1;
      h1 = a * h1 + h2;
      h2 = aux;
      aux = k1;
      k1 = a * k1 + k2;
      k2 = aux;

      // Z1 FIX: Guard against Infinity when b - a == 0 (integer input)
      const remainder = b - a;
      if (Math.abs(remainder) < 1e-15 || !Number.isFinite(1 / remainder)) {
        break;
      }
      b = 1 / remainder;
    } while (Math.abs(decimal - h1 / k1) > decimal * 1e-12);

    return new FractionClass(sign * h1, k1);
  }

  getNumerator(): number {
    return this.numerator;
  }

  getDenominator(): number {
    return this.denominator;
  }

  isPositive(): boolean {
    return this.numerator > 0;
  }

  isZero(): boolean {
    return this.numerator === 0;
  }

  greaterThan(other: FractionClass): boolean {
    return this.compare(other) > 0;
  }

  lessThan(other: FractionClass): boolean {
    return this.compare(other) < 0;
  }

  greaterThanOrEqual(other: FractionClass): boolean {
    return this.compare(other) >= 0;
  }

  lessThanOrEqual(other: FractionClass): boolean {
    return this.compare(other) <= 0;
  }
}
