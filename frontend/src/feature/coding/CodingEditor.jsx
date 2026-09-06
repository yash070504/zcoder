import { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../../constants";
import Output from "./Output";
import Navbar from "../../components/Navbar";
import { FiCode, FiPlay, FiRefreshCw } from "react-icons/fi";

function CodingEditor() {
  const editorRef = useRef();
  const [language, setLanguage] = useState("javascript");
  const [value, setValue] = useState(CODE_SNIPPETS["javascript"] || "");
  const [runTrigger, setRunTrigger] = useState(0);

  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme("zcoder-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "64748b", fontStyle: "italic" },
        { token: "keyword", foreground: "c084fc", fontStyle: "bold" },
        { token: "string", foreground: "34d399" },
        { token: "number", foreground: "38bdf8" },
        { token: "function", foreground: "818cf8" },
        { token: "variable", foreground: "f8fafc" },
        { token: "type", foreground: "f472b6" },
      ],
      colors: {
        "editor.background": "#0c101c",
        "editor.foreground": "#f8fafc",
        "editor.lineHighlightBackground": "#141b2d",
        "editorCursor.foreground": "#818cf8",
        "editorWhitespace.foreground": "#1e293b",
        "editorIndentGuide.background": "#1e293b",
        "editorIndentGuide.activeBackground": "#475569",
        "editorLineNumber.foreground": "#475569",
        "editorLineNumber.activeForeground": "#a5b4fc",
        "editorGutter.background": "#0c101c",
        "scrollbarSlider.background": "#33415544",
        "scrollbarSlider.hoverBackground": "#47556977",
      },
    });
  };

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (selectedLang) => {
    setLanguage(selectedLang);
    setValue(CODE_SNIPPETS[selectedLang] || "");
  };

  const onResetCode = () => {
    if (window.confirm("Reset code to default template?")) {
      setValue(CODE_SNIPPETS[language] || "");
    }
  };

  const triggerRun = () => {
    setRunTrigger((prev) => prev + 1);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#070a12" }}>
      <Navbar />

      {/* Pro Full-Viewport IDE Workspace */}
      <div className="ide-workspace">
        <div className="ide-split-container">
          {/* Left Pane: Code Editor */}
          <div className="ide-editor-pane">
            {/* Editor Pane Toolbar */}
            <div className="ide-pane-toolbar">
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <FiCode color="#818cf8" size={16} />
                  <span className="text-white fw-bold small">solution.{language === "javascript" ? "js" : language === "python" ? "py" : language === "java" ? "java" : "cpp"}</span>
                </div>
                <LanguageSelector language={language} onSelect={onSelect} />
              </div>

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  onClick={onResetCode}
                  className="btn-outline-glass py-1 px-3 d-inline-flex align-items-center gap-1"
                  style={{ fontSize: "0.8rem", borderRadius: "8px" }}
                  title="Reset to snippet template"
                >
                  <FiRefreshCw size={13} />
                  <span className="d-none d-md-inline">Reset</span>
                </button>

                <button
                  type="button"
                  onClick={triggerRun}
                  className="btn-premium py-1 px-3 d-inline-flex align-items-center gap-2"
                  style={{ 
                    fontSize: "0.85rem", 
                    background: "linear-gradient(135deg, #10b981, #059669)", 
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(16, 185, 129, 0.35)"
                  }}
                >
                  <FiPlay size={14} />
                  <span>Run</span>
                </button>
              </div>
            </div>

            {/* Monaco Editor Container */}
            <div style={{ flex: 1, minHeight: 0, position: "relative", background: "#0c101c" }}>
              <Editor
                options={{
                  minimap: { enabled: false },
                  fontSize: 14.5,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: "on",
                  padding: { top: 14, bottom: 14 },
                  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                  fontLigatures: true,
                  cursorBlinking: "smooth",
                  smoothScrolling: true,
                }}
                height="100%"
                theme="zcoder-dark"
                beforeMount={handleEditorWillMount}
                language={language}
                value={value}
                onMount={onMount}
                onChange={(val) => setValue(val || "")}
              />
            </div>
          </div>

          {/* Right Pane: Console Output Terminal */}
          <Output 
            editorRef={editorRef} 
            language={language} 
            runTrigger={runTrigger}
          />
        </div>
      </div>
    </div>
  );
}

export default CodingEditor;
