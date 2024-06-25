import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  useAddNewUserMutation,
  selectUserById,
  selectAllUsers,
} from "./userApiSlice";
import { useSelector } from "react-redux";
const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;
function NewUserForm() {
  const navigate = useNavigate();
  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setEmail("");
      setProfileUrl("");
      navigate("/login");
    }
  }, [isSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ username, password, email, profileUrl });
    const user = await addNewUser({ username, password, email, profileUrl });
  };

  const onUsernameChanged = (e) => {
    setUsername(e.target.value);
  };
  const onPasswordChanged = (e) => {
    setPassword(e.target.value);
  };
  const onEmailChanged = (e) => {
    setEmail(e.target.value);
  };
  const onProfileUrlChanged = (e) => {
    setProfileUrl(e.target.value);
  };
  return (
    <>
      <form className="newUser-form">
        <div className="newUser-name">
          <label className="name-label">Username</label>
          <input type="text" onChange={(e) => onUsernameChanged(e)} />
        </div>

        <div className="newUser-pass">
          <label className="pass-label">Password</label>
          <input type="text" onChange={(e) => onPasswordChanged(e)} />
        </div>

        <div className="newUser-email">
          <label className="email-label">Email</label>
          <input type="text" onChange={(e) => onEmailChanged(e)} />
        </div>

        <div className="newUser-url">
          <label className="url-label">Profile-URL</label>
          <input type="url" onChange={(e) => onProfileUrlChanged(e)} />
        </div>

        <button type="submit" onClick={(e) => handleSubmit(e)}>
          Create
        </button>
      </form>
    </>
  );
}

export default NewUserForm;
