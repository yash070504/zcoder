// ═══════════════════════════════════════════════════════════════════
// judgeRouter.js — Asynchronous Micro-Judge Endpoints
//
// Routes:
//   POST /api/judge/run      → Fast testcase run (Sample cases)
//   POST /api/judge/submit   → Official LeetCode-style submission (Sample + Hidden)
//   GET  /api/judge/status/:id → Query submission status (Polling fallback)
//   GET  /api/judge/history/:problemId → Past submissions with runtime metrics
// ═══════════════════════════════════════════════════════════════════

const express = require("express");
const router = express.Router();
const judgeQueue = require("../services/judgeQueue");
const { evaluateSubmission } = require("../services/verdictEngine");
const Submission = require("../model/Submission");
const Promblem = require("../model/Promblem");
const metricsService = require("../services/metricsService");
const { executionLimiter } = require("../middleware/rateLimiter");

// Connect the judgeQueue worker to the evaluation engine
judgeQueue.setWorkerExecutor(async (job, onProgress) => {
  const result = await evaluateSubmission(job, onProgress);
  metricsService.recordVerdict(result.verdict);

  // Persist submission result to database if it's an official submission
  if (job.isSubmission) {
    try {
      await Submission.create({
        user: job.userId && job.userId !== "anonymous" ? job.userId : null,
        problem: job.problemId || null,
        language: job.language,
        sourceCode: job.sourceCode,
        verdict: result.verdict,
        verdictCode: result.verdictCode,
        verdictLabel: result.verdictLabel,
        passedTestCases: result.passedCount,
        totalTestCases: result.totalCount,
        runtimeMs: result.averageRuntimeMs || 0,
        compileError: result.compileError || null,
        testcaseBreakdown: result.testcaseResults || []
      });
    } catch (err) {
      console.error("Failed to persist submission:", err.message);
    }
  }

  return result;
});

/**
 * Run sample testcases asynchronously
 */
router.post("/run", executionLimiter, async (req, res) => {
  const { language = "javascript", sourceCode = "", testcases = [], timeLimitMs } = req.body;

  if (!sourceCode) {
    return res.status(400).json({ error: "Source code is required" });
  }

  const job = judgeQueue.enqueue({
    language,
    sourceCode,
    testcases: testcases.length > 0 ? testcases : [{ input: "", expectedOutput: "" }],
    timeLimitMs: timeLimitMs || 4000,
    isSubmission: false
  });

  return res.status(202).json({
    message: "Execution queued in Micro-Judge pipeline",
    submissionId: job.submissionId,
    status: "QUEUED",
    streamUrl: `/ws/judge/${job.submissionId}`
  });
});

/**
 * Submit solution against official test cases
 */
router.post("/submit", executionLimiter, async (req, res) => {
  const { problemId, language = "javascript", sourceCode = "", userId = "anonymous", testcases: directCases } = req.body;

  if (!sourceCode) {
    return res.status(400).json({ error: "Source code is required" });
  }

  let testcases = [];
  let problemTimeLimitMs = 4000;

  if (problemId) {
    try {
      const problem = await Promblem.findById(problemId);
      if (problem) {
        problemTimeLimitMs = problem.timeLimitMs || 4000;

        // Combine sample testcases + hidden testcases
        const samples = (problem.sampleTestCases || []).map((tc) => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isHidden: false,
          timeoutMs: problemTimeLimitMs
        }));
        const hiddens = (problem.hiddenTestCases || []).map((tc) => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isHidden: true,
          timeoutMs: problemTimeLimitMs
        }));

        testcases = [...samples, ...hiddens];

        // Fallback to legacy string testcase if structured cases are empty
        if (testcases.length === 0 && problem.testcase) {
          testcases = [{ input: problem.testcase, expectedOutput: "", isHidden: false, timeoutMs: problemTimeLimitMs }];
        }
      }
    } catch (err) {
      console.error("Error fetching problem for submission:", err.message);
    }
  } else if (Array.isArray(directCases) && directCases.length > 0) {
    testcases = directCases;
  }

  const job = judgeQueue.enqueue({
    userId,
    problemId,
    language,
    sourceCode,
    testcases,
    timeLimitMs: problemTimeLimitMs,
    isSubmission: true
  });

  return res.status(202).json({
    message: "Solution submitted to Judge Queue",
    submissionId: job.submissionId,
    status: "QUEUED",
    totalTestCases: testcases.length
  });
});

/**
 * Poll submission status (Fallback for environments without active WebSockets)
 */
router.get("/status/:id", (req, res) => {
  const { id } = req.params;
  const job = judgeQueue.getJob(id);

  if (!job) {
    return res.status(404).json({ error: "Job expired or not found" });
  }

  return res.json({
    submissionId: job.submissionId,
    status: job.status,
    progress: job.progress,
    result: job.result,
    error: job.error,
    elapsedMs: job.completedAt ? job.completedAt - job.startedAt : Date.now() - (job.startedAt || job.enqueuedAt)
  });
});

/**
 * Fetch past submissions for a problem
 */
router.get("/history/:problemId", async (req, res) => {
  try {
    const submissions = await Submission.find({ problem: req.params.problemId })
      .sort({ createdAt: -1 })
      .limit(15)
      .select("-sourceCode");
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
