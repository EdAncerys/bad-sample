import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/colors";
import { setGoToAction } from "../../context";

const ImageAndPromoCard = ({
  state,
  actions,
  libraries,
  imageAndPromoCard,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  if (!imageAndPromoCard) return null;

  const { body, image, link, label } = imageAndPromoCard;

  // SERVERS ---------------------------------------------
  const ServeBody = () => {
    if (!body) return null;

    return (
      <div className="flex-col" style={{ padding: `2em 0` }}>
        <div className="flex">
          <Html2React html={body} />
        </div>
        <ServeMoreAction />
      </div>
    );
  };

  const ServeCardImage = () => {
    if (!image) return null;
    const alt = "BAD";

    return (
      <div style={{ width: "100%", maxHeight: 300, padding: `2em` }}>
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

  const ServeMoreAction = () => {
    if (!link) return null;
    let GO_TO_LABEL = "More";
    if (label) GO_TO_LABEL = <Html2React html={label} />;

    return (
      <div onClick={() => setGoToAction({ path: link, actions })}>
        <div
          style={{
            borderBottom: `2px solid ${colors.darkSilver}`,
            paddingBottom: 5,
            textTransform: "capitalize",
            cursor: "pointer",
            width: "fit-content",
          }}
        >
          {GO_TO_LABEL}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(2, 1fr)`,
        gap: 20,
      }}
    >
      <ServeCardImage />
      <ServeBody />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(ImageAndPromoCard);
