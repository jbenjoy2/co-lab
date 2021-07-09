import React from "react";
import "./UserAvatar.css";
function UserAvatar({ username }) {
  // render the letter in circle avatar for user's username on their details card
  return <div className="Avatar">{username[0].toUpperCase()}</div>;
}

export default UserAvatar;
