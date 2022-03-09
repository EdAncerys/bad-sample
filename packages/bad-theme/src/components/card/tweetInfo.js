import { useState, useEffect } from "react";
import { connect } from "frontity";

import Image from "@frontity/components/image";

import { colors } from "../../config/imports";
import { setGoToAction } from "../../context";

const TweetInfo = ({ state, actions, libraries, tweetInfo }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!tweetInfo) return null;

  const { name, profile_image_url, author_name } = tweetInfo;

  // SERVERS ---------------------------------------------
  const ServeCardImage = () => {
    if (!profile_image_url) return null;
    const alt = name || "BAD";

    const IMG_WIDTH = 75;

    return (
      <div
        style={{
          height: IMG_WIDTH,
          width: IMG_WIDTH,
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <Image
          src={profile_image_url}
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

  const ServeName = () => {
    if (!name) return null;

    return (
      <div
        className="flex primary-title"
        style={{ fontSize: 20 }}
        onClick={() => setGoToAction({ path: profile_image_url, actions })}
      >
        <Html2React html={name} />
      </div>
    );
  };

  const ServeUserName = () => {
    if (!author_name) return null;

    return (
      <div style={{ fontSize: 20 }}>
        @<Html2React html={author_name} />
      </div>
    );
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `1fr 3fr`,
        gap: 20,
        borderBottom: `1px solid ${colors.darkSilver}`,
        paddingBottom: `1em`,
        marginBottom: `2em`,
      }}
    >
      <ServeCardImage />
      <div className="flex-col">
        <ServeName />
        <ServeUserName />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(TweetInfo);
