import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import Image from "@frontity/components/image";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import Loading from "./loading";
import { setGoToAction } from "../context";

const Banner = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  if (!block) return <Loading />;

  const { disable_vertical_padding } = block;

  const { background_image, label, link, title } = block;
  const BANNER_HEIGHT = state.theme.bannerHeight;
  const THEME_COLOR = colors.white;
  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;

  if (disable_vertical_padding) marginVertical = 0;

  // SERVERS ----------------------------------------------------------------
  const ServeFooter = () => {
    const ServeMoreAction = () => {
      if (!label && !link) return null;

      let LABEL = "More";
      if (label) LABEL = label;

      return (
        <div
          className="flex"
          style={{ alignItems: "flex-end", justifyContent: "flex-end" }}
        >
          <div>
            <button
              className="btn btn-outline-light flex-center-row"
              style={{
                color: THEME_COLOR,
                borderColor: THEME_COLOR,
                textTransform: "uppercase",
                alignItems: "center",
                borderRadius: 5,
                padding: `0.5em 2em`,
              }}
              onClick={() => setGoToAction({ path: link.url, actions })}
            >
              <div className="flex">
                <Html2React html={LABEL} />
              </div>
              <div>
                <KeyboardArrowRightIcon
                  style={{
                    fill: THEME_COLOR,
                    borderRadius: "50%",
                    padding: 0,
                  }}
                />
              </div>
            </button>
          </div>
        </div>
      );
    };

    return (
      <div style={{ position: "relative" }}>
        <div
          className="flex-row"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: marginHorizontal,
            width: "100%",
            height: BANNER_HEIGHT,
            // padding: `3em 5em`,
            padding: `${marginVertical}px ${marginHorizontal}px`,
          }}
        >
          <div className="flex BAD-banner" style={{ flex: 3 }}>
            <div
              className="flex-col"
              style={{
                color: THEME_COLOR,
                // textTransform: "capitalize",
                justifyContent: "flex-end",
                overflow: "hidden",
              }}
            >
              <Html2React html={title} />
            </div>
          </div>
          <ServeMoreAction />
        </div>
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
        margin: `${marginVertical}px 0`,
        overflow: "hidden",
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
