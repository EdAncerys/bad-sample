import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";

import Loading from "./loading";

const TitleBlock = ({ state, actions,libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  
  const { label, link, title } = block;
  if (!title.length) return null;
  if (!label.length) return null;

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
          <div className="card-title" style={{ fontSize: "1.75em" }}>
          <Html2React html={title} />
          </div>
        </div>

        <div onClick={handleGoToPath}>
          <div style={styles.footerActionTitle}>
          <Html2React html={label} />
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
