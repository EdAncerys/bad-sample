import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";

import Loading from "./loading";

const Banner = ({ state, actions, item, alignContent }) => {
  // alignContent value can be set to 'center' | 'start' | 'end'

  if (!item) return <Loading />;

  const BANNER_HEIGHT = 300;
  const { title, body, url } = item;
  let ALIGNMENT = "start";
  if (alignContent === "center") ALIGNMENT = "center";
  if (alignContent === "end") ALIGNMENT = "end";

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

    // Manage max string Length
    const MAX_LENGTH = 200;
    let bodyPreview = `${body.substring(0, MAX_LENGTH)}...`;
    if (body.length < MAX_LENGTH) bodyPreview = body;

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
        <h5 className="flex card-text">{bodyPreview}</h5>
      </div>
    );
  };

  const ServeActions = () => {
    if (!url) return null;

    // HELPERS ----------------------------------------------------
    const handleGoToAction = () => {
      actions.router.set(`${url}`);
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
            <span>Find out more</span>
          </button>
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div
      className="flex"
      style={{
        border: "none",
        textAlign: ALIGNMENT,
      }}
    >
      <div
        style={{
          minHeight: BANNER_HEIGHT,
          border: "none",
          padding: `3em 20%`,
        }}
      >
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

export default connect(Banner);
