import { useState, useEffect } from "react";
import { connect } from "frontity";

import Loading from "./loading";
import ReactPlayer from "react-player";
import { colors } from "../config/colors";

const EmbeddedVideo = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;
  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const { colour, video_url } = block;
  const THEME = colour || colors.primary;

  // SERVERS ---------------------------------------------
  const ServeCardVideo = () => {
    if (!video_url) return null;
    const alt = "BAD";

    return (
      <div className="shadow" style={{ width: "100%", height: BANNER_HEIGHT }}>
        <ReactPlayer
          url={video_url}
          alt={alt}
          width="100%"
          height="100%"
          style={{
            objectFit: "cover",
          }}
          playing
          muted
          controls
        />
      </div>
    );
  };

  const ServeFooter = () => {
    return (
      <div
        style={{
          backgroundColor: THEME,
          height: 5,
          width: "100%",
        }}
      />
    );
  };

  // RETURN ---------------------------------------------
  return (
    <div
      style={{
        padding: `${marginVertical}px ${marginHorizontal}px`,
        backgroundColor: colors.silverFillOne,
      }}
    >
      <ServeCardVideo />
      <ServeFooter />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(EmbeddedVideo);
