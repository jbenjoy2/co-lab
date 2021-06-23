import React from "react";
import UserCowrite from "./UserCowrite";
import UserOwner from "./UserOwner";
import { useSelector } from "react-redux";
import "./UserDashboard.css";
import UserAvatar from "./UserAvatar";
import UserDetailsCard from "./UserDetailsCard";
import Notification from "./Notification";
function UserDashboard() {
  return (
    <div className="UserDashboard">
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
