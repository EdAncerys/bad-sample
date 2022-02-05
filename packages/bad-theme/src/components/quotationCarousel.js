import React from "react";
import { connect } from "frontity";
import { Carousel } from "react-bootstrap";
import { colors } from "../config/imports";
import Image from "@frontity/components/image";

import Quotation from "../img/svg/quotation.svg";
import LeftIcon from "../img/svg/carouselIconLeft.svg";
import RightIcon from "../img/svg/carouselIconRight.svg";

import Loading from "./loading";
import BlockWrapper from "./blockWrapper";
import { muiQuery } from "../context";

const QuotationCarousel = ({ state, actions, libraries, block }) => {
  const { sm, md, lg, xl } = muiQuery();

  if (!block) return null;

  const { disable_vertical_padding, background_colour, carouselling } = block;

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  const ICON_WIDTH = 40;

  // SERVERS ----------------------------------------------------------------
  const ServeQuotation = () => {
    return (
      <div
        style={{
          width: ICON_WIDTH,
          height: ICON_WIDTH,
        }}
      >
        <Image
          src={Quotation}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    );
  };

  const ServeIcon = ({ icon, left, right }) => {
    if (!icon) return null;

    return (
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          width: 25,
          height: 40,
          cursor: "pointer",
          top: BANNER_HEIGHT / 2,
          right: right ? 0 : "",
          marginLeft: left ? `-6em` : "auto",
          marginRight: right ? `-6em` : "auto",
        }}
      >
        <Image className="d-block h-100" src={icon} />
      </div>
    );
  };
  const ServeAuthorPhoto = ({ photo }) => {
    if (!photo) return null;
    if (lg) return null;
    return (
      <div style={{ maxHeight: 200 }}>
        <Image src={photo} style={styles.authorPhoto} />
      </div>
    );
  };
  if (!block) return <Loading />;

  // RETURN ---------------------------------------------------
  return (
    <div>
      <BlockWrapper>
        <div
          style={{
            position: "relative",
            margin: `${marginVertical}px ${marginHorizontal}px`,
          }}
        >
          <ServeIcon icon={LeftIcon} left />
          <ServeIcon icon={RightIcon} right />
        </div>
      </BlockWrapper>
      <Carousel
        className="quotation-carousel"
        style={{ color: colors.darkSilver }}
        interval={carouselling ? 5000 : null}
      >
        {block.slides.map((block, key) => {
          const { label, title, photo } = block;

          // SERVERS ----------------------------------------------------

          return (
            <Carousel.Item key={key}>
              <div
                style={{
                  height: BANNER_HEIGHT,
                  backgroundColor: background_colour || "transparent",
                }}
              >
                <Carousel.Caption
                  className="flex-col"
                  style={{ alignItems: "center", height: BANNER_HEIGHT * 0.95 }}
                >
                  <ServeQuotation />
                  <div
                    className="flex primary-title"
                    style={{
                      fontSize: 22,
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    <ServeAuthorPhoto photo={photo} />
                    <Html2React html={title} />
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      padding: `2em 0`,
                      color: colors.darkSilver,
                    }}
                  >
                    <Html2React html={label} />
                  </div>
                </Carousel.Caption>
              </div>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </div>
  );
};

const styles = {
  container: {},
  authorPhoto: {
    borderRadius: "50%",
    aspectRatio: "1/1",
    marginRight: "1em",
    width: 150,
  },
};

export default connect(QuotationCarousel);
