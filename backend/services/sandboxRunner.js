// ═══════════════════════════════════════════════════════════════════
// sandboxRunner.js — Resource-Isolated Code Execution Subsystem
//
// SDE 2 Security & Resilience Features:
// 1. Process tree termination (prevents orphaned processes on timeout)
// 2. Stdout/Stderr buffer size capping (prevents OOM crashes from loop-printing)
// 3. Wall-clock execution timeout enforcement
// 4. Memory/time profiling
// 5. Code safety pre-flight checks (blocks high-risk syscalls/libraries)
// ═══════════════════════════════════════════════════════════════════

const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn, execSync } = require("child_process");

const MAX_OUTPUT_BUFFER = 1024 * 512; // 512 KB max stdout/stderr buffer
const DEFAULT_TIMEOUT_MS = 5000;      // 5-second default limit

/**
 * Basic security pre-flight scanner.
 * Warns or blocks obvious malicious patterns in untrusted code before execution.
 */
function scanCodeSecurity(sourceCode, language) {
  const dangerousPatterns = [
    { pattern: /child_process/i, reason: "Forbidden Node.js child_process module invocation" },
    { pattern: /fs\.unlink|fs\.rmdir|fs\.rm/i, reason: "Direct destructive filesystem API blocked" },
    { pattern: /process\.exit/i, reason: "Direct process termination blocked" },
    { pattern: /os\.system|subprocess\.Popen|subprocess\.run|shutil\.rmtree/i, reason: "Destructive OS/Subprocess calls blocked" },
    { pattern: /system\s*\(\s*["']rm|system\s*\(\s*["']del/i, reason: "Dangerous system shell execution blocked" }
  ];

  for (const item of dangerousPatterns) {
    if (item.pattern.test(sourceCode)) {
      return { safe: false, reason: item.reason };
    }
  }
  return { safe: true };
}

/**
 * Terminate a process and all its children across OS platforms.
 */
function killProcessTree(pid) {
  try {
    if (process.platform === "win32") {
      execSync(`taskkill /pid ${pid} /t /f`, { stdio: "ignore" });
    } else {
      process.kill(-pid, "SIGKILL");
    }
  } catch (e) {
    // Process may have already exited
  }
}

/**
 * Compiles code if required (e.g. C++, Java).
 * Returns { success, compileError, exePath }
 */
async function compileSource({ lang, sourceFile, tempDir }) {
  if (lang === "cpp" || lang === "c++" || lang === "c") {
    const exeFile = path.join(tempDir, process.platform === "win32" ? "solution.exe" : "solution.out");
    return new Promise((resolve) => {
      const compileProcess = spawn("g++", ["-O2", sourceFile, "-o", exeFile], {
        cwd: tempDir,
        windowsHide: true
      });

      let stderr = "";
      compileProcess.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      compileProcess.on("close", (code) => {
        if (code === 0 && fs.existsSync(exeFile)) {
          resolve({ success: true, exePath: exeFile });
        } else {
          resolve({ success: false, compileError: stderr || "Compilation Failed" });
        }
      });

      compileProcess.on("error", (err) => {
        resolve({ success: false, compileError: `Compiler not available: ${err.message}` });
      });
    });
  }

  if (lang === "java") {
    return new Promise((resolve) => {
      const compileProcess = spawn("javac", [sourceFile], {
        cwd: tempDir,
        windowsHide: true
      });

      let stderr = "";
      compileProcess.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      compileProcess.on("close", (code) => {
        if (code === 0) {
          resolve({ success: true, classPath: tempDir });
        } else {
          resolve({ success: false, compileError: stderr || "Java Compilation Failed" });
        }
      });

      compileProcess.on("error", (err) => {
        resolve({ success: false, compileError: `Java Compiler not available: ${err.message}` });
      });
    });
  }

  return { success: true };
}

/**
 * Execute a compiled binary or script against a specific testcase input with strict timeout and buffer limits.
 */
async function runIsolatedTestcase({
  lang,
  sourceFile,
  compiledInfo,
  tempDir,
  stdin = "",
  timeoutMs = DEFAULT_TIMEOUT_MS
}) {
  return new Promise((resolve) => {
    let cmd = "";
    let args = [];

    if (lang === "javascript" || lang === "js") {
      cmd = "node";
      args = [sourceFile];
    } else if (lang === "python" || lang === "py") {
      cmd = "python";
      args = ["-u", sourceFile]; // unbuffered
    } else if (lang === "cpp" || lang === "c++" || lang === "c") {
      cmd = compiledInfo.exePath;
      args = [];
    } else if (lang === "java") {
      cmd = "java";
      args = ["-cp", tempDir, "Solution"];
    } else {
      cmd = "node";
      args = [sourceFile];
    }

    const startTime = process.hrtime.bigint();
    let isTimedOut = false;
    let stdout = "";
    let stderr = "";

    const child = spawn(cmd, args, {
      cwd: tempDir,
      detached: process.platform !== "win32",
      windowsHide: true,
      env: {
        PATH: process.env.PATH,
        TEMP: tempDir,
        TMP: tempDir
      }
    });

    const timer = setTimeout(() => {
      isTimedOut = true;
      if (child.pid) {
        killProcessTree(child.pid);
      }
    }, timeoutMs);

    if (stdin) {
      try {
        child.stdin.write(stdin);
        child.stdin.end();
      } catch (err) {
        // Stdin write error
      }
    } else {
      child.stdin.end();
    }

    child.stdout.on("data", (chunk) => {
      if (stdout.length < MAX_OUTPUT_BUFFER) {
        stdout += chunk.toString();
      }
    });

    child.stderr.on("data", (chunk) => {
      if (stderr.length < MAX_OUTPUT_BUFFER) {
        stderr += chunk.toString();
      }
    });

    child.on("close", (exitCode) => {
      clearTimeout(timer);
      const endTime = process.hrtime.bigint();
      const executionTimeMs = Number((endTime - startTime) / BigInt(1e6));

      if (isTimedOut) {
        return resolve({
          status: "TIME_LIMIT_EXCEEDED",
          stdout,
          stderr: `Time Limit Exceeded (${timeoutMs}ms)`,
          executionTimeMs: timeoutMs,
          memoryMb: null
        });
      }

      if (exitCode !== 0) {
        return resolve({
          status: "RUNTIME_ERROR",
          stdout,
          stderr: stderr || `Process exited with code ${exitCode}`,
          executionTimeMs,
          memoryMb: null
        });
      }

      return resolve({
        status: "SUCCESS",
        stdout: stdout.trim(),
        stderr,
        executionTimeMs,
        memoryMb: null
      });
    });

    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({
        status: "EXECUTION_ERROR",
        stdout: "",
        stderr: err.message,
        executionTimeMs: 0,
        memoryMb: null
      });
    });
  });
}

module.exports = {
  scanCodeSecurity,
  compileSource,
  runIsolatedTestcase,
  killProcessTree
};
