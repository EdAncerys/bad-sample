import { styled } from "frontity";
import { CircularProgress } from "@mui/material";
import { colors } from "../config/colors";

const Loading = ({ padding, alignSelf, background }) => {
  const componentPadding = padding || 24;

  return (
    <Container
      style={{ padding: componentPadding, alignSelf: alignSelf || "center" }}
    >
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

const Container = styled.div`
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;
