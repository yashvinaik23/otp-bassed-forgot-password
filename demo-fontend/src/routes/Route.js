// import LoginPage from "../pages/LoginPage";
import Signup from "../pages/Signup";
import Profile from "../pages/Profile";
import ForgetPass from "../pages/ForgetPass";
import LoginPage from "../pages/LoginPage";
import { GoogleOAuthProvider } from "@react-oauth/google";

const roughtConfiguration = [
  {
    path: "/login",
    auth: false,
    name: "Login",
    component: <LoginPage />,
  },
  {
    path: "/signup",
    auth: false,
    name: "Signup",
    component: (
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <Signup />
      </GoogleOAuthProvider>
    ),
  },
  {
    path: "/forgotpassword",
    auth: false,
    name: "ForgotPassword",
    component: <ForgetPass />,
  },
  {
    path: "/profile",
    auth: true,
    name: "Profile",
    authPage: "Login",
    component: <Profile />,
  },
];

export default roughtConfiguration;
