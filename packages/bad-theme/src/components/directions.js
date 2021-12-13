import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const Directions = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const endPoint = state.router.link;
  const data = state.source.get(endPoint);

  const [wpMenu, setWpMenu] = useState([]);
  const marginHorizontal = state.theme.marginHorizontal;
  const directions = endPoint.split("/").slice(1, -1);
  const directionLength = directions.length;
  const MARGIN = 10;
  let KEY = 0;

  useEffect(() => {
    // getting wp menu from state
    const data = state.theme.menu;
    if (!data) return;

    setWpMenu(data);
  }, [state.theme.menu]);

  // SERVERS ---------------------------------------------
  const ServePatchDirections = ({ item, nextKey }) => {
    let chevron = (
      <ChevronRightIcon style={{ fontSize: 16, color: colors.darkSilver }} />
    );
    if (nextKey === directionLength) chevron = null;

    // HELPERS ---------------------------------------------
    const handleGoToLink = () => {
      const goToPath = endPoint.split("/").slice(1, nextKey + 1);
      const goToLink = `/${goToPath.join("/")}`;
      actions.router.set(`${goToLink}`);
    };

    let TITLE_RENDER = item;
    wpMenu.map((menuItem) => {
      if (menuItem.child_items)
        menuItem.child_items.map((childItem) => {
          if (childItem.slug === item.toLowerCase())
            TITLE_RENDER = childItem.title;
        });
      if (menuItem.slug === item.toLowerCase()) TITLE_RENDER = menuItem.title;
    });

    return (
      <div>
        <div className="flex-row" style={styles.link} onClick={handleGoToLink}>
          <div style={styles.linkValue}>
            <Html2React html={TITLE_RENDER} />
          </div>
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
          You're here:
        </div>
      </div>
    );
  };

  if (data.isError) return null;

  return (
    <div
      style={{
        backgroundColor: colors.lightSilver,
        margin: `0 ${marginHorizontal}px`,
      }}
    >
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
    fontSize: 14,
    fontWeight: "bold",
    color: colors.blue,
    textTransform: "capitalize",
  },
};

export default connect(Directions);
