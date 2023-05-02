import React from "react";

const PublicRouter = (props: { children: React.ReactElement }) => {
  return <React.Fragment>{props.children}</React.Fragment>;
};

export default PublicRouter;
