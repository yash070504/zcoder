// ═══════════════════════════════════════════════════════════════════
// Submission.js — MongoDB Schema for Code Submissions
// Tracks verdicts, execution metrics, and test case breakdowns
// ═══════════════════════════════════════════════════════════════════

const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false // supports guest/anonymous submissions
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Promblem",
      required: false
    },
    language: {
      type: String,
      required: true
    },
    sourceCode: {
      type: String,
      required: true
    },
    verdict: {
      type: String,
      enum: [
        "QUEUED",
        "PROCESSING",
        "ACCEPTED",
        "WRONG_ANSWER",
        "TIME_LIMIT_EXCEEDED",
        "MEMORY_LIMIT_EXCEEDED",
        "COMPILATION_ERROR",
        "RUNTIME_ERROR",
        "SECURITY_VIOLATION"
      ],
      default: "QUEUED"
    },
    passedTestCases: {
      type: Number,
      default: 0
    },
    totalTestCases: {
      type: Number,
      default: 0
    },
    runtimeMs: {
      type: Number,
      default: 0
    },
    compileError: {
      type: String,
      default: null
    },
    testcaseBreakdown: [
      {
        testCaseIndex: Number,
        isHidden: Boolean,
        verdict: String,
        executionTimeMs: Number,
        input: String,
        expectedOutput: String,
        actualOutput: String,
        stderr: String
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Submission", submissionSchema);
