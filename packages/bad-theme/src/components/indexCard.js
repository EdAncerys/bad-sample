import { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";

import Loading from "./loading";

const IndexCard = ({
  state,
  actions,
  libraries,
  block,
  cardWidth,
  cardHeight,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;
  if (!block.index_title) return null;

  const { colour, subtitle, title } = block;
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // SERVERS ----------------------------------------------
  const ServeFooter = () => {
    return (
      <div
        style={{
          backgroundColor: colour || colors.primary,
          height: 8,
          width: "100%",
        }}
      />
    );
  };

  const ServeCardBody = ({ block }) => {
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
              borderBottom: `1px dotted ${colors.silver}`,
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
      className="shadow"
      style={{
        ...styles.card,
        width: cardWidth || "30%",
        height: cardHeight || "100%",
        margin: `${marginVertical}px ${marginHorizontal}px`,
      }}
    >
      <div className="flex-col m-3">
        <div className="list-group">
          <div
            className="list-group-block"
            style={{ fontSize: 20, fontWeight: "bold" }}
          >
            <Html2React html={title} />
          </div>
          <div
            className="list-group-block"
            style={{ fontSize: 16, fontWeight: "bold", padding: `1em 0` }}
          >
            <Html2React html={subtitle} />
          </div>
          {block.index_title.map((block, key) => {
            return <ServeCardBody key={key} block={block} />;
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
