import React from "react";
import styled from "styled-components";
import DropZone from "./DropZone";

const Title = styled.h3`
  padding: 8px;
  text-align: center;
  color: white;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

function SectionsDest({ sections, remove }) {
  return (
    <Container>
      <Title>Arrangement</Title>
      <DropZone title="arrangements" sections={sections} remove={remove} />
    </Container>
  );
}

export default SectionsDest;
