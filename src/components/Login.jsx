import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { setCredentials } from "../feature/auth/authSlice";
import { useLoginMutation } from "../feature/auth/authApiSlice";
import "../styles/LoginCrazyDesign.css";
const Login = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isSuccess, isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, [isSuccess]);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      navigate(`/dash/${username}`);
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message);
      }
      errRef.current.focus();
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => {
    setPassword(e.target.value);
  };

  const errClass = errMsg ? "errmsg" : "offscreen";

  if (isLoading) return <p>Loading...</p>;

  const content = (
    <section className="public">
      <main className="login login-main">
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>

        <form className="form login-form login1-form" onSubmit={handleSubmit}>
          <center style={{ fontSize: "50px", fontWeight: "500" }}>Login</center>

          <label htmlFor="username">Username:</label>
          <input
            className="form__input"
            type="text"
            id="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            className="form__input"
            type="password"
            id="password"
            onChange={handlePwdInput}
            value={password}
            required
          />
          <button
            className="form__submit-button btn btn-primary"
            style={{
              backgroundColor: "Blue",
              width: "100px",
              height: "45px",
              fontSize: "15px",
              color: "whitesmoke",
            }}
          >
            Sign In
          </button>

          {/* <Link className="btn btn-danger" style={{ fontSize: "20px" }} to="/">
            Home
          </Link> */}

          <Link className="btn btn-create-account" to="/create">
            Create Account
          </Link>

          <label className="form__uo">
            <input
              type="checkbox"
              className="form__checkbox"
              id="uo"
              style={{ fontSize: "20px", paddingLeft: "10px" }}
            />
            Trust This Device
          </label>
        </form>
      </main>
    </section>
  );

  return content;
};
export default Login;
