import React, { useState } from "react";

import RhymeForm from "./RhymeForm";
import Modal from "react-bootstrap/Modal";
import LoadingSpinner from "../auth/LoadingSpinner";
import useModal from "../../hooks/useModal";
import { Button } from "react-bootstrap";
import ColabAPI from "../../api/colabApi";
import "./RhymeTest.css";
function Rhymetest(props) {
  const [word, setWord] = useState("");
  const [rhymes, setRhymes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isShowing, toggle } = useModal();

  const findRhymes = async word => {
    try {
      setWord(word);
      setLoading(true);
      const foundRhymes = await ColabAPI.getRhymes(word);
      setRhymes(foundRhymes);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalClose = () => {
    setRhymes([]);
    setWord("");
    toggle();
  };
  return (
    <>
      <Button onClick={toggle}>Rhyme Time</Button>
      <Modal show={isShowing} onHide={handleModalClose} className="RhymeModal" centered>
        <Modal.Header className="bg-dark text-light" closeButton>
          <Modal.Title>Find Rhymes</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark">
          <div>
            <RhymeForm search={findRhymes} />
            {loading && <LoadingSpinner />}
            {word.length > 0 && !loading && (
              <h3 style={{ color: "white" }} className="ml-3 mt-4">
                Words that rhyme with '{word}':{" "}
              </h3>
            )}
            <div style={{ maxHeight: "50vh", overflowY: "scroll" }}>
              <ol className="list-group ml-3 mr-3 mt-3">
                {rhymes.map((rhyme, idx) => (
                  <li
                    key={idx}
                    className="list-group-item list-group-item-success text-secondary d-flex justify-content-between align-items-center"
                  >
                    {rhyme.word}

                    <span className="badge badge-primary badge-pill">Score: {rhyme.score}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Rhymetest;
