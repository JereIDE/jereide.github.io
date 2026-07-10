import styled from "styled-components";

const HighlightedText = styled.span`
  position: relative;
  -webkit-text-fill-color: #0000;
  background: linear-gradient(120deg, #00c7d1, #008a96);
  -webkit-background-clip: text;
  background-clip: text;
  color: #00c7d1;
  text-shadow: 0 0 1.8em #00c7d1;
`;

export default HighlightedText;
