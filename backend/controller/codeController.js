const fs = require("fs");
const path = require("path");
const os = require("os");
const { exec, spawn } = require("child_process");

const executeCode = async (req, res) => {
  const { language = "javascript", sourceCode = "", stdin = "" } = req.body;

  if (!sourceCode || typeof sourceCode !== "string") {
    return res.status(400).json({
      message: "Missing or invalid sourceCode",
      run: { output: "Error: No code provided to execute", stderr: "No source code provided" }
    });
  }

  const lang = language.toLowerCase();
  const tempDir = path.join(os.tmpdir(), "zcoder_exec_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7));

  try {
    fs.mkdirSync(tempDir, { recursive: true });

    let command = "";
    let fileName = "";

    if (lang === "javascript" || lang === "js" || lang === "typescript" || lang === "ts") {
      fileName = path.join(tempDir, "solution.js");
      fs.writeFileSync(fileName, sourceCode, "utf8");
      command = `node "${fileName}"`;
    } else if (lang === "python" || lang === "py") {
      fileName = path.join(tempDir, "solution.py");
      fs.writeFileSync(fileName, sourceCode, "utf8");
      command = `python "${fileName}"`;
    } else if (lang === "cpp" || lang === "c++" || lang === "c") {
      fileName = path.join(tempDir, "solution.cpp");
      const exeFile = path.join(tempDir, "solution.exe");
      fs.writeFileSync(fileName, sourceCode, "utf8");
      // Compile then execute
      command = `g++ -O2 "${fileName}" -o "${exeFile}" && "${exeFile}"`;
    } else if (lang === "java") {
      fileName = path.join(tempDir, "Solution.java");
      fs.writeFileSync(fileName, sourceCode, "utf8");
      command = `javac "${fileName}" && java -cp "${tempDir}" Solution`;
    } else {
      return res.status(400).json({
        run: {
          output: `Language "${language}" is not supported. Supported: javascript, python, cpp`,
          stderr: "Unsupported language"
        }
      });
    }

    exec(command, { timeout: 6000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      // Clean up temp directory
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (cleanupErr) {}

      if (error) {
        if (error.killed || error.signal === "SIGTERM") {
          return res.json({
            run: {
              output: "Execution Timed Out (Limit: 6 seconds)",
              stderr: "Time Limit Exceeded"
            }
          });
        }
        const outputText = (stderr || error.message || "").trim();
        return res.json({
          run: {
            output: outputText || (stdout ? stdout.trim() : "Execution exited with error"),
            stderr: outputText
          }
        });
      }

      const outputResult = stdout || (stderr ? stderr : "(No output produced)");
      res.json({
        run: {
          output: outputResult.trim(),
          stdout: stdout.trim(),
          stderr: (stderr || "").trim()
        }
      });
    });
  } catch (err) {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {}

    return res.status(500).json({
      run: {
        output: "Execution runner error: " + err.message,
        stderr: err.message
      }
    });
  }
};

module.exports = { executeCode };
