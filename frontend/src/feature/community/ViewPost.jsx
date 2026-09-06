import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useDeletePostMutation, useGetAllPostQuery, useLikePostMutation } from "./communityApiSlice";
import Comment from "./Comment";
import Post from "./Post";
import NavbarG from "../../components/NavbarG";
import { NavAvatar } from "../../components/Navbar";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FiMessageSquare, 
  FiPlusCircle, 
  FiTrash2, 
  FiTag, 
  FiSearch, 
  FiExternalLink,
  FiShare2,
  FiHeart,
  FiCopy,
  FiCheck,
  FiFilter,
  FiClock,
  FiTrendingUp,
  FiX
} from "react-icons/fi";

const DEFAULT_POPULAR_TAGS = [
  "All",
  "Algorithms",
  "Interview",
  "WebDev",
  "Bugs",
  "Showcase",
  "Coding",
  "React",
  "Node"
];

function formatTimeAgo(timestamp) {
  if (!timestamp) return "Recently";
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (isNaN(diffInSeconds) || diffInSeconds < 0) return "Just now";
  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function ViewPost() {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const sharedPostId = searchParams.get("post") || params.id || "";

  const [deletePost, { isSuccess: isDelSuccess }] = useDeletePostMutation();
  const [likePostApi] = useLikePostMutation();

  const token = useSelector((state) => state?.auth?.token) || localStorage.getItem("zcoder_token");
  const idFromStore = useSelector((store) => store.idUsername?.id);
  const usernameFromStore = useSelector((store) => store.idUsername?.username);
  const profileUrlFromStore = useSelector((store) => store.idUsername?.profileUrl);
  const currentUsername = usernameFromStore || localStorage.getItem("zcoder_username") || "";
  const isGuest = !token && !currentUsername;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [sortBy, setSortBy] = useState("latest"); // "latest" | "most_comments" | "oldest"
  const [copiedPostId, setCopiedPostId] = useState(null);

  const postRefs = useRef({});
  const prevAuthorPostsRef = useRef(null);

  // Real-time polling every 3 seconds for live updates without page reload
  const {
    data: postsData,
    isLoading,
    isSuccess,
    refetch
  } = useGetAllPostQuery(undefined, {
    pollingInterval: 3000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isDelSuccess) {
      toast.success("Post deleted successfully", { theme: "dark" });
    }
  }, [isDelSuccess]);

  // Scroll to shared post if parameter is present in URL
  useEffect(() => {
    if (sharedPostId && isSuccess && postRefs.current[sharedPostId]) {
      setTimeout(() => {
        postRefs.current[sharedPostId]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [sharedPostId, isSuccess, postsData]);

  // Extract all posts array from RTK Query
  const allPosts = useMemo(() => {
    if (!isSuccess || !postsData) return [];
    const { ids, entities } = postsData;
    return ids.map((id) => entities[id]).filter(Boolean);
  }, [isSuccess, postsData]);

  // Real-time live notifications for the author when another user likes or comments
  useEffect(() => {
    if (!isSuccess || !allPosts.length || !currentUsername) return;

    if (!prevAuthorPostsRef.current) {
      const initialMap = {};
      allPosts.forEach((p) => {
        if (p.username === currentUsername) {
          initialMap[p._id] = {
            likes: Array.isArray(p.likes) ? [...p.likes] : [],
            commentCount: Array.isArray(p.comments) ? p.comments.length : 0,
          };
        }
      });
      prevAuthorPostsRef.current = initialMap;
      return;
    }

    allPosts.forEach((p) => {
      if (p.username === currentUsername) {
        const prev = prevAuthorPostsRef.current[p._id];
        if (prev) {
          const currentLikes = Array.isArray(p.likes) ? p.likes : [];
          const newLikers = currentLikes.filter((u) => !prev.likes.includes(u) && u !== currentUsername);
          newLikers.forEach((liker) => {
            toast.info(`❤️ @${liker} liked your post: "${p.title}"!`, {
              theme: "dark",
              position: "top-center",
              autoClose: 4500,
            });
          });

          const currentCommentCount = Array.isArray(p.comments) ? p.comments.length : 0;
          if (currentCommentCount > prev.commentCount) {
            const latestComment = p.comments[p.comments.length - 1];
            if (latestComment && latestComment.createdBy !== currentUsername) {
              toast.info(`💬 @${latestComment.createdBy} commented on your post: "${p.title}"!`, {
                theme: "dark",
                position: "top-center",
                autoClose: 4500,
              });
            }
          }
        }

        prevAuthorPostsRef.current[p._id] = {
          likes: Array.isArray(p.likes) ? [...p.likes] : [],
          commentCount: Array.isArray(p.comments) ? p.comments.length : 0,
        };
      }
    });
  }, [allPosts, isSuccess, currentUsername]);

  // Dynamic tags with count
  const { tagOptions, tagCounts } = useMemo(() => {
    const counts = { All: allPosts.length };
    const dynamicSet = new Set(DEFAULT_POPULAR_TAGS);

    allPosts.forEach((p) => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach((rawTag) => {
          const t = rawTag.trim();
          if (t) {
            dynamicSet.add(t);
            counts[t] = (counts[t] || 0) + 1;
          }
        });
      }
    });

    return {
      tagOptions: Array.from(dynamicSet),
      tagCounts: counts,
    };
  }, [allPosts]);

  // Filter posts by search query (title, body, author, tags, AND comments) & tag
  const filteredPosts = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    const filtered = allPosts.filter((post) => {
      const matchesTag = 
        selectedTag === "All" ||
        (Array.isArray(post.tags) && post.tags.some((t) => t.trim().toLowerCase() === selectedTag.toLowerCase()));

      if (!matchesTag) return false;

      if (!query) return true;

      // 1. Search in title & body
      const inTitle = post.title?.toLowerCase().includes(query);
      const inBody = post.body?.toLowerCase().includes(query);
      const inAuthor = post.username?.toLowerCase().includes(query);
      const inTags = Array.isArray(post.tags) && post.tags.some((t) => t.toLowerCase().includes(query));

      // 2. Search inside specific comments!
      const inComments = Array.isArray(post.comments) && post.comments.some((c) =>
        c.message?.toLowerCase().includes(query) || c.createdBy?.toLowerCase().includes(query)
      );

      return inTitle || inBody || inAuthor || inTags || inComments;
    });

    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortBy === "most_comments") {
        return (b.comments?.length || 0) - (a.comments?.length || 0);
      }
      if (sortBy === "oldest") {
        return (new Date(a.createdAt || 0)) - (new Date(b.createdAt || 0));
      }
      // "latest" default: newest first
      return (new Date(b.createdAt || b._id)) - (new Date(a.createdAt || a._id));
    });
  }, [allPosts, searchTerm, selectedTag, sortBy]);

  const handleDelete = async (postId, postTitle) => {
    if (window.confirm(`Are you sure you want to delete "${postTitle}"?`)) {
      try {
        await deletePost({ id: postId }).unwrap();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete post", { theme: "dark" });
      }
    }
  };

  const handleShare = (postId, postTitle) => {
    const shareUrl = `${window.location.origin}/community?post=${postId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedPostId(postId);
      toast.success("🔗 Direct post link copied to clipboard! Anyone can view this discussion.", {
        position: "top-center",
        autoClose: 2500,
        theme: "dark",
      });
      setTimeout(() => setCopiedPostId(null), 2000);
    }).catch(() => {
      prompt("Copy direct link to this post:", shareUrl);
    });
  };

  const toggleLike = async (post) => {
    if (isGuest) {
      toast.info("🔒 You need to log in to like posts! If you are a new user, please create an account.", {
        theme: "dark",
        position: "top-center",
        autoClose: 4000
      });
      return;
    }

    try {
      const res = await likePostApi({ postId: post._id, username: currentUsername }).unwrap();
      if (res.isLiked) {
        toast.success(`❤️ Liked "${res.postTitle}"! Author @${res.authorUsername} notified.`, {
          theme: "dark",
          position: "top-center",
          autoClose: 2500
        });
      } else {
        toast.info(`Removed like from "${res.postTitle}"`, {
          theme: "dark",
          position: "top-center",
          autoClose: 2000
        });
      }
    } catch (err) {
      console.error("Failed to like post:", err);
      toast.error(err?.data?.message || "Failed to update like", { theme: "dark" });
    }
  };

  const copyContent = (text) => {
    navigator.clipboard.writeText(text);
    toast.info("Copied post content to clipboard", { theme: "dark", autoClose: 1500 });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarG>
        <Link 
          to="/community/new" 
          className="btn-premium py-2 px-3 d-inline-flex align-items-center gap-2"
          style={{ fontSize: "0.86rem" }}
        >
          <FiPlusCircle size={15} />
          <span>New Discussion</span>
        </Link>
      </NavbarG>

      <main className="page-container flex-grow-1" style={{ maxWidth: "1140px", width: "100%" }}>
        {/* Header Hero Section */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
          <div>
            <h1 className="fs-2 fw-bold text-white mb-1">
              Community <span className="gradient-text">Forum</span>
            </h1>
            <p style={{ color: "#cbd5e1", fontSize: "0.95rem" }} className="mb-0">
              Exchange problem solutions, ask debugging questions, and discuss algorithms with fellow developers.
            </p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge-easy">
              <span className="badge-pulse"></span> Live Synced
            </span>
            <Link 
              to="/community/new" 
              className="btn-premium py-2 px-3 d-none d-md-inline-flex align-items-center gap-2"
              style={{ fontSize: "0.86rem" }}
            >
              <FiPlusCircle size={15} />
              <span>Create Post</span>
            </Link>
          </div>
        </div>

        {/* Shared Post Banner Notice (If arriving from a direct link) */}
        {sharedPostId && (
          <div 
            className="p-3 mb-4 rounded-3 d-flex align-items-center justify-content-between gap-3"
            style={{ 
              background: "rgba(99, 102, 241, 0.15)", 
              border: "1px solid rgba(99, 102, 241, 0.35)",
              boxShadow: "0 0 20px rgba(99, 102, 241, 0.2)"
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontSize: "1.1rem" }}>📌</span>
              <span style={{ color: "#c7d2fe", fontSize: "0.88rem" }}>
                Viewing shared discussion. Direct link active.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchParams({});
              }}
              className="btn btn-sm btn-link text-white-50 text-decoration-none p-0 d-flex align-items-center gap-1"
              style={{ fontSize: "0.8rem" }}
            >
              <FiX size={14} /> Clear Focus
            </button>
          </div>
        )}

        {/* Anonymous / Guest Notice Banner */}
        {isGuest && (
          <div 
            className="p-3 mb-4 rounded-3 d-flex flex-wrap align-items-center justify-content-between gap-3"
            style={{ 
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.12) 100%)", 
              border: "1px solid rgba(99, 102, 241, 0.3)",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
            }}
          >
            <div className="d-flex align-items-center gap-2.5">
              <span style={{ fontSize: "1.2rem" }}>👀</span>
              <div>
                <span className="text-white fw-bold d-block" style={{ fontSize: "0.88rem" }}>
                  Browsing Community as Guest
                </span>
                <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                  You can read all discussions. Sign in or create a user account to like posts and reply with your solutions!
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Link to="/login" className="btn-outline-glass py-1.5 px-3" style={{ fontSize: "0.82rem" }}>
                Sign In
              </Link>
              <Link to="/create" className="btn-premium py-1.5 px-3" style={{ fontSize: "0.82rem" }}>
                Create User
              </Link>
            </div>
          </div>
        )}

        {/* Search, Filter & Sort Controls Bar */}
        <div className="glass-card p-3 p-md-4 mb-4" style={{ borderRadius: "18px" }}>
          <div className="row g-3 align-items-center">
            {/* Search Input (Searches Posts & Specific Comments!) */}
            <div className="col-lg-6 col-md-7">
              <div className="position-relative">
                <FiSearch 
                  size={17} 
                  style={{ 
                    position: "absolute", 
                    left: "14px", 
                    top: "50%", 
                    transform: "translateY(-50%)", 
                    color: "#64748b",
                    pointerEvents: "none"
                  }} 
                />
                <input
                  type="text"
                  className="glass-input"
                  style={{ paddingLeft: "42px", fontSize: "0.9rem", height: "42px" }}
                  placeholder="Search discussions, code, authors, or specific comments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="btn btn-link text-muted p-0"
                    style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)" }}
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="col-lg-6 col-md-5 d-flex justify-content-md-end align-items-center gap-2">
              <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                <FiTrendingUp size={14} className="me-1" /> Sort:
              </span>
              <select
                className="glass-input"
                style={{ width: "auto", minWidth: "160px", height: "42px", fontSize: "0.85rem", padding: "8px 14px" }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="latest">⚡ Latest Posts</option>
                <option value="most_comments">💬 Most Comments</option>
                <option value="oldest">🕒 Oldest First</option>
              </select>
            </div>
          </div>

          {/* Interactive Tag Filter Pills */}
          <div className="mt-3 pt-3 border-top border-secondary border-opacity-25">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600" }} className="me-1">
                <FiFilter size={13} className="me-1" /> Filter Tags:
              </span>
              {tagOptions.map((tag) => {
                const count = tagCounts[tag] || 0;
                const isSelected = selectedTag.toLowerCase() === tag.toLowerCase();

                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className="btn btn-sm d-inline-flex align-items-center gap-1.5 transition-all"
                    style={{
                      background: isSelected ? "linear-gradient(135deg, #6366f1, #a855f7)" : "rgba(255, 255, 255, 0.05)",
                      color: isSelected ? "#ffffff" : "#94a3b8",
                      border: isSelected ? "1px solid #818cf8" : "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "999px",
                      padding: "4px 12px",
                      fontSize: "0.78rem",
                      fontWeight: isSelected ? "700" : "500",
                      boxShadow: isSelected ? "0 0 12px rgba(99, 102, 241, 0.4)" : "none"
                    }}
                  >
                    <span>{tag}</span>
                    {count > 0 && (
                      <span 
                        style={{ 
                          fontSize: "0.68rem", 
                          padding: "1px 6px", 
                          borderRadius: "10px", 
                          background: isSelected ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.08)",
                          color: isSelected ? "#fff" : "#64748b"
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}

              {selectedTag !== "All" && (
                <button
                  type="button"
                  onClick={() => setSelectedTag("All")}
                  className="btn btn-sm btn-link text-muted p-0 ms-1 text-decoration-none"
                  style={{ fontSize: "0.78rem" }}
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Feed Summary Bar */}
        <div className="d-flex align-items-center justify-content-between mb-3 px-1">
          <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            Showing <strong>{filteredPosts.length}</strong> {filteredPosts.length === 1 ? "discussion" : "discussions"}
            {selectedTag !== "All" && ` in #${selectedTag}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </span>
          <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
            Latest on top • Auto-synced
          </span>
        </div>

        {/* Posts Feed */}
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2 small">Loading community discussions...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div 
            className="glass-card p-5 text-center my-4" 
            style={{ borderRadius: "20px" }}
          >
            <div 
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "rgba(99, 102, 241, 0.15)",
                color: "#818cf8",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px"
              }}
            >
              <FiMessageSquare size={26} />
            </div>
            <h3 className="fs-5 fw-bold text-white mb-2">No Discussions Found</h3>
            <p className="text-muted small mb-4">
              {searchTerm || selectedTag !== "All"
                ? "No posts or comments match your current search and filter criteria."
                : "No community posts have been published yet. Be the first to start a conversation!"}
            </p>
            <Link to="/community/new" className="btn-premium py-2 px-4">
              <FiPlusCircle size={16} /> Start First Discussion
            </Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {filteredPosts.map((post) => {
              const isAuthor = currentUsername && post.username === currentUsername;
              const authorName = post.username || "Anonymous";
              const isSharedTarget = sharedPostId === post._id;
              const likesList = Array.isArray(post.likes) ? post.likes : [];
              const isLikedByMe = Boolean(currentUsername && likesList.includes(currentUsername));
              const postLikes = {
                count: post.likesCount !== undefined ? post.likesCount : likesList.length,
                liked: isLikedByMe,
              };

              // Check if query matched comments in this post
              const commentMatches = searchTerm.trim() 
                ? (post.comments || []).filter(c => 
                    c.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.createdBy?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length 
                : 0;

              return (
                <div 
                  key={post._id}
                  ref={(el) => (postRefs.current[post._id] = el)}
                  id={`post-${post._id}`}
                  className="glass-card p-4 position-relative overflow-hidden transition-all"
                  style={{ 
                    borderRadius: "20px",
                    border: isSharedTarget ? "2px solid #818cf8" : "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: isSharedTarget ? "0 0 25px rgba(99, 102, 241, 0.4)" : "none",
                  }}
                >
                  {/* Top Row: Author info, timestamp & actions */}
                  <div className="d-flex align-items-center justify-content-between gap-3 mb-3 pb-3 border-bottom border-secondary border-opacity-25">
                    <div className="d-flex align-items-center gap-2.5">
                      <Link 
                        to={`/user/profile/${authorName}`}
                        className="d-flex align-items-center gap-2 text-decoration-none"
                        title={`View @${authorName}'s Profile`}
                      >
                        <NavAvatar 
                          url={post.authorAvatar || (isAuthor ? profileUrlFromStore : "")} 
                          name={authorName} 
                          style={{ width: "38px", height: "38px", fontSize: "0.95rem" }}
                        />
                        <div>
                          <div className="d-flex align-items-center gap-2">
                            <span 
                              className="fw-bold" 
                              style={{ color: "#f8fafc", fontSize: "0.94rem" }}
                            >
                              @{authorName}
                            </span>
                            <span style={{ fontSize: "0.74rem", color: "#64748b" }}>
                              <FiExternalLink size={12} />
                            </span>
                            {isAuthor && (
                              <span 
                                style={{
                                  fontSize: "0.7rem",
                                  padding: "2px 8px",
                                  borderRadius: "999px",
                                  background: "rgba(99, 102, 241, 0.2)",
                                  color: "#a5b4fc",
                                  fontWeight: 600,
                                  border: "1px solid rgba(99, 102, 241, 0.35)"
                                }}
                              >
                                You
                              </span>
                            )}
                          </div>
                          <div className="d-flex align-items-center gap-2" style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                            <span>Author</span>
                            <span>•</span>
                            <span className="d-flex align-items-center gap-1">
                              <FiClock size={11} />
                              {formatTimeAgo(post.createdAt)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Post Action Buttons */}
                    <div className="d-flex align-items-center gap-2">
                      {/* Share Button (Works for anyone, logged in or unlogged in!) */}
                      <button
                        type="button"
                        onClick={() => handleShare(post._id, post.title)}
                        className="btn-outline-glass d-inline-flex align-items-center gap-1.5 py-1 px-2.5"
                        title="Share this discussion (link works for logged in & unlogged in users)"
                        style={{ fontSize: "0.8rem", borderRadius: "8px" }}
                      >
                        {copiedPostId === post._id ? <FiCheck size={14} color="#10b981" /> : <FiShare2 size={13} color="#38bdf8" />}
                        <span style={{ color: copiedPostId === post._id ? "#10b981" : "#cbd5e1" }}>
                          {copiedPostId === post._id ? "Copied!" : "Share"}
                        </span>
                      </button>

                      {/* Delete Button (For author only) */}
                      {isAuthor && (
                        <button
                          type="button"
                          onClick={() => handleDelete(post._id, post.title)}
                          className="btn-danger-glass d-inline-flex align-items-center gap-1 py-1 px-2.5"
                          title="Delete this discussion"
                          style={{ fontSize: "0.8rem", borderRadius: "8px" }}
                        >
                          <FiTrash2 size={13} />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Post Title & Body */}
                  <div className="mb-3">
                    <h2 className="fs-5 fw-bold text-white mb-2">
                      {post.title}
                    </h2>
                    <p 
                      style={{ 
                        color: "#cbd5e1", 
                        fontSize: "0.95rem", 
                        lineHeight: "1.7",
                        whiteSpace: "pre-wrap"
                      }} 
                      className="mb-3"
                    >
                      {post.body}
                    </p>

                    {/* Tag Pills */}
                    {Array.isArray(post.tags) && post.tags.length > 0 && (
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag, idx) => {
                          const cleanTag = tag.trim();
                          if (!cleanTag) return null;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedTag(cleanTag)}
                              className="tag-pill border-0 text-decoration-none"
                              style={{ cursor: "pointer" }}
                              title={`Filter by #${cleanTag}`}
                            >
                              <FiTag size={11} className="me-1" />
                              {cleanTag}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Interaction Toolbar: Like, Copy, & Matched Comments Indicator */}
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-2 border-top border-secondary border-opacity-25">
                      <div className="d-flex align-items-center gap-2">
                        {/* Like / Upvote Button */}
                        <button
                          type="button"
                          onClick={() => toggleLike(post)}
                          className="btn btn-sm d-inline-flex align-items-center gap-1.5 py-1 px-2.5"
                          style={{
                            background: postLikes.liked ? "rgba(244, 63, 94, 0.15)" : "rgba(255, 255, 255, 0.05)",
                            border: postLikes.liked ? "1px solid rgba(244, 63, 94, 0.4)" : "1px solid rgba(255, 255, 255, 0.08)",
                            color: postLikes.liked ? "#fb7185" : "#94a3b8",
                            borderRadius: "8px",
                            fontSize: "0.8rem",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <FiHeart size={13} fill={postLikes.liked ? "#fb7185" : "none"} />
                          <span>{postLikes.count > 0 ? postLikes.count : "Helpful"}</span>
                        </button>

                        {/* Copy Post Content Button */}
                        <button
                          type="button"
                          onClick={() => copyContent(`${post.title}\n\n${post.body}`)}
                          className="btn btn-sm d-inline-flex align-items-center gap-1 py-1 px-2 text-muted"
                          style={{ fontSize: "0.78rem" }}
                          title="Copy discussion text"
                        >
                          <FiCopy size={12} />
                          <span>Copy</span>
                        </button>
                      </div>

                      {/* Comment Match Badge (When search term matched a specific comment) */}
                      {commentMatches > 0 && (
                        <span 
                          className="badge d-inline-flex align-items-center gap-1"
                          style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", fontSize: "0.75rem", padding: "4px 8px" }}
                        >
                          <FiSearch size={11} /> Matched in {commentMatches} {commentMatches === 1 ? "comment" : "comments"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Comment Reply Form & List with search pass-through */}
                  <div className="pt-2">
                    <Post postId={post._id} />
                    <Comment 
                      id={post._id} 
                      defaultOpen={isSharedTarget || commentMatches > 0} 
                      searchQuery={searchTerm}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default ViewPost;
