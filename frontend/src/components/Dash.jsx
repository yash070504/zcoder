import { Link, useParams, useNavigate } from "react-router-dom";
import { useGetUserQuery } from "../feature/user/userApiSlice";
import { useGetPromblemQuery } from "../feature/promblem/promblemApiSlice";
import { useGetAllPostQuery } from "../feature/community/communityApiSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import Navbar, { NavAvatar } from "./Navbar";
import Calender from "../feature/Calender/Calender";
import { useDispatch, useSelector } from "react-redux";
import { idUsernameActions } from "../app/id";
import { DEFAULT_AVATARS } from "../constants";
import { 
  FiCode, 
  FiBookOpen, 
  FiUsers, 
  FiPlusCircle, 
  FiArrowRight, 
  FiCheckCircle, 
  FiActivity,
  FiZap,
  FiAward,
  FiTrendingUp,
  FiPlay,
  FiCompass,
  FiTarget,
  FiTerminal
} from "react-icons/fi";

function Dash() {
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state?.auth?.token) || localStorage.getItem("zcoder_token");
  const storedUser = useSelector((state) => state?.idUsername?.username) || localStorage.getItem("zcoder_username");
  const storedProfileUrl = useSelector((state) => state?.idUsername?.profileUrl) || localStorage.getItem("zcoder_profileUrl");

  // 1. Redirect to /login if unauthenticated
  useEffect(() => {
    if (!token && !storedUser) {
      navigate("/login", { replace: true });
    }
  }, [token, storedUser, navigate]);

  const {
    data: users,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useGetUserQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    skip: !token && !storedUser,
  });

  // 2. Redirect to /login if backend returns 401 Unauthorized or 403 Forbidden
  useEffect(() => {
    if (isError && (error?.status === 401 || error?.status === 403)) {
      navigate("/login", { replace: true });
    }
  }, [isError, error, navigate]);

  // 3. Welcome notification only for authenticated sessions
  useEffect(() => {
    if (isSuccess && username && (token || storedUser)) {
      toast.success(`Welcome to your arena, ${username}!`, {
        position: "top-center",
        autoClose: 2500,
        theme: "dark",
      });
    }
  }, [isSuccess, username, token, storedUser]);

  let id = "";
  let userProfileUrl = "";
  if (isSuccess && users) {
    const { ids, entities } = users;
    ids.forEach((userId) => {
      if (entities[userId]?.username === username) {
        id = userId;
        userProfileUrl = entities[userId]?.profileUrl || "";
      }
    });
  }

  const activeAvatar = userProfileUrl || storedProfileUrl || DEFAULT_AVATARS[0].url;
  const safeAvatar = (!activeAvatar || activeAvatar.includes("flaticon")) ? DEFAULT_AVATARS[0].url : activeAvatar;

  useEffect(() => {
    if (username) dispatch(idUsernameActions.username(username));
    if (id) dispatch(idUsernameActions.id(id));
    if (isSuccess && userProfileUrl) {
      const resolved = (!userProfileUrl || userProfileUrl.includes("flaticon")) ? DEFAULT_AVATARS[0].url : userProfileUrl;
      dispatch(idUsernameActions.profileUrl(resolved));
    }
  }, [username, id, isSuccess, userProfileUrl, dispatch]);

  const urlProblems = id ? `/promblem/view/${id}` : "/login";
  const urlNewProblem = id ? `/promblem/new/${id}` : "/login";
  const urlCommunity = "/community";
  const urlCode = "/code";

  // Real-time problem and community data
  const { data: problemsData } = useGetPromblemQuery();
  const { data: postsData } = useGetAllPostQuery();

  const totalProblems = problemsData?.ids?.length || 0;
  const totalPosts = postsData?.length || 0;

  const firstProblemId = problemsData?.ids?.[0];
  const firstProblem = firstProblemId ? problemsData?.entities?.[firstProblemId] : null;

  const dailyProblem = firstProblem || {
    title: "Two Sum & Target Index",
    topic: "Arrays & Hash Table",
    difficulty: "Easy",
    description: "Find two numbers in an array that add up to target in optimal linear O(n) runtime."
  };

  // If unauthorized or redirecting, don't throw errors or render broken dashboard
  if (!token && !storedUser) {
    return null;
  }

  if (isError && (error?.status === 401 || error?.status === 403)) {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="page-container flex-grow-1">
        {/* Elite Arena Command Center */}
        <div className="glass-card p-4 p-md-5 mb-5 position-relative overflow-hidden" style={{ borderRadius: "24px" }}>
          {/* Ambient Cybernetic Glows */}
          <div style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "350px",
            height: "350px",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none"
          }}></div>
          <div style={{
            position: "absolute",
            bottom: "-60px",
            left: "10%",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none"
          }}></div>

          {/* Top HUD: Coder Profile & Dynamic Stats Header */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-4 border-bottom border-secondary border-opacity-25 position-relative z-2">
            <div className="d-flex align-items-center gap-3">
              <div className="position-relative">
                <NavAvatar
                  url={safeAvatar}
                  name={username}
                  style={{
                    width: "60px",
                    height: "60px",
                    fontSize: "1.5rem",
                    border: "2.5px solid #6366f1",
                    boxShadow: "0 0 20px rgba(99, 102, 241, 0.45)"
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    right: "2px",
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: "#10b981",
                    border: "2px solid #0d121f",
                    boxShadow: "0 0 8px #10b981"
                  }}
                  title="Online • Arena Ready"
                ></span>
              </div>
              <div>
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <h1 className="fs-3 fw-bold mb-0 text-white">
                    Welcome back, <span className="gradient-text">{username}</span>
                  </h1>
                  <span className="badge-easy" style={{ fontSize: "0.76rem" }}>
                    Level 5 Coder
                  </span>
                </div>
                <p style={{ color: "#94a3b8", fontSize: "0.92rem" }} className="mb-0 mt-1">
                  Ready to conquer today's algorithms and track global contests.
                </p>
              </div>
            </div>

            {/* Quick Live Stats Pills */}
            <div className="d-flex flex-wrap align-items-center gap-2">
              <div className="px-3 py-2 rounded-pill d-flex align-items-center gap-2" style={{ background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
                <span style={{ fontSize: "1.1rem" }}>🔥</span>
                <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#fbbf24" }}>5-Day Streak</span>
              </div>
              <div className="px-3 py-2 rounded-pill d-flex align-items-center gap-2" style={{ background: "rgba(99, 102, 241, 0.12)", border: "1px solid rgba(99, 102, 241, 0.3)" }}>
                <FiAward size={15} color="#818cf8" />
                <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#a5b4fc" }}>1,480 Elo</span>
              </div>
              <div className="px-3 py-2 rounded-pill d-flex align-items-center gap-2" style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                <span className="badge-pulse"></span>
                <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#34d399" }}>Arena Active</span>
              </div>
            </div>
          </div>

          {/* Main Command Center: Daily Challenge & Rapid Launchpad */}
          <div className="row g-4 position-relative z-2">
            {/* Left Column: Daily Challenge Quest */}
            <div className="col-lg-5">
              <div 
                className="p-4 rounded-4 h-100 d-flex flex-column justify-content-between" 
                style={{ 
                  background: "rgba(13, 20, 36, 0.85)", 
                  border: "1px solid rgba(99, 102, 241, 0.25)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
                  backdropFilter: "blur(12px)"
                }}
              >
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="d-inline-flex align-items-center gap-1.5 px-3 py-1 rounded-pill" style={{ background: "rgba(99, 102, 241, 0.18)", color: "#a5b4fc", fontSize: "0.8rem", fontWeight: "700" }}>
                      <FiZap size={14} /> Daily Challenge
                    </span>
                    <span className="badge-easy" style={{ fontSize: "0.78rem", padding: "4px 10px" }}>
                      +50 XP Quest
                    </span>
                  </div>

                  <h3 className="fs-4 fw-bold text-white mb-2" style={{ letterSpacing: "-0.01em" }}>
                    {dailyProblem.title || "Dynamic Array Sum"}
                  </h3>

                  <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: "1.6" }} className="mb-3">
                    {dailyProblem.description || "Write an optimal solution with minimum space and time complexity."}
                  </p>

                  <div className="d-flex flex-wrap gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded text-white-50" style={{ background: "rgba(255, 255, 255, 0.06)", fontSize: "0.78rem" }}>
                      🏷️ {dailyProblem.topic || "Algorithms"}
                    </span>
                    <span className="px-2.5 py-1 rounded fw-semibold" style={{ background: "rgba(6, 182, 212, 0.12)", color: "#22d3ee", fontSize: "0.78rem" }}>
                      ⚡ {dailyProblem.difficulty || "Medium"}
                    </span>
                    <span className="px-2.5 py-1 rounded text-white-50" style={{ background: "rgba(255, 255, 255, 0.06)", fontSize: "0.78rem" }}>
                      ⏱️ ~15 mins
                    </span>
                  </div>
                </div>

                <Link 
                  to={urlCode} 
                  className="btn-premium w-100 py-3 text-center mt-3 d-flex align-items-center justify-content-center gap-2"
                  style={{ fontSize: "0.92rem" }}
                >
                  <FiPlay size={16} />
                  <span>Solve in Playground</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Rapid Launchpad with generous gaps & cool card grid */}
            <div className="col-lg-7">
              <div 
                className="p-4 rounded-4 h-100 d-flex flex-column justify-content-between" 
                style={{ 
                  background: "rgba(13, 20, 36, 0.85)", 
                  border: "1px solid rgba(168, 85, 247, 0.25)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
                  backdropFilter: "blur(12px)"
                }}
              >
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-secondary border-opacity-25">
                    <span className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill" style={{ background: "rgba(168, 85, 247, 0.15)", color: "#c084fc", fontSize: "0.82rem", fontWeight: "700" }}>
                      <FiCompass size={15} /> Rapid Launchpad
                    </span>
                    <span className="text-white-50" style={{ fontSize: "0.8rem" }}>
                      {totalProblems} Problems • {totalPosts} Posts
                    </span>
                  </div>

                  {/* 2x2 spacious action grid with generous gaps and proper margins */}
                  <div className="row g-4 mt-1">
                    {/* Option 1: Problem Library */}
                    <div className="col-sm-6">
                      <Link 
                        to={urlProblems} 
                        className="launchpad-card text-decoration-none d-flex flex-column justify-content-between rounded-4 h-100"
                        style={{ 
                          background: "linear-gradient(145deg, rgba(99, 102, 241, 0.1) 0%, rgba(15, 23, 42, 0.6) 100%)", 
                          border: "1px solid rgba(99, 102, 241, 0.25)",
                          padding: "22px 24px",
                          borderRadius: "16px",
                          minHeight: "138px"
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: "16px" }}>
                          <div className="launchpad-icon-box" style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(99, 102, 241, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8", border: "1px solid rgba(99, 102, 241, 0.3)" }}>
                            <FiBookOpen size={20} />
                          </div>
                          <FiArrowRight size={17} color="#818cf8" className="launchpad-arrow" />
                        </div>
                        <div style={{ marginTop: "auto" }}>
                          <div className="fw-bold text-white mb-1" style={{ fontSize: "0.98rem" }}>Problem Library</div>
                          <div style={{ color: "#94a3b8", fontSize: "0.82rem", lineHeight: "1.4" }}>Filter by topic & solve arena challenges</div>
                        </div>
                      </Link>
                    </div>

                    {/* Option 2: Code Playground */}
                    <div className="col-sm-6">
                      <Link 
                        to={urlCode} 
                        className="launchpad-card text-decoration-none d-flex flex-column justify-content-between rounded-4 h-100"
                        style={{ 
                          background: "linear-gradient(145deg, rgba(6, 182, 212, 0.1) 0%, rgba(15, 23, 42, 0.6) 100%)", 
                          border: "1px solid rgba(6, 182, 212, 0.25)",
                          padding: "22px 24px",
                          borderRadius: "16px",
                          minHeight: "138px"
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: "16px" }}>
                          <div className="launchpad-icon-box" style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(6, 182, 212, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#22d3ee", border: "1px solid rgba(6, 182, 212, 0.3)" }}>
                            <FiCode size={20} />
                          </div>
                          <FiArrowRight size={17} color="#22d3ee" className="launchpad-arrow" />
                        </div>
                        <div style={{ marginTop: "auto" }}>
                          <div className="fw-bold text-white mb-1" style={{ fontSize: "0.98rem" }}>Code Playground</div>
                          <div style={{ color: "#94a3b8", fontSize: "0.82rem", lineHeight: "1.4" }}>Run JS, Python & C++ with live output</div>
                        </div>
                      </Link>
                    </div>

                    {/* Option 3: Community Forum */}
                    <div className="col-sm-6">
                      <Link 
                        to={urlCommunity} 
                        className="launchpad-card text-decoration-none d-flex flex-column justify-content-between rounded-4 h-100"
                        style={{ 
                          background: "linear-gradient(145deg, rgba(168, 85, 247, 0.1) 0%, rgba(15, 23, 42, 0.6) 100%)", 
                          border: "1px solid rgba(168, 85, 247, 0.25)",
                          padding: "22px 24px",
                          borderRadius: "16px",
                          minHeight: "138px"
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: "16px" }}>
                          <div className="launchpad-icon-box" style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(168, 85, 247, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c084fc", border: "1px solid rgba(168, 85, 247, 0.3)" }}>
                            <FiUsers size={20} />
                          </div>
                          <FiArrowRight size={17} color="#c084fc" className="launchpad-arrow" />
                        </div>
                        <div style={{ marginTop: "auto" }}>
                          <div className="fw-bold text-white mb-1" style={{ fontSize: "0.98rem" }}>Community Forum</div>
                          <div style={{ color: "#94a3b8", fontSize: "0.82rem", lineHeight: "1.4" }}>Live discussions, doubts & solutions</div>
                        </div>
                      </Link>
                    </div>

                    {/* Option 4: Contribute Problem */}
                    <div className="col-sm-6">
                      <Link 
                        to={urlNewProblem} 
                        className="launchpad-card text-decoration-none d-flex flex-column justify-content-between rounded-4 h-100"
                        style={{ 
                          background: "linear-gradient(145deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.6) 100%)", 
                          border: "1px solid rgba(16, 185, 129, 0.25)",
                          padding: "22px 24px",
                          borderRadius: "16px",
                          minHeight: "138px"
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: "16px" }}>
                          <div className="launchpad-icon-box" style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34d399", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                            <FiPlusCircle size={20} />
                          </div>
                          <FiArrowRight size={17} color="#34d399" className="launchpad-arrow" />
                        </div>
                        <div style={{ marginTop: "auto" }}>
                          <div className="fw-bold text-white mb-1" style={{ fontSize: "0.98rem" }}>Contribute Problem</div>
                          <div style={{ color: "#94a3b8", fontSize: "0.82rem", lineHeight: "1.4" }}>Post custom challenges & testcases</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contest & Streak Calendar Section */}
        <div className="glass-card p-4 p-md-5 mb-5">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
            <div>
              <h3 className="fs-4 fw-bold text-white mb-1">Contest Schedule</h3>
              <p style={{ color: "#cbd5e1", fontSize: "0.92rem" }} className="mb-0">
                Track upcoming rounds and register for competitions across Codeforces, LeetCode, CodeChef, and AtCoder.
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge-easy">Live Synced</span>
            </div>
          </div>

          <div className="w-100">
            <Calender />
          </div>
        </div>

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
      </main>

      {/* Modern Dashboard Footer */}
      <footer className="border-top border-secondary border-opacity-25 py-4 text-center text-muted small" style={{ background: "rgba(9, 13, 22, 0.9)" }}>
        <div className="container d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2">
          <span>&copy; {new Date().getFullYear()} ZCoder Arena • Developed for Competitive Coders</span>
          <span className="d-flex align-items-center gap-2">
            <span className="badge-pulse"></span> Backend Connected
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Dash;
