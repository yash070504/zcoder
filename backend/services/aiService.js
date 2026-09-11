// ═══════════════════════════════════════════════════════════════════
// aiService.js — Architectural Complexity & Socratic Post-Mortem Analyzer
//
// Capabilities:
// 1. Time/Space Big-O Complexity estimation
// 2. Socratic Hint generation (guiding without spoiling answer)
// 3. Post-Mortem error diagnosis (explaining WA, TLE, and edge cases)
// 4. Fallback heuristic engine if no external API key is provided
// ═══════════════════════════════════════════════════════════════════

const axios = require("axios");

/**
 * Static Heuristic Complexity Estimator (Runs offline with 0 API dependencies)
 */
function analyzeCodeHeuristically(sourceCode, language) {
  const lines = sourceCode.split("\n");
  let loopCount = 0;
  let maxNesting = 0;
  let currentNesting = 0;
  let hasRecursion = false;
  let hasSorting = /sort\(|Arrays\.sort|Collections\.sort|sorted\(/i.test(sourceCode);
  let hasHashMap = /Map\(|Set\(|dict\(|\{\}|unordered_map|HashMap/i.test(sourceCode);

  for (const line of lines) {
    if (/for\s*\(|while\s*\(|for\s+[a-zA-Z0-9_]+\s+in/i.test(line)) {
      loopCount++;
      currentNesting++;
      if (currentNesting > maxNesting) maxNesting = currentNesting;
    }
    if (line.includes("}") && currentNesting > 0) {
      currentNesting--;
    }
  }

  // Deduce Big-O
  let estimatedTime = "O(1)";
  if (maxNesting >= 3) estimatedTime = "O(N³)";
  else if (maxNesting === 2) estimatedTime = "O(N²)";
  else if (hasSorting) estimatedTime = "O(N log N)";
  else if (maxNesting === 1) estimatedTime = "O(N)";

  let estimatedSpace = hasHashMap ? "O(N)" : "O(1)";

  const bottlenecks = [];
  if (maxNesting >= 2) {
    bottlenecks.push("Nested loops detected. For large input sizes (N >= 10⁵), this risks Time Limit Exceeded (TLE). Consider hash maps or two-pointer patterns.");
  }
  if (/unshift\(|\.slice\(|\.splice\(/i.test(sourceCode)) {
    bottlenecks.push("Array operations like unshift/slice inside loops carry hidden O(N) penalties.");
  }
  if (!bottlenecks.length) {
    bottlenecks.push("Algorithmic structure looks linear and well-bounded.");
  }

  return {
    timeComplexity: estimatedTime,
    spaceComplexity: estimatedSpace,
    nestingDepth: maxNesting,
    bottlenecks,
    architectureVerdict: maxNesting >= 2 ? "Needs Optimization" : "Optimal",
    optimizationHints: [
      "Check if sorting or indexing can reduce search time from O(N) to O(1) or O(log N).",
      "Ensure space allocation doesn't exceed 256MB with large arrays."
    ]
  };
}

/**
 * Generate Socratic hints for a user stuck on a failed test case.
 */
function generateSocraticHint({ problemTitle, failedCase, sourceCode }) {
  const hints = [];

  if (failedCase) {
    if (failedCase.verdict === "TIME_LIMIT_EXCEEDED") {
      hints.push("💡 Observation: Your solution takes too long on large or edge-case inputs. Check for infinite loops or O(N²) quadratic scaling.");
      hints.push("🤔 Question: Can you precompute values, use a hash map for O(1) lookups, or apply binary search?");
    } else if (failedCase.verdict === "WRONG_ANSWER") {
      hints.push(`💡 Failing Input Context: Look closely at your handling of boundary values.`);
      hints.push("🤔 Question: Does your code handle negative numbers, empty structures, single-element inputs, or duplicates properly?");
    } else if (failedCase.verdict === "RUNTIME_ERROR") {
      hints.push("💡 Runtime Crash: Your code encountered an unhandled exception or null pointer dereference.");
      hints.push("🤔 Question: Are you accessing array indexes out of bounds or dividing by zero?");
    }
  }

  if (hints.length === 0) {
    hints.push("💡 Test with extreme boundaries: 0, 1, max constraint size, and reverse-sorted lists.");
  }

  return {
    hints,
    recommendedNextStep: "Write a mini test script validating only the boundary conditions."
  };
}

/**
 * Unified AI analyze handler (with Gemini API integration if GEMINI_API_KEY is configured).
 */
async function analyzeSolution({ sourceCode, language, problemTitle = "Algorithm Problem", failedCase = null }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const prompt = `You are a Senior Staff Software Engineer and Competitive Programming Coach.
Analyze this ${language} code for the problem "${problemTitle}".
Code:
\`\`\`${language}
${sourceCode}
\`\`\`
${failedCase ? `Failed Test Case: Input: ${failedCase.input}, Expected: ${failedCase.expectedOutput}, Got: ${failedCase.actualOutput}` : ""}

Return a STRICT JSON response ONLY with no markdown wrappers matching this schema:
{
  "timeComplexity": "O(...)",
  "spaceComplexity": "O(...)",
  "bottlenecks": ["string"],
  "architectureVerdict": "Optimal" or "Needs Optimization",
  "hints": ["socratic hint 1", "socratic hint 2"],
  "refactoringAdvice": "string"
}`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }]
        },
        { timeout: 8000 }
      );

      const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return parsed;
    } catch (err) {
      // Graceful fallback to heuristic engine if API key fails or errors out
    }
  }

  // Fallback heuristic output
  const heuristics = analyzeCodeHeuristically(sourceCode, language);
  const hintInfo = generateSocraticHint({ problemTitle, failedCase, sourceCode });

  return {
    timeComplexity: heuristics.timeComplexity,
    spaceComplexity: heuristics.spaceComplexity,
    bottlenecks: heuristics.bottlenecks,
    architectureVerdict: heuristics.architectureVerdict,
    hints: hintInfo.hints,
    refactoringAdvice: heuristics.optimizationHints[0]
  };
}

module.exports = {
  analyzeSolution,
  analyzeCodeHeuristically,
  generateSocraticHint
};
