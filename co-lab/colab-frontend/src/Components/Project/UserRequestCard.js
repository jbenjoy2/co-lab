import React, { useEffect, useState } from "react";
import ColabAPI from "../../api/colabApi";
import { useSelector } from "react-redux";
import "./UserRequestCard.css";
function UserRequestCard({ user, projectId, owner }) {
  /**
   *
   * card component to render results from user search to request user collaborations
   * props: user object, projectId, project owner
   */
  const { currentUser } = useSelector(st => st.user);
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // get all requests associated with project on page load, and whenever the status variable changs (on a request button click)
  useEffect(() => {
    const getProjectRequests = async projectId => {
      const requests = await ColabAPI.getProjectRequests(projectId);

      if (requests.projRequests) {
        if (user.username === owner) {
          setIsOwner(true);
        }
        setRequests(requests.projRequests.filter(req => req.recipient === user.username));
      }
    };
    getProjectRequests(projectId);
  }, [status, owner, user.username, projectId]);

  // make a request on click and then rerender the request card
  const handleClick = async () => {
    const data = { project_id: +projectId, recipient: user.username };
    await ColabAPI.makeRequest(currentUser.username, data);
    setStatus(true);
  };

  return (
    <div className="my-2 list-group-item">
      <div className="UserRequestCard border-left">
        <div className="card-body">
          <h6 className="card-title">@{user.username}</h6>
          <p>
            {user.firstName} {user.lastName}
          </p>
          {isOwner && (
            <button className="btn btn-outline-primary text-uppercase float-right" disabled>
              Project Owner
            </button>
          )}
          {!isOwner && (requests.length === 0 || requests[requests.length - 1].accepted === false) && (
            <button onClick={handleClick} className="btn btn-primary text-uppercase float-right">
              Request
            </button>
          )}
          {requests[requests.length - 1] && requests[requests.length - 1].accepted === null && (
            <button className="btn btn-warning text-uppercase float-right" disabled>
              Request Pending
            </button>
          )}
          {requests[requests.length - 1] && requests[requests.length - 1].accepted === true && (
            <button className="btn btn-outline-secondary text-uppercase float-right" disabled>
              Already a collaborator
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserRequestCard;
