import { useState, useEffect } from "react";
import { excuteCode } from "./api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiTerminal, FiTrash2, FiPlay, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";

const Output = ({ editorRef, language, runTrigger }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [execTime, setExecTime] = useState(null);

  const runCode = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const startTime = performance.now();
      const { run: result } = await excuteCode(language, sourceCode);
      const endTime = performance.now();
      setExecTime(((endTime - startTime) / 1000).toFixed(2));
      setOutput(result.output ? result.output.split("\n") : ["(No output returned)"]);
      setIsError(!!result.stderr);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setOutput([error.message || "Failed to execute code"]);
      toast.error("Execution error: " + (error.message || "Unable to run code"), {
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Run when parent triggers
  useEffect(() => {
    if (runTrigger > 0) {
      runCode();
    }
  }, [runTrigger]);

  const clearOutput = () => {
    setOutput(null);
    setIsError(false);
    setExecTime(null);
  };

  return (
    <div className="ide-output-pane">
      {/* Pane Toolbar */}
      <div className="ide-pane-toolbar">
        <div className="d-flex align-items-center gap-2">
          <FiTerminal color="#a5b4fc" size={17} />
          <span className="text-white fw-bold small text-uppercase" style={{ letterSpacing: "0.05em" }}>
            Terminal Console
          </span>
          {execTime && (
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
              • {execTime}s
            </span>
          )}
        </div>

        <div className="d-flex align-items-center gap-2">
          {output && (
            <button
              type="button"
              onClick={clearOutput}
              className="btn btn-link p-1 text-muted text-decoration-none d-flex align-items-center gap-1"
              style={{ fontSize: "0.8rem" }}
              title="Clear terminal output"
            >
              <FiTrash2 size={14} />
              <span>Clear</span>
            </button>
          )}

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
              whiteSpace: "nowrap",
              flexShrink: 0
            }}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <FiPlay size={13} />
            )}
            <span>{isLoading ? "Running..." : "Run Code"}</span>
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div 
        style={{
          flex: 1,
          minHeight: 0,
          padding: "16px 20px",
          background: "#0c101c",
          color: isError ? "#fda4af" : "#e2e8f0",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: "0.88rem",
          overflowY: "auto",
          lineHeight: "1.6"
        }}
      >
        {isLoading ? (
          <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: "0.88rem" }}>
            <span className="spinner-border spinner-border-sm text-primary" role="status"></span>
            <span>Compiling and executing code against test runtime...</span>
          </div>
        ) : output ? (
          <div>
            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom border-secondary border-opacity-25" style={{ fontSize: "0.78rem" }}>
              {isError ? (
                <span className="d-flex align-items-center gap-1 text-danger">
                  <FiAlertTriangle size={13} /> Runtime Error
                </span>
              ) : (
                <span className="d-flex align-items-center gap-1 text-success">
                  <FiCheckCircle size={13} /> Execution Succeeded
                </span>
              )}
            </div>
            {output.map((line, i) => (
              <div key={i} style={{ whiteSpace: "pre-wrap", marginBottom: "2px" }}>
                {line}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted" style={{ fontSize: "0.88rem", paddingTop: "8px" }}>
            <p className="mb-2" style={{ color: "#64748b" }}>
              &gt; ZCoder Sandbox Engine v2.0
            </p>
            <p className="mb-0" style={{ color: "#475569" }}>
              Press <strong>"Run Code"</strong> or click Run to execute and view stdout/stderr output here.
            </p>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={2500} theme="dark" />
    </div>
  );
};

export default Output;
