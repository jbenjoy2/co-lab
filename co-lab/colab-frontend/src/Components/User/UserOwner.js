import React from "react";
import CardList from "./CardList";
import { useSelector } from "react-redux";
import "./UserOwner.css";
import moment from "moment";

function UserOwner() {
  const { projects } = useSelector(st => st.user.currentUser);
  projects.sort((a, b) => moment(b.updatedAt) - moment(a.updatedAt));
  const owned = projects.filter(p => p.owner);

  return (
    <div className="UserOwnerProjects">
      <h3 className="UserOwner-title">My Originals</h3>
      <CardList projects={owned} />
    </div>
  );
}

export default UserOwner;
