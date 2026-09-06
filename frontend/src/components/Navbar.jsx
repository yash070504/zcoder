import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FiHome, 
  FiCode, 
  FiBookOpen, 
  FiUsers, 
  FiPlusCircle, 
  FiLogOut, 
  FiUser, 
  FiSettings, 
  FiChevronDown, 
  FiMenu, 
  FiX,
  FiTerminal
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { useSendLogoutMutation } from "../feature/auth/authApiSlice";
import { logOut } from "../feature/auth/authSlice";
import { idUsernameActions } from "../app/id";
import { DEFAULT_AVATARS } from "../constants";
import { useGetUserQuery } from "../feature/user/userApiSlice";

export function NavAvatar({ url, name, sizeClass = "", style = {} }) {
  const initial = (name && name.charAt(0).toUpperCase()) || "Z";
  const defaultUrl = DEFAULT_AVATARS[0]?.url || "";
  const getSafeUrl = (rawUrl) => (!rawUrl || rawUrl.includes("flaticon")) ? defaultUrl : rawUrl;

  const [currentSrc, setCurrentSrc] = useState(() => getSafeUrl(url));
  const [hasError, setHasError] = useState(false);

  // Sync avatar immediately when url prop changes (e.g. after edit or server sync)
  useEffect(() => {
    const safe = getSafeUrl(url);
    setCurrentSrc(safe);
    setHasError(false);
  }, [url]);

  const handleImageError = () => {
    if (currentSrc !== defaultUrl && defaultUrl) {
      // Graceful fallback: switch to the default robot avatar first
      setCurrentSrc(defaultUrl);
    } else {
      // If even default fails, display the letter badge
      setHasError(true);
    }
  };

  return (
    <div className={`user-avatar-circle ${sizeClass}`} style={style}>
      {!hasError && currentSrc ? (
        <img
          key={currentSrc}
          src={currentSrc}
          alt={name || "User Avatar"}
          style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
          onError={handleImageError}
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}

function Navbar({ children }) {
  const { id = "", username = "", profileUrl = "" } = useSelector((store) => store?.idUsername || {});
  const token = useSelector((state) => state?.auth?.token) || localStorage.getItem("zcoder_token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sync profile data directly from server whenever authenticated
  const { data: usersData, isSuccess: isUsersSuccess } = useGetUserQuery(undefined, {
    skip: !username && !token,
    pollingInterval: 15000,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isUsersSuccess && usersData && username) {
      const { ids, entities } = usersData;
      const matchedId = ids.find((uid) => entities[uid]?.username === username);
      if (matchedId) {
        const userObj = entities[matchedId];
        const dbAvatar = (!userObj?.profileUrl || userObj.profileUrl.includes("flaticon"))
          ? DEFAULT_AVATARS[0].url
          : userObj.profileUrl;

        if (dbAvatar && dbAvatar !== profileUrl) {
          dispatch(idUsernameActions.profileUrl(dbAvatar));
        }
        if (matchedId && matchedId !== id) {
          dispatch(idUsernameActions.id(matchedId));
        }
      }
    }
  }, [isUsersSuccess, usersData, username, profileUrl, id, dispatch]);

  const [sendLogout, { isSuccess }] = useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) {
      dispatch(idUsernameActions.username(""));
      dispatch(idUsernameActions.id(""));
      dispatch(idUsernameActions.profileUrl(""));
      dispatch(logOut());
      localStorage.removeItem("zcoder_username");
      localStorage.removeItem("zcoder_id");
      localStorage.removeItem("zcoder_profileUrl");
      navigate("/");
    }
  }, [isSuccess, navigate, dispatch]);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    try {
      await sendLogout().unwrap();
    } catch (err) {
      console.warn("Logout error:", err);
      dispatch(idUsernameActions.username(""));
      dispatch(idUsernameActions.id(""));
      dispatch(idUsernameActions.profileUrl(""));
      dispatch(logOut());
      localStorage.removeItem("zcoder_username");
      localStorage.removeItem("zcoder_id");
      localStorage.removeItem("zcoder_profileUrl");
      navigate("/");
    }
  };

  const urlHome = username ? `/dash/${username}` : "/";
  const urlViewProfile = username ? `/user/profile/${username}` : "/login";
  const urlProblems = id ? `/promblem/view/${id}` : "/promblem/view/all";
  const urlCommunity = "/community";
  const urlCode = "/code";
  const urlAddProblem = id ? `/promblem/new/${id}` : "/promblem/new";
  const urlEditUser = username ? `/user/edit/${username}` : "/login";

  return (
    <header className="zcoder-header">
      <div className="zcoder-header-inner">
        {/* Left: Brand Logo */}
        <Link to={urlHome} className="navbar-brand-custom">
          <div className="brand-logo-icon">
            <FiCode size={20} color="#fff" />
          </div>
          <span className="brand-logo-text">
            Z<span className="brand-gradient-text">Coder</span>
          </span>
        </Link>

        {/* Center: Floating Nav Pills (Desktop) */}
        <nav className="d-none d-lg-flex">
          <div className="zcoder-nav-pills">
            <Link 
              to={urlHome} 
              className={`zcoder-nav-link ${location.pathname.startsWith('/dash') ? 'active' : ''}`}
            >
              <FiHome size={15} />
              <span>Home</span>
            </Link>

            <Link 
              to={urlProblems} 
              className={`zcoder-nav-link ${location.pathname.startsWith('/promblem/view') ? 'active' : ''}`}
            >
              <FiBookOpen size={15} />
              <span>Problems</span>
            </Link>

            <Link 
              to={urlCommunity} 
              className={`zcoder-nav-link ${location.pathname.startsWith('/community') ? 'active' : ''}`}
            >
              <FiUsers size={15} />
              <span>Community</span>
            </Link>

            <Link 
              to={urlCode} 
              className={`zcoder-nav-link ${location.pathname.startsWith('/code') ? 'active' : ''}`}
            >
              <FiTerminal size={15} />
              <span>Code Editor</span>
            </Link>

            <Link 
              to={urlAddProblem} 
              className={`zcoder-nav-link ${location.pathname.startsWith('/promblem/new') ? 'active' : ''}`}
            >
              <FiPlusCircle size={15} />
              <span>Add Problem</span>
            </Link>
          </div>
        </nav>

        {/* Right: Unified Single Profile Dropdown Button */}
        <div className="d-flex align-items-center gap-3">
          {children && <div className="d-none d-sm-block">{children}</div>}

          {username ? (
            <div className="user-dropdown-container" ref={dropdownRef}>
              <button
                type="button"
                className={`user-trigger-btn ${userDropdownOpen ? 'active' : ''}`}
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-expanded={userDropdownOpen}
                aria-label="User menu"
              >
                <NavAvatar url={profileUrl} name={username} />
                <span className="user-name-text">{username}</span>
                <FiChevronDown 
                  size={15} 
                  className={`chevron-icon ${userDropdownOpen ? 'rotate' : ''}`}
                />
              </button>

              {/* Glassmorphic Dropdown Menu */}
              {userDropdownOpen && (
                <div className="user-dropdown-menu">
                  {/* Account Header (Clickable to profile) */}
                  <Link 
                    to={urlViewProfile}
                    className="text-decoration-none"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="user-dropdown-header" style={{ cursor: "pointer", transition: "background 0.2s ease" }}>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <NavAvatar url={profileUrl} name={username} sizeClass="small" />
                        <div className="d-flex flex-column text-start overflow-hidden">
                          <span className="fw-bold text-white text-truncate" style={{ fontSize: "0.92rem" }}>
                            {username}
                          </span>
                          <span className="user-status-badge">
                            <span className="status-dot"></span> View Profile &rarr;
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Dropdown Menu Items */}
                  <div className="user-dropdown-list">
                    <Link 
                      to={urlViewProfile} 
                      className="user-dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="item-icon-wrap icon-indigo">
                        <FiUser size={15} />
                      </div>
                      <div className="item-text-wrap">
                        <span className="item-title">View Profile</span>
                        <span className="item-subtitle">Overview, streak & arena</span>
                      </div>
                    </Link>

                    <Link 
                      to={urlEditUser} 
                      className="user-dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="item-icon-wrap icon-sky">
                        <FiSettings size={15} />
                      </div>
                      <div className="item-text-wrap">
                        <span className="item-title">Edit Profile</span>
                        <span className="item-subtitle">Account settings & bio</span>
                      </div>
                    </Link>

                    <Link 
                      to={urlProblems} 
                      className="user-dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="item-icon-wrap icon-emerald">
                        <FiBookOpen size={15} />
                      </div>
                      <div className="item-text-wrap">
                        <span className="item-title">My Problems</span>
                        <span className="item-subtitle">Saved & solved questions</span>
                      </div>
                    </Link>
                  </div>

                  <div className="dropdown-divider"></div>

                  <button 
                    type="button" 
                    className="user-dropdown-item danger"
                    onClick={handleLogout}
                  >
                    <div className="item-icon-wrap icon-rose">
                      <FiLogOut size={15} />
                    </div>
                    <div className="item-text-wrap">
                      <span className="item-title">Log Out</span>
                      <span className="item-subtitle">Sign out of ZCoder</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login" 
              className="btn-premium py-2 px-3 d-inline-flex align-items-center gap-2" 
              style={{ fontSize: "0.85rem", borderRadius: "10px" }}
            >
              <FiUser size={14} />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="d-lg-none btn btn-link p-1 text-decoration-none mobile-toggle-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile navigation menu"
          >
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileOpen && (
        <div className="mobile-nav-overlay d-lg-none">
          <Link 
            to={urlHome} 
            className={`zcoder-nav-link py-2 ${location.pathname.startsWith('/dash') ? 'active' : ''}`}
          >
            <FiHome size={18} />
            <span>Home Dashboard</span>
          </Link>

          <Link 
            to={urlProblems} 
            className={`zcoder-nav-link py-2 ${location.pathname.startsWith('/promblem/view') ? 'active' : ''}`}
          >
            <FiBookOpen size={18} />
            <span>Browse Problems</span>
          </Link>

          <Link 
            to={urlCommunity} 
            className={`zcoder-nav-link py-2 ${location.pathname.startsWith('/community') ? 'active' : ''}`}
          >
            <FiUsers size={18} />
            <span>Community Forum</span>
          </Link>

          <Link 
            to={urlCode} 
            className={`zcoder-nav-link py-2 ${location.pathname.startsWith('/code') ? 'active' : ''}`}
          >
            <FiCode size={18} />
            <span>Monaco Code Editor</span>
          </Link>

          <Link 
            to={urlAddProblem} 
            className={`zcoder-nav-link py-2 ${location.pathname.startsWith('/promblem/new') ? 'active' : ''}`}
          >
            <FiPlusCircle size={18} />
            <span>Contribute Problem</span>
          </Link>

          {children && <div className="pt-2">{children}</div>}

          {username && (
            <div className="pt-3 mt-2 border-top border-secondary border-opacity-25 d-flex flex-column gap-2">
              <div className="d-flex justify-content-between align-items-center">
                <Link to={urlViewProfile} className="user-trigger-btn">
                  <NavAvatar url={profileUrl} name={username} sizeClass="small" />
                  <span>View Profile</span>
                </Link>

                <button 
                  onClick={handleLogout}
                  className="logout-icon-btn"
                >
                  <FiLogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>

              <Link to={urlEditUser} className="zcoder-nav-link py-1" style={{ fontSize: "0.85rem" }}>
                <FiSettings size={15} />
                <span>Edit Profile Settings</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
