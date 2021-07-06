import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Arrangement from "../Arrangement/Arrangement";

import LoginForm from "../auth/LoginForm";
import RegisterForm from "../auth/RegisterForm";

import UserDashboard from "../User/UserDashboard";

import Protected from "./Protected";
import Profile from "../Profile/Profile";
import ProjectMain from "../Project/ProjectMain";
import { useSelector } from "react-redux";
import LandingPage from "../LandingPage";

function Routes({ login, register }) {
  const { currentUser } = useSelector(st => st.user);
  return (
    <Switch>
      <Route exact path="/">
        {currentUser.username ? <UserDashboard /> : <LandingPage />}
      </Route>
      <Route exact path="/register">
        <RegisterForm register={register} />
      </Route>
      <Route exact path="/login">
        <LoginForm login={login} />
      </Route>

      <Protected exact path="/dashboard">
        <UserDashboard />
      </Protected>
      <Protected exact path="/profile">
        <Profile />
      </Protected>
      <Protected exact path="/projects/:projectId">
        <ProjectMain />
      </Protected>
      <Protected exact path="/projects/:projectId/arrangement-lab">
        <Arrangement />
      </Protected>
      <Redirect to="/" />
    </Switch>
  );
}

export default Routes;
