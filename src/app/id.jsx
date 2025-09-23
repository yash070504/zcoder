import { createSlice } from "@reduxjs/toolkit";

const idUsernameSlice = createSlice({
  name: "idUsername",
  initialState: { id: "", username: "" },
  reducers: {
    username: (state, action) => {
      state.username = action.payload;
    },
    id: (state, action) => {
      state.id = action.payload;
    },
  },
});

export const idUsernameActions = idUsernameSlice.actions;

export default idUsernameSlice;
