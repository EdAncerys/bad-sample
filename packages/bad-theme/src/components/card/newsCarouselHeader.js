import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/colors";
import Bulletins from "../../img/svg/bulletins.svg";
import eCircular from "../../img/svg/eCircular.svg";
import Insights from "../../img/svg/insights.svg";
import Podcasts from "../../img/svg/podcasts.svg";
import PressRelease from "../../img/svg/pressRelease.svg";
import Responses from "../../img/svg/responses.svg";
import Updates from "../../img/svg/updates.svg";

const NewsCarouselHeader = ({ state, actions, libraries, newsCarousel }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  if (!newsCarousel) return null;

  const { date, release } = newsCarousel;

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

    return (
      <div
        className="flex"
        style={{
          fontSize: 12,
          fontWeight: "bold",
          paddingRight: release ? `1em` : 0,
        }}
      >
        <Html2React html={date} />
      </div>
    );
  };

  return (
    <div
      className="position-absolute"
      style={{ backgroundColor: colors.white, top: `3em`, left: `2em` }}
    >
      <div className="flex-row" style={{ padding: `1em` }}>
        <ServeDate />
        <ServeRelease />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(NewsCarouselHeader);
