import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import Card from "./card";
import Loading from "./loading";
import ButtonsRow from "./buttonsRow";
import FullWidthContentBlock from "./fullWidthContentBlock";

const HeroBanner = ({ state, actions, libraries, block }) => {
  // console.log("HeroBanner Triggered", block); //debug
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const BANNER_HEIGHT = state.theme.bannerHeight;
  const PADDING = state.theme.marginHorizontal;
  const FOOTER_HEIGHT = 50;
  let OVERLAY_WIDTH = "200%";
  let CARD_WIDTH = "50%";
  let CARD_HEIGHT = BANNER_HEIGHT - FOOTER_HEIGHT * 2;
  let BODY_LENGTH = 400;
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const {
    add_background_image,
    add_buttons,
    background_image,
    body,
    buttons,
    layout,
    pop_out_text,
    title,
  } = block;

  if (!buttons) {
    BODY_LENGTH = 450;
    CARD_HEIGHT = BANNER_HEIGHT - FOOTER_HEIGHT;
  }
  if (layout !== "50-50") {
    CARD_WIDTH = "100%";
    OVERLAY_WIDTH = "100%";
    BODY_LENGTH = 800;
  }

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
            marginLeft: PADDING,
            marginTop: FOOTER_HEIGHT / 2,
          }}
        >
          <Card
            cardTitle="Card Header Title"
            title={title}
            body={body}
            cardWidth={CARD_WIDTH}
            cardHeight={CARD_HEIGHT}
            bodyLength={BODY_LENGTH}
          />
        </div>
      </div>
    );
  };

  const ServeButtonsOverLay = () => {
    if (!buttons) return null;

    return (
      <div
        // className="flex-col"
        style={{
          position: "absolute",
          zIndex: 1,
          width: OVERLAY_WIDTH,
        }}
      >
        <div
          style={{
            marginLeft: PADDING,
            marginTop: BANNER_HEIGHT - FOOTER_HEIGHT,
          }}
        >
          <ButtonsRow block={block} disableMargin />
        </div>
      </div>
    );
  };

  const ServeCardContent = () => {
    if (pop_out_text) return null;

    return <FullWidthContentBlock block={block} disableMargin />;
  };

  const ServeCardImage = () => {
    if (!background_image && layout === "50-50")
      return <div className="flex" />;
    if (!background_image) return null;
    if (layout !== "50-50") return null;

    const alt = { title } || "BAD";

    return (
      <div
        className="flex"
        style={{ width: "100%", height: BANNER_HEIGHT, overflow: "hidden" }}
      >
        <Image src={background_image} className="d-block h-100" alt={alt} />
      </div>
    );
  };

  const ServeOverLay = () => {
    return (
      <div
        className="flex"
        style={{ height: BANNER_HEIGHT, position: "relative" }}
      >
        <ServeCardContent />
        <ServeBannerOverLay />
        <ServeButtonsOverLay />
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div className="flex-col" style={{ margin: `${marginVertical}px 0` }}>
      <div className="flex-row">
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
