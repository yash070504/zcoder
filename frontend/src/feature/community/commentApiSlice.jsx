import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../../app/api/apiSlice";

const commentAdapter = createEntityAdapter();

const initialState = commentAdapter.getInitialState();

export const commentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createComment: builder.mutation({
      query: (data) => ({
        url: "/post",
        method: "PUT",
        body: {
          ...data,
        },
      }),
      invalidatesTags: ["Comment", "Post"],
    }),
  }),
});

export const { useCreateCommentMutation } = commentApiSlice;
