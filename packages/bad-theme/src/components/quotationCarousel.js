import React from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Carousel } from "react-bootstrap";
import { colors } from "../config/colors";
import Quate from "../img/svg/quote.svg";

import Loading from "./loading";

const QuotationCarousel = ({ state, actions, libraries, block }) => {
  if (!block) return null;

  const { disable_vertical_padding } = block;

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const BANNER_HEIGHT = state.theme.bannerHeight;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // SERVERS ----------------------------------------------------------------
  const ServeIcon = () => {
    return (
      <div
        className="flex"
        style={{ justifyContent: "center", padding: `2em 0` }}
      >
        <div style={{ width: 100, height: 100 }}>
          <Image src={Quate} className="d-block h-100" alt="BAD Logo" />
        </div>
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
              <div
                style={{
                  position: "relative",
                  height: BANNER_HEIGHT,
                  backgroundColor: colors.silver,
                }}
              >
                <ServeIcon />
                <Carousel.Caption
                  className="flex-col"
                  style={{
                    color: colors.textMain,
                    textAlign: "center",
                  }}
                >
                  <div
                    className="flex primary-title" 
                    style={{
                      fontSize: 36,
                      fontWeight: "bold",
                      color: colors.black,
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
