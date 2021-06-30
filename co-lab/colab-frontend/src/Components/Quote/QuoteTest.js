import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import LoadingSpinner from "../auth/LoadingSpinner";
import useModal from "../../hooks/useModal";
import { Button } from "react-bootstrap";
import _ from "lodash";
import ColabAPI from "../../api/colabApi";

function Quotetest() {
  const [quote, setQuote] = useState({});
  const [loading, setLoading] = useState(false);
  const { isShowing, toggle } = useModal();

  const getQuote = async () => {
    try {
      setQuote({});
      setLoading(true);
      const foundQuote = await ColabAPI.getQuote();
      setQuote(foundQuote);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalClose = () => {
    setQuote({});
    toggle();
  };
  return (
    <>
      <Button onClick={toggle}>Random Quote Inspo</Button>
      <Modal show={isShowing} size="lg" onHide={handleModalClose} centered>
        <Modal.Header className="bg-dark text-light">
          <Modal.Title>Get Quote</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark ">
          <div>
            <Button variant="secondary" className="mb-4" onClick={getQuote}>
              Get Quote
            </Button>
            {loading && <LoadingSpinner />}
            {!_.isEmpty(quote) && !loading && (
              <>
                <h6 style={{ color: "white" }} className="mt-2">
                  <u>Inspiration</u>
                </h6>
                <blockquote className="blockquote">
                  <p className="mb-0 text-light">{quote.q}</p>
                  <footer className="blockquote-footer">
                    <cite title="Source author">{quote.a}</cite>
                  </footer>
                </blockquote>
              </>
            )}
          </div>
          <span>
            Inspirational quotes provided by{" "}
            <a href="https://zenquotes.io/" target="_blank">
              ZenQuotes API
            </a>
          </span>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Quotetest;
