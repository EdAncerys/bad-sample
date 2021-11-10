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

  return (
    <div className="card" style={styles.card}>
      <div className="card-body flex-col">
        <div className="flex-row pointer" onClick={handleGoToPath}>
          <span>
            <p className="card-text">{title}</p>
          </span>
          <span
            style={{
              backgroundColor: colors.silver,
              margin: 2,
              borderRadius: "50%",
            }}
          >
            <KeyboardArrowRightIcon />
          </span>
        </div>
      </div>
      <div
        style={{
          backgroundColor: colors.primary,
          height: 10,
          width: "100%",
        }}
      />
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
