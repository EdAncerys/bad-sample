import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import Loading from "./loading";
import FullWidthContentBlock from "./fullWidthContentBlock";
import { colors } from "../config/imports";

import { muiQuery } from "../context";

const PromoBlock = ({ state, actions, block, disableMargin }) => {
  const { sm, md, lg, xl } = muiQuery();

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
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            <Image
              src={logo}
              alt={alt}
              style={{
                width: `100%`,
                height: `100%`,
              }}
            />
          </div>
        </div>
      );
    };

    return (
      <div
        className="flex"
        style={{
          width: BANNER_HEIGHT,
          height: !lg ? BANNER_HEIGHT : BANNER_HEIGHT / 2,
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
          display: !lg ? "flex" : null,
          flexDirection: isAlignLeft ? "row-reverse" : "inherit",
          height: !lg ? BANNER_HEIGHT : null,
          overflow: "hidden",
          margin: MARGIN,
        }}
        className="row"
      >
        <div
          className={
            !lg ? "col-lg-6 col-12 flex" : "col-lg-6 col-12 flex order-2"
          }
          style={{ margin: `auto 0` }}
        >
          <ServeCardContent />
        </div>
        <div
          className={
            !lg ? "col-lg-6 col-12 p-0" : "col-lg-6 col-12 p-0 order-1"
          }
        >
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
