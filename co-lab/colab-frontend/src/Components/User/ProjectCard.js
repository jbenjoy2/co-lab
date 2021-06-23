import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "./ProjectCard.css";
import ColabAPI from "../../api/colabApi";
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
  }, []);
  return (
    <div className="ProjectCard">
      <div className="ProjectCard-top">
        <div className="ProjectCard-title">{title}</div>
      </div>
      <div className="ProjectCard-details">
        {!owner && <div className="ProjectCard-owner mt-1">Owner: {projOwner}</div>}
        <div className="ProjectCard-updated mb-1">
          <small>Last updated:</small>
          <small className="ProjectCard-small">{updatedAt}</small>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
