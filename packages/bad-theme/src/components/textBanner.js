import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import Image from "@frontity/components/image";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import Loading from "./loading";

const Banner = ({ state, actions, item }) => {
  const BANNER_HEIGHT = 550;
  const { title, body, url } = item;

  // SERVERS ----------------------------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    // Manage max string Length
    const MAX_LENGTH = 60;
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
    const MAX_LENGTH = 1400;
    let bodyPreview = `${body.substring(0, MAX_LENGTH)}...`;
    if (body.length < MAX_LENGTH) bodyPreview = body;

    return (
      <div className="flex-col" style={{ fontSize: 16, margin: `2em 0` }}>
        <h5 className="flex card-text">{bodyPreview}</h5>
      </div>
    );
  };

  const ServeActions = () => {
    // HELPERS ----------------------------------------------------
    const handleGoToAction = () => {
      actions.router.set(`${url}`);
    };

    return (
      <div>
        <div className="flex-center-row">
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

  if (!item) return <Loading />;
  // RETURN ---------------------------------------------------
  return (
    <div
      className="card flex-center-col"
      style={{
        position: "relative",
        minHeight: BANNER_HEIGHT,
        border: "none",
        padding: `3em 20%`,
      }}
    >
      <ServeTitle />
      <ServeCardBody />
      <ServeActions />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Banner);
