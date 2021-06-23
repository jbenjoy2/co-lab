import React from "react";
import { Switch, Route, Redirect, Link } from "react-router-dom";
import Arrangement from "../Arrangement/Arrangement";
import LoadingSpinner from "../auth/LoadingSpinner";
import LoginForm from "../auth/LoginForm";
import RegisterForm from "../auth/RegisterForm";
import CardList from "../User/CardList";
import ProjectCard from "../User/ProjectCard";
import Rhymetest from "../Rhymes/Rhymetest";
import UserDashboard from "../User/UserDashboard";
import UserOwner from "../User/UserOwner";
import Usertest from "../User/Usertest";
import Quotetest from "../Quote/QuoteTest";
import ProfileEditForm from "../Profile/ProfileEditForm";
import Protected from "./Protected";
import Profile from "../Profile/Profile";
import ProjectMain from "../Project/ProjectMain";

function routes({ login, register }) {
  return (
    <Switch>
      <Route exact path="/loading">
        <LoadingSpinner />
      </Route>
      <Route exact path="/users">
        <Usertest />
      </Route>
      <Route exact path="/login">
        <LoginForm login={login} />
      </Route>
      <Route exact path="/dashboard">
        <UserDashboard />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route exact path="/register">
        <RegisterForm register={register} />
      </Route>
      <Route exact path="/:projectId">
        <ProjectMain />
      </Route>
      <Route exact path="/:projectId/arrangement-lab">
        <Arrangement />
      </Route>
      <Route exact path="/">
        <h1>Landing Page</h1>
      </Route>

      <Redirect to="/" />
    </Switch>
  );
}

export default routes;
