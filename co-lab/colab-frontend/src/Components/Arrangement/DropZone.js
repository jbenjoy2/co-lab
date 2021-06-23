import React from "react";
import styled from "styled-components";
import Section from "./Section";
import { Droppable } from "react-beautiful-dnd";
import ArrangementPiece from "./ArrangementPiece";

const Container = styled.div`
  margin: 8px;
  border: ${props =>
    props.columnId === "arrangements"
      ? props.length > 0
        ? "2px solid lightgrey"
        : "none"
      : "none"};
  border-radius: 15px;
  width: ${props => (props.columnId === "arrangements" ? "36vw" : "30vw")};
  max-width: 500px;
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const TaskList = styled.div`
  display: flex;
  background-color: ${props =>
    props.isDraggingOver ? "lightgrey" : props.length < 1 ? "white" : "transparent"};
  transition: background-color 0.2s ease;
  flex-direction: column;
  border-radius: 15px;
  padding: 5px;
`;

function DropZone({ title, sections, remove }) {
  const disabled = title === "sections";

  return (
    <Container columnId={`${title}`} length={sections.length}>
      <Droppable droppableId={title} isDropDisabled={disabled}>
        {(provided, snapshot) => (
          <TaskList
            ref={provided.innerRef}
            {...provided.droppableProdps}
            isDraggingOver={snapshot.isDraggingOver}
            columnId={title}
            length={sections.length}
          >
            {title === "sections" ? (
              sections.map((section, index) => (
                <Section key={section.dragId} section={section} index={index} source={title} />
              ))
            ) : sections.length > 0 ? (
              sections.map((section, index) => (
                <ArrangementPiece
                  key={section.dragId}
                  section={section}
                  index={index}
                  source={title}
                  remove={remove}
                />
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center"
                }}
              >
                Drag a section to begin creating a new arrangement
              </div>
            )}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  );
}

export default DropZone;
