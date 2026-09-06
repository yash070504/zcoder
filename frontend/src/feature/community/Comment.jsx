import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { selectPostById } from "./communityApiSlice";
import { useSelector } from "react-redux";
import { FiMessageSquare, FiChevronDown, FiChevronUp, FiExternalLink, FiSearch } from "react-icons/fi";
import { NavAvatar } from "../../components/Navbar";

function Comment({ id, defaultOpen = false, searchQuery = "" }) {
  const post = useSelector((state) => selectPostById(state, id));
  const currentUsername = useSelector((state) => state?.idUsername?.username) || localStorage.getItem("zcoder_username");
  const currentProfileUrl = useSelector((state) => state?.idUsername?.profileUrl) || localStorage.getItem("zcoder_profileUrl");

  const comments = post?.comments || [];

  const hasCommentMatch = Boolean(
    searchQuery.trim() && 
    comments.some(c => 
      c.message?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.createdBy?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const [isOpen, setIsOpen] = useState(defaultOpen || hasCommentMatch);

  useEffect(() => {
    if (defaultOpen || hasCommentMatch) {
      setIsOpen(true);
    }
  }, [defaultOpen, hasCommentMatch]);

  return (
    <div className="mt-3 pt-3 border-top border-secondary border-opacity-25">
      <div className="d-flex align-items-center justify-content-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-link text-decoration-none p-0 d-inline-flex align-items-center gap-2"
          style={{ color: "#a5b4fc", fontSize: "0.85rem", fontWeight: 600 }}
        >
          <FiMessageSquare size={14} />
          <span>
            {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
          </span>
          {isOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>

        {hasCommentMatch && (
          <span 
            className="badge d-inline-flex align-items-center gap-1"
            style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", fontSize: "0.74rem" }}
          >
            <FiSearch size={11} /> Comment Matched
          </span>
        )}
      </div>

      {isOpen && (
        <div className="mt-3 d-flex flex-column gap-2">
          {comments.length === 0 ? (
            <p className="text-muted small mb-0 fst-italic">No comments yet. Be the first to reply!</p>
          ) : (
            comments.map((comment, index) => {
              const author = comment.createdBy || "Developer";
              const isCurrentUser = author === currentUsername;
              const commenterAvatar = isCurrentUser ? currentProfileUrl : (comment.avatar || "");

              const isMatch = Boolean(
                searchQuery.trim() && (
                  comment.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  author.toLowerCase().includes(searchQuery.toLowerCase())
                )
              );

              return (
                <div 
                  key={comment._id || index} 
                  className="p-3 rounded-3 transition-all"
                  style={{
                    background: isMatch ? "rgba(14, 30, 56, 0.85)" : "rgba(10, 15, 29, 0.75)",
                    border: isMatch ? "1.5px solid rgba(56, 189, 248, 0.55)" : "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: isMatch ? "0 0 14px rgba(56, 189, 248, 0.25)" : "none",
                    fontSize: "0.9rem"
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                    <Link
                      to={`/user/profile/${author}`}
                      className="d-inline-flex align-items-center gap-2 text-decoration-none"
                      title={`View @${author}'s Profile`}
                    >
                      <NavAvatar 
                        url={commenterAvatar} 
                        name={author} 
                        style={{ width: "24px", height: "24px", fontSize: "0.75rem" }}
                      />
                      <span className="fw-bold" style={{ color: isMatch ? "#38bdf8" : "#93c5fd", fontSize: "0.85rem" }}>
                        @{author}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                        <FiExternalLink size={11} />
                      </span>
                    </Link>

                    {isMatch && (
                      <span className="badge" style={{ background: "rgba(56, 189, 248, 0.2)", color: "#38bdf8", fontSize: "0.7rem" }}>
                        Search Match
                      </span>
                    )}
                  </div>
                  <div style={{ color: "#cbd5e1", fontSize: "0.9rem", lineHeight: "1.6", paddingLeft: "32px" }}>
                    {comment.message}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default Comment;
