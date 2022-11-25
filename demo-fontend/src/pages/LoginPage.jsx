import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, NavLink } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import OpenEye from "../components/OpenEye";
import CloseEye from "../components/CloseEye";
import LoadingBtn from "../components/LoadingBtn";
import { loginUserWithGoogle, loginUser } from "../Actions/action";

const LoginPage = (props) => {
  const dispatch = useDispatch();

  const { user, isAuth, loginInProgress } = useSelector(
    (state) => state.loginStore
  );
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errorEnable, setErrorEnable] = useState({
    email: false,
    password: false,
  });

  const [saveEnable, setSaveEnable] = useState(false);
  const [visiblePass, setVisiblePass] = useState(false);

  const onChangeText = (event) => {
    if (event.target.name === "email") {
      setValues((prevState) => {
        return { ...prevState, email: event.target.value.toLowerCase() };
      });
      if (
        /([a-zA-Z0-9]+)([\_\.\-{1}])?([a-zA-Z0-9]+)\@([a-zA-Z0-9]+)([\.])([a-zA-Z\.]+)/g.test(
          event.target.value
        )
      ) {
        setErrorEnable({ ...errorEnable, email: false });
      } else {
        setErrorEnable({ ...errorEnable, email: true });
      }
    } else if (event.target.name === "pass") {
      setValues((prevState) => {
        return { ...prevState, password: event.target.value };
      });
      if (
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{4,}$/.test(
          event.target.value
        )
      ) {
        setErrorEnable({ ...errorEnable, password: false });
      } else {
        setErrorEnable({ ...errorEnable, password: true });
      }
    }
  };

  const authWithGoogle = (res) => {
    dispatch(loginUserWithGoogle({ credential: res.access_token }));
  };

  const login = useGoogleLogin({
    onSuccess: (CodeResponse) => authWithGoogle(CodeResponse),
  });

  const loginSubmitHandler = (event) => {
    event?.preventDefault();
    dispatch(loginUser(values));
  };

  useEffect(() => {
    const areTrue = Object.values(errorEnable).every((value) => value !== true);
    const isNullish = Object.values(values).every((value) => value !== "");
    isNullish
      ? areTrue
        ? setSaveEnable(true)
        : setSaveEnable(false)
      : setSaveEnable(false);
  }, [errorEnable, values]);

  if (!!isAuth && !loginInProgress && user && Object.keys(user).length !== 0) {
    return <Navigate to={"/profile"} />;
  }

  return (
    <section className="h-screen">
      <ToastContainer />
      <div className="px-6 h-full text-gray-800">
        <div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
          <div className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="w-full"
              alt="Sample-image"
            />
          </div>
          <div className="xl:pl-20 xl:w-6/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
            <form onSubmit={loginSubmitHandler}>
              <div className="mb-6">
                <input
                  type="email"
                  name="email"
                  required
                  value={values.email.toLowerCase()}
                  onChange={onChangeText}
                  className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-800 bg-white bg-clip-padding border border-solid border-blue-500 rounded transition ease-in-out m-0 focus:text-gray-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="email"
                  placeholder="Email Address"
                />
                <p className="text-left text-red-500 text-basic italic pt-1 ">
                  {errorEnable.email && "Please write valid email!"}
                </p>
              </div>
              <div className="mb-6">
                <div className="relative">
                  <input
                    name="pass"
                    required
                    autoComplete="on"
                    type={visiblePass ? "text" : "password"}
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-800 bg-white bg-clip-padding border border-solid border-blue-500 rounded transition ease-in-out m-0 focus:text-gray-800 focus:bg-white focus:border-blue-600 focus:outline-none"
                    id="pass"
                    placeholder="Password"
                    value={values.password}
                    onChange={onChangeText}
                  />
                  <span
                    className="absolute inset-y-0 right-0 flex items-center pr-5 cursor-pointer"
                    onClick={() => setVisiblePass(!visiblePass)}
                  >
                    {visiblePass ? <OpenEye /> : <CloseEye />}
                  </span>
                </div>
                <p className="text-left text-red-500 text-basic italic pt-1">
                  {errorEnable.password &&
                    "Minimum eight characters, contains one letter, one number and one special character"}
                </p>
              </div>

              <div className="flex justify-end items-center mb-2">
                <NavLink to="/forgotpassword" className="text-gray-900">
                  <button type="button">Forgot password?</button>
                </NavLink>
              </div>

              <div className="text-center lg:text-left w-full">
                {!!loginInProgress ? (
                  <LoadingBtn />
                ) : (
                  <button
                    type="submit"
                    className={`inline-block px-10 py-3   ${
                      !saveEnable ? "bg-gray-500" : "bg-blue-600"
                    } text-white font-medium text-md leading-snug uppercase rounded shadow-md hover:${
                      !saveEnable ? "bg-gray-500" : "bg-blue-700"
                    } hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:${
                      !saveEnable ? "bg-gray-500" : "bg-blue-800"
                    } active:shadow-lg transition duration-150 ease-in-out ${
                      !saveEnable && "cursor-not-allowed"
                    }`}
                    disabled={!saveEnable}
                  >
                    Login
                  </button>
                )}
                <p className="text-sm font-semibold mt-2 pt-1 mb-0">
                  Don't have an account?
                  <NavLink
                    to="/signup"
                    className="text-blue-600 hover:text-green-900 focus:text-green-500 transition duration-200 ease-in-out"
                  >
                    {" "}
                    Sign Up{" "}
                  </NavLink>
                </p>
              </div>
              <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
                <p className="text-center font-semibold mx-4 mb-0">Or</p>
              </div>
              <div className="w-full flex items-center justify-center mb-5">
                <button
                  type="button"
                  onClick={() => login()}
                  class="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 lg:w-2/5 lg:flex lg:justify-evenly"
                >
                  <svg
                    class="mr-2 ml-1 w-4 h-4"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="google"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                  >
                    <path
                      fill="currentColor"
                      d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    ></path>
                  </svg>
                  Sign in with Google
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
export default LoginPage;
