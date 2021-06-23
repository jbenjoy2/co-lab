import React from "react";
import "./Notification.css";
import { useSelector } from "react-redux";
function Notification(props) {
  const { currentUser } = useSelector(st => st.user);
  const user = {
    username: "akp143",
    firstName: "Abby",
    lastName: "Benjoya",
    email: "abbybenjoya@gmail.com"
  };
  return (
    <div className={props.className}>
      <div className="UserDetailsCard">
        <div className="UserDetailsCard-card">
          <div className="UserDetailsCard-top ">
            <span className=" UserDetailsCard-fullname">
              {currentUser.firstName} {currentUser.lastName}
            </span>
            <span className="UserDetailsCard-username">(@{currentUser.username})</span>
          </div>
          <div className="UserDetailsCard-details">
            <div className="UserDetailsCard-email">
              <a href={`mailto:${currentUser.email}`}>{currentUser.email}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notification;
