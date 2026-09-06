import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { 
  FiUser, 
  FiMail, 
  FiShield, 
  FiSettings, 
  FiCode, 
  FiBookOpen, 
  FiUsers, 
  FiArrowLeft, 
  FiAward, 
  FiCheckCircle,
  FiTerminal,
  FiCalendar,
  FiCpu
} from "react-icons/fi";
import NavbarG from "../../components/NavbarG";
import { NavAvatar } from "../../components/Navbar";
import { DEFAULT_AVATARS } from "../../constants";
import { useGetUserQuery } from "./userApiSlice";

export default function ProfileView() {
  const navigate = useNavigate();
  const { username: paramUsername } = useParams();
  const { id = "", username: storeUsername = "", profileUrl = "" } = useSelector((state) => state?.idUsername || {});

  const token = useSelector((state) => state?.auth?.token) || localStorage.getItem("zcoder_token");
  const storedUser = useSelector((state) => state?.idUsername?.username) || localStorage.getItem("zcoder_username");

  useEffect(() => {
    if (!token && !storedUser) {
      navigate("/login", { replace: true });
    }
  }, [token, storedUser, navigate]);
  
  const displayUsername = paramUsername || storeUsername || "Coder";

  const { data: usersData } = useGetUserQuery(undefined, {
    skip: !token && !storedUser,
    pollingInterval: 20000,
  });

  let fetchedProfileUrl = "";
  if (usersData) {
    const { ids, entities } = usersData;
    const matchedId = ids.find((uid) => entities[uid]?.username === displayUsername);
    if (matchedId) {
      fetchedProfileUrl = entities[matchedId]?.profileUrl;
    }
  }

  const rawAvatar = fetchedProfileUrl || (displayUsername === storeUsername ? profileUrl : "") || DEFAULT_AVATARS[0].url;
  const activeAvatar = (!rawAvatar || rawAvatar.includes("flaticon")) ? DEFAULT_AVATARS[0].url : rawAvatar;

  if (!token && !storedUser) {
    return null;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarG>
        <Link 
          to={displayUsername ? `/user/edit/${displayUsername}` : "/login"} 
          className="btn-premium py-2 px-3"
          style={{ fontSize: "0.86rem" }}
        >
          <FiSettings size={15} />
          <span>Edit Profile</span>
        </Link>
      </NavbarG>

      <main className="page-container flex-grow-1">
        {/* Navigation back */}
        <button
          onClick={() => navigate(`/dash/${displayUsername}`)}
          className="btn-outline-glass py-2 px-3 mb-4 d-inline-flex align-items-center gap-2"
          style={{ fontSize: "0.85rem", borderRadius: "10px" }}
        >
          <FiArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        {/* Profile Hero Header Card */}
        <div className="glass-card p-4 p-md-5 mb-4 position-relative overflow-hidden" style={{ borderRadius: "24px" }}>
          <div 
            style={{
              position: "absolute",
              top: "-60px",
              right: "-60px",
              width: "220px",
              height: "220px",
              background: "radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)",
              filter: "blur(30px)",
              pointerEvents: "none"
            }}
          ></div>

          <div className="row align-items-center g-4 position-relative z-2">
            <div className="col-md-auto text-center text-md-start">
              <div className="position-relative d-inline-block">
                <NavAvatar
                  url={activeAvatar}
                  name={displayUsername}
                  style={{
                    width: "110px",
                    height: "110px",
                    fontSize: "2.8rem",
                    border: "3px solid #6366f1",
                    boxShadow: "0 0 25px rgba(99, 102, 241, 0.5)"
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: "4px",
                    right: "4px",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: "#10b981",
                    border: "3px solid #0d121f",
                    boxShadow: "0 0 10px #10b981"
                  }}
                  title="Online Status: Active"
                ></span>
              </div>
            </div>

            <div className="col-md">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <h1 className="fs-2 fw-bold text-white mb-0">{displayUsername}</h1>
                <span className="badge-easy">Active Developer</span>
                <span 
                  style={{ 
                    fontSize: "0.78rem", 
                    color: "#a5b4fc", 
                    background: "rgba(99, 102, 241, 0.15)", 
                    padding: "3px 10px", 
                    borderRadius: "999px", 
                    border: "1px solid rgba(99, 102, 241, 0.3)" 
                  }}
                >
                  Rating: 1400+
                </span>
              </div>

              <p style={{ color: "#cbd5e1", fontSize: "0.98rem", maxWidth: "680px" }} className="mb-3">
                Welcome to your ZCoder profile. View your competitive problem-solving milestones, 
                code playground activity, and account credentials.
              </p>

              <div className="d-flex flex-wrap align-items-center gap-3 text-muted small">
                <span className="d-inline-flex align-items-center gap-1">
                  <FiUser size={14} style={{ color: "#818cf8" }} />
                  <strong style={{ color: "#f8fafc" }}>Handle:</strong> @{displayUsername}
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <FiShield size={14} style={{ color: "#34d399" }} />
                  <span style={{ color: "#cbd5e1" }}>Password: Protected & Encrypted</span>
                </span>
                <span className="d-inline-flex align-items-center gap-1">
                  <FiCheckCircle size={14} style={{ color: "#38bdf8" }} />
                  <span style={{ color: "#cbd5e1" }}>Verified Account</span>
                </span>
              </div>
            </div>

            <div className="col-md-auto text-center text-md-end">
              <Link 
                to={displayUsername ? `/user/edit/${displayUsername}` : "/login"} 
                className="btn-premium py-2 px-4"
              >
                <FiSettings size={16} />
                <span>Edit Profile</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Action Portals */}
        <div className="glass-card p-4 p-md-5">
          <h3 className="fs-5 fw-bold text-white mb-3">Quick Actions</h3>
          <div className="row g-3">
            <div className="col-md-4">
              <Link 
                to={displayUsername ? `/user/edit/${displayUsername}` : "/login"}
                className="d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none"
                style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", transition: "all 0.2s ease" }}
              >
                <div style={{ padding: "10px", borderRadius: "12px", background: "rgba(99, 102, 241, 0.15)", color: "#818cf8" }}>
                  <FiSettings size={22} />
                </div>
                <div>
                  <h5 className="fs-6 fw-bold text-white mb-0">Edit Profile & Avatar</h5>
                  <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>Update handle, password & icon</span>
                </div>
              </Link>
            </div>

            <div className="col-md-4">
              <Link 
                to="/code"
                className="d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none"
                style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", transition: "all 0.2s ease" }}
              >
                <div style={{ padding: "10px", borderRadius: "12px", background: "rgba(6, 182, 212, 0.15)", color: "#22d3ee" }}>
                  <FiCode size={22} />
                </div>
                <div>
                  <h5 className="fs-6 fw-bold text-white mb-0">Code Playground</h5>
                  <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>Launch the Monaco code editor</span>
                </div>
              </Link>
            </div>

            <div className="col-md-4">
              <Link 
                to={id ? `/promblem/view/${id}` : "/login"}
                className="d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none"
                style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", transition: "all 0.2s ease" }}
              >
                <div style={{ padding: "10px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.15)", color: "#34d399" }}>
                  <FiBookOpen size={22} />
                </div>
                <div>
                  <h5 className="fs-6 fw-bold text-white mb-0">Browse Challenges</h5>
                  <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>Solve algorithmic problems</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
