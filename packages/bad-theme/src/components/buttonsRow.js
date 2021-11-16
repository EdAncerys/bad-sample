import { useState, useEffect } from "react";
import { connect } from "frontity";

import Loading from "../components/loading";
import RowButton from "./rowButton";

const ButtonsRow = ({ state, actions, style, block }) => {
  if (!block) return <Loading />;
  let KEY = 0;

  // RETURN ---------------------------------------------------
  return (
    <div className="flex" style={{ ...style }}>
      {block.buttons.map((block) => {
        KEY += 1;

        return (
          <RowButton
            key={KEY}
            block={block}
            // buttonWidth="100%"
          />
        );
      })}
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(ButtonsRow);
