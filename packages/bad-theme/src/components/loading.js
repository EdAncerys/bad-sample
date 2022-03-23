import { styled, keyframes, css } from "frontity";
import { CircularProgress } from "@mui/material";
import { colors } from "../config/colors";

// const scale = keyframes`
//   0% {transform: scaley(1.0)}
//   50% {transform: scaley(0.4)}
//   100% {transform: scaley(1.0)}
// `;

const Loading = ({ padding }) => {
  const componentPadding = padding || 24;

  return (
    <Container style={{ padding: componentPadding }}>
      <div
        style={{
          display: "grid",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          color: colors.primary,
        }}
      >
        <CircularProgress color="inherit" />
      </div>
    </Container>
  );
};

export default Loading;

const bar = (index) => css`
  background-color: rgba(12, 17, 43, 0.3);
  width: 4px;
  height: 24px;
  margin: 3px;
  border-radius: 0;
  display: inline-block;
  animation: ${scale} 1s ${index * 0.1}s infinite
    cubic-bezier(0.2, 0.68, 0.18, 1.08);
  animation-fill-mode: both;
`;

const Container = styled.div`
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  & > * {
    margin-top: 24px;
  }
`;
