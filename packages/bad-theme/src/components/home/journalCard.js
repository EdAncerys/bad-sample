import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors, capsBtn } from "../../config/colors";
import { setGoToAction } from "../../context";

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
            className="flex"
            className="flex-row pointer"
            style={{ alignItems: "center" }}
            onClick={() => setGoToAction({ path: link.url, actions })}
          >
            <div style={capsBtn}>Read More</div>
          </div>
        </div>
      );
    };

    const ServeTitle = () => {
      if (!title) return null;

      return (
        <div
          className="flex primary-title"
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
        <div className="flex primary-title" style={{ fontSize: 20 }}>
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
        <div
          className="flex-col"
          style={{ paddingLeft: `1em`, color: colors.black }}
        >
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
