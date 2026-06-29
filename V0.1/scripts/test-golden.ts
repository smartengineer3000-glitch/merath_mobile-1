import { runInheritanceCalculation } from "../lib/inheritance/enhanced-engine-safe";
import cases from "../tests/golden-cases.json";

function run() {
  const results: any[] = [];

  for (const c of (cases as any).cases) {
    const result = runInheritanceCalculation(c.input);

    results.push({
      name: c.name,
      passed: JSON.stringify(result?.allocations || {}) === JSON.stringify(c.expected),
      output: result?.allocations,
      expected: c.expected
    });
  }

  const failed = results.filter(r => !r.passed);

  if (failed.length > 0) {
    console.error("Golden tests FAILED", failed);
    process.exit(1);
  }

  console.log("Golden tests PASSED");
}

run();