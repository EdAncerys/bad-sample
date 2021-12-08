import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/colors";

const CardBody = ({
  state,
  actions,
  libraries,
  title,
  body,
  heroBanner,
  newsCarousel,
  TEXT_ALIGN,
  isFrom4Col,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  let CONTENT_ALIGNMENT = 0;
  if (heroBanner) CONTENT_ALIGNMENT = `auto 0`;
  if (newsCarousel) CONTENT_ALIGNMENT = `auto 0`;

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    let TITLE_HEIGHT = 80;
    if (heroBanner || !body) TITLE_HEIGHT = "auto";

    let titlePreview = title;
    const MAX_CHAR = 45;
    if (title.length > MAX_CHAR && isFrom4Col)
      titlePreview = `${title.slice(0, MAX_CHAR)}...`;
    if (!body) titlePreview = title;

    return (
      <div
        className="flex"
        style={{
          fontSize: heroBanner ? 36 : 20,
          height: TITLE_HEIGHT,
          maxHeight: isFrom4Col ? 200 : "auto", // restricting title height
          overflow: "hidden",
          fontWeight: "bold",
          color: colors.black,
          alignItems: newsCarousel ? "center" : "flex-start",
        }}
      >
        <Html2React html={titlePreview} />
      </div>
    );
  };

  const ServeBody = () => {
    if (!body) return null;

    let bodyPreview = body;
    const MAX_CHAR = 80;
    if (body.length > MAX_CHAR && isFrom4Col)
      bodyPreview = `${body.slice(0, MAX_CHAR)}...`;

    return (
      <div style={{ fontSize: 16, overflow: "auto", padding: `1em 0` }}>
        <Html2React html={bodyPreview} />
      </div>
    );
  };

  return (
    <div
      className="flex-col"
      style={{
        textAlign: `${TEXT_ALIGN}`,
        padding: heroBanner ? `1em 2em` : 0,
      }}
    >
      <div style={{ margin: CONTENT_ALIGNMENT }}>
        <ServeTitle />
        <ServeBody />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(CardBody);
