import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";

import Loading from "./loading";

const TitleBlock = ({ state, actions, block }) => {
  if (!block) return <Loading />;

  const { label, link, title } = block;
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // HELPERS ---------------------------------------------
  const handleGoToPath = () => {
    // console.log("url", url); // debug
    if (!link.url) return null;
    actions.router.set(`${link.url}`);
  };

  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div className="flex-row">
        <div className="flex">
          <h5 className="card-title" style={{ fontSize: "1.75em" }}>
            {title}
          </h5>
        </div>

        <div onClick={handleGoToPath}>
          <div style={styles.footerActionTitle}>
            <p className="card-text">{label}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  footerActionTitle: {
    marginRight: 25,
    borderBottom: `1px solid ${colors.black}`,
    textTransform: "uppercase",
    fontSize: "0.75em",
    cursor: "pointer",
  },
};

export default connect(TitleBlock);
