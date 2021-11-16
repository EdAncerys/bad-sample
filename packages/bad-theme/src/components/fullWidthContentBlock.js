import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";

import Loading from "./loading";

const FullWidthContentBlock = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const BANNER_HEIGHT = 300;
  const {
    add_button,
    background_colour,
    body,
    label,
    link,
    padding,
    text_align,
    title,
  } = block;

  let PADDING = `0 20%`;
  let ALIGNMENT = "start";
  if (text_align === "centre") ALIGNMENT = "center";
  if (text_align === "right") ALIGNMENT = "end";
  if (padding === "small") PADDING = `0 10%`;
  if (padding === "large") PADDING = `0 25%`;

  // SERVERS ----------------------------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    // Manage max string Length
    const MAX_LENGTH = 40;
    let titlePreview = `${title.substring(0, MAX_LENGTH)}...`;
    if (title.length < MAX_LENGTH) titlePreview = title;

    return (
      <div>
        <h5
          className="card-text"
          style={{ fontSize: 36, fontWeight: "bold", color: colors.black }}
        >
          {titlePreview}
        </h5>
      </div>
    );
  };

  const ServeCardBody = () => {
    if (!body) return null;

    return (
      <div
        className="flex-col"
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
    if (!add_button) return null;

    // HELPERS ----------------------------------------------------
    const handleGoToAction = () => {
      actions.router.set(`${link}`);
    };

    return (
      <div>
        <div className="flex" style={{ justifyContent: ALIGNMENT }}>
          <button
            className="btn"
            style={{
              fontSize: 16,
              textTransform: "capitalize",
              color: colors.white,
              backgroundColor: colors.blue,
            }}
            onClick={handleGoToAction}
          >
            <span>{label}</span>
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
        minHeight: BANNER_HEIGHT,
        padding: `2em 0`,
      }}
    >
      <div style={{ margin: PADDING }}>
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
