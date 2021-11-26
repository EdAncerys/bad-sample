import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import Image from "@frontity/components/image";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import Loading from "./loading";

const Banner = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  if (!block) return <Loading />;

  const { background_image, label, link, title } = block;
  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // HELPERS ----------------------------------------------------
  const handleGoToAction = () => {
    if (!link.url) return null;
    actions.router.set(`${link.url}`);
  };

  // SERVERS ----------------------------------------------------------------
  const ServeFooter = () => {
    const ServeActions = () => {
      if (!label.length) return null;

      return (
        <div className="mr-5">
          <button
            className="btn btn-outline-light flex-center-row"
            onClick={handleGoToAction}
          >
            <Html2React html={label} />
            <div>
              <KeyboardArrowRightIcon style={{ fill: colors.white }} />
            </div>
          </button>
        </div>
      );
    };

    return (
      <div
        className="flex-row"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          padding: `3em 5em`,
        }}
      >
        <div className="flex">
          <div
            className="card-text"
            style={{
              color: colors.white,
              fontSize: "2em",
              textTransform: "capitalize",
            }}
          >
            <Html2React html={title} />
          </div>
        </div>
        <ServeActions />
      </div>
    );
  };

  const ServeCardImage = () => {
    if (!background_image) return null;
    const alt = title || "BAD";

    return (
      <div style={{ width: "100%", height: BANNER_HEIGHT, overflow: "hidden" }}>
        <Image
          src={background_image.url}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    );
  };

  const ServeOverlay = () => {
    return (
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: BANNER_HEIGHT,
          background: `linear-gradient(0deg, rgba(31,51,94,1) 0%, rgba(133,133,148,0.1) 60%)`,
        }}
      />
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div
      className="flex-col"
      style={{
        position: "relative",
        height: BANNER_HEIGHT,
        margin: `${marginVertical}px ${marginHorizontal}px`,
      }}
    >
      <ServeCardImage />
      <ServeOverlay />
      <ServeFooter />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Banner);
