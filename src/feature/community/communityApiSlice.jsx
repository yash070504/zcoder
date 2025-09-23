import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../../app/api/apiSlice";

const postAdapter = createEntityAdapter();

const initialState = postAdapter.getInitialState();

export const postApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPost: builder.query({
      query: () => "/post",
      transformResponse: (data) => {
        const loadedPost = data.map((post) => {
          post.id = post._id;
          return post;
        });
        return postAdapter.setAll(initialState, loadedPost);
      },
      providesTags: ["Post"],
    }),
    createPost: builder.mutation({
      query: (data) => ({
        url: "/post",
        method: "POST",
        body: {
          ...data,
        },
      }),
      invalidatesTags: ["Post"],
    }),
    deletePost: builder.mutation({
      query: ({ id }) => ({
        url: "/post",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useGetAllPostQuery,
  useCreatePostMutation,
  useDeletePostMutation,
} = postApiSlice;

export const selectPostResult = postApiSlice.endpoints.getAllPost.select();

const selectPostsData = createSelector(selectPostResult, (posts) => posts.data);

export const {
  selectAll: selectAllPost,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postAdapter.getSelectors((state) => selectPostsData(state) ?? initialState);
