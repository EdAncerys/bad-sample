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
  const IMG_ALIGNMENT = image_align === "left";

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
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            height: "100%",
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
        backgroundColor: colors.lightSilver,
        height: BANNER_HEIGHT,
        overflow: "hidden",
        margin: `${marginVertical}px ${marginHorizontal}px`,
      }}
    >
      {IMG_ALIGNMENT && (
        <div className="flex">
          <ServeCardImage />
          <ServeCardContent />
        </div>
      )}
      {!IMG_ALIGNMENT && (
        <div className="flex">
          <ServeCardContent />
          <ServeCardImage />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(PromoBlock);
