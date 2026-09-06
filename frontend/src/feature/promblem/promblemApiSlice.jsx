import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../../app/api/apiSlice";

//It orginzed the data in Normalized Way {
//  it orgainze in id and enetities
//}
const promblemAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

//it have
const initialState = promblemAdapter.getInitialState();

export const promblemApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPromblem: builder.query({
      query: () => "/promblem",
      transformResponse: (responseData) => {
        const loadedPromblem = responseData.map((promblem) => {
          promblem.id = promblem._id;
          return promblem;
        });
        return promblemAdapter.setAll(initialState, loadedPromblem);
      },
      providesTags: ["Promblem"],
    }),

    addNewPromblem: builder.mutation({
      query: (initialPromblemData) => ({
        url: "/promblem",
        method: "POST",
        body: {
          ...initialPromblemData,
        },
      }),

      invalidatesTags: ["Promblem"],
    }),
    updatePromblem: builder.mutation({
      query: (initialPromblemData) => ({
        url: "/promblem",
        method: "PATCH",
        body: {
          ...initialPromblemData,
        },
      }),
      //arg giving the id
      invalidatesTags: ["Promblem"],
    }),
    deletePromblem: builder.mutation({
      query: ({ id }) => ({
        url: `/promblem`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["Promblem"],
    }),
  }),
});

export const {
  useGetPromblemQuery,
  useAddNewPromblemMutation,
  useUpdatePromblemMutation,
  useDeletePromblemMutation,
} = promblemApiSlice;

export const selectPromblemResult =
  promblemApiSlice.endpoints.getPromblem.select();

const selectPromblemData = createSelector(
  selectPromblemResult,
  (promblemData) => promblemData.data
);

export const {
  selectAll: selectAllPromblem,
  selectById: selectPromblemById,
  selectIds: selectPromblemIds,
} = promblemAdapter.getSelectors(
  (state) => selectPromblemData(state) ?? initialState
);
