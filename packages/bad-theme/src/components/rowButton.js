import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const RowButton = ({ state, actions, title, url, themeColor }) => {
  const THEME = themeColor || colors.primary;

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
          <div className="flex">
            <p className="card-text">{title}</p>
          </div>
          <div
            style={{
              backgroundColor: THEME,
              borderRadius: "50%",
            }}
          >
            <KeyboardArrowRightIcon style={{ fill: colors.white }} />
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
    margin: `0 10px`,
    width: "25%",
  },
};

export default connect(RowButton);
