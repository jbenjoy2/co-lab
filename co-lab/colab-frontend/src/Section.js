import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 1px;
  background-color: ${props => (props.isDragging ? "lightgreen" : "white")};
`;
function Section({ section, index }) {
  return (
    <Draggable key={section.dragId} draggableId={section.id} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          {section.name}
        </Container>
      )}
    </Draggable>
  );
}

export default Section;
