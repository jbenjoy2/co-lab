import React, { useState } from "react";
import UserCowrite from "./UserCowrite";
import UserOwner from "./UserOwner";
import { useSelector, useDispatch } from "react-redux";
import "./UserDashboard.css";
import UserAvatar from "./UserAvatar";
import UserDetailsCard from "./UserDetailsCard";
import Notification from "./Notification";
import ColabAPI from "../../api/colabApi";
import { useHistory } from "react-router-dom";
import { addUserProjectApi } from "../../actions/user";
function UserDashboard() {
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser = useSelector(st => st.user.currentUser);

  const createProject = async (title, owner) => {
    const createUserProject = addUserProjectApi(title, owner);
    const res = await createUserProject(dispatch);
    history.push(`/${res.project.id}`);
  };

  return (
    <div className="UserDashboard">
      <div className=" container-fluid w-75 row justify-content-end">
        <button
          onClick={async () => await createProject("temp", currentUser.username)}
          className="btn btn-success mb-5 "
        >
          Create New Project
        </button>
      </div>
      <div className="details-wrapper container-fluid row justify-content-center mr-0">
        <UserDetailsCard className="col-12 col-md-5 " />
        <Notification className="col-12 col-md-5 mt-2 mt-md-0" />
      </div>
      <div className="UserDashboard-projects mt-5">
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
