import axios from "axios";
import { forgotPasswordActions } from "../store/reducers/forgotPasswordReducer";
import { loginActions } from "../store/reducers/loginReducer";
import { toast } from "react-toastify";

const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

export function forgotPassword(user) {
  return async (dispatch) => {
    try {
      const url = `${baseUrl}/forgot-password`;
      dispatch(forgotPasswordActions.FETCHING_OTP_REQUEST());
      let response = await axios.patch(url, user);
      if (response.status === 201 || response.status === 200) {
        dispatch(forgotPasswordActions.FETCHING_OTP_SUCCESS(response.data));
        response?.data?.message &&
          toast.success(response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
      }
    } catch (err) {
      dispatch(forgotPasswordActions.FETCHING_OTP_ERROR());
      toast.error(err?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
}

export function sendOtpForCheck(data) {
  return async (dispatch) => {
    try {
      const url = `${baseUrl}/check-otp/${data.parameter}/${data.otp}/${data.isContact}`;
      dispatch(forgotPasswordActions.SENDING_OTP_REQUEST());
      let response = await axios.get(url);
      if (response.status === 201 || response.status === 200) {
        dispatch(
          forgotPasswordActions.SENDING_OTP_SUCCESS(response.data.isOtpCorrect)
        );
        response?.data?.message &&
          toast.error(response?.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
      } else {
        dispatch(forgotPasswordActions.SENDING_OTP_ERROR());
      }
    } catch (err) {
      dispatch(forgotPasswordActions.SENDING_OTP_ERROR());
      err?.response?.data?.message &&
        toast.error(err?.response?.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
    }
  };
}

export function resetPassword(data) {
  return async (dispatch) => {
    try {
      const url = `${baseUrl}/reset-password`;
      dispatch(forgotPasswordActions.RESET_PASSWORD_REQUEST());
      let response = await axios.patch(url, data);
      if (response.status === 201 || response.status === 200) {
        dispatch(forgotPasswordActions.RESET_PASSWORD_SUCCESS());
        dispatch(loginActions.SIGN_IN_SUCCESS(response.data));
      } else {
        dispatch(forgotPasswordActions.RESET_PASSWORD_ERROR());
      }
    } catch (err) {
      dispatch(forgotPasswordActions.RESET_PASSWORD_ERROR());
      err?.response?.data?.message &&
        toast.error(err?.response?.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
    }
  };
}

export function removeOtp(data) {
  return async (dispatch) => {
    try {
      const url = `${baseUrl}/remove-otp`;
      dispatch(forgotPasswordActions.REMOVE_OTP_REQUEST());
      let response = await axios.patch(url, data);
      if (response.status === 201 || response.status === 200) {
        dispatch(forgotPasswordActions.REMOVE_OTP_SUCCESS());
        response?.data?.message &&
          toast.error(response?.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
      }
    } catch (err) {
      dispatch(forgotPasswordActions.RESET_PASSWORD_ERROR());
    }
  };
}
