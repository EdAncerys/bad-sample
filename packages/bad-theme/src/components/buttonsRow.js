import { useState, useEffect } from "react";
import { connect } from "frontity";

import RowButton from "./rowButton";
import { DATA } from "../config/data";

const ButtonsRow = ({ state, actions, style, data }) => {
  const PROPS = style || {};
  const array = data || DATA; // TBD

  return (
    <div>
      <div className="flex" style={{ ...PROPS }}>
        {array.map((item) => {
          return <RowButton key={item.id} item={item} />;
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(ButtonsRow);
