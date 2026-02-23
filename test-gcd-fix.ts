import { FractionClass } from './lib/inheritance/fraction';

/**
 * Test script to verify GCD fix resolves stack overflow
 */

console.log('Testing GCD Fix...\n');

// Test 1: Simple case
try {
  const f1 = new FractionClass(2, 4);
  console.log('✓ Test 1 (2/4): Pass -', f1.toString());
} catch (e) {
  console.log('✗ Test 1 (2/4): Fail -', (e as Error).message);
}

// Test 2: Large numbers
try {
  const f2 = new FractionClass(999999, 1000000);
  console.log('✓ Test 2 (999999/1000000): Pass -', f2.toString());
} catch (e) {
  console.log('✗ Test 2 (999999/1000000): Fail -', (e as Error).message);
}

// Test 3: Very large numbers that would exceed recursion limit
try {
  const f3 = new FractionClass(1000000000, 1000000001);
  console.log('✓ Test 3 (1000000000/1000000001): Pass -', f3.toString());
} catch (e) {
  console.log('✗ Test 3 (1000000000/1000000001): Fail -', (e as Error).message);
}

// Test 4: Complex fraction operations
try {
  const f4 = new FractionClass(1, 2);
  const f5 = new FractionClass(1, 3);
  const result = f4.add(f5);
  console.log(`✓ Test 4 (1/2 + 1/3): Pass - ${result.toString()}`);
} catch (e) {
  console.log('✗ Test 4 (1/2 + 1/3): Fail -', (e as Error).message);
}

console.log('\n✅ GCD Fix Verification Complete');
