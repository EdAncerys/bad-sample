import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import Loading from "./loading";
import FullWidthContentBlock from "./fullWidthContentBlock";
import { colors } from "../config/colors";

const PromoBlock = ({ state, actions, block, reverse }) => {
  if (!block) return <Loading />;

  const { background_image, image_align, title } = block;

  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const isAlignLeft = image_align === "left";

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
      <div className="flex">
        <FullWidthContentBlock block={block} disableMargin />
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isAlignLeft ? "row-reverse" : "inherit",
        backgroundColor: colors.lightSilver,
        height: BANNER_HEIGHT,
        overflow: "hidden",
        margin: `${marginVertical}px ${marginHorizontal}px`,
      }}
    >
      <ServeCardContent />
      <ServeCardImage />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(PromoBlock);
