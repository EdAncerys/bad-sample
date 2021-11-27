import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

const CardBody = ({
  state,
  actions,
  libraries,
  title,
  body,
  url,
  heroBanner,
  TEXT_ALIGN,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div style={{ fontSize: heroBanner ? 36 : 20, fontWeight: "bold" }}>
        <Html2React html={title} />
      </div>
    );
  };

  const ServeBody = () => {
    if (url) return null;
    if (!body) return null;

    return (
      <div className="flex mt-2" style={{ overflow: "auto" }}>
        <Html2React html={body} />
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
