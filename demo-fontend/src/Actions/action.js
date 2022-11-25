import axios from "axios";
import { loginActions } from "../store/reducers/loginReducer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

export function SignUpUser(user) {
  return async (dispatch) => {
    try {
      const url = `${baseUrl}/signup`;
      dispatch(loginActions.SIGN_IN_REQUEST());
      let response = await axios.post(url, user);
      if (response.status === 201 || response.status === 200) {
        dispatch(loginActions.SIGN_IN_SUCCESS(response.data));
      } else {
        dispatch(loginActions.SIGN_IN_ERROR());
      }
    } catch (err) {
      return toast.error(err?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
}

export function loginUser(user) {
  return async (dispatch) => {
    try {
      const url = `${baseUrl}/login`;
      dispatch(loginActions.SIGN_IN_REQUEST());
      const response = await axios.post(url, user);
      if (response.status === 201 || response.status === 200) {
        dispatch(loginActions.SIGN_IN_SUCCESS(response.data));
        toast.success("Successfully sign In!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        dispatch(loginActions.SIGN_IN_ERROR());
      }
    } catch (err) {
      dispatch(loginActions.SIGN_IN_ERROR());
      return toast.error(err?.response?.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
}

export function loginUserWithGoogle(data) {
  return async (dispatch) => {
    try {
      const url = `${baseUrl}/login/google`;
      dispatch(loginActions.SIGN_IN_REQUEST());
      let response = await axios.post(url, data);
      if (response.status === 201 || response.status === 200) {
        dispatch(loginActions.SIGN_IN_SUCCESS(response.data));
      } else {
        dispatch(loginActions.SIGN_IN_ERROR());
      }
    } catch (err) {
      dispatch(loginActions.SIGN_IN_ERROR());
      return toast.error(
        err?.response?.data?.message ||
          "Something went wrong please check inputs and try again",
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    }
  };
}

export function signUpUserWithGoogle(data) {
  return async (dispatch) => {
    try {
      const url = `${baseUrl}/signupwithGoogle`;
      dispatch(loginActions.SIGN_IN_REQUEST());
      let response = await axios.post(url, data);
      if (response.status === 201 || response.status === 200) {
        dispatch(loginActions.SIGN_IN_SUCCESS(response.data));
      } else {
        dispatch(loginActions.SIGN_IN_ERROR());
      }
    } catch (err) {
      dispatch(loginActions.SIGN_IN_ERROR());
      return toast.error(
        err?.response?.data?.message ||
          "Something went wrong please check inputs and try again",
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    }
  };
}
export function logoutUser() {
  return async (dispatch) => {
    try {
      const url = `${baseUrl}/logout`;
      dispatch(loginActions.LOGOUT_REQUEST());
      let response = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (response.status === 201 || response.status === 200) {
        dispatch(loginActions.LOGOUT_SUCCESS(response.data));
      } else {
        toast.error("Something went wrong please check inputs and try again", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (err) {
      return toast.error(
        err?.response?.data?.message ||
          "Something went wrong please check inputs and try again",
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    }
  };
}

export function updateUser(data) {
  return async (dispatch) => {
    try {
      const url = `${baseUrl}/update_user/${data.id}`;
      dispatch(loginActions.SIGN_IN_REQUEST());
      let response = await axios.patch(
        url,
        { data },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (response.status === 201 || response.status === 200) {
        dispatch(loginActions.LOGOUT_SUCCESS(response.data));
      } else {
        return toast.error(
          "Something went wrong please check inputs and try again",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      }
    } catch (err) {
      return toast.error(
        err?.response?.data?.message ||
          "Something went wrong please check inputs and try again",
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    }
  };
}
