import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isfetchingOtp: false,
  otpSet: false,
  error: "",
  isSendingOtp: false,
  isResetPasswordInProgress: false,
  correctOtp: false,
  resetPasswordSuccess: false,
  isremovingOtp: false,
};

const forgotPasswordReducer = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    errorReducer(state) {
      state.error = "";
    },
    FETCHING_OTP_REQUEST(state) {
      state.isfetchingOtp = true;
    },
    FETCHING_OTP_SUCCESS(state, action) {
      state.isfetchingOtp = false;
      state.otpSet = action.payload;
    },
    FETCHING_OTP_ERROR(state, action) {
      state.isfetchingOtp = false;
    },
    SENDING_OTP_REQUEST(state) {
      state.isSendingOtp = true;
    },
    SENDING_OTP_SUCCESS(state, action) {
      state.correctOtp = action.payload;
      state.isSendingOtp = false;
    },
    SENDING_OTP_ERROR(state) {
      state.isSendingOtp = false;
      state.correctOtp = false;
    },
    RESET_PASSWORD_REQUEST(state) {
      state.isResetPasswordInProgress = true;
    },
    RESET_PASSWORD_SUCCESS(state) {
      state.isResetPasswordInProgress = false;
      state.resetPasswordSuccess = true;
      state.otpSet = false;
      state.correctOtp = false;
      localStorage.removeItem("resetPassEmail");
      localStorage.removeItem("contact");
    },
    RESET_PASSWORD_ERROR(state) {
      state.isResetPasswordInProgress = false;
    },
    REMOVE_OTP_REQUEST(state) {
      state.isremovingOtp = true;
      state.otpSet = false;
    },
    REMOVE_OTP_SUCCESS(state) {
      state.isremovingOtp = false;
    },
  },
});

export const forgotPasswordActions = forgotPasswordReducer.actions;
export default forgotPasswordReducer.reducer;
