import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import Loading from "./loading";
import FullWidthContentBlock from "./fullWidthContentBlock";
import { colors } from "../config/colors";

const PromoBlock = ({ state, actions, block, disableMargin }) => {
  if (!block) return <Loading />;

  const { background_image, image_align, title, horizontal_padding } = block;

  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const isAlignLeft = image_align === "left";
  const HORIZONTAL_PADDING = horizontal_padding === "True";
  let MARGIN = 0;
  if (HORIZONTAL_PADDING) MARGIN = `0 ${marginHorizontal}px`;
  if (disableMargin) MARGIN = 0;

  // SERVERS ----------------------------------------------------------------
  const ServeCardImage = () => {
    if (!background_image) return null;
    const alt = title || "BAD";

    return (
      <div
        className="flex"
        style={{
          width: BANNER_HEIGHT,
          height: BANNER_HEIGHT,
        }}
      >
        <Image
          src={background_image.url}
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

  const ServeCardContent = () => {
    return (
      <div
        className="flex"
        style={{
          margin: "auto 0",
          padding: isAlignLeft
            ? `0 0 0 ${marginHorizontal}px`
            : `0 ${marginHorizontal}px 0 0`,
        }}
      >
        <FullWidthContentBlock block={block} disablePadding />
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div
      style={{
        backgroundColor: block.background_colour,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isAlignLeft ? "row-reverse" : "inherit",
          height: BANNER_HEIGHT,
          overflow: "hidden",
          margin: MARGIN,
        }}
      >
        <ServeCardContent />
        <ServeCardImage />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(PromoBlock);
