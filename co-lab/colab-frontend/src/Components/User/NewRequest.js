import React, { useEffect, useState } from "react";
import moment from "moment";

import ColabAPI from "../../api/colabApi";
import { Link } from "react-router-dom";
import { addUserCowrite } from "../../actions/user";
import { useDispatch } from "react-redux";
import "./NewRequest.css";
function NewRequest({ request }) {
  const [accepted, setAccepted] = useState(null);
  const [color, setColor] = useState("");
  const [responded, setResponded] = useState(false);
  const [project, setProject] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    const getProject = async projId => {
      const res = await ColabAPI.getProjectDetails(projId);
      setProject(res);
    };
    getProject(request.projectId);
  }, [request.projectId]);

  const handleAccept = async () => {
    await ColabAPI.acceptRequest(request.requestID);
    setResponded(true);
    setAccepted(true);
    dispatch(addUserCowrite(project));
    setColor("success");
  };
  const handleReject = async () => {
    await ColabAPI.rejectRequest(request.requestID);
    setResponded(true);
    setAccepted(false);
    setColor("danger");
  };

  return (
    <div
      style={{ position: "relative" }}
      className={`list-group-item list-group-item-${color}
      } my-1 NewRequest`}
    >
      <p style={{ color: "#215E6D" }}>
        {request.sender} has invited you to collaborate on: "{project.title}"
      </p>
      {!responded && (
        <p className="float-left">
          <small>
            Sent at{" "}
            {moment(request.sentAt)
              .local()
              .format("MMM DD, YYYY [at] h:mmA")}
          </small>
        </p>
      )}
      {!responded && (
        <div className="float-right">
          <button className="btn btn-cancel mr-2" onClick={handleReject}>
            Reject
          </button>
          <button className="btn btn-accept" onClick={handleAccept}>
            Accept
          </button>
        </div>
      )}
      {accepted && (
        <div className="float-left">
          <p>
            Cowrite accepted! <Link to={`/projects/${request.projectId}`}>Go to project</Link>
          </p>
        </div>
      )}
      {accepted === false && (
        <div className="float-left">
          <p className="text-secondary">Request to collaborate declined</p>
        </div>
      )}
    </div>
  );
}

export default NewRequest;
