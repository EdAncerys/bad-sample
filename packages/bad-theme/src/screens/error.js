import React from "react";
import { connect } from "frontity";
import { colors } from "../config/imports";

// CONTEXT ----------------------------------------------------------------
import { setGoToAction } from "../context";

const Error = ({ state, actions }) => {
  // SERVERS ----------------------------------------------------
  const ServeActions = () => {
    return (
      <div style={{ alignSelf: "center", paddingTop: "1em" }}>
        <div
          className="blue-btn-reverse"
          style={{ width: "fit-content" }}
          onClick={() => setGoToAction({ state, path: "/", actions })}
        >
          Return to BAD home
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div className="flex-col" style={{ textAlign: "center" }}>
        <div
          className="primary-title"
          style={{
            fontSize: 96,
            fontWeight: "500",
            color: colors.primary,
          }}
        >
          404
        </div>
        <div
          className="primary-title"
          style={{
            fontSize: 26,
            fontWeight: "500",
            color: colors.primary,
            padding: "1em 0",
          }}
        >
          Something went wrong.
        </div>

        <ServeActions />
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
    marginTop: "10%",
    padding: "4em 0",
  },
};

export default connect(Error);
