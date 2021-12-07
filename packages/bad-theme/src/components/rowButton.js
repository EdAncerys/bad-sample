import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { setGoToAction } from "../context";

const RowButton = ({ state, actions, libraries, block, onClick }) => {
  // block: object
  // onClick action
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const { title, colour, link } = block;
  const THEME = colour || colors.primary;
  let LABEL = title;
  if (!title && link) LABEL = link.title;

  // SERVERS --------------------------------------------
  const ServeFooter = () => {
    return (
      <div
        style={{
          backgroundColor: THEME,
          height: 5,
          width: "100%",
        }}
      />
    );
  };

  return (
    <div
      className="shadow"
      style={{
        ...styles.container,
        backgroundColor: colors.white,
        width: "100%",
      }}
    >
      <div className="flex-col" style={{ padding: `1em` }}>
        <div
          className="flex-row pointer"
          onClick={() => {
            if (onClick) {
              onClick();
            } else {
              if (!link) return null;
              setGoToAction({ path: link.url, actions });
            }
          }}
        >
          <div
            className="flex"
            style={{
              fontWeight: "bold",
              fontSize: 12,
              textTransform: "uppercase",
              justifyContent: "start",
              alignItems: "center",
              letterSpacing: 2,
            }}
          >
            <Html2React html={LABEL} />
          </div>
          <div>
            <KeyboardArrowRightIcon
              style={{
                fill: colors.white,
                backgroundColor: THEME,
                borderRadius: "50%",
                padding: 0,
              }}
            />
          </div>
        </div>
      </div>
      <ServeFooter />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
};

export default connect(RowButton);
