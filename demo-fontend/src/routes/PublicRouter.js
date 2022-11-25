import React from "react";

function PublicRouter({ children, isAuthenticated, ...rest }) {
  return <React.Fragment>{children}</React.Fragment>;
}

export default PublicRouter;
