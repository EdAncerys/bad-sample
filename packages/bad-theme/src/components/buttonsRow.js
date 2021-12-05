import { useState, useEffect } from "react";
import { connect } from "frontity";

import Loading from "../components/loading";
import RowButton from "./rowButton";

const ButtonsRow = ({ state, actions, style, block, disableMargin }) => {
  if (!block) return <Loading />;
  if (!block.buttons) return null;

  let BUTTON_COUNT = 4;
  if (block.button_width === "33%") BUTTON_COUNT = 3;
  if (block.button_width === "100%") BUTTON_COUNT = 1;

  // if (!block.add_buttons) return null; // if toggle set to false

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

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
        return <RowButton key={key} block={block} />;
      })}
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(ButtonsRow);
