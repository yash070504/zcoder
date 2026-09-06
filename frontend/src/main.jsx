import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import Intro from "./components/Intro.jsx";
import Login from "./components/Login.jsx";
import NewUserForm from "./feature/user/NewUserForm.jsx";
import { store } from "./app/store.jsx";
import Dash from "./components/Dash.jsx";
import EditUserForm from "./feature/user/EditUserForm.jsx";
import ViewPromblem from "./feature/promblem/ViewPromblem.jsx";
import NewPromblem from "./feature/promblem/NewPromblem.jsx";
import Calender from "./feature/Calender/Calender.jsx";
import ViewPost from "./feature/community/ViewPost.jsx";
import NewFormPost from "./feature/community/NewFormPost.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme.jsx";
import CodingEditor from "./feature/coding/CodingEditor.jsx";
import ProfileView from "./feature/user/ProfileView.jsx";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

if (process.env.NODE_ENV === "production") disableReactDevTools();

function HomeRedirect() {
  const username = useSelector((state) => state?.idUsername?.username) || localStorage.getItem("zcoder_username");
  const token = useSelector((state) => state?.auth?.token) || localStorage.getItem("zcoder_token");

  if (username && token) {
    return <Navigate to={`/dash/${username}`} replace />;
  }
  return <Navigate to="/" replace />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      { path: "/", element: <Intro></Intro> },
      { path: "/home", element: <HomeRedirect /> },
      { path: "/dash", element: <HomeRedirect /> },
      { path: "/login", element: <Login></Login> },
      { path: "/create", element: <NewUserForm /> },
      { path: "/dash/:username", element: <Dash /> },
      { path: "/user/profile/:username", element: <ProfileView /> },
      { path: "/profile/:username", element: <ProfileView /> },
      { path: "/community", element: <ViewPost /> },
      { path: "/community/:id", element: <ViewPost /> },
      { path: "/community/new", element: <NewFormPost /> },
      { path: "/community/new/:id", element: <NewFormPost /> },
      { path: "/user/edit/:username", element: <EditUserForm /> },
      { path: "/promblem/view/:username", element: <ViewPromblem /> },
      { path: "/promblem/new/:id", element: <NewPromblem /> },
      { path: "/code", element: <CodingEditor /> },
      { path: "/calender", element: <Calender /> },
      { path: "/community/new/:id", element: <NewFormPost /> },
      { path: "*", element: <HomeRedirect /> },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);
