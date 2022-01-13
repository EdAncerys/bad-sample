import { connect } from "frontity";

import Loading from "./loading";
import { colors } from "../config/imports";
import BlockWrapper from "./blockWrapper";

const DividerBlock = ({ state, actions, libraries, block }) => {
  if (!block) return <Loading />;

  const { block_height, divider, background_colour } = block;

  let height = state.theme.marginVertical;
  if (block_height) height = block_height;

  // SERVERS --------------------------------------------
  const ServeDivider = () => {
    if (!divider) return null;

    return (
      <div
        style={{
          backgroundColor: `rgb(0, 0, 0, 0.4)`,
          height: 1,
          width: "100%",
        }}
      />
    );
  };

  // RETURN ---------------------------------------------
  return (
    <div
      style={{
        display: "grid",
        alignItems: "center",
        height: `${height}px`,
        backgroundColor: background_colour,
      }}
    >
      <BlockWrapper>
        <ServeDivider />
      </BlockWrapper>
    </div>
  );
};

export default connect(DividerBlock);