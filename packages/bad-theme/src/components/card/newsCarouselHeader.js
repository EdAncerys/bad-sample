import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/imports";
import date from "date-and-time";

const DATE_MODULE = date;

const NewsCarouselHeader = ({ state, actions, libraries, newsCarousel }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  if (!newsCarousel) return null;

  const { date, release, categoryName, media, background_image } = newsCarousel;
  if (!date && !release) return null;

  // SERVERS ---------------------------------------------
  const ServeRelease = () => {
    if (!release) return null;

    return (
      <div
        style={{
          fontSize: 12,
          textTransform: "capitalize",
          letterSpacing: 2,
          paddingLeft: date ? `1em` : 0,
        }}
      >
        <Html2React html={release} />
      </div>
    );
  };

  const ServeDate = () => {
    if (!date) return null;
    const datePublished = new Date(date);

    return (
      <div
        className="flex"
        style={{
          fontSize: 12,
          fontWeight: "bold",
          paddingRight: release ? `1em` : 0,
        }}
      >
        <Html2React html={DATE_MODULE.format(datePublished, "DD/MMM/YYYY")} />
      </div>
    );
  };

  const ServeCategory = () => {
    if (!categoryName) return null;

    return (
      <div
        style={{
          fontSize: 12,
          color: colors.blue,
          textTransform: "capitalize",
          letterSpacing: 2,
          paddingLeft: date ? `1em` : 0,
        }}
      >
        <Html2React html={categoryName} />
      </div>
    );
  };

  const ServeCardImage = () => {
    if (!media) return null;
    const alt = release || "BAD";

    return (
      <div style={{ width: "100%", minHeight: 200, maxHeight: 300 }}>
        <Image
          src={media.source_url}
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

  const ServePlaceholder = () => {
    if (media || background_image) return null;

    return (
      <div
        style={{
          width: "100%",
          height: 250,
          backgroundColor: colors.silverFillTwo,
        }}
      />
    );
  };

  return (
    <div className="position-relative">
      <ServeCardImage />
      <ServePlaceholder />
      <div
        className="position-absolute"
        style={{ backgroundColor: colors.white, top: `3em`, left: `2em` }}
      >
        <div className="flex-row" style={{ padding: `1em` }}>
          <ServeDate />
          <ServeRelease />
          <ServeCategory />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(NewsCarouselHeader);
