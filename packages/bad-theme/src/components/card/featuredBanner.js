import { useState, useEffect } from "react";
import { connect } from "frontity";

import Image from "@frontity/components/image";

import { colors } from "../../config/imports";
import { setGoToAction } from "../../context";

const FeaturedBanner = ({ state, actions, libraries, featuredBanner }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!featuredBanner) return null;

  const { title, featured_media } = featuredBanner;

  // SERVERS ---------------------------------------------
  const ServeCardImage = () => {
    if (featured_media === 0) return null;

    const media = state.source.attachment[featured_media];
    const alt = title.rendered || "BAD";

    console.log(media);

    return (
      <Image
        src={media ? media.source_url : ""}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    );
  };

  return (
    <div
      style={{
        height: 200,
        width: "100%",
        overflow: "hidden",
        backgroundColor: colors.silver,
      }}
    >
      <ServeCardImage />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(FeaturedBanner);
