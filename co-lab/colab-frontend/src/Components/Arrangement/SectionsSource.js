import React from "react";
import DropZone from "./DropZone";
import styled from "styled-components";

const Title = styled.h3`
  padding: 8px;
  text-align: center;
  color: white;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

function SectionsSource({ sections }) {
  /**
   * Wrapper component for dropzone housing the sections source array
   * props: sections array
   *
   */
  return (
    <Container>
      <Title>Sections</Title>
      <DropZone title="sections" sections={sections} />
    </Container>
  );
}

export default SectionsSource;
