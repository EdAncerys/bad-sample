import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/colors";

const VideoGalleryInfo = ({ state, actions, libraries, videoGalleryInfo }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!videoGalleryInfo) return null;
  const { body, condition, date, procedure, service, title } = videoGalleryInfo;

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div
        className="flex"
        style={{ fontSize: 22, fontWeight: "bold", paddingRight: `1em` }}
      >
        <Html2React html={title} />
      </div>
    );
  };

  const ServeBody = () => {
    if (!body) return null;

    return (
      <div style={{ fontSize: 16, padding: `1em 0 0` }}>
        <Html2React html={body} />
      </div>
    );
  };

  const ServeDate = () => {
    if (!date) return null;

    return (
      <div style={{ fontSize: 12 }}>
        <Html2React html={date} />
      </div>
    );
  };

  const ServeActions = () => {
    if (!condition && !procedure && !service) return null;

    return (
      <div className="flex-row" style={{ flexWrap: "wrap" }}>
        <div style={styles.action}>
          <Html2React html={condition} />
        </div>
        <div style={styles.action}>
          <Html2React html={procedure} />
        </div>
        <div style={styles.action}>
          <Html2React html={service} />
        </div>
      </div>
    );
  };

  return (
    <div className="flex-col" style={{ padding: `1em 0` }}>
      <div className="flex-row" style={{ alignItems: "center" }}>
        <ServeTitle />
        <ServeDate />
      </div>
      <ServeBody />
      <ServeActions />
    </div>
  );
};

const styles = {
  container: {},
  action: {
    backgroundColor: colors.lightSilver,
    borderRadius: 5,
    padding: `0.5em 1.5em`,
    margin: `1em 1em 0 0`,
  },
};

export default connect(VideoGalleryInfo);
