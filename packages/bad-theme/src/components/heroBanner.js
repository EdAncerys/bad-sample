import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import Card from "./card/card";
import Loading from "./loading";
import ButtonsRow from "./buttonsRow";
import FullWidthContentBlock from "./fullWidthContentBlock";
import { muiQuery } from "../context";

const HeroBanner = ({ state, actions, libraries, block }) => {
  const { sm, md, lg, xl } = muiQuery();

  // console.log("HeroBanner Triggered", block); //debug
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const {
    add_background_image,
    add_buttons,
    background_colour,
    background_image,
    body,
    buttons,
    layout,
    pop_out_text,
    title,
    content_height,
    disable_vertical_padding,
  } = block;

  let BANNER_HEIGHT = state.theme.bannerHeight;
  const PADDING = state.theme.marginHorizontal;
  const FOOTER_HEIGHT = 50;
  let OVERLAY_WIDTH = "100%";
  let CARD_WIDTH = !lg ? "50%" : "100%";
  let CARD_HEIGHT = BANNER_HEIGHT - FOOTER_HEIGHT * 2;
  let BODY_LENGTH = 400;
  const CONTENT_WIDTH = state.theme.contentContainer;
  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;
  let marginBottom = marginVertical;
  if (buttons) marginBottom = state.theme.marginVertical;

  if (content_height === "small")
    BANNER_HEIGHT = state.theme.bannerHeight * 0.75;
  if (!buttons) {
    BODY_LENGTH = 450;
    CARD_HEIGHT = BANNER_HEIGHT - FOOTER_HEIGHT;
  }
  if (!background_image && layout === "full-width") return null; // defaults to null based on config
  const BACKGROUND_COLOUR = background_colour || "transparent";

  // SERVERS -----------------------------------------------------------
  const ServeFooter = () => {
    return (
      <div
        style={{
          height: FOOTER_HEIGHT,
          width: "100%",
        }}
      />
    );
  };

  const ServeBannerOverLay = () => {
    if (layout === "full-width") return null;
    if (!pop_out_text) return null;

    return (
      <div
        className="flex-col"
        style={{
          position: "absolute",
          zIndex: 1,
          height: BANNER_HEIGHT,
          width: OVERLAY_WIDTH,
        }}
      >
        <div
          className="flex"
          style={{
            marginLeft: !lg ? PADDING : 0,
            marginTop: FOOTER_HEIGHT / 2,
          }}
        >
          <Card
            title={title}
            body={body}
            cardWidth={CARD_WIDTH}
            cardHeight={CARD_HEIGHT}
            bodyLength={BODY_LENGTH}
            colour={block.colour}
            shadow
            heroBanner
          />
        </div>
      </div>
    );
  };

  const ServeButtonsOverLay = () => {
    if (!buttons) return null;

    return (
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          width: OVERLAY_WIDTH,
        }}
      >
        <div
          style={{
            margin: `0 ${PADDING}px`,
            marginTop: BANNER_HEIGHT - FOOTER_HEIGHT,
          }}
        >
          <ButtonsRow block={block} disableMargin />
        </div>
      </div>
    );
  };

  const ServeCardContent = () => {
    if (layout === "full-width") return null;
    if (pop_out_text) return <div className="flex" />;

    return (
      <div className="flex relative">
        <div
          style={{
            display: "grid",
            alignItems: "center",
            position: "absolute",
            zIndex: 99,
            width: !lg
              ? !background_image
                ? CONTENT_WIDTH / 1.5
                : CONTENT_WIDTH / 2
              : CONTENT_WIDTH, // if no img provided defaults to diff width
            height: BANNER_HEIGHT,
          }}
        >
          <FullWidthContentBlock block={block} heroBanner />
        </div>
      </div>
    );
  };

  const ServeCardImage = () => {
    if (!background_image) return <div className="flex" />;

    const alt = { title } || "BAD";
    const isFullWidth = layout === "full-width";
    const CARD_STYLES = isFullWidth
      ? {
          height: BANNER_HEIGHT,
          width: "100%",
          overflow: "hidden",
          paddingLeft: `${marginHorizontal}px`,
        }
      : {
          width: "100%",
          height: BANNER_HEIGHT,
        };

    return (
      <div className="flex">
        <div style={CARD_STYLES}>
          <Image
            src={background_image}
            alt={alt}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    );
  };

  const ServeOverLay = () => {
    return (
      <div
        style={{
          height: BANNER_HEIGHT,
          width: CONTENT_WIDTH,
          position: "absolute",
          zIndex: 9,
        }}
      >
        <ServeBannerOverLay />
        <ServeButtonsOverLay />
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div
      className="flex-col "
      style={{
        height: BANNER_HEIGHT,
        backgroundColor: BACKGROUND_COLOUR,
        margin: `${marginVertical}px 0 ${marginBottom}px`,
      }}
    >
      <div className="flex-row relative">
        <ServeCardContent />
        <ServeOverLay />
        <ServeCardImage />
      </div>
      <ServeFooter />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(HeroBanner);
