import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const RowButton = ({ state, actions, block, buttonWidth }) => {
  const { label, theme, link } = block;
  const THEME = colors[theme] || colors.primary;

  // Manage max string Length
  const MAX_LENGTH = 24;
  let titlePreview;
  if (label) {
    titlePreview = `${label.substring(0, MAX_LENGTH)}...`;
    if (label.length < MAX_LENGTH) titlePreview = label;
  }

  // HELPERS ---------------------------------------------
  const handleGoToPath = () => {
    actions.router.set(`${link}`);
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
            <p className="card-text">{titlePreview}</p>
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
