// ═══════════════════════════════════════════════════════════════════
// verdictEngine.js — Multi-Testcase Evaluator & LeetCode Verdict Pipeline
//
// Verdicts:
//   - ACCEPTED (AC)
//   - WRONG_ANSWER (WA)
//   - TIME_LIMIT_EXCEEDED (TLE)
//   - COMPILATION_ERROR (CE)
//   - RUNTIME_ERROR (RE)
//   - SECURITY_VIOLATION (SV)
// ═══════════════════════════════════════════════════════════════════

const fs = require("fs");
const path = require("path");
const os = require("os");
const {
  scanCodeSecurity,
  compileSource,
  runIsolatedTestcase
} = require("./sandboxRunner");

/**
 * Normalized LeetCode verdict mappings:
 * AC  - Accepted
 * WA  - Wrong Answer
 * TLE - Time Limit Exceeded
 * CE  - Compilation Error
 * RE  - Runtime Error
 * SV  - Security Violation
 */
const VERDICT_CODES = {
  ACCEPTED: "AC",
  WRONG_ANSWER: "WA",
  TIME_LIMIT_EXCEEDED: "TLE",
  COMPILATION_ERROR: "CE",
  RUNTIME_ERROR: "RE",
  SECURITY_VIOLATION: "SV"
};

const VERDICT_LABELS = {
  AC: "Accepted",
  WA: "Wrong Answer",
  TLE: "Time Limit Exceeded",
  CE: "Compilation Error",
  RE: "Runtime Error",
  SV: "Security Violation"
};

/**
 * Standardize output by trimming trailing whitespace and unifying line-endings.
 */
function normalizeOutput(str) {
  if (!str) return "";
  return str
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

/**
 * Executes a full submission against testcases with live updates.
 */
async function evaluateSubmission(job, onProgress = () => {}) {
  const { language, sourceCode, testcases = [], timeLimitMs } = job;
  const lang = (language || "javascript").toLowerCase();

  // 1. Security Scan
  const secScan = scanCodeSecurity(sourceCode, lang);
  if (!secScan.safe) {
    const verdict = "SECURITY_VIOLATION";
    const verdictCode = VERDICT_CODES[verdict];
    return {
      verdict,
      verdictCode,
      verdictLabel: VERDICT_LABELS[verdictCode],
      passedCount: 0,
      totalCount: testcases.length,
      details: secScan.reason,
      testcaseResults: []
    };
  }

  // 2. Prepare Sandbox Environment
  const tempDir = path.join(
    os.tmpdir(),
    "zcoder_sub_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7)
  );
  fs.mkdirSync(tempDir, { recursive: true });

  try {
    let sourceFileName = "solution.js";
    if (lang === "python" || lang === "py") sourceFileName = "solution.py";
    else if (lang === "cpp" || lang === "c++" || lang === "c") sourceFileName = "solution.cpp";
    else if (lang === "java") sourceFileName = "Solution.java";

    const sourceFile = path.join(tempDir, sourceFileName);
    fs.writeFileSync(sourceFile, sourceCode, "utf8");

    // 3. Compile Step (if applicable)
    onProgress({ status: "COMPILING" });
    const compiledInfo = await compileSource({ lang, sourceFile, tempDir });

    if (compiledInfo.success === false) {
      const verdict = "COMPILATION_ERROR";
      const verdictCode = VERDICT_CODES[verdict];
      return {
        verdict,
        verdictCode,
        verdictLabel: VERDICT_LABELS[verdictCode],
        passedCount: 0,
        totalCount: testcases.length,
        compileError: compiledInfo.compileError,
        testcaseResults: []
      };
    }

    // 4. Testcase Loop
    const results = [];
    let totalExecTime = 0;
    let finalVerdict = "ACCEPTED";
    let firstFailedCase = null;

    for (let i = 0; i < testcases.length; i++) {
      const tc = testcases[i];
      onProgress({
        status: "RUNNING_TESTCASES",
        progress: { current: i + 1, total: testcases.length }
      });

      const tcTimeout = tc.timeoutMs || timeLimitMs || 4000;
      const tcRun = await runIsolatedTestcase({
        lang,
        sourceFile,
        compiledInfo,
        tempDir,
        stdin: tc.input || "",
        timeoutMs: tcTimeout
      });

      totalExecTime += tcRun.executionTimeMs || 0;

      let tcVerdict = "ACCEPTED";
      let actual = normalizeOutput(tcRun.stdout);
      const hasExpected = tc.expectedOutput !== undefined && tc.expectedOutput !== null && tc.expectedOutput !== "";
      let expected = hasExpected ? normalizeOutput(tc.expectedOutput) : null;

      if (tcRun.status === "TIME_LIMIT_EXCEEDED") {
        tcVerdict = "TIME_LIMIT_EXCEEDED";
      } else if (tcRun.status === "RUNTIME_ERROR" || tcRun.status === "EXECUTION_ERROR") {
        tcVerdict = "RUNTIME_ERROR";
      } else if (hasExpected && actual !== expected) {
        tcVerdict = "WRONG_ANSWER";
      }

      const tcVerdictCode = VERDICT_CODES[tcVerdict] || tcVerdict;
      const isHidden = !!tc.isHidden;

      // Mask hidden test case payload to prevent leaking confidential test data
      const caseResult = {
        testCaseIndex: i + 1,
        isHidden,
        verdict: tcVerdict,
        verdictCode: tcVerdictCode,
        verdictLabel: VERDICT_LABELS[tcVerdictCode] || tcVerdict,
        executionTimeMs: tcRun.executionTimeMs,
        input: isHidden ? "[Hidden]" : tc.input,
        expectedOutput: isHidden ? "[Hidden]" : (hasExpected ? tc.expectedOutput : "(Playground execution)"),
        actualOutput: isHidden ? (tcVerdict === "ACCEPTED" ? "[Hidden (Passed)]" : "[Hidden]") : actual,
        stderr: isHidden ? (tcVerdict === "TIME_LIMIT_EXCEEDED" ? `Time Limit Exceeded (${tcTimeout}ms)` : null) : (tcRun.stderr || null)
      };

      results.push(caseResult);

      if (tcVerdict !== "ACCEPTED") {
        finalVerdict = tcVerdict;
        if (!firstFailedCase) {
          firstFailedCase = caseResult;
        }
        // Stop evaluating remaining testcases if submission fails (standard competitive judge optimization)
        break;
      }
    }

    const finalVerdictCode = VERDICT_CODES[finalVerdict] || finalVerdict;
    const passedCount = results.filter((r) => r.verdict === "ACCEPTED").length;
    const avgRuntime = results.length > 0 ? Math.round(totalExecTime / results.length) : 0;

    return {
      verdict: finalVerdict,
      verdictCode: finalVerdictCode,
      verdictLabel: VERDICT_LABELS[finalVerdictCode] || finalVerdict,
      passedCount,
      totalCount: testcases.length,
      averageRuntimeMs: avgRuntime,
      testcaseResults: results,
      firstFailedCase
    };
  } finally {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {}
  }
}

module.exports = {
  VERDICT_CODES,
  VERDICT_LABELS,
  evaluateSubmission,
  normalizeOutput
};
