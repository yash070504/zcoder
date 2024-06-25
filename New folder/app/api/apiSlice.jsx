import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3500/",
  credentials: "include",
  prepareHeaders: (header, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      header.set("authorization", `Bearer ${token}`);
    }
    return header;
  },
});

//baseQuery: fetchBaseQuery({
/// baseUrl: "http://localhost:3500",
//}),
export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User", "Promblem"],
  endpoints: (builder) => ({}),
});
