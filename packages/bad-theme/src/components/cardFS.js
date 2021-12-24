import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/imports";
import Image from "@frontity/components/image";

import { setGoToAction } from "../context";

const CardFS = ({
  state,
  actions,
  libraries,
  title,
  body,
  url,
  textAlign,
  themeColor,
  imgUrl,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const TEXT_ALIGN = textAlign || "start";
  const MIN_CARD_HEIGHT = 100;
  const THEME = themeColor || colors.primary;

  // SERVERS ----------------------------------------------------------------
  const ServeFooter = () => {
    return (
      <div
        style={{
          backgroundColor: THEME,
          height: 5,
          width: "100%",
        }}
      />
    );
  };

  const ServeCardImage = () => {
    if (!imgUrl) return null;
    const alt = title || "BAD";

    return (
      <div style={{ width: 160, height: 160 }}>
        <Image
          src={imgUrl}
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

  const ServeCardInfo = () => {
    if (!title) return null;

    // Manage max string Length
    const MAX_LENGTH = 60;
    let titlePreview = `${title.substring(0, MAX_LENGTH)}...`;
    if (title.length < MAX_LENGTH) titlePreview = title;

    return (
      <div className="flex-center-row p-2">
        <ServeCardImage />
        <div className="flex">
          <div
            className="primary-title"
            style={{
              fontSize: 28,
              marginLeft: "1em",
              textAlign: "start",
              fontWeight: "bold",
            }}
          >
            {titlePreview}
          </div>
        </div>
      </div>
    );
  };

  const ServeCardBody = () => {
    return (
      <div className="flex-col p-2">
        <ServeBody />
        <ServeFooterActions />
      </div>
    );
  };

  const ServeFooterActions = () => {
    return (
      <div className="flex pt-4">
        <div onClick={() => setGoToAction({ path: url, actions })}>
          <div style={styles.footerActionTitle}>
            <p className="card-text">Find Out More</p>
          </div>
        </div>
      </div>
    );
  };

  const ServeBody = () => {
    const ServeBody = () => {
      if (!body) return null;

      return (
        <div className="flex" style={{ minHeight: 100, overflow: "auto" }}>
          <Html2React html={body} />
        </div>
      );
    };

    return (
      <div className="flex-col" style={{ textAlign: `${TEXT_ALIGN}` }}>
        <ServeBody />
      </div>
    );
  };

  // RETURN ----------------------------------------------------
  return (
    <div
      className="card m-2 mt-5 shadow"
      style={{
        ...styles.card,
        minHeight: `${MIN_CARD_HEIGHT}`,
      }}
    >
      <div className="card-body flex-row" style={{ padding: "2em" }}>
        <ServeCardInfo />
        <ServeCardBody />
      </div>
      <ServeFooter />
    </div>
  );
};

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  footerActionTitle: {
    fontSize: 12,
    marginRight: 25,
    borderBottom: `1px solid ${colors.black}`,
    textTransform: "uppercase",
  },
};

export default connect(CardFS);
