import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import React from "react";
import { RootState } from "../store/store";

function PrivateRouter(props: { children: React.ReactElement }) {
  // const isAuth = props.isAuth;
  const { isAuth } = useSelector((state: RootState) => state.loginStore);
  if (isAuth) {
    return <React.Fragment>{props.children}</React.Fragment>;
  } else return <Navigate to={"/"} />;
}

export default PrivateRouter;
