import React from "react";
import { connect } from "frontity";

import { colors } from "../config/colors";

const Error = ({ state }) => {
  return (
    <div style={styles.container}>
      <div>
        <h2 style={styles.title}>404 Error</h2>
        <p>
          The path <em>{state.router.link}</em> cannot be found.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "5%",
  },
  title: {
    fontSize: 40,
    fontWeight: "500",
    color: colors.primary,
  },
};

export default connect(Error);
