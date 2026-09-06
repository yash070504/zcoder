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

