import { useState, useEffect } from "react";
import { connect } from "frontity";

import parse from "html-react-parser";

import Loading from "./loading";
import { setGoToAction, muiQuery } from "../context";

const TitleBlock = ({
  state,
  actions,
  libraries,
  block,
  disableMargin,
  disableHorizontalMargin,
  margin,
  fontSize,
}) => {
  const { sm, md, lg, xl } = muiQuery();

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const { label, link, title, text_align, disable_vertical_padding } = block;

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  let ALIGNMENT = "start";
  if (text_align === "centre") ALIGNMENT = "center";
  if (text_align === "right") ALIGNMENT = "end";

  let MARGIN = `${marginVertical}px ${marginHorizontal}px 0 ${marginHorizontal}px`;
  if (disableMargin) MARGIN = 0;
  if (disableHorizontalMargin) MARGIN = `${marginVertical}px 0 0`;
  if (margin) MARGIN = margin;

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    if (!link) return null;
    let LABEL = "More";

    return (
      <div
        className="caps-btn"
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
        className="flex primary-title"
        style={{
          fontSize: fontSize || 26,
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
        margin: MARGIN,
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
