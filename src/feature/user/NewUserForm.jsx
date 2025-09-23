import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  useAddNewUserMutation,
  selectUserById,
  selectAllUsers,
} from "./userApiSlice";
import { useSelector } from "react-redux";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../components/Navbar";

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
      toast("Created !");
      navigate("/login");
    }
  }, [isSuccess, navigate, isError]);

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
      <Navbar></Navbar>
      <form className="row g-3 newuser-form">
        <div className="col-md-6">
          <label className="form-label">Username</label>
          <input
            type="text"
            onChange={(e) => onUsernameChanged(e)}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Password</label>
          <input type="text" onChange={(e) => onPasswordChanged(e)} />
        </div>

        <div className="col-12">
          <label className="form-label">Email</label>
          <input type="text" onChange={(e) => onEmailChanged(e)} />
        </div>

        <div className="col-12">
          <label className="form-label">Profile-URL</label>
          <input type="url" onChange={(e) => onProfileUrlChanged(e)} />
        </div>
        <center>
          <button
            type="submit"
            className="btn btn-success"
            onClick={(e) => {
              handleSubmit(e);
            }}
            style={{ width: "88px" }}
          >
            Create
          </button>
        </center>

        <ToastContainer />
      </form>
    </>
  );
}

export default NewUserForm;
