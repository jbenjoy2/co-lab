import React, { useState } from "react";

import useModal from "../../hooks/useModal";
import { useHistory } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
function ProjectNotesForm(props) {
  const { currentUser } = useSelector(st => st.user);
  const history = useHistory();
  const [notes, setNotes] = useState(props.notes || "");
  const { isShowing, toggle } = useModal();
  const handleChange = e => {
    setNotes(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await props.save(props.projectId, notes);
  };

  const handleDelete = async () => {
    await props.delete(props.projectId);
    history.push("/");
  };

  const handleLeave = async () => {
    await props.leave(props.projectId);
    history.push("/");
  };
  const handleModalClose = () => {
    toggle();
  };
  return (
    // <Form>
    //   <Form.Group controlId="exampleForm.ControlTextarea1">
    //     <Form.Label className="text-center">
    //       <h2 className="text-primary">Project Notes</h2>
    //     </Form.Label>
    //     <Form.Control as="textarea" rows={30} value={notes} />
    //   </Form.Group>
    // </Form>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label style={{ color: "#f47b33" }} htmlFor="notes">
          <h2 className="text-center display-4">Song Notes</h2>
        </label>
        <textarea
          onChange={handleChange}
          rows="15"
          id="notes"
          name="notes"
          className="form-control p-4"
          value={notes}
          style={{ fontSize: "min(1.25rem, 5vw)" }}
        />
      </div>
      <div className="form-row justify-content-center">
        <button className="btn btn-secondary mx-2 mx-lg-5">Save Project</button>
        {currentUser.username === props.owner && (
          <>
            <button onClick={toggle} type="button" className="btn btn-danger mx-2 mx-lg-5">
              Delete
            </button>
            <Modal show={isShowing} size="lg" onHide={handleModalClose} centered>
              <Modal.Header className="bg-dark text-light">
                <Modal.Title>Are you sure?</Modal.Title>
              </Modal.Header>
              <Modal.Body className="bg-dark ">
                <div>
                  <p className="text-secondary">Are you sure you want to delete this project?</p>
                  <div className="mt-2 container row justify-content-center">
                    <button onClick={toggle} type="button" className="mr-3 btn btn-cancel">
                      Cancel
                    </button>
                    <button onClick={handleDelete} type="button" className="ml-3 btn btn-accept">
                      Confirm
                    </button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </>
        )}
        <button
          onClick={toggle}
          type="button"
          className="btn btn-outline-danger mx-2 mx-lg-5 mt-2 mt-lg-0 "
        >
          Leave Project
        </button>
        <Modal show={isShowing} size="lg" onHide={handleModalClose} centered>
          <Modal.Header className="bg-dark text-light">
            <Modal.Title>Are you sure?</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark ">
            <div>
              <p className="text-secondary">Are you sure you want to leave this project?</p>
              <div className="mt-2 container row justify-content-center">
                <button onClick={toggle} type="button" className="mr-3 btn btn-cancel">
                  Cancel
                </button>
                <button onClick={handleLeave} type="button" className="ml-3 btn btn-accept">
                  Confirm
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </form>
  );
}

export default ProjectNotesForm;
