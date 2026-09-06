import { createSlice } from "@reduxjs/toolkit";

const getSavedItem = (key) => {
  try {
    return localStorage.getItem(key) || "";
  } catch (e) {
    return "";
  }
};

const idUsernameSlice = createSlice({
  name: "idUsername",
  initialState: { 
    id: getSavedItem("zcoder_id"), 
    username: getSavedItem("zcoder_username"),
    profileUrl: getSavedItem("zcoder_profileUrl")
  },
  reducers: {
    username: (state, action) => {
      state.username = action.payload || "";
      try {
        if (action.payload) {
          localStorage.setItem("zcoder_username", action.payload);
        } else {
          localStorage.removeItem("zcoder_username");
        }
      } catch (e) {
        console.warn("Storage error", e);
      }
    },
    id: (state, action) => {
      state.id = action.payload || "";
      try {
        if (action.payload) {
          localStorage.setItem("zcoder_id", action.payload);
        } else {
          localStorage.removeItem("zcoder_id");
        }
      } catch (e) {
        console.warn("Storage error", e);
      }
    },
    profileUrl: (state, action) => {
      state.profileUrl = action.payload || "";
      try {
        if (action.payload) {
          localStorage.setItem("zcoder_profileUrl", action.payload);
        } else {
          localStorage.removeItem("zcoder_profileUrl");
        }
      } catch (e) {
        console.warn("Storage error", e);
      }
    },
  },
});

export const idUsernameActions = idUsernameSlice.actions;

export default idUsernameSlice;
