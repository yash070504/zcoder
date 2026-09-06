import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiArrowRight, FiCode, FiAlertCircle, FiCheck } from "react-icons/fi";

import { setCredentials } from "../feature/auth/authSlice";
import { useLoginMutation } from "../feature/auth/authApiSlice";
import { idUsernameActions } from "../app/id";
import "../styles/LoginCrazyDesign.css";

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isSuccess, isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current?.focus();
  }, [isSuccess]);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { accessToken } = await login({ username, password }).unwrap();
      if (accessToken) {
        try { 
          localStorage.setItem("zcoder_token", accessToken);
          localStorage.setItem("zcoder_username", username);
        } catch {}
      }
      dispatch(setCredentials({ accessToken }));
      dispatch(idUsernameActions.username(username));
      const targetUser = username;
      setUsername("");
      setPassword("");
      navigate(`/dash/${targetUser}`);
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response. Please verify backend is running.");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Invalid username or password");
      } else if (err.status === 503) {
        setErrMsg(err.data?.message || "Database is currently waking up, please wait a moment.");
      } else {
        setErrMsg(err.data?.message || "Authentication failed");
      }
      errRef.current?.focus();
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* Dynamic Background Glow Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="login-card-container">
        {/* Header Branding */}
        <div className="login-header text-center mb-4">
          <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none mb-3">
            <div className="login-logo-icon">
              <FiCode size={24} color="#fff" />
            </div>
            <span className="login-logo-text">
              Z<span className="text-accent">Coder</span>
            </span>
          </Link>
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to your competitive programming arena</p>
        </div>

        {/* Error Notification */}
        {errMsg && (
          <div ref={errRef} className="login-alert" aria-live="assertive">
            <FiAlertCircle size={18} className="flex-shrink-0" />
            <span>{errMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="form-group mb-3">
            <label className="form-label" htmlFor="username">Username</label>
            <div className="input-group-custom">
              <span className="input-icon">
                <FiUser size={18} />
              </span>
              <input
                className="input-field"
                type="text"
                id="username"
                ref={userRef}
                value={username}
                placeholder="Enter your username"
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label mb-0" htmlFor="password">Password</label>
            </div>
            <div className="input-group-custom">
              <span className="input-icon">
                <FiLock size={18} />
              </span>
              <input
                className="input-field"
                type="password"
                id="password"
                value={password}
                placeholder="••••••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Options Row */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <label className="custom-checkbox-label">
              <input
                type="checkbox"
                className="custom-checkbox-input"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="custom-checkbox-box">
                {rememberMe && <FiCheck size={12} color="#fff" />}
              </span>
              <span className="checkbox-text">Remember device</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="d-flex align-items-center justify-content-center gap-2">
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Authenticating...</span>
              </span>
            ) : (
              <span className="d-flex align-items-center justify-content-center gap-2">
                <span>Sign In to ZCoder</span>
                <FiArrowRight size={18} />
              </span>
            )}
          </button>
        </form>

        {/* Footer Navigation Links */}
        <div className="login-card-footer text-center mt-4 pt-3 border-top border-secondary border-opacity-25">
          <p className="footer-text mb-2">
            Don't have an account yet?{" "}
            <Link to="/create" className="footer-link">
              Create an account
            </Link>
          </p>
          <Link to="/" className="back-home-link">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
