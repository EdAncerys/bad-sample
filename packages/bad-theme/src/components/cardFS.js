import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import Image from "@frontity/components/image";

import Template from "../img/svg/template.svg";

const CardFS = ({
  state,
  actions,
  title,
  body,
  url,
  textAlign,
  themeColor,
  imgUrl,
}) => {
  const TEXT_ALIGN = textAlign || "start";
  const MIN_CARD_HEIGHT = 100;
  const THEME = themeColor || colors.primary;
  const URL = imgUrl || Template;

  // Manage max string Length
  const MAX_LENGTH = 60;
  let titlePreview = `${title.substring(0, MAX_LENGTH)}...`;
  if (title.length < MAX_LENGTH) titlePreview = title;

  // HELPERS ---------------------------------------------
  const handleGoToPath = () => {
    actions.router.set(`${url}`);
    console.log("url", url);
  };

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
    return (
      <div className="flex" style={{ maxWidth: "40%" }}>
        <Image className="d-block w-100" src={URL} alt="BAD" />
      </div>
    );
  };

  const ServeCardInfo = () => {
    return (
      <div className="flex-center-row p-2">
        <ServeCardImage />
        <div className="flex">
          <div
            style={{
              marginLeft: "1em",
              textAlign: "start",
              fontSize: "1.75em",
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
        <div onClick={handleGoToPath}>
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
          <p className="card-text">{body}</p>
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
    marginRight: 25,
    borderBottom: `1px solid ${colors.black}`,
    textTransform: "uppercase",
    fontSize: "0.75em",
  },
};

export default connect(CardFS);
