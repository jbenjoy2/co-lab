import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import { shadows } from "./shadows";
function getStyle(style, snapshot) {
  if (!snapshot.isDropAnimating) {
    return style;
  }

  // patching the existing style
  return {
    ...style,
    transitionDuration: `0.04s`
  };
}
const colors = {
  Intro: "#ff6666",
  Verse: "#ff8c66",
  Prechorus: "#ffb366",
  Refrain: "#ffd966",
  Chorus: "#ffff66",
  Bridge: "#d9ff66",
  Outro: "#b3ff66",
  "Re-in": "#66ffb3",
  Solo: "#66ffff",
  Interlude: "#66b3ff"
};
const Container = styled.div`
  text-align: center;
  color: #ffffff;
  background: darkslategrey;
  text-shadow: 2px 2px 0 ${props => props.shadow}, 2px -2px 0 ${props => props.shadow},
    -2px 2px 0 ${props => props.shadow}, -2px -2px 0 ${props => props.shadow},
    2px 0px 0 ${props => props.shadow}, 0px 2px 0 ${props => props.shadow},
    -2px 0px 0 ${props => props.shadow}, 0px -2px 0 ${props => props.shadow};
  position: relative;
  display: flex;
  user-select: none;
  margin-bottom: 1%;
  padding: 0.5rem;
  font-size: calc(1vw + 10px);
  min-height: 50px;
  height: 7vw;
  max-height: 50px;
  border-radius: 15px;
  background: #fff;
  border: 1px ${props => (props.isDragging ? "dashed #4099ff" : "solid #ddd")};
  background-color: ${props => props.color};
  -webkit-box-shadow: inset 0px -1px 8px 7px ${props => props.shadow};
  box-shadow: inset 0px -1px 8px 7px ${props => props.shadow};
  transition: all ease-in 10ms ease-out 800ms;

  &:hover {
    transform: scale(1.003);
    opacity: 0.88;
  }
`;
const Clone = styled(Container)`
  + div {
    display: hidden;
  }
`;

function Section({ section, index, source }) {
  return (
    <Draggable key={section.dragId} draggableId={section.dragId} index={index}>
      {(provided, snapshot) => (
        <>
          <Container
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            isDragging={snapshot.isDragging}
            color={colors[section.sectionName]}
            style={getStyle(provided.draggableProps.style, snapshot)}
            shadow={shadows[section.sectionName]}
          >
            {section.sectionName}
          </Container>
          {snapshot.isDragging && (
            <Clone color={colors[section.sectionName]} shadow={shadows[section.sectionName]}>
              {section.sectionName}
            </Clone>
          )}
          {provided.placeholder}
        </>
      )}
    </Draggable>
  );
}

export default Section;
