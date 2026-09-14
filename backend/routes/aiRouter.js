// ═══════════════════════════════════════════════════════════════════
// aiRouter.js — AI Architectural Assistant & Post-Mortem Debugger
// ═══════════════════════════════════════════════════════════════════

const express = require("express");
const router = express.Router();
const { analyzeSolution } = require("../services/aiService");
const { aiLimiter } = require("../middleware/rateLimiter");
const metricsService = require("../services/metricsService");

/**
 * POST /api/ai/analyze
 * Generates Big-O complexity analysis and architectural feedback
 */
router.post("/analyze", aiLimiter, async (req, res) => {
  try {
    const { sourceCode, language = "javascript", problemTitle } = req.body;

    if (!sourceCode) {
      return res.status(400).json({ error: "Source code is required" });
    }

    metricsService.recordAiAnalysis();
    const analysis = await analyzeSolution({
      sourceCode,
      language,
      problemTitle
    });

    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/ai/hint
 * Generates Socratic progressive hints for failed testcases
 */
router.post("/hint", aiLimiter, async (req, res) => {
  try {
    const { sourceCode, language = "javascript", problemTitle, failedCase } = req.body;

    if (!sourceCode) {
      return res.status(400).json({ error: "Source code is required" });
    }

    metricsService.recordAiAnalysis();
    const analysis = await analyzeSolution({
      sourceCode,
      language,
      problemTitle,
      failedCase
    });

    res.json({
      hints: analysis.hints || [],
      refactoringAdvice: analysis.refactoringAdvice || ""
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
