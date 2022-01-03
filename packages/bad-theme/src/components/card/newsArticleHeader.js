import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/imports";
import Bulletins from "../../img/svg/bulletins.svg";
import eCircular from "../../img/svg/eCircular.svg";
import Insights from "../../img/svg/insights.svg";
import Podcasts from "../../img/svg/podcasts.svg";
import PressRelease from "../../img/svg/pressRelease.svg";
import Responses from "../../img/svg/responses.svg";
import Updates from "../../img/svg/updates.svg";

const NewsArticleHeader = ({ state, actions, libraries, newsArticle }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  if (!newsArticle) return null;

  const { news_title, date, icon } = newsArticle;

  const ICON_WIDTH = 40;
  let SERVE_ICON = PressRelease;
  if (icon === "Bulletins") SERVE_ICON = Bulletins;
  if (icon === "E-circular") SERVE_ICON = eCircular;
  if (icon === "Insights") SERVE_ICON = Insights;
  if (icon === "Podcasts") SERVE_ICON = Podcasts;
  if (icon === "Responses") SERVE_ICON = Responses;
  if (icon === "Updates") SERVE_ICON = Updates;

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!news_title) return null;

    return (
      <div
        className="primary-title"
        style={{
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        <Html2React html={news_title} />
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
          padding: `1em 0`,
        }}
      >
        <Html2React html={date} />
      </div>
    );
  };

  const ServeIcon = () => {
    if (!icon) return null;
    const alt = "BAD";

    return (
      <div
        style={{
          width: ICON_WIDTH,
          height: ICON_WIDTH,
          margin: `0 auto`,
        }}
      >
        <Image
          src={SERVE_ICON}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        padding: `1.5em 1.5em 0`,
        overflow: "auto",
      }}
    >
      <div className="flex-row" style={{ height: "100%" }}>
        <div className="flex-col">
          <ServeTitle />
          <ServeDate />
        </div>
        <ServeIcon />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(NewsArticleHeader);
