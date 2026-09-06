import { useState, useEffect } from "react";
import { useCreatePostMutation } from "./communityApiSlice";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FiMessageSquare, 
  FiArrowLeft, 
  FiTag, 
  FiZap, 
  FiEye, 
  FiHelpCircle,
  FiSend
} from "react-icons/fi";

function NewFormPost() {
  const { id, username } = useSelector((store) => store.idUsername || {});
  const [createPost, { isLoading, isSuccess, isError, error }] = useCreatePostMutation();

  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const targetUserId = id || localStorage.getItem("zcoder_id") || username || localStorage.getItem("zcoder_username");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setErrMsg("Please provide both a discussion title and content.");
      return;
    }

    try {
      const tagsArray = tags
        ? tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
        : ["Discussion"];

      await createPost({
        user: targetUserId,
        title: title.trim(),
        body: body.trim(),
        tags: tagsArray,
        comments: [],
      }).unwrap();
    } catch (err) {
      setErrMsg(err?.data?.message || "Failed to create post. Please try again.");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Discussion post published!", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      setTimeout(() => {
        navigate(`/community`);
      }, 1200);
    }
  }, [isSuccess, navigate]);

  const addTag = (tag) => {
    const existing = tags ? tags.split(",").map((t) => t.trim()) : [];
    if (!existing.includes(tag)) {
      setTags(existing.length > 0 ? `${tags}, ${tag}` : tag);
    }
  };

  const parsedTags = tags
    ? tags.split(",").map((t) => t.trim()).filter(Boolean)
    : ["Discussion"];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="page-container flex-grow-1" style={{ maxWidth: "1200px", width: "100%" }}>
        {/* Top Navigation */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="btn-outline-glass py-2 px-3 d-inline-flex align-items-center gap-2"
            style={{ fontSize: "0.85rem", borderRadius: "10px" }}
          >
            <FiArrowLeft size={16} />
            <span>Back to Community</span>
          </button>

          <span className="badge-medium" style={{ fontSize: "0.78rem" }}>
            Community Creator Studio
          </span>
        </div>

        {errMsg && (
          <div className="login-alert mb-4">
            <span>{errMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* Left Main Form (col-lg-8) */}
            <div className="col-lg-8">
              <div className="glass-card p-4 p-md-5 mb-4 position-relative overflow-hidden" style={{ borderRadius: "20px" }}>
                <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #a855f7, #ec4899)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    boxShadow: "0 0 16px rgba(168, 85, 247, 0.4)"
                  }}>
                    <FiMessageSquare size={24} />
                  </div>
                  <div>
                    <h1 className="fs-3 fw-bold text-white mb-1">Create Community Post</h1>
                    <p style={{ color: "#94a3b8", fontSize: "0.88rem" }} className="mb-0">
                      Share algorithm solutions, interview questions, or ask for guidance.
                    </p>
                  </div>
                </div>

                {/* Title */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-white mb-1.5" style={{ fontSize: "0.92rem" }}>
                    Discussion Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Optimal approach for dynamic programming grid traversal"
                    className="glass-input py-2.5"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Content */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-white mb-1.5" style={{ fontSize: "0.92rem" }}>
                    Post Content *
                  </label>
                  <textarea
                    required
                    rows={8}
                    placeholder="Write your explanation, code breakdown, complexity analysis, or question in detail..."
                    className="glass-input"
                    style={{ lineHeight: "1.6", resize: "vertical" }}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="form-label fw-semibold text-white mb-1.5" style={{ fontSize: "0.92rem" }}>
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DynamicProgramming, LeetCode, InterviewPrep"
                    className="glass-input py-2 mb-2"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                  <div className="d-flex flex-wrap gap-1.5 align-items-center">
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Suggestions:</span>
                    {["Algorithms", "Interview", "WebDev", "Bugs", "Showcase", "Python", "JavaScript"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => addTag(t)}
                        className="btn btn-sm py-0 px-2 text-white-50"
                        style={{ background: "rgba(255, 255, 255, 0.06)", borderRadius: "4px", fontSize: "0.74rem" }}
                      >
                        +{t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar (col-lg-4) */}
            <div className="col-lg-4 d-flex flex-column gap-4">
              {/* Live Preview Card */}
              <div className="glass-card p-4" style={{ borderRadius: "20px" }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h4 className="fs-6 fw-bold text-white mb-0 d-flex align-items-center gap-2">
                    <FiEye size={16} color="#c084fc" />
                    <span>Feed Live Preview</span>
                  </h4>
                  <span style={{ fontSize: "0.72rem", color: "#64748b" }}>Live Mockup</span>
                </div>

                <div 
                  className="p-3.5 rounded-3"
                  style={{
                    background: "rgba(10, 15, 29, 0.85)",
                    border: "1px solid rgba(168, 85, 247, 0.3)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)"
                  }}
                >
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="fw-bold" style={{ color: "#38bdf8", fontSize: "0.85rem" }}>
                      @{username || "Author"}
                    </span>
                    <span className="badge-easy" style={{ fontSize: "0.68rem" }}>Author</span>
                  </div>

                  <h5 className="fs-6 fw-bold text-white mb-1.5 text-truncate">
                    {title || "Your Post Title Will Appear Here"}
                  </h5>

                  <p style={{ color: "#94a3b8", fontSize: "0.8rem", lineHeight: "1.4" }} className="mb-3">
                    {body ? (body.length > 95 ? `${body.slice(0, 95)}...` : body) : "Discussion content preview..."}
                  </p>

                  <div className="d-flex flex-wrap gap-1">
                    {parsedTags.slice(0, 3).map((t, idx) => (
                      <span key={idx} className="badge" style={{ background: "rgba(99, 102, 241, 0.15)", color: "#a5b4fc", fontSize: "0.72rem" }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Publish Actions */}
              <div className="glass-card p-4 d-flex flex-column gap-2" style={{ borderRadius: "20px" }}>
                <button
                  type="submit"
                  className="btn-premium w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                  disabled={isLoading}
                  style={{ fontSize: "0.95rem" }}
                >
                  <FiSend size={16} />
                  <span>{isLoading ? "Publishing Post..." : "Publish Post"}</span>
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

              {/* Community Guidelines */}
              <div className="p-3 rounded-3" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px dashed rgba(255, 255, 255, 0.1)" }}>
                <div className="d-flex align-items-start gap-2">
                  <FiHelpCircle size={16} color="#c084fc" className="mt-0.5 flex-shrink-0" />
                  <p style={{ color: "#94a3b8", fontSize: "0.78rem", lineHeight: "1.5" }} className="mb-0">
                    <strong>Tip:</strong> Keep titles descriptive. Use code snippets and format complexity (e.g. O(N log N)) so other developers can easily review and reply.
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

export default NewFormPost;
