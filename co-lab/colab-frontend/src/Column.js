import React from "react";
import styled from "styled-components";
import Section from "./Section";
import { Droppable } from "react-beautiful-dnd";
const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: ${props => (props.columnId === "arrangement" ? "220px" : "110px")};
  display: flex;
  flex-direction: column;
`;
const Title = styled.h3`
  padding: 8px;
`;
const TaskList = styled.div`
  background-color: ${props => (props.isDraggingOver ? "skyblue" : "white")};
  transition: background-color 0.2s ease;
  flex-grow: 1;
  min-height: 350px;
`;

function Column({ column, sections }) {
  return (
    <Container columnId={column.id}>
      <Title>{column.title}</Title>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <TaskList
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {sections.map((section, index) => (
              <Section key={section.id} section={section} index={index} />
            ))}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  );
}

export default Column;
