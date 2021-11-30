import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";

import Loading from "./loading";

const TitleBlock = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const { label, link, title, text_align } = block;
  if (!title.length) return null;
  if (!label.length) return null;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  let ALIGNMENT = "start";
  if (text_align === "centre") ALIGNMENT = "center";
  if (text_align === "right") ALIGNMENT = "end";

  // HELPERS ---------------------------------------------
  const handleGoToPath = () => {
    // console.log("url", url); // debug
    if (!link.url) return null;
    actions.router.set(`${link.url}`);
  };

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    if (!label) return null;

    return (
      <div
        style={{
          borderBottom: `1px solid ${colors.black}`,
          textTransform: "uppercase",
          fontSize: "0.75em",
          cursor: "pointer",
          marginLeft: `2em`,
        }}
        onClick={handleGoToPath}
      >
        <Html2React html={label} />
      </div>
    );
  };

  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div className="flex-row" style={{ alignItems: "center" }}>
        <div
          className="flex"
          style={{
            fontSize: 27,
            fontWeight: "bold",
            textAlign: ALIGNMENT,
            justifyContent: ALIGNMENT,
          }}
        >
          <Html2React html={title} />
        </div>

        <ServeActions />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(TitleBlock);
