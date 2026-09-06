import { Link, useNavigate } from "react-router-dom";
import { useDeletePromblemMutation } from "./promblemApiSlice";
import { useState } from "react";
import NavbarG from "../../components/NavbarG";
import { useSelector } from "react-redux";
import { 
  FiExternalLink, 
  FiTrash2, 
  FiChevronDown, 
  FiChevronUp, 
  FiPlus, 
  FiSearch,
  FiCode
} from "react-icons/fi";

function ViewPro({ promblems }) {
  const { id } = useSelector((store) => store.idUsername);
  const [deletePromblem] = useDeletePromblemMutation();
  const navigate = useNavigate();
  const [openSolutionId, setOpenSolutionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const toggleSolution = (problemId) => {
    setOpenSolutionId(openSolutionId === problemId ? null : problemId);
  };

  const getDifficultyBadge = (difficulty) => {
    const d = (difficulty || "").toLowerCase();
    if (d.includes("easy")) return <span className="badge-easy">Easy</span>;
    if (d.includes("med")) return <span className="badge-medium">Medium</span>;
    if (d.includes("hard")) return <span className="badge-hard">Hard</span>;
    return <span className="badge-medium">{difficulty || "Standard"}</span>;
  };

  const filteredProblems = (promblems || []).filter((p) => {
    const matchesSearch = 
      (p.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiff = 
      difficultyFilter === "all" || 
      (p.difficult || "").toLowerCase().includes(difficultyFilter.toLowerCase());
    return matchesSearch && matchesDiff;
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavbarG>
        <button
          className="btn-premium py-2 px-3"
          style={{ fontSize: "0.88rem" }}
          onClick={() => navigate(`/promblem/new/${id}`)}
        >
          <FiPlus size={16} />
          <span>Add Problem</span>
        </button>
      </NavbarG>

      <main className="page-container flex-grow-1">
        {/* Header Title & Filter Bar */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h1 className="fs-2 fw-bold text-white mb-1">Problem Hub</h1>
            <p className="text-muted small mb-0">
              Practice algorithm challenges, inspect reference solutions, and test problem cases
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="d-flex flex-wrap align-items-center gap-3">
            <div className="position-relative" style={{ minWidth: "280px" }}>
              <FiSearch 
                size={18} 
                style={{ 
                  position: "absolute", 
                  left: "14px", 
                  top: "50%", 
                  transform: "translateY(-50%)", 
                  color: "#818cf8", 
                  pointerEvents: "none",
                  zIndex: 2
                }} 
              />
              <input
                type="text"
                placeholder="Search problems by name or tag..."
                className="glass-input py-2"
                style={{ 
                  fontSize: "0.92rem", 
                  paddingLeft: "42px",
                  background: "rgba(18, 24, 38, 0.95)", 
                  border: "1px solid rgba(99, 102, 241, 0.35)",
                  color: "#ffffff",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)"
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="glass-input py-2 px-3"
              style={{ width: "auto", fontSize: "0.88rem" }}
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Problems List / Table */}
        {filteredProblems.length === 0 ? (
          <div className="glass-card p-5 text-center my-4">
            <div style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "rgba(99, 102, 241, 0.15)",
              color: "#818cf8",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <FiCode size={28} />
            </div>
            <h3 className="fs-5 fw-bold text-white mb-2">No Problems Found</h3>
            <p className="text-muted small mb-4">
              {searchTerm || difficultyFilter !== "all" 
                ? "No challenges match your current search or filter criteria." 
                : "No problems added yet. Be the first to create one!"}
            </p>
            <button
              className="btn-premium py-2 px-4"
              onClick={() => navigate(`/promblem/new/${id}`)}
            >
              <FiPlus size={16} /> Add First Problem
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {filteredProblems.map((problem) => {
              const problemId = problem.id || problem._id;
              const isSolutionOpen = openSolutionId === problemId;

              return (
                <div className="col-12" key={problemId}>
                  <div className="glass-card p-4">
                    <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3">
                      <div>
                        <div className="d-flex align-items-center gap-3 mb-2">
                          <h3 className="fs-5 fw-bold text-white mb-0">{problem.title}</h3>
                          {getDifficultyBadge(problem.difficult)}
                        </div>
                        <p className="text-muted mb-0" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                          {problem.description}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="d-flex align-items-center gap-2">
                        {problem.testcase && (
                          <a
                            href={problem.testcase.startsWith("http") ? problem.testcase : `https://${problem.testcase}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline-glass py-1 px-3 d-inline-flex align-items-center gap-1"
                            style={{ fontSize: "0.85rem" }}
                          >
                            <span>Link</span>
                            <FiExternalLink size={14} />
                          </a>
                        )}

                        <button
                          className="btn-danger-glass p-2 d-flex align-items-center justify-content-center"
                          title="Delete Problem"
                          onClick={async () => {
                            if (window.confirm("Are you sure you want to delete this problem?")) {
                              await deletePromblem({ id: problemId });
                            }
                          }}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Solution Drawer */}
                    {problem.solution && (
                      <div className="mt-3 pt-3 border-top border-secondary border-opacity-25">
                        <button
                          className="btn btn-link text-decoration-none p-0 d-inline-flex align-items-center gap-2 text-accent"
                          style={{ fontSize: "0.88rem", fontWeight: 600 }}
                          onClick={() => toggleSolution(problemId)}
                        >
                          <span>{isSolutionOpen ? "Hide Solution" : "View Reference Solution"}</span>
                          {isSolutionOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                        </button>

                        {isSolutionOpen && (
                          <div 
                            className="mt-3 p-3 rounded-3 code-font"
                            style={{ 
                              background: "#090d16", 
                              border: "1px solid rgba(255, 255, 255, 0.08)",
                              color: "#e2e8f0",
                              fontSize: "0.88rem",
                              whiteSpace: "pre-wrap",
                              overflowX: "auto"
                            }}
                          >
                            {problem.solution}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default ViewPro;
