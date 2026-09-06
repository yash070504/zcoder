// ═══════════════════════════════════════════════════════════
// main.jsx — The ROOT entry point of the React frontend
// This is the first file React runs. It sets up:
//   - Redux store (global state management)
//   - Chakra UI (component library for modals, buttons, etc.)
//   - React Router (all page routes / URL navigation)
//   - React.StrictMode (catches common mistakes during development)
// ═══════════════════════════════════════════════════════════

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS for basic layout utilities
import "./index.css";                          // Our custom global CSS styles
import ReactDOM from "react-dom/client";
import App from "./App.jsx";                  // Root component that wraps all pages

// React Router — handles URL-based navigation without page reloads
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";

// Redux — global state management
import { Provider, useSelector } from "react-redux";

// ── Page/Feature Components ──────────────────────────────────
// Each page in the app maps to one of these components
import Intro from "./components/Intro.jsx";               // Landing page (/)
import Login from "./components/Login.jsx";               // Login page
import NewUserForm from "./feature/user/NewUserForm.jsx"; // Registration page
import { store } from "./app/store.jsx";                  // Redux store
import Dash from "./components/Dash.jsx";                 // Dashboard page after login
import EditUserForm from "./feature/user/EditUserForm.jsx"; // Profile edit form
import ViewPromblem from "./feature/promblem/ViewPromblem.jsx"; // View coding problems list
import NewPromblem from "./feature/promblem/NewPromblem.jsx";   // Create new problem
import Calender from "./feature/Calender/Calender.jsx";  // Contest calendar page
import ViewPost from "./feature/community/ViewPost.jsx"; // Community posts feed
import NewFormPost from "./feature/community/NewFormPost.jsx"; // Create/edit community post
import { ChakraProvider } from "@chakra-ui/react";        // UI component library provider
import theme from "./theme.jsx";                          // Custom Chakra UI theme config
import CodingEditor from "./feature/coding/CodingEditor.jsx"; // Online code editor
import ProfileView from "./feature/user/ProfileView.jsx"; // Public user profile view
import { disableReactDevTools } from "@fvilers/disable-react-devtools"; // Hides React DevTools in production

// Disable React DevTools in production for security (users can't inspect component state)
if (process.env.NODE_ENV === "production") disableReactDevTools();

// ── Smart Redirect Component ──────────────────────────────────
// HomeRedirect checks if the user is already logged in
// If logged in → redirect to their dashboard
// If not logged in → redirect to the landing page (/)
function HomeRedirect() {
  const username = useSelector((state) => state?.idUsername?.username) || localStorage.getItem("zcoder_username");
  const token = useSelector((state) => state?.auth?.token) || localStorage.getItem("zcoder_token");

  if (username && token) {
    return <Navigate to={`/dash/${username}`} replace />; // Go to user's personal dashboard
  }
  return <Navigate to="/" replace />; // Not logged in → show landing page
}

// ── App Routes ────────────────────────────────────────────────
// createBrowserRouter defines all URL → Component mappings
// All routes are CHILDREN of App.jsx (which renders Navbar + footer)
const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>, // App wraps all pages with shared layout (navbar, etc.)
    children: [
      { path: "/", element: <Intro></Intro> },                         // Landing page
      { path: "/home", element: <HomeRedirect /> },                    // Smart redirect
      { path: "/dash", element: <HomeRedirect /> },                    // Smart redirect
      { path: "/login", element: <Login></Login> },                    // Login form
      { path: "/create", element: <NewUserForm /> },                   // Register new user
      { path: "/dash/:username", element: <Dash /> },                  // Personal dashboard
      { path: "/user/profile/:username", element: <ProfileView /> },   // Profile view
      { path: "/profile/:username", element: <ProfileView /> },        // Alias for profile
      { path: "/community", element: <ViewPost /> },                   // Community feed
      { path: "/community/:id", element: <ViewPost /> },               // Single post view
      { path: "/community/new", element: <NewFormPost /> },            // Create post
      { path: "/community/new/:id", element: <NewFormPost /> },        // Edit post
      { path: "/user/edit/:username", element: <EditUserForm /> },     // Edit profile
      { path: "/promblem/view/:username", element: <ViewPromblem /> }, // View problems
      { path: "/promblem/new/:id", element: <NewPromblem /> },         // Create problem
      { path: "/code", element: <CodingEditor /> },                    // Online code editor
      { path: "/calender", element: <Calender /> },                    // Contest calendar
      { path: "/community/new/:id", element: <NewFormPost /> },        // Duplicate (safe)
      { path: "*", element: <HomeRedirect /> },                        // Catch-all → smart redirect
    ],
  },
]);

// ── Render the App ────────────────────────────────────────────
// Renders into the <div id="root"> in index.html
// Wrapped in:
//   React.StrictMode → extra warnings/checks in development
//   Provider → makes Redux store available to all components
//   ChakraProvider → makes Chakra UI components available everywhere
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);
