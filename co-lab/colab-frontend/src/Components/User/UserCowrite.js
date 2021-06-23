import React from "react";
import CardList from "./CardList";
import { useSelector } from "react-redux";
import "./UserCowrite.css";
function UserCowrite() {
  const { currentUser } = useSelector(st => st.user);

  const { projects } = currentUser;
  const cowrites = projects.filter(p => !p.owner);

  return (
    <div>
      <div className="UserCowriteProjects">
        <h3 className="UserCowrite-title">Cowrites</h3>
        <CardList projects={cowrites} />
      </div>
    </div>
  );
}

export default UserCowrite;
