import { useState, useEffect } from "react";
import { connect } from "frontity";

import Loading from "../components/loading";
import RowButton from "./rowButton";

const ButtonsRow = ({ state, actions, style, item }) => {
  if (!item) return <Loading />;
  // RETURN ---------------------------------------------------
  return (
    <div className="flex" style={{ ...style }}>
      {item.map((item) => {
        return <RowButton key={item.id} item={item} buttonWidth="100%" />;
      })}
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(ButtonsRow);
