import React from "react";
import "./UserAvatar.css";
function UserAvatar({ username }) {
  return <div className="Avatar">{username[0].toUpperCase()}</div>;
}

export default UserAvatar;
