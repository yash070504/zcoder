import { useState, useEffect } from "react";
import { excuteCode, runCodeAsync, analyzeComplexity, getSocraticHint } from "./api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FiTerminal, 
  FiTrash2, 
  FiPlay, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiCpu, 
  FiHelpCircle,
  FiActivity,
  FiZap
} from "react-icons/fi";

const Output = ({ editorRef, language, runTrigger, problemTitle = "Algorithmic Challenge" }) => {
  const [activeTab, setActiveTab] = useState("terminal"); // "terminal" | "ai" | "judge"
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [execTime, setExecTime] = useState(null);
  const [judgeStep, setJudgeStep] = useState(null);

  // AI Assistant State
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [hints, setHints] = useState([]);
  const [hintsLoading, setHintsLoading] = useState(false);

  // Asynchronous Micro-Judge Execution
  const runCode = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      setActiveTab("terminal");
      setJudgeStep("Queued in Micro-Judge pipeline...");

      const startTime = performance.now();
      
      // Attempt async micro-judge first
      try {
        const judgeResult = await runCodeAsync(language, sourceCode, [], (progress) => {
          if (progress.status === "COMPILING") {
            setJudgeStep("Compiling source tree...");
          } else if (progress.status === "RUNNING_TESTCASES") {
            setJudgeStep(`Executing testcase ${progress.progress?.current || 1}...`);
          } else if (progress.status === "PROCESSING") {
            setJudgeStep("Running in sandboxed worker...");
          }
        });

        const endTime = performance.now();
        setExecTime(((endTime - startTime) / 1000).toFixed(2));
        setJudgeStep(null);

        if (judgeResult.verdict === "ACCEPTED") {
          const rawOut = judgeResult.testcaseResults?.[0]?.actualOutput;
          setOutput(rawOut ? rawOut.split("\n") : ["(Code executed successfully with no output)"]);
          setIsError(false);
        } else {
          setIsError(true);
          const failMsg = judgeResult.compileError || judgeResult.details || judgeResult.testcaseResults?.[0]?.stderr || `Verdict: ${judgeResult.verdict}`;
          setOutput(failMsg.split("\n"));
        }
      } catch (asyncErr) {
        // Fallback to legacy endpoint if judge queue encounters an issue
        const { run: result } = await excuteCode(language, sourceCode);
        const endTime = performance.now();
        setExecTime(((endTime - startTime) / 1000).toFixed(2));
        setOutput(result.output ? result.output.split("\n") : ["(No output returned)"]);
        setIsError(!!result.stderr);
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
      setOutput([error.message || "Failed to execute code"]);
      toast.error("Execution error: " + (error.message || "Unable to run code"), {
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
      setJudgeStep(null);
    }
  };

  // Run AI Complexity Analysis
  const runAiAnalysis = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) {
      toast.warning("Write some code in the editor first!", { theme: "dark" });
      return;
    }

    try {
      setAiLoading(true);
      setActiveTab("ai");
      const result = await analyzeComplexity({
        sourceCode,
        language,
        problemTitle
      });
      setAiData(result);
    } catch (err) {
      toast.error("AI Analysis failed: " + err.message, { theme: "dark" });
    } finally {
      setAiLoading(false);
    }
  };

  // Request Socratic Hint
  const requestHint = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;
    try {
      setHintsLoading(true);
      const res = await getSocraticHint({
        sourceCode,
        language,
        problemTitle,
        failedCase: isError ? { verdict: "WRONG_ANSWER" } : null
      });
      setHints(res.hints || []);
      setActiveTab("ai");
    } catch (err) {
      toast.error("Could not fetch hint: " + err.message, { theme: "dark" });
    } finally {
      setHintsLoading(false);
    }
  };

  useEffect(() => {
    if (runTrigger > 0) {
      runCode();
    }
  }, [runTrigger]);

  const clearOutput = () => {
    setOutput(null);
    setIsError(false);
    setExecTime(null);
    setJudgeStep(null);
  };

  return (
    <div className="ide-output-pane" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Pane Navigation Toolbar */}
      <div className="ide-pane-toolbar d-flex align-items-center justify-content-between px-3 py-2" style={{ background: "#0b101d", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        {/* Tabs */}
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("terminal")}
            className={`btn btn-sm d-flex align-items-center gap-1.5 px-2.5 py-1 ${activeTab === "terminal" ? "btn-primary text-white" : "text-muted"}`}
            style={{ fontSize: "0.78rem", borderRadius: "6px", border: "none" }}
          >
            <FiTerminal size={14} />
            <span>Terminal</span>
            {execTime && <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>({execTime}s)</span>}
          </button>

          <button
            type="button"
            onClick={runAiAnalysis}
            className={`btn btn-sm d-flex align-items-center gap-1.5 px-2.5 py-1 ${activeTab === "ai" ? "btn-info text-white" : "text-muted"}`}
            style={{ fontSize: "0.78rem", borderRadius: "6px", border: "none" }}
          >
            <FiCpu size={14} color="#38bdf8" />
            <span>AI Architecture & Big-O</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="d-flex align-items-center gap-2">
          {activeTab === "terminal" && output && (
            <button
              type="button"
              onClick={clearOutput}
              className="btn btn-link p-1 text-muted text-decoration-none d-flex align-items-center gap-1"
              style={{ fontSize: "0.78rem" }}
              title="Clear terminal output"
            >
              <FiTrash2 size={13} />
              <span>Clear</span>
            </button>
          )}

          <button
            type="button"
            onClick={requestHint}
            disabled={hintsLoading}
            className="btn btn-sm text-warning d-inline-flex align-items-center gap-1 px-2 py-1"
            style={{ fontSize: "0.78rem", background: "rgba(234, 179, 8, 0.12)", border: "1px solid rgba(234, 179, 8, 0.3)", borderRadius: "6px" }}
          >
            <FiHelpCircle size={13} />
            <span>{hintsLoading ? "Thinking..." : "Get Socratic Hint"}</span>
          </button>

          <button
            type="button"
            onClick={runCode}
            disabled={isLoading}
            className="btn-premium py-1 px-3 d-inline-flex align-items-center gap-2"
            style={{ 
              fontSize: "0.82rem", 
              background: "linear-gradient(135deg, #10b981, #059669)", 
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(16, 185, 129, 0.3)",
              whiteSpace: "nowrap"
            }}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <FiPlay size={13} />
            )}
            <span>{isLoading ? "Running Sandbox..." : "Run Code"}</span>
          </button>
        </div>
      </div>

      {/* Pane Content Area */}
      <div 
        style={{
          flex: 1,
          minHeight: 0,
          padding: "16px 20px",
          background: "#0c101c",
          color: "#e2e8f0",
          fontFamily: activeTab === "terminal" ? "'JetBrains Mono', 'Fira Code', monospace" : "inherit",
          fontSize: "0.88rem",
          overflowY: "auto",
          lineHeight: "1.6"
        }}
      >
        {/* TAB 1: TERMINAL OUTPUT */}
        {activeTab === "terminal" && (
          <>
            {isLoading ? (
              <div className="d-flex flex-column gap-2 text-muted py-3">
                <div className="d-flex align-items-center gap-2">
                  <span className="spinner-border spinner-border-sm text-primary" role="status"></span>
                  <span className="text-white fw-medium">{judgeStep || "Processing submission in micro-judge..."}</span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  Isolated runner enforcing 5000ms wall-clock timeout and process memory tree bounds.
                </div>
              </div>
            ) : output ? (
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary border-opacity-25" style={{ fontSize: "0.78rem" }}>
                  {isError ? (
                    <span className="d-flex align-items-center gap-1 text-danger fw-bold">
                      <FiAlertTriangle size={14} /> Execution Terminated / Error
                    </span>
                  ) : (
                    <span className="d-flex align-items-center gap-1 text-success fw-bold">
                      <FiCheckCircle size={14} /> Execution Succeeded
                    </span>
                  )}
                  <span className="badge bg-dark border border-secondary text-secondary">
                    Sandbox Isolation: Active
                  </span>
                </div>
                {output.map((line, i) => (
                  <div key={i} style={{ whiteSpace: "pre-wrap", marginBottom: "2px", color: isError ? "#fca5a5" : "#e2e8f0" }}>
                    {line}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted" style={{ fontSize: "0.88rem", paddingTop: "8px" }}>
                <p className="mb-2" style={{ color: "#64748b" }}>
                  &gt; ZCoder Asynchronous Micro-Judge Engine v2.0
                </p>
                <p className="mb-2" style={{ color: "#475569" }}>
                  • Isolated child process execution with cgroup-style buffer limits
                </p>
                <p className="mb-0" style={{ color: "#475569" }}>
                  • Click <strong>"Run Code"</strong> to trigger asynchronous worker evaluation or <strong>"AI Architecture"</strong> for Big-O profiling.
                </p>
              </div>
            )}
          </>
        )}

        {/* TAB 2: AI ARCHITECTURE & BIG-O */}
        {activeTab === "ai" && (
          <div className="ai-panel">
            {aiLoading ? (
              <div className="text-center py-5">
                <span className="spinner-border text-info mb-3"></span>
                <p className="text-light small">Analyzing abstract syntax tree and algorithmic loops...</p>
              </div>
            ) : aiData ? (
              <div className="d-flex flex-column gap-3">
                {/* Header Pills */}
                <div className="d-flex align-items-center gap-3">
                  <div className="p-3 rounded-3" style={{ background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.25)", flex: 1 }}>
                    <div className="text-muted small text-uppercase fw-bold">Time Complexity</div>
                    <div className="h4 text-info mb-0 fw-bold">{aiData.timeComplexity || "O(N)"}</div>
                  </div>
                  <div className="p-3 rounded-3" style={{ background: "rgba(168, 85, 247, 0.1)", border: "1px solid rgba(168, 85, 247, 0.25)", flex: 1 }}>
                    <div className="text-muted small text-uppercase fw-bold">Space Complexity</div>
                    <div className="h4 text-purple mb-0 fw-bold" style={{ color: "#c084fc" }}>{aiData.spaceComplexity || "O(1)"}</div>
                  </div>
                  <div className="p-3 rounded-3" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.25)", flex: 1 }}>
                    <div className="text-muted small text-uppercase fw-bold">Verdict</div>
                    <div className="h5 text-success mb-0 fw-bold">{aiData.architectureVerdict || "Optimal"}</div>
                  </div>
                </div>

                {/* Bottlenecks Card */}
                {aiData.bottlenecks?.length > 0 && (
                  <div className="p-3 rounded-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="d-flex align-items-center gap-2 text-warning mb-2 fw-semibold">
                      <FiActivity size={16} />
                      <span>Identified Bottlenecks & Scale Constraints</span>
                    </div>
                    <ul className="mb-0 ps-3 text-light small" style={{ lineHeight: "1.7" }}>
                      {aiData.bottlenecks.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Socratic Hints Card */}
                {(hints.length > 0 || aiData.hints?.length > 0) && (
                  <div className="p-3 rounded-3" style={{ background: "rgba(234, 179, 8, 0.08)", border: "1px solid rgba(234, 179, 8, 0.2)" }}>
                    <div className="d-flex align-items-center gap-2 text-warning mb-2 fw-semibold">
                      <FiZap size={16} />
                      <span>Socratic Guidance & Architectural Hints</span>
                    </div>
                    <ul className="mb-0 ps-3 text-light small" style={{ lineHeight: "1.7" }}>
                      {(hints.length ? hints : aiData.hints).map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiData.refactoringAdvice && (
                  <div className="small text-muted p-2 border-top border-secondary border-opacity-25">
                    💡 <strong>Clean Code Tip:</strong> {aiData.refactoringAdvice}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-muted">
                <FiCpu size={32} className="mb-2 text-info opacity-50" />
                <p>Click <strong>"AI Architecture & Big-O"</strong> to inspect asymptotic time/space complexities and algorithmic hotspots.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={2500} theme="dark" />
    </div>
  );
};

export default Output;
