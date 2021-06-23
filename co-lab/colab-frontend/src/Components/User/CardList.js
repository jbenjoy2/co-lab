import React from "react";
import ProjectCard from "./ProjectCard";
import "./CardList.css";
import { Link } from "react-router-dom";
function CardList({ projects }) {
  if (!projects.length) return "No projects yet!";
  return (
    <div className="wrapper">
      <div className="CardList scrollable">
        {projects.map(m => (
          <Link key={m.id} to={`/${m.id}`} className="card-link">
            <ProjectCard
              key={m.id}
              id={m.id}
              title={m.title}
              owner={m.owner}
              updatedAt={m.updatedAt}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CardList;
