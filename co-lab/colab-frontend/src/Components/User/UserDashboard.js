import React from "react";
import UserCowrite from "./UserCowrite";
import UserOwner from "./UserOwner";
import { useSelector, useDispatch } from "react-redux";
import "./UserDashboard.css";

import UserDetailsCard from "./UserDetailsCard";
import Notification from "./Notification";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { addUserProjectApi } from "../../actions/user";
function UserDashboard() {
  /**
   * main component to render the entire user dashboard page
   * this component renders the 'new project' button, as well as all of the card lists, the user details card, and the requests panel
   */
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser = useSelector(st => st.user.currentUser);

  // helper function to create new project in api and in user redux store, then navigate to the new project
  const createProject = async (title, owner) => {
    const createUserProject = addUserProjectApi(title, owner);
    const res = await createUserProject(dispatch);
    history.push(`/projects/${res.project.id}`);
  };

  return (
    <div className="UserDashboard">
      <Helmet>
        <title>Colab - {currentUser.username}'s Dashboard</title>
      </Helmet>
      <div className="justify-content-center">
        <div className="container w-50">
          <button
            onClick={async () => await createProject("Click to Change Title", currentUser.username)}
            className="btn btn-success mb-5 btn-block"
          >
            Create New Project
          </button>
        </div>
      </div>
      <div className="details-wrapper">
        <UserDetailsCard />
        <Notification />
      </div>
      <div className="UserDashboard-projects mt-5 mb-5">
        <div className="mb-5">
          <UserOwner />
        </div>
        <div className="container">
          <hr style={{ backgroundColor: "#f47b33" }} />
        </div>
        <UserCowrite />
      </div>
    </div>
  );
}

export default UserDashboard;
