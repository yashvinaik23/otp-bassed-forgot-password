import { NavLink, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  useGoogleLogin,
} from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import PhoneInput from "react-phone-number-input";
// import "react-phone-number-input/style.css";
import LoadingBtn from "../components/LoadingBtn";
import OpenEye from "../components/OpenEye";
import CloseEye from "../components/CloseEye";
import { SignUpUser, signUpUserWithGoogle } from "../Actions/action";

const Signup = (props) => {
  const dispatch = useDispatch();

  const { user, loginInProgress, loadingLogin } = useSelector(
    (state) => state.loginStore
  );
  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    mobileNo: "",
    email: "",
    password: "",
    confirmPass: "",
  });
  const [errorEnable, setErrorEnable] = useState({
    email: false,
    fname: false,
    lname: false,
    mobile: false,
    password: false,
    confirmPass: false,
  });
  const [saveEnable, setSaveEnable] = useState(false);
  const [visiblePass, setVisiblePass] = useState(false);
  const [visibleConfirmPass, setVisibleConfirmPass] = useState(false);

  const authWithGoogle = (res) => {
    console.log("tokenResponse:::", res);
    dispatch(signUpUserWithGoogle({ credential: res.access_token }));
  };

  const login = useGoogleLogin({
    onSuccess: (CodeResponse) => authWithGoogle(CodeResponse),
  });

  const onSubmitHandler = (event) => {
    event?.preventDefault();
    dispatch(SignUpUser(fields));
  };

  const onChangeText = (event) => {
    if (event.target.name === "email") {
      setFields((prevState) => {
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
    } else if (event.target.name === "firstName") {
      setFields((prevState) => {
        return {
          ...prevState,
          firstName: event.target.value.toLowerCase(),
        };
      });
      if (/^[A-Za-z]+$/.test(event.target.value)) {
        setErrorEnable({ ...errorEnable, fname: false });
      } else {
        setErrorEnable({ ...errorEnable, fname: true });
      }
    } else if (event.target.name === "lastName") {
      setFields((prevState) => {
        return {
          ...prevState,
          lastName: event.target.value.toLowerCase(),
        };
      });
      if (/^[A-Za-z]+$/.test(event.target.value)) {
        setErrorEnable({ ...errorEnable, lname: false });
      } else {
        setErrorEnable({ ...errorEnable, lname: true });
      }
    } else if (event.target.name === "pass") {
      setFields((prevState) => {
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
    } else if (event.target.name === "confirmPass") {
      setFields((prevState) => {
        return { ...prevState, confirmPass: event.target.value };
      });

      if (event.target.value === fields.password) {
        setErrorEnable({ ...errorEnable, confirmPass: false });
      } else {
        setErrorEnable({ ...errorEnable, confirmPass: true });
      }
    }
  };

  const handlePhoneChange = (e) => {
    setFields((prevState) => {
      return {
        ...prevState,
        mobileNo: e,
      };
    });
    if (/^[+6-9][0-9]{11,12}$/.test(e)) {
      setErrorEnable({ ...errorEnable, mobile: false });
    } else {
      setErrorEnable({ ...errorEnable, mobile: true });
    }
  };

  useEffect(() => {
    const areTrue = Object.values(errorEnable).every((value) => value !== true);
    const isNullish = Object.values(fields).every((value) => value !== "");
    isNullish
      ? areTrue
        ? setSaveEnable(true)
        : setSaveEnable(false)
      : setSaveEnable(false);
  }, [errorEnable, fields]);

  if (!loginInProgress && user && Object.keys(user).length !== 0) {
    return <Navigate to={"/profile"} />;
  }

  return (
    <section className="h-screen">
      <ToastContainer />
      <div className="px-6 h-full text-gray-800">
        <div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
          <div className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-7/12 mb-12 md:mb-0">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="w-full"
              alt="Sample-image"
            />
          </div>
          <div className="xl:ml-20 xl:w-4/12 lg:w-4/12 md:w-6/12 mb-12 md:mb-0">
            <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
              <h1 className="text-[42px]"> Sign Up </h1>
            </div>
            {!saveEnable && (
              <p className="text-left text-green-600 pb-5 text-basic italic">
                Required to fill all the fields.
              </p>
            )}
            <form onSubmit={onSubmitHandler}>
              <div className="mb-6">
                <input
                  name="firstName"
                  type="text"
                  className="form-control block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-blue-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-800 focus:outline-none"
                  id="firstName"
                  placeholder="First Name"
                  required
                  value={fields.firstName}
                  onChange={onChangeText}
                />
                <p className="text-left text-red-500 text-basic italic">
                  {errorEnable.fname && "Please enter valid first name!"}
                </p>
              </div>
              <div className="mb-6">
                <input
                  name="lastName"
                  type="text"
                  className="form-control block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-blue-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-800 focus:outline-none"
                  id="lastName"
                  placeholder="Last Name"
                  required
                  value={fields.lastName.toLowerCase()}
                  onChange={onChangeText}
                />
                <p className="text-left text-red-500 text-basic italic">
                  {errorEnable.lname && "Please enter valid last name!"}
                </p>
              </div>
              <div className="mb-6">
                <PhoneInput
                  name="mobile"
                  className="form-control w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-blue-500 rounded transition ease-in-out m-0 focus:bg-white focus:border-blue-800 focus:outline-none flex"
                  placeholder="Mobile Number"
                  value={fields.mobileNo}
                  onChange={handlePhoneChange}
                />
                <p className="text-left text-red-500 text-basic italic">
                  {errorEnable.mobile &&
                    "Start with [6-9] and 10 digits mobile no.!"}
                </p>
              </div>
              <div className="mb-6">
                <input
                  name="email"
                  type="email"
                  className="form-control block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-blue-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-800 focus:outline-none"
                  id="email"
                  placeholder="Email address"
                  required
                  value={fields.email.toLowerCase()}
                  onChange={onChangeText}
                />
                <p className="text-left text-red-500 text-basic italic">
                  {errorEnable.email && "Please enter valid email!"}
                </p>
              </div>
              <div className="mb-6">
                <div className="relative">
                  <input
                    name="pass"
                    autoComplete="on"
                    required
                    type={visiblePass ? "text" : "password"}
                    className="form-control block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-blue-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-800 focus:outline-none"
                    id="pass"
                    placeholder="Password"
                    value={fields.password}
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
              <div className="mb-6 ">
                <div className="relative">
                  <input
                    name="confirmPass"
                    autoComplete="on"
                    required
                    type={visibleConfirmPass ? "text" : "password"}
                    className="form-control block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-blue-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-800 focus:outline-none"
                    id="confirmpass"
                    placeholder="Confirm Password"
                    value={fields.confirmPass}
                    onChange={onChangeText}
                  />
                  <span
                    className="absolute inset-y-0 right-0 flex items-center pr-5 cursor-pointer"
                    onClick={() => setVisibleConfirmPass(!visibleConfirmPass)}
                  >
                    {visibleConfirmPass ? <OpenEye /> : <CloseEye />}
                  </span>
                </div>
                <p className="text-left text-red-500 text-basic italic pt-1">
                  {errorEnable.confirmPass &&
                    "Password and confirm password not match!"}
                </p>
              </div>
              <div className="text-center lg:text-center">
                {!!loadingLogin ? (
                  <div className="mx-auto w-1/3">
                    <LoadingBtn />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className={`inline-block px-10 py-3 ${
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
                    Sign Up
                  </button>
                )}
                <p className="text-sm font-semibold mt-2 pt-1 mb-0">
                  Already have an account?
                  <NavLink
                    to="/"
                    className="text-blue-600 hover:text-green-900 focus:text-green-500 transition duration-200 ease-in-out"
                  >
                    {" "}
                    Sign In{" "}
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
                  class="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 lg:w-1/2 lg:flex lg:justify-evenly"
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
                  Sign up with Google
                </button>
              </div>
              {/* <div className="mx-16 sm:mx-24 xl:mx-40">
                <GoogleOAuthProvider
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                  className="w-2/3"
                >
                  <GoogleLogin
                    className="w-full"
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    text={"signup_with"}
                    onSuccess={authWithGoogle}
                    onError={(e) => {
                      console.log(e);
                    }}
                  ></GoogleLogin>
                </GoogleOAuthProvider>
              </div> */}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Signup;
