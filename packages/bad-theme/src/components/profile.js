import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import Image from "@frontity/components/image";

const Profile = ({ state, actions, item }) => {
  const PROFILE_PICTURE_WIDTH = 190;
  const { name, theme, about, profileUrl, url } = item;

  // SERVERS ----------------------------------------------------------------
  const ServeProfilePicture = () => {
    if (!profileUrl) return null;
    const alt = name || "BAD";

    return (
      <div
        style={{
          width: PROFILE_PICTURE_WIDTH,
          height: PROFILE_PICTURE_WIDTH,
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <Image src={profileUrl} className="d-block h-100" alt={alt} />
      </div>
    );
  };

  const ServeName = () => {
    return (
      <div style={{ fontSize: 20, fontWeight: "bold", marginBottom: "1em" }}>
        <span>{name}</span>
      </div>
    );
  };

  const ServeAbout = () => {
    if (!about) return null;

    // Manage max string Length
    const MAX_LENGTH = 80;
    let aboutPreview = `${about.substring(0, MAX_LENGTH)}...`;
    if (about.length < MAX_LENGTH) aboutPreview = about;

    return (
      <div
        style={{
          fontSize: 16,
          fontWeight: "regular",
          color: colors.silver,
        }}
      >
        <span>{aboutPreview}</span>
      </div>
    );
  };

  const ServeProfile = () => {
    return (
      <div style={{ padding: "1em 2em" }}>
        <ServeName />
        <ServeAbout />
      </div>
    );
  };

  return (
    <div
      className="card m-2"
      style={{
        border: "none",
        width: "30%",
        minWidth: PROFILE_PICTURE_WIDTH,
        backgroundColor: "transparent",
      }}
    >
      <div className="flex-center-col">
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
