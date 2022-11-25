import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";
import { ToastContainer } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  forgotPassword,
  resetPassword,
  sendOtpForCheck,
  removeOtp,
} from "../Actions/forgotPasswordAction";
import LoadingBtn from "../components/LoadingBtn";
import { Navigate } from "react-router-dom";

const ForgetPass = (props) => {
  const dispatch = useDispatch();
  const { user, isAuth, loginInProgress } = useSelector(
    (state) => state.loginStore
  );
  const {
    isfetchingOtp,
    otpSet,
    isSendingOtp,
    isResetPasswordInProgress,
    resetPasswordSuccess,
    correctOtp,
  } = useSelector((state) => state.forgotPasswordStore);
  const [values, setValues] = useState({
    email: "",
    otp: "",
    phone: "",
  });
  const [errorEnable, setErrorEnable] = useState({
    email: false,
    otp: false,
    phone: false,
  });

  const [passConfirm, SetPassConfirm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [passConfirmError, setpassConfirmError] = useState({
    password: false,
    confirmPassword: false,
  });
  const [counter, setCounter] = useState(0);
  const [openConfirmPassword, setOpenConfirmPassword] = useState(
    !!otpSet.sendotp && !!correctOtp ? true : false
  );

  const [otpByPhone, setOtpByPhone] = useState(false);

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  useEffect(() => {
    if (!!otpSet.sendotp && !!correctOtp) {
      setOpenConfirmPassword(true);
    }
  }, [otpSet.sendotp, correctOtp]);

  const removingOtp = () => {
    const email = localStorage.getItem("resetPassEmail");
    const contact = localStorage.getItem("contact");
    console.log(
      isSendingOtp,
      correctOtp,
      resetPasswordSuccess,
      !(isSendingOtp || correctOtp || resetPasswordSuccess)
    );
    const findParams = otpByPhone
      ? { contact: contact, isContact: true }
      : { email: email, isContact: false };
    !(!!isSendingOtp || !!correctOtp || !!resetPasswordSuccess) &&
      dispatch(removeOtp(findParams));
  };

  useEffect(() => {
    if (!!otpSet?.sendotp) {
      setCounter(60);
      const debounceAction = debounce(() => {
        removingOtp();
      }, 60000);
      debounceAction();
    }
  }, [otpSet.sendotp]);

  const handleResetPassword = (event) => {
    event?.preventDefault();
    !!otpByPhone
      ? localStorage.setItem("contact", values.phone)
      : localStorage.setItem("resetPassEmail", values.email);
    const parameters = !!otpByPhone
      ? { contact: values.phone, isContact: true }
      : { email: values.email, isContact: false };
    dispatch(forgotPassword(parameters));
  };

  const handleSendOtp = () => {
    const email = localStorage.getItem("resetPassEmail");
    const contact = localStorage.getItem("contact");
    dispatch(
      sendOtpForCheck({
        parameter: otpByPhone ? contact : email,
        otp: values.otp,
        isContact: otpByPhone ? true : false,
      })
    );
  };

  const handleResetPasswordConfirm = (event) => {
    event?.preventDefault();
    const email = localStorage.getItem("resetPassEmail");
    const contact = localStorage.getItem("contact");
    if (
      passConfirm.password === passConfirm.confirmPassword &&
      passConfirm.password.length > 8
    ) {
      dispatch(
        resetPassword({
          email: email,
          contact: contact,
          password: passConfirm.password,
          isContact: otpByPhone ? true : false,
        })
      );
    }
  };

  useEffect(() => {
    if (!!resetPasswordSuccess) {
      setOpenConfirmPassword(false);
    }
  }, [resetPasswordSuccess]);

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
    } else if (event.target.name === "password") {
      setValues((prevState) => {
        return { ...prevState, password: event.target.value };
      });
    } else if (event.target.name === "otp") {
      setValues((prevState) => {
        return { ...prevState, otp: event.target.value };
      });
      if (event?.target?.value?.tostring()?.length < 6) {
        setErrorEnable({ ...errorEnable, otp: true });
      } else {
        setErrorEnable({ ...errorEnable, otp: false });
      }
    }
  };
  const handlePhoneChange = (e) => {
    setValues((prevState) => {
      return {
        ...prevState,
        phone: e,
      };
    });
    if (/^[+6-9][0-9]{11,12}$/.test(e)) {
      setErrorEnable({ ...errorEnable, phone: false });
    } else {
      setErrorEnable({ ...errorEnable, phone: true });
    }
  };
  const onChangeTextPass = (event) => {
    if (event.target.name === "password") {
      SetPassConfirm((prevState) => {
        return { ...prevState, password: event.target.value };
      });
      if (
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{4,}$/.test(
          event.target.value
        )
      ) {
        setpassConfirmError({ ...passConfirmError, password: false });
      } else {
        setpassConfirmError({ ...passConfirmError, password: true });
      }
    } else if (event.target.name === "confirmPassword") {
      SetPassConfirm((prevState) => {
        return { ...prevState, confirmPassword: event.target.value };
      });
      if (
        event.target.value.length === 0 ||
        event.target.value !== passConfirm.password
      ) {
        setpassConfirmError({ ...passConfirmError, confirmPassword: true });
      } else {
        setpassConfirmError({ ...passConfirmError, confirmPassword: false });
      }
    }
  };

  if (!!isAuth && !loginInProgress && user && Object.keys(user).length !== 0) {
    return <Navigate to={"/profile"} />;
  }

  return (
    <div className="container mx-auto w-full h-screen flex justify-center items-center">
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
            <div className="px-8 mb-4 text-center">
              <h3 className="pt-4 mb-2 text-2xl">Forgot Your Password?</h3>
              <p className="mb-4 text-sm text-gray-700">
                {`We get it, stuff happens. Just enter your ${
                  otpByPhone ? "mobile number" : "email address"
                } below
                and we'll send you otp to reset your password!`}
              </p>
            </div>
            {console.log("openConfirmPassword ", openConfirmPassword)}
            {openConfirmPassword ? (
              <form className="px-8 pt-6 pb-8 mb-4 bg-white rounded">
                <div className="mb-4">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    for="password"
                  >
                    Password
                  </label>
                  <input
                    name="password"
                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="Enter Password"
                    value={passConfirm.password}
                    onChange={onChangeTextPass}
                  />
                  <p className="text-left text-red-500 text-basic italic">
                    {passConfirmError.password &&
                      "Minimum eight characters, contains one letter, one number and one special character"}
                  </p>
                </div>
                <div className="mb-4">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    for="password"
                  >
                    Confirm Password
                  </label>
                  <input
                    name="confirmPassword"
                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="confirmPassword"
                    type="password"
                    placeholder="Enter Confirm Password"
                    value={passConfirm.confirmPassword.toLowerCase()}
                    onChange={onChangeTextPass}
                  />
                  <p className="text-left text-red-500 text-basic italic">
                    {passConfirmError.confirmPassword &&
                      "Please enter valid password which is same as above!"}
                  </p>
                  {!!isResetPasswordInProgress ? (
                    <LoadingBtn />
                  ) : (
                    <button
                      className={`w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-yellow-500	 focus:outline-none focus:shadow-outline mt-8 ${
                        passConfirm.password.toString().length === 0 &&
                        passConfirm.confirmPassword.toString().length === 0 &&
                        "cursor-not-allowed"
                      }`}
                      type="button"
                      onClick={handleResetPasswordConfirm}
                      disabled={
                        passConfirm.password.toString().length === 0 ||
                        passConfirm.confirmPassword.toString().length === 0
                      }
                    >
                      Reset Password
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <form className="px-8 pt-6 pb-8 mb-4 bg-white rounded">
                {!!otpSet.sendotp ? (
                  <div className="mb-4">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700"
                      for="password"
                    >
                      OTP
                    </label>
                    <input
                      name="otp"
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      id="otp"
                      type="password"
                      placeholder="Enter your otp"
                      value={values.otp.toLowerCase()}
                      onChange={onChangeText}
                    />
                    <p className="text-left text-red-500 text-basic italic">
                      {errorEnable.otp && "Please enter valid 6 digit otp!"}
                    </p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700"
                      for="email"
                    >
                      {otpByPhone ? "Mobile Number" : "Email"}
                    </label>
                    {otpByPhone ? (
                      <>
                        <PhoneInput
                          name="mobile"
                          className="form-control w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-blue-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-800 focus:outline-none flex"
                          placeholder="Mobile Number"
                          value={values.phone}
                          onChange={handlePhoneChange}
                        />
                        <p className="text-left text-red-500 text-basic italic">
                          {errorEnable.phone &&
                            "Start with [6-9] and 10 digits mobile no.!"}
                        </p>
                      </>
                    ) : (
                      <>
                        <input
                          name="email"
                          className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                          id="email"
                          type="email"
                          placeholder="Enter Email Address..."
                          value={values.email.toLowerCase()}
                          onChange={onChangeText}
                        />
                        <p className="text-left text-red-500 text-basic italic">
                          {errorEnable.email && "Please enter valid email!"}
                        </p>
                      </>
                    )}
                  </div>
                )}
                {counter > 0 && (
                  <div className="cursor-pointer inline-block text-sm text-blue-500 align-baseline hover:text-blue-800">
                    {counter}
                  </div>
                )}
                <div className="mb-6 text-center">
                  {!!isfetchingOtp || !!isSendingOtp ? (
                    <LoadingBtn />
                  ) : (
                    <button
                      className={`w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-yellow-500 focus:outline-none focus:shadow-outline ${
                        (errorEnable.email || errorEnable.otp) &&
                        "cursor-not-allowed"
                      }`}
                      type="button"
                      onClick={
                        !!otpSet.sendotp ? handleSendOtp : handleResetPassword
                      }
                      // disabled={errorEnable.email || errorEnable.otp}
                    >
                      {!!otpSet.sendotp ? "Reset Password" : "Generate Otp"}
                    </button>
                  )}
                </div>
                {!otpSet.sendotp && (
                  <div
                    onClick={() => setOtpByPhone(otpByPhone ? false : true)}
                    className="cursor-pointer inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                  >
                    {otpByPhone ? "Send otp on email" : "Send otp on Phone"}
                  </div>
                )}
                <hr className="mb-6 border-t" />
                <div className="text-center">
                  <a
                    className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                    href="/signup"
                  >
                    Create an Account!
                  </a>
                </div>
                <div className="text-center">
                  <a
                    className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                    href="/"
                  >
                    Already have an account? Login!
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPass;
