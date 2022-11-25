import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import React from "react";

function PrivateRouter(props) {
  const isAuth = props.isAuth;
  if (isAuth) {
    return <React.Fragment>{props.children}</React.Fragment>;
  } else return <Navigate to={"/"} />;
}

const mapStateToProps = (state) => {
  const { user, isAuth } = state.loginStore;
  return {
    user,
    isAuth,
  };
};

export default connect(mapStateToProps, null)(PrivateRouter);
