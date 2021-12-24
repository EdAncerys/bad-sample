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

const QuotationCarousel = ({ state, actions, libraries, block }) => {
  if (!block) return null;

  const { disable_vertical_padding, background_colour } = block;

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const BANNER_HEIGHT = state.theme.bannerHeight;
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

  const ServeIcon = ({ icon, right }) => {
    if (!icon) return null;

    return (
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          width: 25,
          height: 50,
          cursor: "pointer",
          top: BANNER_HEIGHT / 2,
          right: right ? 0 : "",
        }}
      >
        <Image className="d-block h-100" src={icon} />
      </div>
    );
  };

  if (!block) return <Loading />;

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px 0` }}>
      <Carousel
        className="quotation-carousel"
        style={{ color: colors.darkSilver }}
      >
        {block.slides.map((block, key) => {
          const { label, title } = block;

          // SERVERS ----------------------------------------------------

          return (
            <Carousel.Item key={key}>
              <BlockWrapper>
                <div style={{ position: "relative" }}>
                  <ServeIcon icon={LeftIcon} />
                  <ServeIcon icon={RightIcon} right />
                </div>
              </BlockWrapper>
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
                      fontWeight: "bold",
                      color: colors.black,
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                  >
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
};

export default connect(QuotationCarousel);
