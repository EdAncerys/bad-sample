import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { colors } from "../config/colors";

const ButtonsRow = ({ state, actions }) => {
  const array = [1, 2, 3, 4]; // TBD

  // SERVERS ---------------------------------------------
  const ServeCardComponent = ({ title }) => {
    return (
      <div className="card" style={styles.card}>
        <div className="card-body flex-col">
          <div className="flex-row">
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

  return (
    <div style={styles.container}>
      <div className="d-flex" style={{ justifyContent: "space-around" }}>
        {array.map((item) => {
          return <ServeCardComponent title="Education" />;
        })}
      </div>
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
  cardWrapper: {
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
  },
};

export default connect(ButtonsRow);
