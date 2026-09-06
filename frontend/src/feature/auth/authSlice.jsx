import { createSlice } from "@reduxjs/toolkit";

const getSavedToken = () => {
  try {
    return localStorage.getItem("zcoder_token") || null;
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: { 
    token: getSavedToken() 
  },
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken } = action.payload || {};
      state.token = accessToken || null;
      try {
        if (accessToken) {
          localStorage.setItem("zcoder_token", accessToken);
        } else {
          localStorage.removeItem("zcoder_token");
        }
      } catch (e) {
        console.warn("Error saving token to localStorage", e);
      }
    },
    logOut: (state) => {
      state.token = null;
      try {
        localStorage.removeItem("zcoder_token");
      } catch (e) {
        console.warn("Error removing token from localStorage", e);
      }
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;
