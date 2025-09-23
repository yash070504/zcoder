import { Link, useParams } from "react-router-dom";
import {
  useGetUserQuery,
  selectAllUsers,
  selectUserIds,
  selectEntities,
} from "../feature/user/userApiSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Calender from "../feature/Calender/Calender";
import Footer from "./footer";
import { useDispatch, useSelector } from "react-redux";
import { idUsernameActions } from "../app/id";

function Dash() {
  const { username } = useParams();
  useEffect(() => {
    toast.success(`Welcome ! ${username} `, {
      position: "top-center",
      autoClose: 100,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    toast.info(`Please Wait !`, {
      position: "top-center",
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }, []);
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
  });

  const dispatch = useDispatch();

  let id = "";
  if (isSuccess) {
    const { ids, entities } = users;
    ids.map((ids) => {
      if (entities[ids].username == username) {
        id = ids;
      }
    });
  }

  const url = `/user/edit/${username}`;
  const url2 = `/promblem/view/${id}`;
  const url3 = `/promblem/new/${id}`;
  const url4 = `/community/${id}`;

  useEffect(() => {
    dispatch(idUsernameActions.username(username));
    dispatch(idUsernameActions.id(id));
  }, []);

  let content = (
    <>
      <div>
        <header>
          <Navbar username={username} id={id}></Navbar>
        </header>
        <main className="dash-calender">
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </main>
      </div>
      <Footer
        children={<Calender></Calender>}
        username={username}
        id={id}
      ></Footer>
    </>
  );

  return content;
}

export default Dash;
