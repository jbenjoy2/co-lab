import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import LoadingSpinner from "../auth/LoadingSpinner";
import useModal from "../../hooks/useModal";
import { Button } from "react-bootstrap";
import ColabAPI from "../../api/colabApi";
import UserSearchForm from "./UserSearchForm";

import UserRequestCard from "./UserRequestCard";
import { useSelector } from "react-redux";

function UserSearch({ projectId, owner }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isShowing, toggle } = useModal();
  const [nullError, setNullError] = useState(false);
  const currUsername = useSelector(st => st.user.currentUser.username);

  const findUsers = async username => {
    try {
      setSearchTerm(username);
      setLoading(true);
      const foundUsers = await ColabAPI.getAllUsers(username);
      if (foundUsers.users) {
        setUsers(foundUsers.users.filter(user => user.username !== currUsername));

        setNullError(false);
      } else {
        setUsers([]);
        setNullError(true);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalClose = () => {
    setUsers([]);
    setSearchTerm("");
    setNullError(false);
    toggle();
  };
  return (
    <>
      <Button onClick={toggle}>Collaborate</Button>
      <Modal show={isShowing} onHide={handleModalClose} className="RhymeModal" centered>
        <Modal.Header className="bg-dark text-light" closeButton>
          <Modal.Title>Find Users</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark">
          <div>
            <UserSearchForm search={findUsers} searchTerm={searchTerm} />
            {loading && <LoadingSpinner />}
            <div style={{ maxHeight: "50vh", overflowY: "scroll" }}>
              {users.length > 0 && (
                <ul className="list-group ml-3 mr-3 mt-3">
                  {users.map((user, idx) => (
                    // <li
                    //   key={idx}
                    //   className="list-group-item list-group-item-success text-secondary d-flex justify-content-between align-items-center"
                    // >
                    //   {user.username}
                    // </li>
                    <UserRequestCard
                      key={user.username}
                      user={user}
                      projectId={projectId}
                      owner={owner}
                    />
                  ))}
                </ul>
              )}
              {nullError && (
                <p className="text-danger mt-2">No users found that match your search!</p>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default UserSearch;
