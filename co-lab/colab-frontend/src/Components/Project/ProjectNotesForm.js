import React, { useState } from "react";
import { Form } from "react-bootstrap";

function ProjectNotesForm(props) {
  const [notes, setNotes] = useState(props.notes || "");
  const handleChange = e => {
    setNotes(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await props.save(props.projectId, notes);
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
      <button className="btn btn-secondary">Save Project</button>
    </form>
  );
}

export default ProjectNotesForm;
