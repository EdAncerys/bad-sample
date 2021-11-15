import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const SCREEN_NAME = ({ state, actions }) => {
  const endPoint = state.router.link;
  const directions = endPoint.split("/").slice(1, -1);
  const directionLength = directions.length;
  const MARGIN = 10;
  let KEY = 0;

  // SERVERS ---------------------------------------------
  const ServePatchDirections = ({ item, nextKey }) => {
    let chevron = (
      <ChevronRightIcon style={{ fontSize: 16, color: colors.silver }} />
    );
    if (nextKey === directionLength) chevron = null;

    return (
      <div>
        <div className="flex-row" style={styles.link}>
          <div style={styles.linkValue}>{item}</div>
          <div style={{ margin: `0 ${MARGIN}px` }}>{chevron}</div>
        </div>
      </div>
    );
  };

  const ServeTitle = () => {
    return (
      <div>
        <div
          className="flex"
          style={{
            marginRight: MARGIN * 2,
            fontSize: 14,
            alignItems: "center",
          }}
        >
          You’re here:
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div className="flex" style={styles.wrapper}>
        <ServeTitle />
        {directions.map((item) => {
          KEY += 1;
          return <ServePatchDirections key={KEY} item={item} nextKey={KEY} />;
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: colors.lightSilver,
  },
  wrapper: {
    height: 75,
    flexWrap: "wrap",
    alignItems: "center",
  },
  link: {
    alignItems: "center",
    fontSize: 14,
  },
  linkValue: {
    color: colors.lightBlue,
  },
};

export default connect(SCREEN_NAME);
