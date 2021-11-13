import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const RowButton = ({ state, actions, item }) => {
  const { title, theme, url } = item;
  const THEME = colors[theme] || colors.primary;

  // Manage max string Length
  const MAX_LENGTH = 24;
  let titlePreview = `${title.substring(0, MAX_LENGTH)}...`;
  if (title.length < MAX_LENGTH) titlePreview = title;

  // HELPERS ---------------------------------------------
  const handleGoToPath = () => {
    actions.router.set(`${url}`);
    console.log("url", url);
  };

  // SERVERS ----------------------------------------------------------------
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
    <div className="card" style={styles.container}>
      <div className="card-body flex-col" style={{ margin: "5px 0" }}>
        <div className="flex-row pointer" onClick={handleGoToPath}>
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
    border: "none",
    margin: `0 10px`,
    width: "25%",
  },
};

export default connect(RowButton);
