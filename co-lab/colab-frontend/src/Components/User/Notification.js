import React, { useEffect, useState } from "react";
import "./Notification.css";
import { useSelector } from "react-redux";
import ColabAPI from "../../api/colabApi";
import NewRequest from "./NewRequest";
function Requests(props) {
  const { currentUser } = useSelector(st => st.user);
  const [userRequests, setUserRequests] = useState([]);

  useEffect(() => {
    const getUserRequests = async user => {
      const res = await ColabAPI.getUserRequests(user);
      const requests = res.userRequests;
      if (requests) {
        const toDo = requests.filter(req => req.accepted === null);

        setUserRequests(toDo);
      }
    };
    getUserRequests(currentUser.username);
  }, [currentUser.username]);

  return (
    <div className="Request-wrapper">
      <div className="RequestCard">
        <div className="UserDetailsCard-card">
          <h3 className="card-title text-center">
            <u style={{ color: "#f47b33" }}>Cowrite Requests</u>
          </h3>

          <div className="UserDetailsCard-details" />
          {userRequests.length > 0 ? (
            <div className="RequestCard-requests">
              <ul className="list-group ml-3 mr-3 mt-3">
                {userRequests.map(req => (
                  <NewRequest request={req} key={req.requestID} />
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-center text-light" style={{ position: "relative", top: "50%" }}>
              You have no pending requests!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Requests;
