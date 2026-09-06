import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../../app/api/apiSlice";
import { useReducer } from "react";

const userAdapter = createEntityAdapter({});
const initialState = userAdapter.getInitialState();

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "/user",
      transformResponse: (data) => {
        const loadedUser = data.map((user) => {
          user.id = user._id;
          return user;
        });
        return userAdapter.setAll(initialState, loadedUser);
      },
      providesTags: ["User"],
    }),
    addNewUser: builder.mutation({
      query: (data) => ({
        url: "/user",
        method: "POST",
        body: {
          ...data,
        },
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/user",
        method: "PATCH",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: "user",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;

export const selectUserResult = userApiSlice.endpoints.getUser.select();

//normailzed the data

const selectUsersData = createSelector(selectUserResult, (users) => users.data);

//detSelector give the selector
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  selectEntities,
} = userAdapter.getSelectors((state) => selectUsersData(state) ?? initialState);
