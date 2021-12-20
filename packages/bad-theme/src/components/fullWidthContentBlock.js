import { useState, useEffect } from "react";
import { connect } from "frontity";
import BlockWrapper from "./blockWrapper";
import { colors } from "../config/colors";

import { setGoToAction } from "../context";
import Loading from "./loading";

const FullWidthContentBlock = ({
  state,
  actions,
  libraries,
  block,
  disableMargin,
  heroBanner,
  disablePadding,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const { background_colour, body, label, link, padding, text_align, title } =
    block;

  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  let ALIGNMENT = "start";
  let MARGIN = `0 0`;
  if (text_align === "centre") ALIGNMENT = "center";
  if (text_align === "right") ALIGNMENT = "end";
  if (padding === "medium") MARGIN = `0 10%`;
  if (padding === "large") MARGIN = `0 15%`;
  if (disableMargin) MARGIN = `0 0 0 ${marginHorizontal}px`;

  let PADDING = `0 ${marginHorizontal}px`;
  if (heroBanner) PADDING = `0 1em 0 ${marginHorizontal}px`;
  if (disablePadding) PADDING = 0;

  let BACKGROUND_COLOUR = background_colour || "transparent";

  // SERVERS ----------------------------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div>
        <div
          className="card-text"
          style={{
            fontSize: 36,
            fontFamily: "Roboto",
            fontWeight: "bold",
            color: colors.black,
          }}
        >
          <Html2React html={title} />
        </div>
      </div>
    );
  };

  const ServeCardBody = () => {
    if (!body) return null;

    return (
      <div
        className="flex-col text-body"
        style={{
          fontSize: 16,
          margin: `2em 0`,
          // limit container height
          // maxHeight: BANNER_HEIGHT / 1.25,
          // overflow: "auto",
        }}
      >
        <div className="card-text">
          <Html2React html={body} />
        </div>
      </div>
    );
  };

  const ServeActions = () => {
    if (!label) return null;

    return (
      <div>
        <div className="flex" style={{ justifyContent: ALIGNMENT }}>
          <button
            className="btn"
            style={{
              fontSize: 16,
              color: colors.white,
              backgroundColor: colors.primary,
            }}
            onClick={() => setGoToAction({ path: link.url, actions })}
          >
            <Html2React html={label} />
          </button>
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div
      style={{
        justifyContent: "center",
        textAlign: ALIGNMENT,
        backgroundColor: BACKGROUND_COLOUR,
        minHeight: heroBanner ? BANNER_HEIGHT : "auto",
        padding: PADDING,
      }}
    >
      <div style={{ margin: heroBanner ? 0 : MARGIN, padding: `2em 0` }}>
        <ServeTitle />
        <ServeCardBody />
        <ServeActions />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(FullWidthContentBlock);
