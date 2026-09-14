// ─────────────────────────────────────────────────────────────
// apiSlice.jsx — The CENTRAL API configuration for the entire app
// This file sets up RTK Query, which handles all HTTP requests
// (GET, POST, PUT, DELETE) to the backend automatically.
// Every feature (user, posts, problems) extends this base slice.
// ─────────────────────────────────────────────────────────────

// createApi  → Creates the RTK Query API instance
// fetchBaseQuery → A simple fetch wrapper (like axios but built into Redux)
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// setCredentials → Redux action to save the new access token in Redux store
import { setCredentials } from "../../feature/auth/authSlice";

// ─────────────────────────────────────────────────────────────
// API_URL — Base URL of your backend
// Priority order:
//   1. VITE_API_URL env variable (set in Render/Vercel dashboard)
//   2. localhost:3500 → used when running locally (npm run dev)
//   3. Render URL → used in production build when no env var is set
// ─────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3500" : "https://zcoder-backend-o2ee.onrender.com");

// ─────────────────────────────────────────────────────────────
// baseQuery — The basic HTTP request setup
// - baseUrl: All API calls will be prefixed with this URL
//   e.g. "/user/123" → "https://zcoder-backend-o2ee.onrender.com/user/123"
// - credentials: "include" → Sends HTTP-only cookies (refresh token)
//   with every request (needed for authentication)
// - prepareHeaders → Runs before EVERY request to attach the JWT token
// ─────────────────────────────────────────────────────────────
const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include", // sends refresh token cookie automatically
  prepareHeaders: (header, { getState }) => {
    // Try to get token from Redux store first, then fallback to localStorage
    // getState()?.auth?.token → token stored in Redux after login
    // localStorage.getItem("zcoder_token") → token persisted across page refresh
    const token = getState()?.auth?.token || localStorage.getItem("zcoder_token");

    if (token) {
      // Attach the JWT access token to every request as a Bearer token
      // Backend's verifyJWT middleware checks this header
      header.set("authorization", `Bearer ${token}`);
    }
    return header;
  },
});

// ─────────────────────────────────────────────────────────────
// baseQueryWithReauth — Enhanced fetch with automatic token refresh
// Problem: JWT access tokens expire after a short time (e.g. 15 min)
// Solution: When the backend returns 403 (Forbidden / token expired):
//   1. Automatically call /auth/refresh to get a NEW access token
//      (using the http-only refresh cookie that was sent automatically)
//   2. Save the new token in Redux store
//   3. Retry the ORIGINAL failed request with the new token
// This means users NEVER get logged out unexpectedly!
// ─────────────────────────────────────────────────────────────
const baseQueryWithReauth = async (args, api, extraOptions) => {
  // Step 1: Try the original request
  let result = await baseQuery(args, api, extraOptions);

  // Step 2: If we get 403 (access token expired), try to refresh
  if (result?.error?.status === 403) {
    // Silently attempt refreshing the access token with the http-only refresh cookie
    const refreshResult = await baseQuery({ url: "/auth/refresh", method: "GET" }, api, extraOptions);
    if (refreshResult?.data?.accessToken) {
      const newAccessToken = refreshResult.data.accessToken;
      // Step 3: Save the new access token into Redux store
      api.dispatch(setCredentials({ accessToken: newAccessToken }));
      // Retry original query with the newly refreshed access token
      result = await baseQuery(args, api, extraOptions);
    }
    // If refresh also fails → user is truly logged out (refresh token also expired)
  }

  return result;
};

// ─────────────────────────────────────────────────────────────
// apiSlice — The main RTK Query API slice
// - baseQuery: Uses our enhanced query with auto token refresh
// - tagTypes: Used for automatic cache invalidation
//   e.g. when you create a Post, RTK Query auto-refetches the Post list
//   Tags used: "User", "Promblem" (typo for Problem), "Post", "Comment"
// - endpoints: Empty here — each feature adds its own endpoints
//   by calling apiSlice.injectEndpoints() in their own file
//   e.g. userApiSlice.jsx, communityApiSlice.jsx, etc.
// ─────────────────────────────────────────────────────────────
export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,   // all API calls go through auto-refresh
  tagTypes: ["User", "Promblem", "Post", "Comment"], // cache tags for auto-refetch
  endpoints: (builder) => ({}),     // features inject their endpoints separately
});

