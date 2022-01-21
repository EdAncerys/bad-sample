import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import Loading from "./loading";
import FullWidthContentBlock from "./fullWidthContentBlock";
import { colors } from "../config/imports";

const PromoBlock = ({ state, actions, block, disableMargin }) => {
  const journals =
    state.router.link === "/research-journals/journals/" ? true : false;
  if (!block) return <Loading />;

  const {
    background_image,
    image_align,
    title,
    disable_horizontal_padding,
    disable_vertical_padding,
    logo_overlay,
    logo,
  } = block;

  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;
  const isAlignLeft = image_align === "left";
  let MARGIN = !journals
    ? `${marginVertical}px ${marginHorizontal}px`
    : `0 ${marginHorizontal}px`;
  if (disable_horizontal_padding) MARGIN = `${marginVertical}px 0`;
  if (disableMargin) MARGIN = 0;

  // SERVERS ----------------------------------------------------------------
  const ServeCardImage = () => {
    if (!background_image) return null;
    const alt = title || "BAD";
    const ServeLogo = () => {
      if (!logo || !logo_overlay) return null;
      return (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            right: isAlignLeft ? 20 : null,
            left: isAlignLeft ? null : 20,
          }}
        >
          <Image
            src={logo}
            alt="Logo"
            style={{ width: "100px", height: "auto", borderRadius: "50%" }}
          />
        </div>
      );
    };
    return (
      <div
        className="flex"
        style={{
          width: BANNER_HEIGHT,
          height: BANNER_HEIGHT,
          position: "relative",
          width: "100%",
        }}
      >
        <ServeLogo />
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
          padding: isAlignLeft ? "0 0 0 20px" : "0 20px 0 0",
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
        className="row"
      >
        <div className="col-6">
          <ServeCardContent />
        </div>
        <div className="col-6 p-0">
          <ServeCardImage />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(PromoBlock);
