import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import ColabAPI from "../../api/colabApi";

function Usertest() {
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(
    function loadUsers() {
      async function fetchUsers() {
        try {
          let allUsers = await ColabAPI.getAllSections();
          setUsers(allUsers);
        } catch (error) {
          if (error.status === 401) setErrors(errors => [...errors, error.status]);
        }
      }
      fetchUsers();
    },

    []
  );
  if (errors.length) {
    console.log("errors", errors);
    return <Redirect to="/" />;
  }
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <ul
        style={{
          display: "flex",
          justifyContent: "center",
          width: "1000px",
          overflow: "scroll",
          padding: "5px"
        }}
      >
        {users.map(user => (
          <div
            key={user.id}
            style={{
              color: "white",
              backgroundColor: "rebeccapurple",
              width: "60px",
              height: "60px",
              margin: "25px",
              padding: "30px"
            }}
          >
            {user.name}
          </div>
        ))}
      </ul>
    </div>
  );
}

export default Usertest;
