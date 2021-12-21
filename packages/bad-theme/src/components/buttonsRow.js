import { useState, useEffect } from "react";
import { connect } from "frontity";

import Loading from "../components/loading";
import RowButton from "./rowButton";
import { setGoToAction } from "../context";

const ButtonsRow = ({ state, actions, style, block, disableMargin }) => {
  if (!block) return <Loading />;
  if (!block.buttons) return null;

  const { disable_vertical_padding } = block;

  let BUTTON_COUNT = 4;
  if (block.button_width === "33%") BUTTON_COUNT = 3;
  if (block.button_width === "100%") BUTTON_COUNT = 1;

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // RETURN ---------------------------------------------------
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${BUTTON_COUNT}, 1fr)`,
        justifyContent: "space-between",
        gap: 10,
        margin: disableMargin ? 0 : `${marginVertical}px ${marginHorizontal}px`,
      }}
    >
      {block.buttons.map((block, key) => {
        return (
          <RowButton key={key} block={block} style={{ cursor: "pointer" }} />
        );
      })}
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(ButtonsRow);
