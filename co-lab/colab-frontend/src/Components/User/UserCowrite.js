import React from "react";
import CardList from "./CardList";
import { useSelector } from "react-redux";
import "./UserCowrite.css";
import moment from "moment";
function UserCowrite() {
  const { currentUser } = useSelector(st => st.user);

  const { projects } = currentUser;
  projects.sort((a, b) => moment(b.updatedAt) - moment(a.updatedAt));
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
