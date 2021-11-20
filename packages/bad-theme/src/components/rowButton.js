import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const RowButton = ({
  state,
  actions,
  libraries,
  block,
  buttonWidth,
  onClick,
}) => {
  // block: object
  // buttonWidth: % value
  // onClick action

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const { title, colour, link } = block;
  const THEME = colour || colors.primary;

  // HELPERS ---------------------------------------------
  const handleGoToPath = () => {
    // console.log("link", link); // debug
    if (!link.url) return null;
    if (onClick) onClick();
    actions.router.set(`${link.url}`);
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
        width: buttonWidth || "100%",
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
