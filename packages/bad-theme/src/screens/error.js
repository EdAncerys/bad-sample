import React from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";

const Error = ({ state }) => {
  return (
    <div style={styles.container}>
      <div>
        <div className="primary-title" style={styles.title}>
          404 Error
        </div>
        <div>
          The path <em>{state.router.link}</em> cannot be found.
        </div>
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
    fontSize: 26,
    fontWeight: "500",
    color: colors.primary,
  },
};

export default connect(Error);
