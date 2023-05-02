import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { forgotPassword } from "../types";

const initialState: forgotPassword = {
  isfetchingOtp: false,
  otpSet: null,
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
    errorReducer(state: forgotPassword) {
      state.error = "";
    },
    FETCHING_OTP_REQUEST(state: forgotPassword) {
      state.isfetchingOtp = true;
    },
    FETCHING_OTP_SUCCESS(state: forgotPassword, action: PayloadAction<any>) {
      state.isfetchingOtp = false;
      state.otpSet = action.payload;
    },
    FETCHING_OTP_ERROR(state: forgotPassword) {
      state.isfetchingOtp = false;
    },
    SENDING_OTP_REQUEST(state: forgotPassword) {
      state.isSendingOtp = true;
    },
    SENDING_OTP_SUCCESS(state: forgotPassword, action: PayloadAction<any>) {
      state.correctOtp = action.payload;
      state.isSendingOtp = false;
    },
    SENDING_OTP_ERROR(state: forgotPassword) {
      state.isSendingOtp = false;
      state.correctOtp = false;
    },
    RESET_PASSWORD_REQUEST(state: forgotPassword) {
      state.isResetPasswordInProgress = true;
    },
    RESET_PASSWORD_SUCCESS(state: forgotPassword) {
      state.isResetPasswordInProgress = false;
      state.resetPasswordSuccess = true;
      state.otpSet = null;
      state.correctOtp = false;
      localStorage.removeItem("resetPassEmail");
      localStorage.removeItem("contact");
    },
    RESET_PASSWORD_ERROR(state: forgotPassword) {
      state.isResetPasswordInProgress = false;
    },
    REMOVE_OTP_REQUEST(state: forgotPassword) {
      state.isremovingOtp = true;
      state.otpSet = null;
    },
    REMOVE_OTP_SUCCESS(state: forgotPassword) {
      state.isremovingOtp = false;
    },
  },
});

export const forgotPasswordActions = forgotPasswordReducer.actions;
export default forgotPasswordReducer.reducer;
