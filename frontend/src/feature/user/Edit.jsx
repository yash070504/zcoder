import { useSelector, useDispatch } from "react-redux";
import { selectUserById } from "./userApiSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./userApiSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FiUser, 
  FiLock, 
  FiMail, 
  FiImage, 
  FiSave, 
  FiTrash2, 
  FiArrowLeft,
  FiCheckCircle,
  FiShield
} from "react-icons/fi";
import { DEFAULT_AVATARS } from "../../constants";
import { idUsernameActions } from "../../app/id";

function Edit({ id, currentUsername, initialUser }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userFromStore = useSelector((state) => selectUserById(state, id));
  const activeUser = initialUser || userFromStore;

  const getInitialAvatar = (url) => {
    if (!url || url.includes("flaticon")) return DEFAULT_AVATARS[0].url;
    return url;
  };

  const [username, setUsername] = useState(activeUser?.username || currentUsername || "");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(activeUser?.email || "");
  const [profileUrl, setProfileUrl] = useState(getInitialAvatar(activeUser?.profileUrl));

  const [updateUser, { isLoading: isUpdating, isSuccess: isUpdateSuccess }] = useUpdateUserMutation();
  const [deleteUser, { isSuccess: isDelSuccess, isLoading: isDeleting }] = useDeleteUserMutation();

  useEffect(() => {
    if (activeUser) {
      if (activeUser.username) setUsername(activeUser.username);
      if (activeUser.email) setEmail(activeUser.email);
      if (activeUser.profileUrl) setProfileUrl(getInitialAvatar(activeUser.profileUrl));
    }
  }, [activeUser]);

  useEffect(() => {
    if (isDelSuccess) {
      toast.success("Account deleted successfully.", { theme: "dark" });
      dispatch(idUsernameActions.username(""));
      dispatch(idUsernameActions.id(""));
      dispatch(idUsernameActions.profileUrl(""));
      localStorage.removeItem("zcoder_username");
      localStorage.removeItem("zcoder_id");
      localStorage.removeItem("zcoder_profileUrl");
      localStorage.removeItem("zcoder_token");
      navigate("/login");
    }
  }, [isDelSuccess, navigate, dispatch]);

  useEffect(() => {
    if (isUpdateSuccess) {
      toast.success("Profile updated successfully!", { theme: "dark" });
      dispatch(idUsernameActions.username(username));
      dispatch(idUsernameActions.profileUrl(profileUrl));
      navigate(`/dash/${username}`);
    }
  }, [isUpdateSuccess, username, profileUrl, navigate, dispatch]);

  const onHandleDelete = async () => {
    if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      const targetId = activeUser?._id || activeUser?.id || id;
      await deleteUser({ id: targetId });
    }
  };

  const onHandleEdit = async (e) => {
    e.preventDefault();
    const finalAvatar = getInitialAvatar(profileUrl);
    const userObject = { 
      id: activeUser?._id || activeUser?.id || id, 
      username: username.trim() || activeUser?.username || currentUsername, 
      email: email.trim() || activeUser?.email, 
      profileUrl: finalAvatar
    };

    if (password && password.trim()) {
      userObject.password = password.trim();
    }

    try {
      await updateUser(userObject).unwrap();
    } catch (err) {
      if (err?.status === 401) {
        toast.error("Session expired or unauthorized. Please re-login to save changes.", { theme: "dark" });
      } else {
        toast.error(err?.data?.message || "Failed to update profile", { theme: "dark" });
      }
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="btn-outline-glass py-2 px-3 mb-4 d-inline-flex align-items-center gap-2"
        style={{ fontSize: "0.85rem", borderRadius: "10px" }}
      >
        <FiArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </button>

      <div className="glass-card p-4 p-md-5 position-relative overflow-hidden" style={{ borderRadius: "24px" }}>
        {/* Profile Card Header */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-4 mb-4 border-bottom border-secondary border-opacity-25">
          <div className="d-flex align-items-center gap-3">
            <div className="position-relative">
              <img
                src={profileUrl || DEFAULT_AVATARS[0].url}
                alt="Profile Avatar"
                className="profile-avatar-large"
                onError={(e) => {
                  e.target.src = DEFAULT_AVATARS[0].url;
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
                  border: "2.5px solid #0d121f",
                  boxShadow: "0 0 8px #10b981"
                }}
                title="Active Profile"
              ></span>
            </div>

            <div>
              <h2 className="fs-3 fw-bold text-white mb-1">
                Profile <span className="gradient-text">Settings</span>
              </h2>
              <p 
                style={{ 
                  color: "#f8fafc", 
                  fontSize: "0.98rem", 
                  fontWeight: "500", 
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>✨</span>
                <span>Your personal space on ZCoder. Tweak your profile, switch your avatar, or refresh your password anytime.</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onHandleDelete}
            disabled={isDeleting}
            className="btn-danger-action"
            title="Permanently Delete Account"
          >
            <FiTrash2 size={16} />
            <span>{isDeleting ? "Deleting..." : "Delete Account"}</span>
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={onHandleEdit} className="d-flex flex-column gap-4">
          {/* Username Field */}
          <div>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label mb-0">Username</label>
              <span className="field-helper-text">Your handle across ZCoder</span>
            </div>
            <div className="input-group-custom">
              <span className="input-icon"><FiUser size={18} /></span>
              <input
                type="text"
                className="input-field"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Email Address Field */}
          <div>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label mb-0">Email Address</label>
              <span className="field-helper-text">Used for account notifications & recovery</span>
            </div>
            <div className="input-group-custom">
              <span className="input-icon"><FiMail size={18} /></span>
              <input
                type="email"
                className="input-field"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label mb-0">New Password</label>
              <span className="field-helper-text">Leave blank if you don't want to change it</span>
            </div>
            <div className="input-group-custom">
              <span className="input-icon"><FiLock size={18} /></span>
              <input
                type="password"
                placeholder="•••••••••••• (Leave blank to keep unchanged)"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Avatar Picker Section */}
          <div className="pt-2 border-top border-secondary border-opacity-25">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label mb-0">Choose an Avatar</label>
              <span style={{ fontSize: "0.82rem", color: "#38bdf8", fontWeight: "600" }}>Pick any of our 7 avatars</span>
            </div>
            
            <div className="d-flex flex-wrap gap-3 mb-3">
              {DEFAULT_AVATARS.map((av) => {
                const isSelected = profileUrl === av.url;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setProfileUrl(av.url)}
                    title={av.name}
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      padding: "3px",
                      background: isSelected ? "linear-gradient(135deg, #6366f1, #a855f7)" : "rgba(255, 255, 255, 0.05)",
                      border: isSelected ? "2.5px solid #6366f1" : "1px solid rgba(255, 255, 255, 0.14)",
                      boxShadow: isSelected ? "0 0 16px rgba(99, 102, 241, 0.65)" : "none",
                      cursor: "pointer",
                      transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
                      transform: isSelected ? "scale(1.08)" : "scale(1)",
                      outline: "none",
                      position: "relative"
                    }}
                  >
                    <img
                      src={av.url}
                      alt={av.name}
                      style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                    />
                    {isSelected && (
                      <div style={{
                        position: "absolute",
                        bottom: "-2px",
                        right: "-2px",
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        background: "#6366f1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid #0d121f"
                      }}>
                        <FiCheckCircle size={11} color="#fff" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <label className="form-label mb-1" style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
              Or Paste Custom Image URL
            </label>
            <div className="input-group-custom">
              <span className="input-icon"><FiImage size={18} /></span>
              <input
                type="url"
                placeholder="https://example.com/your-custom-photo.png"
                className="input-field"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-secondary border-opacity-25">
            <span style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
              Only fields you change will be updated.
            </span>

            <button
              type="submit"
              className="btn-premium py-2 px-4 d-inline-flex align-items-center gap-2"
              disabled={isUpdating}
              style={{ fontSize: "0.95rem", borderRadius: "12px" }}
            >
              {isUpdating ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <FiSave size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer position="top-center" autoClose={2500} theme="dark" />
    </div>
  );
}

export default Edit;
