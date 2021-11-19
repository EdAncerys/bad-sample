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
  let MAIN_AXIS = "flex-row"; // define alignment with main axis
  if (image_align === "left") MAIN_AXIS = "flex-row row-reverse";

  // SERVERS ----------------------------------------------------------------
  const ServeCardImage = () => {
    if (!background_image) return null;
    const alt = title || "BAD";

    return (
      <div className="flex">
        <div
          style={{
            width: "100%",
            minHeight: BANNER_HEIGHT,
            overflow: "hidden",
          }}
        >
          <Image
            src={background_image.url}
            className="d-block h-100"
            alt={alt}
          />
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div
      className={MAIN_AXIS}
      style={{
        ...styles.container,
        margin: `${marginVertical}px ${marginHorizontal}px`,
      }}
    >
      <FullWidthContentBlock block={block} disableMargin />
      <ServeCardImage />
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: colors.lightSilver,
  },
};

export default connect(PromoBlock);
