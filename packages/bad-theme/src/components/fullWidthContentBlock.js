import { useState, useEffect } from "react";
import { connect } from "frontity";
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
  const paddingLeft = heroBanner ? `0 1em 0 ${marginHorizontal}px` : 0;
  let PADDING = `0 20%`;
  let ALIGNMENT = "start";
  if (text_align === "centre") ALIGNMENT = "center";
  if (text_align === "right") ALIGNMENT = "end";
  if (padding === "small") PADDING = `0 10%`;
  if (padding === "large") PADDING = `0 25%`;
  if (disablePadding) PADDING = `0 0 0 ${marginHorizontal}px`;

  // SERVERS ----------------------------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div>
        <div
          className="card-text"
          style={{
            fontSize: 36,
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
              textTransform: "capitalize",
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
      className="flex-col"
      style={{
        justifyContent: "center",
        textAlign: ALIGNMENT,
        backgroundColor: background_colour || "transparent",
        minHeight: heroBanner ? BANNER_HEIGHT : "auto",
        margin: disableMargin
          ? paddingLeft
          : `${marginVertical}px ${marginHorizontal}px`,
      }}
    >
      <div style={{ margin: heroBanner ? 0 : PADDING, padding: `2em 0` }}>
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
