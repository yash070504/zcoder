import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectUserById } from "../feature/user/userApiSlice";
import { idUsernameActions } from "../app/id";
import { Link, useNavigate } from "react-router-dom";

export default function NavbarG({ children }) {
  const { id, username } = useSelector((store) => store.idUsername);
  const navigate = useNavigate();
  const url2 = `/promblem/view/${id}`;
  const url3 = `/promblem/new/${id}`;
  const url4 = `/community/${id}`;
  const onClickUse = () => {
    navigate(`/dash/${username}`);
  };

  return (
    <nav className="navbar navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasDarkNavbar"
          aria-controls="offcanvasDarkNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="offcanvas offcanvas-end text-bg-dark"
          tabindex="-1"
          id="offcanvasDarkNavbar"
          aria-labelledby="offcanvasDarkNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
              Menu
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <Link to={url2} className="nav-link">
                  View Promblem
                </Link>
              </li>

              <li className="nav-item">
                <Link to={url4} className="nav-link">
                  Community
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/code" className="nav-link">
                  CodeEditor
                </Link>
              </li>

              <li className="nav-item">
                <Link to={url3} className="nav-link">
                  Add Promblem
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <a
          className="navbar-brand"
          onClick={() => {
            onClickUse();
          }}
        >
          <img
            width="30"
            height="24"
            className="d-inline-block align-text-top dash-img"
            src="https://i.pinimg.com/originals/1c/54/f7/1c54f7b06d7723c21afc5035bf88a5ef.png"
            alt=""
          />
          ZCoder
        </a>

        <a>{children}</a>
      </div>
    </nav>
  );
}
