import { useState, useEffect } from "react";
import { useAddNewPromblemMutation } from "./promblemApiSlice";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FiCode, 
  FiPlusCircle, 
  FiArrowLeft, 
  FiTag, 
  FiExternalLink, 
  FiCheck, 
  FiTerminal, 
  FiEye, 
  FiBookOpen,
  FiZap,
  FiHelpCircle
} from "react-icons/fi";

const TEMPLATES = {
  cpp: `// C++ Optimal Solution
#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> solveChallenge(vector<int>& nums) {
        // Implementation here
        return nums;
    }
};`,
  python: `# Python 3 Optimal Solution
class Solution:
    def solve_challenge(self, nums: list[int]) -> list[int]:
        # Implementation here
        return nums`,
  javascript: `// JavaScript Optimal Solution
function solveChallenge(nums) {
    // Implementation here
    return nums;
}`
};

function NewPromblem() {
  const { id, username } = useSelector((store) => store.idUsername || {});
  const [addNewPromblem, { isLoading, isSuccess, isError, error }] = useAddNewPromblemMutation();

  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [testCase, setTestCase] = useState("");
  const [difficult, setDifficult] = useState("Medium");
  const [solution, setSolution] = useState("");
  const [selectedLang, setSelectedLang] = useState("cpp");
  const [errMsg, setErrMsg] = useState("");

  const targetUserId = id || localStorage.getItem("zcoder_id") || username || localStorage.getItem("zcoder_username");

  const onCreate = async (e) => {
    e.preventDefault();
    if (!title || !description || !solution) {
      setErrMsg("Title, description, and reference solution are required.");
      return;
    }

    try {
      const object = {
        user: targetUserId,
        title: title.trim(),
        description: description.trim(),
        solution: solution.trim(),
        testcase: testCase.trim() || "https://leetcode.com",
        difficult: difficult || "Medium",
      };
      await addNewPromblem(object).unwrap();
    } catch (err) {
      setErrMsg(err?.data?.message || "Failed to create problem. Please try again.");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Problem challenge created successfully!", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      setTimeout(() => {
        navigate(`/promblem/view/${id || username}`);
      }, 1500);
    }
  }, [isSuccess, id, username, navigate]);

  const insertSnippet = (snippet) => {
    setDescription((prev) => prev ? `${prev}\n\n${snippet}` : snippet);
  };

  const insertCodeTemplate = (lang) => {
    setSelectedLang(lang);
    setSolution(TEMPLATES[lang] || "");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="page-container flex-grow-1" style={{ maxWidth: "1280px", width: "100%" }}>
        {/* Top Breadcrumb & Studio Header */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="btn-outline-glass py-2 px-3 d-inline-flex align-items-center gap-2"
            style={{ fontSize: "0.85rem", borderRadius: "10px" }}
          >
            <FiArrowLeft size={16} />
            <span>Back to Problems</span>
          </button>

          <div className="d-flex align-items-center gap-2">
            <span className="badge-easy" style={{ fontSize: "0.78rem" }}>
              <span className="badge-pulse"></span> Arena Problem Studio
            </span>
          </div>
        </div>

        {errMsg && (
          <div className="login-alert mb-4">
            <span>{errMsg}</span>
          </div>
        )}

        <form onSubmit={onCreate}>
          <div className="row g-4">
            {/* Left Main Column: Form Inputs & IDE (col-lg-8) */}
            <div className="col-lg-8">
              {/* Problem Details Card */}
              <div className="glass-card p-4 p-md-5 mb-4 position-relative overflow-hidden" style={{ borderRadius: "20px" }}>
                <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    boxShadow: "0 0 16px rgba(16, 185, 129, 0.4)"
                  }}>
                    <FiPlusCircle size={24} />
                  </div>
                  <div>
                    <h1 className="fs-3 fw-bold text-white mb-1">Add Coding Challenge</h1>
                    <p style={{ color: "#94a3b8", fontSize: "0.88rem" }} className="mb-0">
                      Contribute algorithmic questions with hints, constraints, and optimal solutions.
                    </p>
                  </div>
                </div>

                {/* Field 1: Title */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1.5">
                    <label className="form-label fw-semibold text-white mb-0" style={{ fontSize: "0.92rem" }}>
                      Problem Title *
                    </label>
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                      {title.length} / 100 characters
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    placeholder="e.g. Invert Binary Tree, LRU Cache, Median of Two Arrays"
                    className="glass-input py-2.5"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Field 2: Problem Description with Quick Snippet Helpers */}
                <div className="mb-4">
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                    <label className="form-label fw-semibold text-white mb-0" style={{ fontSize: "0.92rem" }}>
                      Problem Description & Constraints *
                    </label>
                    <div className="d-flex align-items-center gap-1.5">
                      <span style={{ fontSize: "0.76rem", color: "#64748b", marginRight: "4px" }}>Add helper:</span>
                      <button
                        type="button"
                        onClick={() => insertSnippet("**Example 1:**\n- Input: `nums = [2,7,11,15], target = 9`\n- Output: `[0,1]`\n- Explanation: `nums[0] + nums[1] == 9`")}
                        className="btn btn-sm py-0.5 px-2 text-white-50"
                        style={{ background: "rgba(255, 255, 255, 0.06)", borderRadius: "6px", fontSize: "0.74rem" }}
                      >
                        + Example
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippet("**Constraints:**\n- `1 <= nums.length <= 10^5`\n- `-10^9 <= nums[i] <= 10^9`")}
                        className="btn btn-sm py-0.5 px-2 text-white-50"
                        style={{ background: "rgba(255, 255, 255, 0.06)", borderRadius: "6px", fontSize: "0.74rem" }}
                      >
                        + Constraints
                      </button>
                    </div>
                  </div>
                  <textarea
                    required
                    rows={7}
                    placeholder="Provide a clear problem statement, input/output formats, and boundary constraints..."
                    className="glass-input"
                    style={{ lineHeight: "1.6", resize: "vertical" }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Field 3: Reference Solution Code Editor Card */}
                <div>
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                    <label className="form-label fw-semibold text-white mb-0" style={{ fontSize: "0.92rem" }}>
                      Reference Solution Code *
                    </label>
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Template:</span>
                      {["cpp", "python", "javascript"].map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => insertCodeTemplate(lang)}
                          className="btn btn-sm py-0.5 px-2 text-uppercase"
                          style={{
                            background: selectedLang === lang ? "rgba(99, 102, 241, 0.3)" : "rgba(255, 255, 255, 0.06)",
                            color: selectedLang === lang ? "#a5b4fc" : "#94a3b8",
                            border: selectedLang === lang ? "1px solid #6366f1" : "1px solid transparent",
                            borderRadius: "6px",
                            fontSize: "0.72rem",
                            fontWeight: 600
                          }}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* IDE Mockup Window */}
                  <div style={{
                    borderRadius: "14px",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    overflow: "hidden",
                    background: "rgba(8, 12, 22, 0.95)"
                  }}>
                    {/* Window Titlebar */}
                    <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom border-secondary border-opacity-25" style={{ background: "rgba(15, 23, 42, 0.8)" }}>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444", display: "inline-block" }}></span>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b", display: "inline-block" }}></span>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981", display: "inline-block" }}></span>
                        <span className="ms-2 small text-muted" style={{ fontSize: "0.75rem" }}>Solution.{selectedLang}</span>
                      </div>
                      <span className="badge text-uppercase" style={{ background: "rgba(99, 102, 241, 0.15)", color: "#a5b4fc", fontSize: "0.72rem" }}>
                        <FiTerminal size={12} className="me-1" /> Optimal Model
                      </span>
                    </div>

                    <textarea
                      required
                      rows={8}
                      placeholder="// Enter optimal solution code with time and space complexity..."
                      className="glass-input code-font border-0 rounded-0"
                      style={{
                        background: "transparent",
                        fontSize: "0.9rem",
                        lineHeight: "1.5",
                        fontFamily: "'Fira Code', monospace"
                      }}
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar Column: Metadata, Live Preview & Actions (col-lg-4) */}
            <div className="col-lg-4 d-flex flex-column gap-4">
              {/* Challenge Settings Card */}
              <div className="glass-card p-4" style={{ borderRadius: "20px" }}>
                <h4 className="fs-6 fw-bold text-white mb-3 d-flex align-items-center gap-2">
                  <FiTag size={16} color="#818cf8" />
                  <span>Challenge Settings</span>
                </h4>

                {/* Difficulty Selector */}
                <div className="mb-4">
                  <label className="form-label small text-muted mb-2">Difficulty Level</label>
                  <div className="d-flex gap-2">
                    {[
                      { level: "Easy", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)", border: "rgba(16, 185, 129, 0.4)" },
                      { level: "Medium", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.4)" },
                      { level: "Hard", color: "#f43f5e", bg: "rgba(244, 63, 94, 0.15)", border: "rgba(244, 63, 94, 0.4)" }
                    ].map((item) => (
                      <button
                        key={item.level}
                        type="button"
                        onClick={() => setDifficult(item.level)}
                        className="flex-grow-1 py-2 rounded-3 text-center transition-all"
                        style={{
                          background: difficult === item.level ? item.bg : "rgba(255, 255, 255, 0.04)",
                          border: difficult === item.level ? `1.5px solid ${item.color}` : "1px solid rgba(255, 255, 255, 0.1)",
                          color: difficult === item.level ? item.color : "#94a3b8",
                          fontWeight: difficult === item.level ? "700" : "500",
                          fontSize: "0.85rem",
                          boxShadow: difficult === item.level ? `0 0 12px ${item.border}` : "none",
                          cursor: "pointer"
                        }}
                      >
                        {item.level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Problem / Testcase URL */}
                <div className="mb-4">
                  <label className="form-label small text-muted mb-2">Problem / Test Case URL</label>
                  <input
                    type="text"
                    placeholder="https://leetcode.com/problems/..."
                    className="glass-input py-2 mb-2"
                    style={{ fontSize: "0.86rem" }}
                    value={testCase}
                    onChange={(e) => setTestCase(e.target.value)}
                  />
                  <div className="d-flex flex-wrap gap-1.5">
                    <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Quick Fill:</span>
                    <button
                      type="button"
                      onClick={() => setTestCase("https://leetcode.com/problemset/all/")}
                      className="btn btn-sm py-0 px-1.5 text-muted"
                      style={{ background: "rgba(255, 255, 255, 0.05)", borderRadius: "4px", fontSize: "0.72rem" }}
                    >
                      LeetCode
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestCase("https://codeforces.com/problemset")}
                      className="btn btn-sm py-0 px-1.5 text-muted"
                      style={{ background: "rgba(255, 255, 255, 0.05)", borderRadius: "4px", fontSize: "0.72rem" }}
                    >
                      Codeforces
                    </button>
                  </div>
                </div>

                {/* Suggested Category Tags */}
                <div>
                  <label className="form-label small text-muted mb-2">Category Suggestions</label>
                  <div className="d-flex flex-wrap gap-1.5">
                    {["Arrays", "Strings", "DP", "Trees", "Graphs", "Hash Table", "Binary Search", "Math"].map((t) => (
                      <span
                        key={t}
                        onClick={() => insertSnippet(`**Category:** ${t}`)}
                        className="px-2 py-1 rounded text-white-50"
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                        title={`Click to add ${t} tag to problem`}
                      >
                        +{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Card Preview */}
              <div className="glass-card p-4" style={{ borderRadius: "20px" }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h4 className="fs-6 fw-bold text-white mb-0 d-flex align-items-center gap-2">
                    <FiEye size={16} color="#22d3ee" />
                    <span>Arena Live Preview</span>
                  </h4>
                  <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Live Mockup</span>
                </div>

                <div 
                  className="p-3.5 rounded-3"
                  style={{
                    background: "rgba(10, 15, 29, 0.85)",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)"
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span 
                      className="px-2 py-0.5 rounded fw-bold"
                      style={{
                        fontSize: "0.72rem",
                        background: difficult === "Easy" ? "rgba(16, 185, 129, 0.15)" : difficult === "Hard" ? "rgba(244, 63, 94, 0.15)" : "rgba(245, 158, 11, 0.15)",
                        color: difficult === "Easy" ? "#34d399" : difficult === "Hard" ? "#fb7185" : "#fbbf24"
                      }}
                    >
                      {difficult}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                      by @{username || "You"}
                    </span>
                  </div>

                  <h5 className="fs-6 fw-bold text-white mb-1.5 text-truncate">
                    {title || "Your Problem Title Will Appear Here"}
                  </h5>

                  <p style={{ color: "#94a3b8", fontSize: "0.8rem", lineHeight: "1.4" }} className="mb-3">
                    {description 
                      ? (description.length > 90 ? `${description.slice(0, 90)}...` : description)
                      : "Detailed problem statement, constraints, example input/output will preview here..."
                    }
                  </p>

                  <div className="d-flex align-items-center justify-content-between pt-2 border-top border-secondary border-opacity-25">
                    <span style={{ color: "#818cf8", fontSize: "0.78rem", fontWeight: 600 }}>Solve Challenge &rarr;</span>
                    <span style={{ fontSize: "0.72rem", color: "#10b981" }}>+50 XP</span>
                  </div>
                </div>
              </div>

              {/* Publish Action Box */}
              <div className="glass-card p-4 d-flex flex-column gap-2" style={{ borderRadius: "20px" }}>
                <button
                  type="submit"
                  className="btn-premium w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                  disabled={isLoading}
                  style={{ fontSize: "0.95rem" }}
                >
                  <FiZap size={16} />
                  <span>{isLoading ? "Publishing Challenge..." : "Publish Challenge"}</span>
                </button>

                <button
                  type="button"
                  className="btn-outline-glass w-100 py-2.5"
                  onClick={() => navigate(-1)}
                  style={{ fontSize: "0.9rem" }}
                >
                  Cancel & Discard
                </button>
              </div>

              {/* Pro Guidelines */}
              <div className="p-3 rounded-3" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px dashed rgba(255, 255, 255, 0.1)" }}>
                <div className="d-flex align-items-start gap-2">
                  <FiHelpCircle size={16} color="#818cf8" className="mt-0.5 flex-shrink-0" />
                  <p style={{ color: "#94a3b8", fontSize: "0.78rem", lineHeight: "1.5" }} className="mb-0">
                    <strong>Quality Tip:</strong> Include edge cases (empty inputs, large values) in the reference solution so candidates can test their solutions thoroughly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>

        <ToastContainer position="top-center" autoClose={3000} theme="dark" />
      </main>
    </div>
  );
}

export default NewPromblem;
