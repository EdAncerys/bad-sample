import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/colors";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const JournalCard = ({
  state,
  actions,
  libraries,
  image,
  title,
  user,
  link,
  shadow,
  tweet,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const CARD_WIDTH = "30%";
  const IMG_WIDTH = 75;

  if (!image && !title) return null; // do not render card if content not provided

  // HELPERS ---------------------------------------------
  const handleGoToPath = () => {
    // console.log("url", url); // debug
    if (!link.url) return null;
    actions.router.set(`${link.url}`);
  };

  // SERVERS ---------------------------------------------
  const ServeCardContent = () => {
    if (!title) return null;

    let BORDER = `none`;
    if (image) BORDER = `2px solid ${colors.darkSilver}`;
    if (tweet) BORDER = `none`;

    // SERVERS ------------------------------
    const ServeActions = () => {
      if (!link) return null;

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
      if (!title) return null;

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

    const ServeUser = () => {
      if (!user) return null;

      return (
        <div
          className="flex"
          style={{
            fontSize: 20,
            color: colors.darkSilver,
          }}
        >
          <Html2React html={user} />
        </div>
      );
    };

    return (
      <div
        className="flex"
        style={{
          borderLeft: BORDER,
          minHeight: IMG_WIDTH,
        }}
      >
        <div className="flex-col" style={{ paddingLeft: `1em` }}>
          <ServeTitle />
          <ServeUser />
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
        style={{
          width: IMG_WIDTH,
          height: IMG_WIDTH,
          borderRadius: "50%",
          overflow: "hidden",
          marginRight: `1em`,
        }}
      >
        <Image
          src={image.url}
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

  // RETURN ----------------------------------------------------------------
  return (
    <div
      className={`${shadow ? "shadow" : ""}`}
      style={{
        minWidth: CARD_WIDTH,
        width: "100%",
        padding: tweet ? `1em 0` : 0,
        borderBottom: tweet ? `2px solid ${colors.darkSilver}` : 0,
      }}
    >
      <div
        className="flex-row"
        style={{
          padding: !tweet ? `1em` : 0,
        }}
      >
        <ServeCardImage />
        <ServeCardContent />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};
export default connect(JournalCard);
