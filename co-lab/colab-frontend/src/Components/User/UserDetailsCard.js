import React from "react";
import { useSelector } from "react-redux";

import UserAvatar from "./UserAvatar";
import "./UserDetailsCard.css";
function UserDetailsCard() {
  /**
   * component to render the details of the current user, including their username, first/last name, email, and songcredits
   *
   *
   */

  const currentUser = useSelector(st => st.user.currentUser);
  const { projects } = currentUser;

  return (
    <div>
      <div className="UserDetailsCard">
        <div className="UserDetailsCard-card">
          <div className="UserDetailsCard-top ">
            <UserAvatar username={currentUser.username} />
            <span className=" UserDetailsCard-fullname mr-0-">
              {currentUser.firstName} {currentUser.lastName}
            </span>
            <span className="UserDetailsCard-username ml-0">(@{currentUser.username})</span>
          </div>
          <div className="UserDetailsCard-details">
            <div className="UserDetailsCard-email">{currentUser.email}</div>
            <div>Song Credits: {projects.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsCard;
