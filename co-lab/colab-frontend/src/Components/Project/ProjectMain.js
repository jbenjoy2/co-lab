import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ColabAPI from "../../api/colabApi";
import LoadingSpinner from "../auth/LoadingSpinner";
import Quotetest from "../Quote/QuoteTest";
import Rhymetest from "../Rhymes/Rhymetest";
import "./ProjectMain.css";
import ProjectNotesForm from "./ProjectNotesForm";
function ProjectMain() {
  const { projectId } = useParams();
  const [project, setProject] = useState({});
  const [cowriters, setCowriters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProject = async id => {
      try {
        const proj = await ColabAPI.getProject(id);
        console.log(proj);
        setProject(proj);
        setCowriters(proj.contributors.filter(c => c !== proj.owner));
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    setLoading(true);
    getProject(projectId);
  }, []);

  const cowriterString = cowriters.join(", ");

  const saveProject = async (projectId, notes) => {
    setProject(project => ({ ...project, notes: notes }));
    try {
      let res = await ColabAPI.updatedProject(projectId, {
        notes: notes,
        title: project.title
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  if (loading) return <LoadingSpinner />;
  return (
    <>
      <div className="text-center">
        <span className="text-light mb-1 display-1 border-bottom ProjectMain-title">
          {project.title}
        </span>
      </div>
      <div className="text-center mb-1 display-4 ProjectMain-owner">Owner: {project.owner}</div>
      <div className="text-center mb-5 display-4 ProjectMain-contributor">
        Contributors: {cowriterString.length > 0 ? cowriterString : "None yet!"}
      </div>
      <div className="container-fluid row justify-content-around">
        <Rhymetest />
        <Quotetest />
        <Link className="btn btn-primary" to={`/${projectId}/arrangement-lab`}>
          Arrangement Lab
        </Link>
      </div>
      <div className="container-fluid w-75 ml-auto mr-auto mt-4">
        <ProjectNotesForm projectId={projectId} notes={project.notes} save={saveProject} />
      </div>
    </>
  );
}

export default ProjectMain;
