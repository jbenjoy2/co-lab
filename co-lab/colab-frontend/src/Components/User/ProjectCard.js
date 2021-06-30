import React, { useEffect, useState } from "react";
import "./ProjectCard.css";
import ColabAPI from "../../api/colabApi";
import moment from "moment";
function ProjectCard({ id, title, updatedAt, owner }) {
  const [projOwner, setProjOwner] = useState("");
  useEffect(() => {
    async function getProject(projId) {
      try {
        const proj = await ColabAPI.getProject(projId);
        setProjOwner(proj.owner);
      } catch (error) {
        console.log(error);
      }
    }
    getProject(id);
  }, [id]);

  return (
    <div className="ProjectCard">
      <div className="ProjectCard-top">
        <div className="ProjectCard-title">{title}</div>
      </div>
      <div className="ProjectCard-details">
        {!owner && <div className="ProjectCard-owner mt-1">Owner: {projOwner}</div>}
        <div className="ProjectCard-updated mb-1">
          <small>Last updated:</small>
          <small className="ProjectCard-small">
            {moment(updatedAt)
              .local()
              .format("MMM D, YYYY [at] h:mmA")}
          </small>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
