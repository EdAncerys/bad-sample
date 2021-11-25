import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import Image from "@frontity/components/image";

const Card = ({
  state,
  actions,
  libraries,
  colour,
  cardTitle,
  title,
  body,
  link,
  textAlign,
  url,
  form_link,
  shadow,
  bodyLength,
  cardWidth,
  cardHeight,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const TEXT_ALIGN = textAlign || "start"; // takes values 'start' | 'center' | 'end'
  const THEME = colour || colors.primary;
  const SHADOW = shadow ? "shadow" : "";

  // HELPERS ---------------------------------------------
  const handleReadMorePath = () => {
    // console.log("link", link); // debug
    actions.router.set(`${link}`);
  };

  const handleFormPath = () => {
    // console.log("link", link); // debug
    actions.router.set(`${form_link}`);
  };

  // SERVERS ----------------------------------------------
  const ServeFooter = () => {
    return (
      <div
        style={{
          backgroundColor: THEME,
          height: 8,
          width: "100%",
        }}
      />
    );
  };

  const ServeCardImage = () => {
    if (!url) return null;
    const alt = title || "BAD";

    return (
      <div
        style={{ width: "100%", height: body ? 125 : 200, overflow: "hidden" }}
      >
        <Image src={url} className="d-block h-100" alt={alt} />
      </div>
    );
  };

  const ServeCardHeader = () => {
    if (url) return null;
    if (!cardTitle) return null;

    return (
      <div>
        <div
          className="flex"
          style={{
            backgroundColor: colors.lightSilver,
            borderRadius: 5,
            textTransform: "uppercase",
          }}
        >
          <span>{cardTitle}</span>
        </div>
      </div>
    );
  };

  const ServeFooterActions = () => {
    const ServeReadMoreAction = () => {
      if (!link) return null;

      return (
        <div onClick={handleReadMorePath}>
          <div style={styles.footerActionTitle}>
            <p className="card-text">Read More</p>
          </div>
        </div>
      );
    };

    const ServeFromAction = () => {
      if (!form_link) return null;

      // HELPERS -------------------------
      const handleReadMorePath = () => {
        actions.router.set(`${form_link}`);
      };

      return (
        <div onClick={handleFormPath}>
          <div style={styles.footerActionTitle}>
            <p className="card-text">Nomination Form</p>
          </div>
        </div>
      );
    };

    return (
      <div>
        <div
          className="flex-row mt-4"
          style={{ justifyContent: "space-between" }}
        >
          <ServeReadMoreAction />
          <ServeFromAction />
        </div>
      </div>
    );
  };

  const ServeCardBody = () => {
    const ServeTitle = () => {
      if (!title) return null;

      // Manage max string Length
      const MAX_LENGTH = 60;
      let titlePreview = `${title.substring(0, MAX_LENGTH)}...`;
      if (title.length < MAX_LENGTH) titlePreview = title;

      return (
        <div>
          <h5 className="flex card-text" style={{ colour: colors.black }}>
            {titlePreview}
          </h5>
        </div>
      );
    };

    const ServeBody = () => {
      if (url) return null;
      if (!body) return null;

      // Manage max string Length
      const MAX_LENGTH = bodyLength || 400;
      let bodyPreview = `${body.substring(0, MAX_LENGTH)}...`;
      if (body.length < MAX_LENGTH) bodyPreview = body;

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

  const ServeContent = () => {
    return (
      <div className="flex-col mt-2">
        <ServeCardBody />
        <ServeFooterActions />
      </div>
    );
  };

  // RETURN ----------------------------------------------------
  return (
    <div
      className={SHADOW}
      style={{
        ...styles.card,
        backgroundColor: colors.white,
        width: cardWidth || "100%",
        height: cardHeight || "100%",
      }}
    >
      {url && <ServeCardImage />}
      <div className="flex-col m-3">
        <ServeCardHeader />
        <ServeContent />
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
    borderBottom: `1px solid ${colors.black}`,
    cursor: "pointer",
  },
};

export default connect(Card);
