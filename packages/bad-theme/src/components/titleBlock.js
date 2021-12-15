import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";

import Loading from "./loading";
import { setGoToAction } from "../context";

const TitleBlock = ({ state, actions, libraries, block, disableMargin }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const { label, link, title, text_align } = block;

  console.log("block----", block);

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  let ALIGNMENT = "start";
  if (text_align === "centre") ALIGNMENT = "center";
  if (text_align === "right") ALIGNMENT = "end";

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    if (!link) return null;
    let LABEL = "More";
    if (label) LABEL = label;

    return (
      <div
        style={{
          borderBottom: `1px solid ${colors.textMain}`,
          textTransform: "uppercase",
          fontSize: "0.75em",
          cursor: "pointer",
          marginLeft: `2em`,
        }}
        onClick={() => setGoToAction({ path: link.url, actions })}
      >
        <Html2React html={LABEL} />
      </div>
    );
  };

  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div
        className="flex"
        style={{
          fontSize: 36,
          fontWeight: "bold",
          color: colors.black,
          textAlign: ALIGNMENT,
          justifyContent: ALIGNMENT,
        }}
      >
        <Html2React html={title} />
      </div>
    );
  };

  return (
    <div
      style={{
        margin: disableMargin ? 0 : `${marginVertical}px ${marginHorizontal}px`,
      }}
    >
      <div className="flex-row" style={{ alignItems: "center" }}>
        <ServeTitle />
        <ServeActions />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(TitleBlock);
