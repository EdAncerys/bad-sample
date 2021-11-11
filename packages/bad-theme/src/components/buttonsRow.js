import { useState, useEffect } from "react";
import { connect } from "frontity";

import RowButton from "./rowButton";

const ButtonsRow = ({ state, actions, style }) => {
  const array = [1, 2, 3, 4]; // TBD
  const PROPS = style || {};

  return (
    <div>
      <div className="flex" style={{ ...PROPS }}>
        {array.map((item) => {
          return <RowButton key={item} title="Education" url />;
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(ButtonsRow);
