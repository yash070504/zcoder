import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../feature/auth/authSlice";

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3500" : "https://zcoder-backend-o2ee.onrender.com");

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include",
  prepareHeaders: (header, { getState }) => {
    const token = getState()?.auth?.token || localStorage.getItem("zcoder_token");

    if (token) {
      header.set("authorization", `Bearer ${token}`);
    }
    return header;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
    // Silently attempt refreshing the access token with the http-only refresh cookie
    const refreshResult = await baseQuery({ url: "/auth/refresh", method: "GET" }, api, extraOptions);
    if (refreshResult?.data?.accessToken) {
      const newAccessToken = refreshResult.data.accessToken;
      api.dispatch(setCredentials({ accessToken: newAccessToken }));
      // Retry original query with the newly refreshed access token
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Promblem", "Post", "Comment"],
  endpoints: (builder) => ({}),
});

