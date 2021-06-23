import React from "react";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import useModal from "../../hooks/useModal";
import { useHistory } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

function ToolBar({ submit, projectId }) {
  const history = useHistory();
  const { isShowing, toggle } = useModal();

  const handleModalClose = () => {
    toggle();
  };
  return (
    <Container className="d-grid gap-2">
      {/* Stack the columns on mobile by making one full-width and the other half-width */}
      <Row>
        <Col xs={12} md={6} className="text-center mb-4 m-md-0">
          <Button onClick={toggle} variant="outline-danger" block>
            Back to Project Main
          </Button>
        </Col>
        <Col xs={12} md={6} className="text-center">
          <Button
            onClick={() => {
              submit(projectId);
            }}
            variant="success"
            block
          >
            Save
          </Button>
        </Col>
      </Row>
      <Modal show={isShowing} size="lg" onHide={handleModalClose} centered>
        <Modal.Header className="bg-dark text-light">
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark ">
          <div>
            <p className="text-secondary">
              Are you sure you want to exit? Any unsaved changes will be lost
            </p>
            <div className="mt-2 container row justify-content-center">
              <Button onClick={toggle} variant="outline-danger" className="mr-3">
                Cancel
              </Button>
              <Button
                onClick={() => history.push(`/${projectId}`)}
                variant="outline-primary"
                className="ml-3"
              >
                Confirm
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default ToolBar;
