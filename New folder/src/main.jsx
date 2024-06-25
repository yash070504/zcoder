import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Intro from "../components/Intro.jsx";
import Login from "../components/Login.jsx";
import NewUserForm from "../feature/user/NewUserForm.jsx";
import { Provider } from "react-redux";
import { store } from "../app/store.jsx";
import Dash from "../components/Dash.jsx";
import EditUserForm from "../feature/user/EditUserForm.jsx";
import ViewPromblem from "../feature/promblem/ViewPromblem.jsx";
import NewPromblem from "../feature/promblem/NewPromblem.jsx";
import Calender from "../feature/Calender/Calender.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      { path: "/", element: <Intro></Intro> },
      { path: "/login", element: <Login></Login> },
      { path: "/create", element: <NewUserForm /> },
      { path: "/dash/:username", element: <Dash /> },
      { path: "/user/edit/:username", element: <EditUserForm /> },
      { path: "/promblem/view/:username", element: <ViewPromblem /> },
      { path: "/promblem/new/:id", element: <NewPromblem /> },
      { path: "/calender", element: <Calender /> },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
      <App />
    </Provider>
  </React.StrictMode>
);
