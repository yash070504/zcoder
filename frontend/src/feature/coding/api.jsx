import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3500" : "https://zcoder-backend-o2ee.onrender.com");

export const excuteCode = async (language, sourceCode) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/execute`, {
      language,
      sourceCode,
    }, {
      timeout: 10000,
    });
    return response.data;
  } catch (backendError) {
    console.warn("Backend runner error, attempting fallback:", backendError);
    
    // For JavaScript, offer seamless in-browser fallback
    if (language === "javascript" || language === "js") {
      let logs = [];
      const customConsole = {
        log: (...args) => logs.push(args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" ")),
        error: (...args) => logs.push("[Error] " + args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" ")),
        warn: (...args) => logs.push("[Warn] " + args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" ")),
        info: (...args) => logs.push(args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" ")),
      };
      try {
        const runFn = new Function("console", sourceCode);
        runFn(customConsole);
        return {
          run: {
            output: logs.length ? logs.join("\n") : "(Code executed successfully with no output)",
            stderr: "",
          }
        };
      } catch (clientErr) {
        return {
          run: {
            output: clientErr.message,
            stderr: clientErr.message,
          }
        };
      }
    }

    throw new Error(backendError.response?.data?.message || backendError.message || "Failed to execute code on runner");
  }
};

/**
 * SDE 2 Asynchronous Judge Pipeline: Runs code via job queue and polls until completion.
 */
export const runCodeAsync = async (language, sourceCode, testcases = [], onProgress = null) => {
  const { data: job } = await axios.post(`${BACKEND_URL}/api/judge/run`, {
    language,
    sourceCode,
    testcases
  });

  const submissionId = job.submissionId;
  const pollInterval = 600;
  const maxPollAttempts = 25; // 15 seconds max

  for (let i = 0; i < maxPollAttempts; i++) {
    await new Promise((r) => setTimeout(r, pollInterval));
    try {
      const { data: statusData } = await axios.get(`${BACKEND_URL}/api/judge/status/${submissionId}`);
      if (onProgress) {
        onProgress(statusData);
      }
      if (statusData.status === "COMPLETED") {
        return statusData.result;
      }
      if (statusData.status === "FAILED") {
        throw new Error(statusData.error || "Execution failed in sandbox");
      }
    } catch (err) {
      if (err.response?.status === 404) continue;
      throw err;
    }
  }

  throw new Error("Job timed out waiting for worker execution.");
};

/**
 * Official LeetCode-style submission against sample + hidden test cases.
 */
export const submitSolution = async ({ problemId, language, sourceCode, userId }) => {
  const { data: job } = await axios.post(`${BACKEND_URL}/api/judge/submit`, {
    problemId,
    language,
    sourceCode,
    userId
  });

  const submissionId = job.submissionId;
  const pollInterval = 600;
  const maxPollAttempts = 30;

  for (let i = 0; i < maxPollAttempts; i++) {
    await new Promise((r) => setTimeout(r, pollInterval));
    const { data: statusData } = await axios.get(`${BACKEND_URL}/api/judge/status/${submissionId}`);
    if (statusData.status === "COMPLETED") {
      return statusData.result;
    }
    if (statusData.status === "FAILED") {
      throw new Error(statusData.error || "Submission evaluation failed");
    }
  }

  throw new Error("Submission evaluation timed out.");
};

/**
 * AI Architectural Assistant: Big-O analysis & bottlenecks.
 */
export const analyzeComplexity = async ({ sourceCode, language, problemTitle }) => {
  const { data } = await axios.post(`${BACKEND_URL}/api/ai/analyze`, {
    sourceCode,
    language,
    problemTitle
  });
  return data;
};

/**
 * AI Socratic Hint & Post-Mortem Debugger.
 */
export const getSocraticHint = async ({ sourceCode, language, problemTitle, failedCase }) => {
  const { data } = await axios.post(`${BACKEND_URL}/api/ai/hint`, {
    sourceCode,
    language,
    problemTitle,
    failedCase
  });
  return data;
};

