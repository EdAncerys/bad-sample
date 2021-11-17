import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const RowButton = ({ state, actions, libraries, block, buttonWidth }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const { title, color, link } = block;
  const THEME = color || colors.primary;

  // HELPERS ---------------------------------------------
  const handleGoToPath = () => {
    actions.router.set(`${link.url}`);
    // console.log("link", link); // debug
  };

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
        marginRight: "10px",
        width: buttonWidth || "25%",
      }}
    >
      <div className="card-body flex-col">
        <div
          className="flex-row pointer"
          style={{ margin: "5px 0", alignItems: "center" }}
          onClick={handleGoToPath}
        >
          <div
            className="flex"
            style={{ textTransform: "uppercase", fontSize: "13px" }}
          >
            <p className="card-text">{title}</p>
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
