import { useState, useEffect } from "react";
import { connect } from "frontity";

import Loading from "../components/loading";
import RowButton from "./rowButton";

const ButtonsRow = ({ state, actions, style, block }) => {
  if (!block) return <Loading />;
  if (!block.add_buttons) return null; // if toggle set to false

  // RETURN ---------------------------------------------------
  return (
    <div style={styles.container}>
      {block.buttons.map((block, key) => {
        return (
          <RowButton
            key={key}
            block={block}
            // buttonWidth="100%"
          />
        );
      })}
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(4, 1fr)`,
    justifyContent: "space-between",
    gap: 10,
  },
};

export default connect(ButtonsRow);
