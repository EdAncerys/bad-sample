import { useState, useEffect } from "react";
import { connect } from "frontity";

import RowButton from "./rowButton";

const ButtonsRow = ({ state, actions }) => {
  const array = [1, 2, 3, 4]; // TBD

  return (
    <div style={styles.container}>
      <div className="d-flex" style={{ justifyContent: "space-around" }}>
        {array.map((item) => {
          return <RowButton title="Education" url />;
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(ButtonsRow);
