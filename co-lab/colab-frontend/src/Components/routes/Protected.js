import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

function Protected({ exact, path, children }) {
  const currentUser = useSelector(st => st.user.currentUser);

  if (!currentUser.username) {
    return <Redirect to="/login" />;
  }

  return (
    <Route exact={exact} path={path}>
      {children}
    </Route>
  );
}

export default Protected;
