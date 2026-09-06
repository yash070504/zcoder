import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetUserQuery } from "./userApiSlice";
import Edit from "./Edit";
import Navbar from "../../components/Navbar";

function EditUserForm() {
  const { username } = useParams();
  const navigate = useNavigate();

  const token = useSelector((state) => state?.auth?.token) || localStorage.getItem("zcoder_token");
  const storedUser = useSelector((state) => state?.idUsername?.username) || localStorage.getItem("zcoder_username");

  useEffect(() => {
    if (!token && !storedUser) {
      navigate("/login", { replace: true });
    }
  }, [token, storedUser, navigate]);

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUserQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    skip: !token && !storedUser,
  });

  useEffect(() => {
    if (isError && (error?.status === 401 || error?.status === 403)) {
      navigate("/login", { replace: true });
    }
  }, [isError, error, navigate]);

  if (!token && !storedUser) {
    return null;
  }

  if (isError && (error?.status === 401 || error?.status === 403)) {
    return null;
  }

  let id = "";
  let targetUser = null;
  if (isSuccess && users) {
    const { ids, entities } = users;
    ids.forEach((userId) => {
      if (entities[userId]?.username === username) {
        id = userId;
        targetUser = entities[userId];
      }
    });
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main className="page-container flex-grow-1" style={{ maxWidth: "720px" }}>
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Loading profile settings...</p>
          </div>
        ) : (
          <Edit id={id} currentUsername={username} initialUser={targetUser} />
        )}
      </main>
    </div>
  );
}

export default EditUserForm;
