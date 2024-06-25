import { useSelector } from "react-redux";
import { selectUserById } from "./userApiSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./userApiSlice";

function Edit({ id }) {
  const user = useSelector((state) => selectUserById(state, id));
  const [username, setUsername] = useState();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState();
  const [profileUrl, setProfileUrl] = useState();
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (isDelSuccess) {
      console.log("Delete is completed");
    }
  }, [isDelSuccess]);

  useEffect(() => {
    if (isSuccess) {
      console.log("Edit is completed");
    }
  }, [isSuccess]);

  const onHandleDelete = async () => {
    navigate("/login");
    await deleteUser({ id });
  };

  const onHandleUsername = (e) => {
    setUsername(e.target.value);
  };

  const onHandlePassword = (e) => {
    setPassword(e.target.value);
  };

  const onHandleEmail = (e) => {
    setEmail(e.target.value);
  };

  const onHandleProfileUrl = (e) => {
    setProfileUrl(e.target.value);
  };

  const onHandleEdit = async () => {
    const userObject = { id: user.id, username, password, email, profileUrl };
    navigate(`/dash/${username}`);
    await updateUser(userObject);
  };

  //console.log(user);
  return (
    <form action="">
      <button onClick={() => onHandleDelete()}>Delete</button>
      <label htmlFor="">Username</label>
      <input type="text" onChange={(e) => onHandleUsername(e)} />
      <label htmlFor="">Password</label>
      <input type="text" onChange={(e) => onHandlePassword(e)} />
      <label htmlFor="">Email</label>
      <input type="text" onChange={(e) => onHandleEmail(e)} />
      <label htmlFor="">ProfileUrl</label>
      <input type="text" onChange={(e) => onHandleProfileUrl(e)} />
      <button onClick={(e) => onHandleEdit(e)}>Edit</button>
    </form>
  );
}

export default Edit;
