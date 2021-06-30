import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import useSound from "use-sound";
import crumple from "./audio/crumple.mp3";
import Button from "react-bootstrap/Button";
import { shadows } from "./shadows";

function getStyle(style, snapshot) {
  if (!snapshot.isDropAnimating) {
    return style;
  }

  // patching the existing style
  return {
    ...style,
    transitionDuration: `0.001s`
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
  margin-bottom: 1%;
  display: flex;
  justify-content: space-between;
  user-select: none;
  padding: 0.5rem;
  min-height: 50px;
  height: 7vw;
  max-height: 50px;
  font-size: 2vw;
  line-height: 1.5;
  border-radius: 15px;
  background: ${props => props.color};
  -webkit-box-shadow: inset 0px -1px 8px 7px ${props => props.shadow};
  box-shadow: inset 0px -1px 8px 7px ${props => props.shadow};
  border: 1px ${props => (props.isDragging ? "dashed #4099ff" : "solid #ddd")};
`;

const Clone = styled(Container)`
  + div {
    display: none !important;
  }
`;

function ArrangementPiece({ section, index, source, remove }) {
  const [playCrumple] = useSound(crumple);
  return (
    <Draggable key={section.dragId} draggableId={section.dragId} index={index}>
      {(provided, snapshot) => (
        <>
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
            color={colors[section.sectionName]}
            shadow={shadows[section.sectionName]}
            style={getStyle(provided.draggableProps.style, snapshot)}
          >
            <span style={{ alignSelf: "center" }}>{section.sectionName.toUpperCase()}</span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                remove(section.dragId);
                playCrumple();
              }}
            >
              ❌
            </Button>
          </Container>
          {snapshot.isDragging && source === "sections" && <Clone>{section.sectionName}</Clone>}
        </>
      )}
    </Draggable>
  );
}

export default ArrangementPiece;
