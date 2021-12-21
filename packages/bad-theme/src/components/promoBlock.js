import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import Loading from "./loading";
import FullWidthContentBlock from "./fullWidthContentBlock";
import { colors } from "../config/colors";

const PromoBlock = ({ state, actions, block, disableMargin }) => {
  if (!block) return <Loading />;

  const {
    background_image,
    image_align,
    title,
    disable_horizontal_padding,
    disable_vertical_padding,
  } = block;

  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  const isAlignLeft = image_align === "left";
  let MARGIN = `${marginVertical}px ${marginHorizontal}px`;
  if (disable_horizontal_padding) MARGIN = `${marginVertical}px 0`;
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
