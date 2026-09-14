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
async function evaluateSubmission(job, onProgress) {
  const { language, sourceCode, testcases = [] } = job;
  const lang = (language || "javascript").toLowerCase();

  // 1. Security Scan
  const secScan = scanCodeSecurity(sourceCode, lang);
  if (!secScan.safe) {
    return {
      verdict: "SECURITY_VIOLATION",
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
      return {
        verdict: "COMPILATION_ERROR",
        passedCount: 0,
        totalCount: testcases.length,
        compileError: compiledInfo.compileError,
        testcaseResults: []
      };
    }

    // 4. Testcase Loop
    const results = [];
    let totalExecTime = 0;
    let maxMemory = 0;
    let finalVerdict = "ACCEPTED";
    let firstFailedCase = null;

    for (let i = 0; i < testcases.length; i++) {
      const tc = testcases[i];
      onProgress({
        status: "RUNNING_TESTCASES",
        progress: { current: i + 1, total: testcases.length }
      });

      const tcRun = await runIsolatedTestcase({
        lang,
        sourceFile,
        compiledInfo,
        tempDir,
        stdin: tc.input || "",
        timeoutMs: tc.timeoutMs || 4000
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

      const caseResult = {
        testCaseIndex: i + 1,
        isHidden: !!tc.isHidden,
        verdict: tcVerdict,
        executionTimeMs: tcRun.executionTimeMs,
        input: tc.isHidden ? "[Hidden]" : tc.input,
        expectedOutput: tc.isHidden ? "[Hidden]" : (hasExpected ? tc.expectedOutput : "(Playground execution)"),
        actualOutput: tc.isHidden && tcVerdict === "WRONG_ANSWER" ? "[Hidden]" : actual,
        stderr: tcRun.stderr || null
      };

      results.push(caseResult);

      if (tcVerdict !== "ACCEPTED") {
        finalVerdict = tcVerdict;
        if (!firstFailedCase) {
          firstFailedCase = caseResult;
        }
        // Stop evaluating remaining testcases if submission fails
        break;
      }
    }

    const passedCount = results.filter((r) => r.verdict === "ACCEPTED").length;
    const avgRuntime = results.length > 0 ? Math.round(totalExecTime / results.length) : 0;

    return {
      verdict: finalVerdict,
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
  evaluateSubmission,
  normalizeOutput
};
