import { Link, useNavigate } from "react-router-dom";
import { 
  FiCode, 
  FiTerminal, 
  FiCpu, 
  FiCalendar, 
  FiUsers, 
  FiArrowRight, 
  FiCheckCircle, 
  FiAward,
  FiZap,
  FiGithub,
  FiBookOpen
} from "react-icons/fi";
import { FaDiscord, FaXTwitter } from "react-icons/fa6";
import Navbar from "./Navbar";
import "../styles/Intro.css";

function Intro() {
  const navigate = useNavigate();

  return (
    <div className="intro-wrapper">
      <Navbar />

      {/* Hero Section */}
      <section className="intro-hero-section">
        <div className="hero-glow-sphere"></div>
        <div className="container position-relative z-2">
          <div className="row align-items-center gy-5">
            <div className="col-lg-7 text-center text-lg-start">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-4 rounded-pill hero-announcement">
                <span className="badge-pulse"></span>
                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#a5b4fc" }}>
                  ZCoder 2.0 is Live
                </span>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>|</span>
                <span style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>Codeforces Tracker & Monaco Editor</span>
              </div>

              <h1 className="hero-heading">
                Master Coding. <br />
                <span className="gradient-text">Conquer Every Problem.</span>
              </h1>

              <p className="hero-description">
                The modern competitive programming arena. Solve curated algorithm challenges, 
                collaborate in developer discussions, compile code in real-time, and track global contest schedules.
              </p>

              <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start gap-3 mt-4">
                <button 
                  className="btn-premium py-3 px-4" 
                  onClick={() => navigate("/login")}
                  style={{ fontSize: "1.05rem" }}
                >
                  <span>Start Coding Now</span>
                  <FiArrowRight size={20} />
                </button>
                <Link to="/code" className="btn-outline-glass py-3 px-4" style={{ fontSize: "1.02rem" }}>
                  <FiTerminal size={18} className="me-2" />
                  Try Code Editor
                </Link>
              </div>

              {/* Trust Metrics */}
              <div className="row g-3 mt-5 pt-3 border-top border-secondary border-opacity-25 text-start">
                <div className="col-4">
                  <div className="metric-number gradient-text">500+</div>
                  <div className="metric-label">Curated Problems</div>
                </div>
                <div className="col-4">
                  <div className="metric-number gradient-text-alt">Real-time</div>
                  <div className="metric-label">Code Execution</div>
                </div>
                <div className="col-4">
                  <div className="metric-number text-white">Live</div>
                  <div className="metric-label">Contest Calendar</div>
                </div>
              </div>
            </div>

            {/* Code Editor Teaser Preview */}
            <div className="col-lg-5">
              <div className="editor-mockup-card">
                <div className="editor-topbar">
                  <div className="window-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <div className="editor-tab">solution.cpp — ZCoder</div>
                  <div className="editor-lang-pill">C++ 20</div>
                </div>
                <div className="editor-content code-font">
                  <span className="code-comment">// Two Sum Optimal Solution</span><br />
                  <span className="code-keyword">vector</span>&lt;<span className="code-type">int</span>&gt; <span className="code-func">twoSum</span>(vector&lt;<span className="code-type">int</span>&gt;&amp; nums, <span className="code-type">int</span> target) &#123;<br />
                  &nbsp;&nbsp;<span className="code-type">unordered_map</span>&lt;<span className="code-type">int</span>, <span className="code-type">int</span>&gt; hash;<br />
                  &nbsp;&nbsp;<span className="code-keyword">for</span> (<span className="code-type">int</span> i = <span className="code-num">0</span>; i &lt; nums.size(); ++i) &#123;<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-type">int</span> comp = target - nums[i];<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-keyword">if</span> (hash.count(comp)) &#123;<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-keyword">return</span> &#123;hash[comp], i&#125;;<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;hash[nums[i]] = i;<br />
                  &nbsp;&nbsp;&#125;<br />
                  &nbsp;&nbsp;<span className="code-keyword">return</span> &#123;&#125;;<br />
                  &#125;
                </div>
                <div className="editor-status-bar">
                  <div className="d-flex align-items-center gap-2">
                    <span className="status-indicator"></span>
                    <span>Ready • 0 errors • O(N) Time</span>
                  </div>
                  <span className="badge-easy">Accepted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Pillars / Highlights Strip */}
      <section className="container my-5 position-relative z-2">
        <div className="row g-4">
          <div className="col-sm-6 col-lg-3">
            <div className="glass-card p-4 h-100" style={{ border: "1px solid rgba(99, 102, 241, 0.25)", transition: "all 0.25s ease" }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#94a3b8" }}>Algorithm Arena</span>
                <div style={{ padding: "8px", borderRadius: "10px", background: "rgba(99, 102, 241, 0.15)", color: "#818cf8" }}>
                  <FiBookOpen size={20} />
                </div>
              </div>
              <h3 className="fs-3 fw-bold text-white mb-1">500+</h3>
              <p style={{ color: "#cbd5e1", fontSize: "0.84rem" }} className="mb-0">
                Problems available to practice & solve
              </p>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="glass-card p-4 h-100" style={{ border: "1px solid rgba(6, 182, 212, 0.25)", transition: "all 0.25s ease" }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#94a3b8" }}>Code Execution</span>
                <div style={{ padding: "8px", borderRadius: "10px", background: "rgba(6, 182, 212, 0.15)", color: "#22d3ee" }}>
                  <FiTerminal size={20} />
                </div>
              </div>
              <h3 className="fs-3 fw-bold text-white mb-1">Node / Py / C++</h3>
              <p style={{ color: "#cbd5e1", fontSize: "0.84rem" }} className="mb-0">
                Real-time native execution engine
              </p>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="glass-card p-4 h-100" style={{ border: "1px solid rgba(245, 158, 11, 0.25)", transition: "all 0.25s ease" }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#94a3b8" }}>Contest Tracker</span>
                <div style={{ padding: "8px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}>
                  <FiCalendar size={20} />
                </div>
              </div>
              <h3 className="fs-3 fw-bold text-white mb-1">4 Platforms</h3>
              <p style={{ color: "#cbd5e1", fontSize: "0.84rem" }} className="mb-0">
                Codeforces, LeetCode, CodeChef, AtCoder
              </p>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="glass-card p-4 h-100" style={{ border: "1px solid rgba(168, 85, 247, 0.25)", transition: "all 0.25s ease" }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#94a3b8" }}>Community Hub</span>
                <div style={{ padding: "8px", borderRadius: "10px", background: "rgba(168, 85, 247, 0.15)", color: "#c084fc" }}>
                  <FiUsers size={20} />
                </div>
              </div>
              <h3 className="fs-3 fw-bold text-white mb-1">Discussions</h3>
              <p style={{ color: "#cbd5e1", fontSize: "0.84rem" }} className="mb-0">
                Share solutions, tips, and insights
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-5 my-4">
        <div className="text-center mb-5">
          <span className="badge-easy mb-2 d-inline-block">Full Suite</span>
          <h2 className="section-title">Engineered For Serious Coders</h2>
          <p className="section-subtitle">Everything you need to sharpen logic, build discipline, and level up.</p>
        </div>

        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <div className="feature-card glass-card h-100">
              <div className="feature-icon-wrapper" style={{ background: "rgba(99, 102, 241, 0.15)", color: "#818cf8" }}>
                <FiCode size={28} />
              </div>
              <h3 className="feature-title">Multi-Language Editor</h3>
              <p className="feature-text">
                Built-in Monaco code editor with syntax highlighting, indentation, and support for JavaScript, C++, Python, and Java.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="feature-card glass-card h-100">
              <div className="feature-icon-wrapper" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399" }}>
                <FiZap size={28} />
              </div>
              <h3 className="feature-title">Problem Tracker</h3>
              <p className="feature-text">
                Bookmark, categorize, and solve coding challenges with test cases, hints, and structured solutions.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="feature-card glass-card h-100">
              <div className="feature-icon-wrapper" style={{ background: "rgba(6, 182, 212, 0.15)", color: "#22d3ee" }}>
                <FiCalendar size={28} />
              </div>
              <h3 className="feature-title">Contest Calendar</h3>
              <p className="feature-text">
                Live automated integration with Codeforces and competitive coding platforms so you never miss a contest.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="feature-card glass-card h-100">
              <div className="feature-icon-wrapper" style={{ background: "rgba(244, 63, 94, 0.15)", color: "#fb7185" }}>
                <FiUsers size={28} />
              </div>
              <h3 className="feature-title">Developer Forum</h3>
              <p className="feature-text">
                Share insights, explain optimal algorithms, discuss interview questions, and give community feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="container my-5">
        <div className="cta-banner text-center">
          <div className="cta-glow"></div>
          <h2 className="cta-heading mb-3">Ready to sharpen your coding skills?</h2>
          <p className="cta-sub mb-4">Create your free account today and start solving problems on ZCoder.</p>
          <button 
            className="btn-premium py-3 px-5"
            onClick={() => navigate("/create")}
            style={{ fontSize: "1.1rem" }}
          >
            Create Your Account Now
          </button>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="intro-footer">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 border-top border-secondary border-opacity-25 pt-4">
            <div className="d-flex align-items-center gap-2">
              <div style={{
                width: "26px",
                height: "26px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <FiCode size={16} color="#fff" />
              </div>
              <span style={{ fontWeight: "700", color: "#f8fafc" }}>ZCoder Arena</span>
              <span style={{ color: "#64748b", fontSize: "0.85rem" }}>© {new Date().getFullYear()} All rights reserved.</span>
            </div>

            <div className="d-flex align-items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon-btn">
                <FiGithub size={18} />
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="social-icon-btn">
                <FaDiscord size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon-btn">
                <FaXTwitter size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Intro;
