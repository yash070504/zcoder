// ═══════════════════════════════════════════════════════════════════
// verdictPipeline.test.js — Verification Suite for LeetCode Verdict Pipeline
//
// Tests:
// 1. AC  (Accepted) — sample + hidden testcases pass
// 2. WA  (Wrong Answer) — logic fails expected output
// 3. TLE (Time Limit Exceeded) — strict 1s timeout kills infinite loop
// 4. CE  (Compilation Error) — compilation failure
// 5. RE  (Runtime Error) — unhandled exception during execution
// 6. SV  (Security Violation) — blocked syscall / malicious library preflight
// 7. Hidden testcase masking — verifies hidden input/output are not leaked
// ═══════════════════════════════════════════════════════════════════

const { evaluateSubmission, VERDICT_CODES } = require("../services/verdictEngine");

async function runTests() {
  console.log("🧪 Starting LeetCode Verdict Pipeline Test Suite...\n");
  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
    }
  }

  // 1. AC Test
  console.log("▶ 1. Testing ACCEPTED (AC)...");
  const acResult = await evaluateSubmission({
    language: "javascript",
    sourceCode: `
      const fs = require('fs');
      // Read two numbers from stdin and output their sum
      const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
      if (input.length >= 2) {
        console.log(Number(input[0]) + Number(input[1]));
      }
    `,
    testcases: [
      { input: "3 5", expectedOutput: "8", isHidden: false },
      { input: "10 20", expectedOutput: "30", isHidden: true }
    ],
    timeLimitMs: 2000
  });

  assert(acResult.verdictCode === "AC", `Verdict is AC (got ${acResult.verdictCode})`);
  assert(acResult.passedCount === 2, `Passed 2/2 testcases (got ${acResult.passedCount})`);
  assert(acResult.testcaseResults[1].input === "[Hidden]", "Hidden testcase input is masked");
  assert(acResult.testcaseResults[1].actualOutput === "[Hidden (Passed)]", "Hidden testcase passed output is protected");

  // 2. WA Test
  console.log("\n▶ 2. Testing WRONG_ANSWER (WA)...");
  const waResult = await evaluateSubmission({
    language: "javascript",
    sourceCode: `
      console.log("wrong output");
    `,
    testcases: [
      { input: "3 5", expectedOutput: "8", isHidden: false }
    ],
    timeLimitMs: 2000
  });

  assert(waResult.verdictCode === "WA", `Verdict is WA (got ${waResult.verdictCode})`);
  assert(waResult.passedCount === 0, `Passed 0/1 testcases (got ${waResult.passedCount})`);
  assert(waResult.firstFailedCase.verdictCode === "WA", "firstFailedCase records WA");

  // 3. TLE Test
  console.log("\n▶ 3. Testing TIME_LIMIT_EXCEEDED (TLE) with strict timeout...");
  const startTime = Date.now();
  const tleResult = await evaluateSubmission({
    language: "javascript",
    sourceCode: `
      // Infinite loop to trigger strict timeout
      while (true) {}
    `,
    testcases: [
      { input: "", expectedOutput: "42", isHidden: false, timeoutMs: 1200 }
    ]
  });
  const elapsed = Date.now() - startTime;

  assert(tleResult.verdictCode === "TLE", `Verdict is TLE (got ${tleResult.verdictCode})`);
  assert(elapsed >= 1000 && elapsed < 3500, `Strict timeout triggered around 1.2s (actual: ${elapsed}ms)`);
  assert(tleResult.passedCount === 0, "Passed 0 cases on timeout");

  // 4. RE Test
  console.log("\n▶ 4. Testing RUNTIME_ERROR (RE)...");
  const reResult = await evaluateSubmission({
    language: "javascript",
    sourceCode: `
      throw new Error("Explicit runtime crash in candidate code");
    `,
    testcases: [
      { input: "", expectedOutput: "ok", isHidden: false }
    ],
    timeLimitMs: 2000
  });

  assert(reResult.verdictCode === "RE", `Verdict is RE (got ${reResult.verdictCode})`);
  assert(reResult.firstFailedCase.verdictCode === "RE", "firstFailedCase indicates RE");

  // 5. SV Test
  console.log("\n▶ 5. Testing SECURITY_VIOLATION (SV)...");
  const svResult = await evaluateSubmission({
    language: "javascript",
    sourceCode: `
      const cp = require("child_process");
      cp.execSync("whoami");
    `,
    testcases: [
      { input: "", expectedOutput: "" }
    ],
    timeLimitMs: 2000
  });

  assert(svResult.verdictCode === "SV", `Verdict is SV (got ${svResult.verdictCode})`);
  assert(svResult.details.includes("child_process"), `Security details captured: "${svResult.details}"`);

  // 6. CE Test (Simulated compilation error check via C++)
  console.log("\n▶ 6. Testing COMPILATION_ERROR (CE)...");
  const ceResult = await evaluateSubmission({
    language: "cpp",
    sourceCode: `
      int main() {
        this_is_invalid_cpp_syntax ;;;
        return 0;
      }
    `,
    testcases: [
      { input: "", expectedOutput: "ok" }
    ],
    timeLimitMs: 2000
  });

  assert(ceResult.verdictCode === "CE", `Verdict is CE (got ${ceResult.verdictCode})`);

  // 7. Hidden testcase masking on failure
  console.log("\n▶ 7. Testing Hidden Testcase Masking on Failure...");
  const hiddenWaResult = await evaluateSubmission({
    language: "javascript",
    sourceCode: `
      console.log("visible answer for sample");
    `,
    testcases: [
      { input: "sample input", expectedOutput: "visible answer for sample", isHidden: false },
      { input: "secret input 999", expectedOutput: "secret answer 999", isHidden: true }
    ],
    timeLimitMs: 2000
  });

  assert(hiddenWaResult.verdictCode === "WA", "Overall verdict is WA on hidden case");
  assert(hiddenWaResult.passedCount === 1, "Passed sample case");
  const hiddenCase = hiddenWaResult.firstFailedCase;
  assert(hiddenCase.input === "[Hidden]", "Hidden testcase input is NOT leaked to candidate");
  assert(hiddenCase.expectedOutput === "[Hidden]", "Hidden testcase expected output is NOT leaked");
  assert(hiddenCase.actualOutput === "[Hidden]", "Hidden testcase actual output is masked on mismatch");

  console.log(`\n========================================`);
  console.log(`🎯 Test Summary: ${passed}/${total} assertions passed`);
  console.log(`========================================\n`);

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution encountered unexpected failure:", err);
  process.exit(1);
});
