import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAddNewUserMutation } from "./userApiSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/Navbar";
import { FiUser, FiLock, FiMail, FiImage, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { DEFAULT_AVATARS } from "../../constants";

function NewUserForm() {
  const navigate = useNavigate();
  const [addNewUser, { isLoading, isSuccess, isError, error }] = useAddNewUserMutation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [profileUrl, setProfileUrl] = useState(DEFAULT_AVATARS[0].url);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account created successfully! Redirecting to login...", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      setErrMsg(error?.data?.message || "Failed to create user account");
    }
  }, [isError, error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    try {
      await addNewUser({ username, password, email, profileUrl }).unwrap();
    } catch (err) {
      setErrMsg(err?.data?.message || "Error creating account. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-page-wrapper">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>

        <div className="login-card-container" style={{ maxWidth: "520px" }}>
          <div className="text-center mb-4">
            <span className="badge-medium mb-2 d-inline-block">Get Started Free</span>
            <h2 className="login-title">Create ZCoder Account</h2>
            <p className="login-subtitle">Join the developer arena, compete, and track your streaks</p>
          </div>

          {errMsg && (
            <div className="login-alert">
              <span>{errMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div className="form-group">
              <label className="form-label">Username *</label>
              <div className="input-group-custom">
                <span className="input-icon"><FiUser size={18} /></span>
                <input
                  type="text"
                  required
                  placeholder="e.g. devmaster"
                  className="input-field"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div className="input-group-custom">
                <span className="input-icon"><FiMail size={18} /></span>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <div className="input-group-custom">
                <span className="input-icon"><FiLock size={18} /></span>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label mb-2">
                Choose Profile Avatar <span style={{ color: "#64748b", fontWeight: "normal" }}>(or click one of 7 defaults)</span>
              </label>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {DEFAULT_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setProfileUrl(av.url)}
                    title={av.name}
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      padding: "2px",
                      background: profileUrl === av.url ? "linear-gradient(135deg, #6366f1, #a855f7)" : "rgba(255, 255, 255, 0.06)",
                      border: profileUrl === av.url ? "2px solid #6366f1" : "1px solid rgba(255, 255, 255, 0.15)",
                      boxShadow: profileUrl === av.url ? "0 0 14px rgba(99, 102, 241, 0.6)" : "none",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      outline: "none"
                    }}
                  >
                    <img
                      src={av.url}
                      alt={av.name}
                      style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                    />
                  </button>
                ))}
              </div>

              <div className="input-group-custom">
                <span className="input-icon"><FiImage size={18} /></span>
                <input
                  type="url"
                  placeholder="Or paste custom image URL..."
                  className="input-field"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="login-submit-btn mt-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Creating Account...</span>
              ) : (
                <span className="d-flex align-items-center justify-content-center gap-2">
                  <span>Register Account</span>
                  <FiArrowRight size={18} />
                </span>
              )}
            </button>
          </form>

          <div className="login-card-footer text-center mt-4 pt-3 border-top border-secondary border-opacity-25">
            <p className="footer-text mb-0">
              Already have an account?{" "}
              <Link to="/login" className="footer-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} theme="dark" />
    </>
  );
}

export default NewUserForm;
