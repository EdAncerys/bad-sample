import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";

import Loading from "./loading";

const IndexCard = ({
  state,
  actions,
  libraries,
  card_title,
  colour,
  index_title,
  subtitle,
  link,
  shadow,
  cardWidth,
  cardHeight,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const SHADOW = shadow ? "shadow" : "";
  const THEME = colour || colors.primary;

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

  const ServeContent = () => {
    const ServeTitle = () => {
      if (!card_title) return null;

      return (
        <div style={{ fontSize: 20, fontWeight: "bold" }}>
          <Html2React html={card_title} />
        </div>
      );
    };

    const ServeSubtile = () => {
      if (!subtitle) return null;

      return (
        <div style={{ fontSize: 16, fontWeight: "bold", padding: `1em 0` }}>
          <Html2React html={subtitle} />
        </div>
      );
    };

    return (
      <div className="flex-col">
        <ServeTitle />
        <ServeSubtile />
      </div>
    );
  };

  const ServeIndexTitle = ({ block }) => {
    const { title, link } = block;

    if (!title) return null;

    // HELPERS ---------------------------------------------
    const handleGoToPath = () => {
      // console.log("url", url); // debug
      if (!link.url) return null;
      actions.router.set(`${link.url}`);
    };

    const ServeTitle = () => {
      return (
        <div
          className="list-group-block"
          style={{ padding: `0.5em 0`, cursor: "pointer" }}
          onClick={handleGoToPath}
        >
          <div
            style={{
              borderBottom: `1px dotted ${colors.darkSilver}`,
              textTransform: "capitalize",
            }}
          >
            <Html2React html={title} />
          </div>
        </div>
      );
    };

    return (
      <div className="flex-col">
        <ServeTitle />
      </div>
    );
  };

  // RETURN ----------------------------------------------------
  return (
    <div
      className={SHADOW}
      style={{
        ...styles.card,
        width: cardWidth || "100%",
        height: cardHeight || "100%",
      }}
    >
      <div className="flex-col m-3">
        <div className="list-group">
          <ServeContent />
          {index_title.map((block, key) => {
            return <ServeIndexTitle key={key} block={block} />;
          })}
        </div>
      </div>
      <ServeFooter />
    </div>
  );
};

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.white,
    overflow: "hidden",
  },
};

export default connect(IndexCard);
