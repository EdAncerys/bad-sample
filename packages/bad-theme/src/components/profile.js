import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import Image from "@frontity/components/image";

const Profile = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const PROFILE_PICTURE_WIDTH = 190;
  const { background_image, body, title } = block;

  // SERVERS ----------------------------------------------------------------
  const ServeProfilePicture = () => {
    if (!background_image) return null;
    const alt = title || "BAD";

    return (
      <div
        style={{
          width: PROFILE_PICTURE_WIDTH,
          height: PROFILE_PICTURE_WIDTH,
          borderRadius: "50%",
          overflow: "hidden",
          margin: `0 auto`,
        }}
      >
        <Image src={background_image.url} className="d-block h-100" alt={alt} />
      </div>
    );
  };

  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div style={{ fontSize: 20, fontWeight: "bold", margin: `0.75em 0` }}>
        <Html2React html={title} />
      </div>
    );
  };

  const ServeBody = () => {
    if (!body) return null;

    return (
      <div
        style={{
          fontSize: 16,
          fontWeight: "regular",
          color: colors.silver,
        }}
      >
       <Html2React html={body} />
      </div>
    );
  };

  const ServeProfile = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <ServeTitle />
        <ServeBody />
      </div>
    );
  };

  return (
    <div style={{ width: "85%", margin: `2em auto` }}>
      <div className="flex-col">
        <ServeProfilePicture />
        <ServeProfile />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Profile);
