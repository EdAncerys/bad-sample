import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const RowButton = ({ state, actions, title, url }) => {
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
          backgroundColor: colors.primary,
          height: 5,
          width: "100%",
        }}
      />
    );
  };

  return (
    <div className="card" style={styles.card}>
      <div className="card-body flex-center-col">
        <div className="flex-center-row pointer" onClick={handleGoToPath}>
          <span>
            <p className="card-text">{title}</p>
          </span>
          <span
            style={{
              backgroundColor: colors.lightSilver,
              margin: 2,
              borderRadius: "50%",
            }}
          >
            <KeyboardArrowRightIcon />
          </span>
        </div>
      </div>
      <ServeFooter />
    </div>
  );
};

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    margin: `0 10px`,
    width: "30%",
  },
};

export default connect(RowButton);
