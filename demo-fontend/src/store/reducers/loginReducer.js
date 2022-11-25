import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  user: {},
  isAuth: false,
  loginInProgress: false,
  errorLogin: null,
};

if (
  !!localStorage.getItem("user") &&
  !!Object.keys(localStorage.getItem("user")).length
) {
  initialState.user = JSON.parse(localStorage.getItem("user"));
  initialState.isAuth = true;
}

if (localStorage.getItem("token")) {
  initialState.token = localStorage.getItem("token");
}

const loginReducer = createSlice({
  name: "userLogin",
  initialState,
  reducers: {
    SIGN_IN_REQUEST(state) {
      state.loginInProgress = true;
      state.isAuth = false;
    },
    SIGN_IN_SUCCESS(state, action) {
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuth = true;
      state.loginInProgress = false;
    },
    SIGN_IN_ERROR(state) {
      state.loginInProgress = false;
      state.isAuth = false;
    },
    LOGOUT_REQUEST(state) {
      state.loginInProgress = true;
    },
    LOGOUT_SUCCESS(state) {
      state.isAuth = false;
      state.loginInProgress = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      state.user = {};
      state.token = null;
    },
    logoutReducer(state) {
      state.isAuth = false;
      state.user = {};
      state.token = "";
    },
  },
});

export const loginActions = loginReducer.actions;
export default loginReducer.reducer;
