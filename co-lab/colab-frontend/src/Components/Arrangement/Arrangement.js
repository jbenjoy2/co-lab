import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import SectionsSource from "./SectionsSource";
import SectionsDest from "./SectionsDest";
import { v4 as uuid } from "uuid";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import up from "./audio/buttonUp.mp3";
import down from "./audio/buttonDown.mp3";
import whoosh from "./audio/whoosh.mp3";
import useSound from "use-sound";
import ToolBar from "./Buttons";
import { useParams, Redirect } from "react-router-dom";
import ColabAPI from "../../api/colabApi";
import Alert from "react-bootstrap/Alert";

const Container = styled.div`
  display: flex;
  width: 100vw;
  justify-content: space-evenly;
  border-bottom: none;
  margin-top: 2vw;
`;

function Arrangement() {
  /**
   * main arrangement components- no props
   * renders main arrangement lab with drag and drop components
   *
   *
   */
  const { projectId } = useParams();
  const [playUp] = useSound(up);
  const [playDown] = useSound(down);
  const [playWhoosh] = useSound(whoosh);
  const [sectionsAPI, setSectionsAPI] = useState([]);
  const [arrangements, setArrangements] = useState([]);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // get current project arrangement on page load for given projectId
  useEffect(() => {
    async function getProjectArrangement() {
      try {
        const arrangement = await ColabAPI.getArrangement(projectId);
        // don't display the default arrangement piece with no section associated with it
        const usableArrangements = arrangement.filter(arr => arr.sectionId !== null);
        // save in state and add a dragId
        setArrangements(
          usableArrangements.map(arr => ({
            ...arr,
            dragId: uuid()
          }))
        );
      } catch (error) {
        if (error.status && error.status !== 404) {
          // redirect to dashboard if an error occurs
          setIsRedirecting(true);
        }
      }
    }
    getProjectArrangement();
  }, [projectId]);

  // get all sections from database on page load and save to state WITH dragId
  useEffect(() => {
    async function getSections() {
      const sections = await ColabAPI.getSections();
      setSectionsAPI(
        sections.map(section => {
          return {
            sectionId: section.id,
            sectionName: section.name,
            dragId: uuid()
          };
        })
      );
    }
    getSections();
  }, []);

  // helper function to move arrangement pieces around within their own container and rearrange order
  const adjustOrder = (arr, startIdx, endIdx) => {
    const arrCopy = [...arr];
    const [removed] = arrCopy.splice(startIdx, 1);
    arrCopy.splice(endIdx, 0, removed);

    return arrCopy;
  };

  // helper function to copy section from the main sections container into the destination arrangement container
  const copyItem = (source, dest, droppableSource, droppableDest) => {
    const sourceCopy = Array.from(source);
    const destCopy = Array.from(dest);

    const itemToCopy = sourceCopy[droppableSource.index];

    destCopy.splice(droppableDest.index, 0, { ...itemToCopy, dragId: uuid() });

    return destCopy;
  };

  // helper function to delete a section from the main arrangement container
  const removeItem = dragId => {
    const filtered = arrangements.filter(arr => arr.dragId !== dragId);
    setArrangements(filtered);
  };

  // helper function to handle what happens when the drag operation ends
  const handleDragEnd = result => {
    const { destination, source } = result;
    if (!destination) {
      playWhoosh();
      return;
    }
    // case by case based on the origin of the drag
    switch (source.droppableId) {
      case destination.droppableId:
        if (destination.droppableId === "sections") break;
        const reordered = adjustOrder(arrangements, source.index, destination.index);
        setArrangements([...reordered]);
        break;
      case "sections":
        if (destination.droppableId === "sections") break;
        const copied = copyItem(sectionsAPI, arrangements, source, destination);
        setArrangements([...copied]);
        break;
      default:
        break;
    }
    playUp();
  };

  // helper function to add a position key to each arrangement object
  const addPosition = arrangements => {
    const data = Array.from(arrangements);
    const added = data.map((arr, idx) => {
      const secId = arr.sectionId;
      return arr.id
        ? {
            id: arr.id,
            section: secId,
            position: idx
          }
        : {
            section: secId,
            position: idx
          };
    });

    return added;
  };

  // helper function ito save current arrangement state in database when save button is pressed
  const handleSubmit = async projectId => {
    const withPosition = addPosition(arrangements);

    try {
      await ColabAPI.updatedProjectArrangement(projectId, { data: withPosition });
      setSuccess(true);
    } catch (error) {
      setErrors(errors => [...errors, error]);
    }
  };
  if (isRedirecting) {
    return <Redirect to="/" />;
  }
  return (
    <div>
      <Helmet>
        <title>Colab - Arrangement Lab</title>
      </Helmet>
      <DragDropContext onDragStart={playDown} onDragEnd={handleDragEnd}>
        <Container>
          <SectionsSource sections={sectionsAPI} />
          <SectionsDest sections={arrangements} remove={removeItem} />
        </Container>
      </DragDropContext>
      <ToolBar submit={handleSubmit} projectId={projectId} length={arrangements.length} />
      {success && (
        <div className="container text-center mt-4">
          <Alert
            variant="success"
            onClose={() => setSuccess(false)}
            dismissible
            className="mt-2 mb-0"
          >
            Arrangement Successfully Updated!
          </Alert>
        </div>
      )}
      {errors.length > 0 && (
        <div className="container text-center mt-4">
          <Alert variant="danger" onClose={() => setErrors([])} dismissible className="mt-2 mb-0">
            Arrangement could not be updated
          </Alert>
        </div>
      )}
    </div>
  );
}

export default Arrangement;
