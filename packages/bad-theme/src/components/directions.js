import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const SCREEN_NAME = ({ state, actions }) => {
  const endPoint = state.router.link;
  const data = state.source.get(endPoint);

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

    // HELPERS ---------------------------------------------
    const handleGoToLink = () => {
      const goToPath = endPoint.split("/").slice(1, nextKey + 1);
      const goToLink = `/${goToPath.join("/")}`;
      actions.router.set(`${goToLink}`);
    };

    return (
      <div>
        <div className="flex-row" style={styles.link} onClick={handleGoToLink}>
          <div style={styles.linkValue}>{item}</div>
          <div style={{ margin: `0 ${MARGIN}px` }}>{chevron}</div>
        </div>
      </div>
    );
  };

  const ServeFallBack = () => {
    if (directionLength) return null;

    return <ServePatchDirections key={KEY} item={["home"]} nextKey={KEY} />;
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

  if (data.isError) return null;

  return (
    <div style={styles.container}>
      <div className="flex" style={styles.wrapper}>
        <ServeTitle />
        <ServeFallBack />
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
    cursor: "pointer",
  },
  linkValue: {
    color: colors.lightBlue,
  },
};

export default connect(SCREEN_NAME);
