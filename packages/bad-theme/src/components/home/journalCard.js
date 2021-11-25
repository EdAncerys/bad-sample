import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/colors";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const JournalCard = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const CARD_WIDTH = "30%";
  const { image, link, title } = block;
  if (!image && !title) return null; // do not render card if content not provided

  // HELPERS ---------------------------------------------
  const handleGoToPath = () => {
    // console.log("url", url); // debug
    if (!link.url) return null;
    actions.router.set(`${link.url}`);
  };

  // SERVERS ---------------------------------------------
  const ServeCardActions = () => {
    if (!title) return null;

    // SERVERS ------------------------------
    const ServeActions = () => {
      return (
        <div>
          <div
            className="flex-row pointer"
            style={{ alignItems: "center" }}
            onClick={handleGoToPath}
          >
            <div style={{ textTransform: "uppercase", fontSize: 12 }}>
              <p className="card-text">Read More</p>
            </div>
            <div>
              <KeyboardArrowRightIcon style={{ fill: colors.darkSilver }} />
            </div>
          </div>
        </div>
      );
    };

    const ServeTitle = () => {
      return (
        <div
          className="flex"
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          <Html2React html={title} />
        </div>
      );
    };

    return (
      <div
        className="flex-col"
        style={{
          borderLeft: `2px solid ${colors.silver}`,
        }}
      >
        <div className="flex-col" style={{ paddingLeft: `10px` }}>
          <ServeTitle />
          <ServeActions />
        </div>
      </div>
    );
  };

  const ServeCardImage = () => {
    if (!image) return null;
    const alt = title || "BAD";

    return (
      <div
        className="flex"
        style={{
          flex: 0.75,
          justifyContent: "center",
          overflow: "hidden",
          width: 75,
          height: 75,
          margin: `0 1em`,
        }}
      >
        <div>
          <Image src={image.url} className="d-block h-100" alt={alt} />
        </div>
      </div>
    );
  };

  // RETURN ----------------------------------------------------------------
  return (
    <div
      className="flex shadow"
      style={{
        minWidth: CARD_WIDTH,
        width: "100%",
      }}
    >
      <div className="flex-row m-2">
        <ServeCardImage />
        <ServeCardActions />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};
export default connect(JournalCard);
