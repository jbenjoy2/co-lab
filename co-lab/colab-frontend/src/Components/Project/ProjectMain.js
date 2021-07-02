import { Alert, OverlayTrigger, Tooltip } from "react-bootstrap";
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import ColabAPI from "../../api/colabApi";
import LoadingSpinner from "../auth/LoadingSpinner";
import Quotetest from "../Quote/QuoteTest";
import Rhymetest from "../Rhymes/Rhymetest";
import "./ProjectMain.css";
import ProjectNotesForm from "./ProjectNotesForm";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProjectApi, deleteUserProjectApi, leaveProjectApi } from "../../actions/user";
import UserSearch from "./UserSearch";
import { Helmet } from "react-helmet";
function ProjectMain() {
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const [project, setProject] = useState({});
  const [cowriters, setCowriters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [errors, setErrors] = useState([]);
  const { currentUser } = useSelector(st => st.user);
  useEffect(() => {
    const getProject = async id => {
      try {
        const proj = await ColabAPI.getProject(id);
        setProject(proj);
        setTitle(proj.title);
        setCowriters(proj.contributors.filter(c => c !== proj.owner));
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    setLoading(true);
    getProject(projectId);
  }, [projectId]);

  const cowriterString = cowriters.join(", ");

  const handleChange = e => {
    setTitle(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setEditing(false);
  };

  const inputEl = useRef(null);
  function handleFocus() {
    inputEl.current.select();
  }

  const saveProject = async (projectId, notes) => {
    setProject(project => ({ ...project, notes: notes }));
    try {
      await ColabAPI.updatedProject(projectId, {
        notes: notes,
        title: title
      });

      const updateProjectInStore = updateUserProjectApi(projectId, {
        notes: notes,
        title: title
      });
      await updateProjectInStore(dispatch);
      setSuccess(true);
    } catch (error) {
      console.log(error);
      if (error.data.error.message === "value too long for type character varying(25)") {
        setErrors(errors => [...errors, "Title must be shorter than 25 characters"]);
      }
    }
  };

  const deleteProject = async projectId => {
    try {
      const deleteProj = deleteUserProjectApi(projectId);
      await deleteProj(dispatch);
    } catch (error) {
      console.log(error);
    }
  };

  const leaveProject = async projectId => {
    try {
      const leaveProj = leaveProjectApi(projectId, currentUser.username);
      await leaveProj(dispatch);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>
          Colab - "{title}" by {currentUser.username}
        </title>
      </Helmet>
      <div className="text-center">
        {editing ? (
          <form onSubmit={handleSubmit} className="container w-50 mt-5">
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={handleChange}
              className="form-control"
              maxLength="25"
              minLength={2}
              autoFocus
              onFocus={e => e.currentTarget.select()}
            />
            <button className="btn btn-primary mt-2">Save</button>
          </form>
        ) : (
          // <>
          //   <span
          //     onClick={() => setEditing(true)}
          //     className="text-light mb-1 display-1 border-bottom ProjectMain-title"
          //   >
          //     {title}
          //   </span>
          //
          // </>
          <>
            <OverlayTrigger
              key={"edit"}
              placement="right"
              overlay={<Tooltip id={`tooltip-edit`}>Click To Edit Project Title</Tooltip>}
            >
              <h1
                onClick={() => {
                  setEditing(true);
                }}
                style={{ textDecoration: "underline", textDecorationColor: "#F47B33" }}
                className="text-light mb-1 ProjectMain-title"
              >
                {title}
                {errors.length > 0 && errors.map(error => <p className="text-danger">{error}</p>)}
              </h1>
            </OverlayTrigger>
          </>
        )}
      </div>
      <h2 className="text-center mb-1 ProjectMain-owner">Owner: {project.owner}</h2>
      <h2 className="text-center mb-5 ProjectMain-contributor">
        Contributors: {cowriterString.length > 0 ? cowriterString : "None yet!"}
      </h2>
      <div className="container-fluid row justify-content-around">
        <Rhymetest />
        <Quotetest />
        <UserSearch projectId={projectId} owner={project.owner} />
        <Link className="btn btn-primary" to={`/${projectId}/arrangement-lab`}>
          Arrangement Lab
        </Link>
      </div>
      <div className="container-fluid w-75 ml-auto mr-auto mt-4 mb-3">
        {success && (
          <div className="container text-center mt-4">
            <Alert
              variant="success"
              onClose={() => setSuccess(false)}
              dismissible
              className="mt-2 mb-0"
            >
              Project Successfully Updated!
            </Alert>
          </div>
        )}
        <ProjectNotesForm
          projectId={projectId}
          notes={project.notes}
          owner={project.owner}
          save={saveProject}
          delete={deleteProject}
          leave={leaveProject}
        />
      </div>
    </>
  );
}

export default ProjectMain;
