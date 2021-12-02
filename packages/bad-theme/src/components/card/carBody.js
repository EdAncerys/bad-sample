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
  TEXT_ALIGN,
  isFrom4Col,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    let titlePreview = title;
    const MAX_CHAR = 45;
    if (title.length > MAX_CHAR && isFrom4Col)
      titlePreview = `${title.slice(0, MAX_CHAR)}...`;

    return (
      <div
        style={{
          fontSize: heroBanner ? 36 : 20,
          height: heroBanner ? "auto" : 80,
          fontWeight: "bold",
          color: colors.black,
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
      <div className="flex mt-2" style={{ fontSize: 16, overflow: "auto" }}>
        <Html2React html={bodyPreview} />
      </div>
    );
  };

  return (
    <div className="flex-col" style={{ textAlign: `${TEXT_ALIGN}` }}>
      <ServeTitle />
      <ServeBody />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(CardBody);
