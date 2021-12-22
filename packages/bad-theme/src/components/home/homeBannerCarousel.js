import { useState } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Carousel } from "react-bootstrap";
import { colors } from "../../config/colors";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import Loading from "../loading";
import BlockWrapper from "../blockWrapper";
import { setGoToAction } from "../../context";
import LeftIcon from "../../img/svg/carouselIconLeft.svg";
import RightIcon from "../../img/svg/carouselIconRight.svg";

const HomeBannerCarousel = ({ state, actions, libraries, block }) => {
  if (!block) return null;

  const { disable_vertical_padding } = block;

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const BANNER_HEIGHT = state.theme.bannerHeight * 1.25;
  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // SERVERS ----------------------------------------------------------------
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

  const ServeOverlay = () => {
    return (
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: BANNER_HEIGHT,
          background: `linear-gradient(90deg, rgba(31,51,94,1) 0%, rgba(133,133,148,0.1) 80%)`,
        }}
      />
    );
  };

  if (!block) return <Loading />;
  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px 0` }}>
      <Carousel className="home-banner-carousel">
        {block.slides.map((block, key) => {
          const {
            background_image,
            event_label,
            event_link,
            label,
            link,
            title,
          } = block;

          let THEME_COLOR = colors.white;
          if (!background_image) THEME_COLOR = colors.danger;

          // SERVERS ----------------------------------------------------
          const ServeMoreAction = () => {
            if (!label && !link) return null;

            let LABEL = "More";
            if (label) LABEL = label;

            return (
              <div className="home-banner">
                <button
                  className="btn btn-outline-light flex-center-row"
                  style={{
                    color: THEME_COLOR,
                    borderColor: THEME_COLOR,
                    borderRadius: 5,
                    padding: `0.5em 2em`,
                  }}
                  onClick={() => setGoToAction({ path: link.url, actions })}
                >
                  <div className="flex">
                    <Html2React html={LABEL} />
                  </div>
                  <div>
                    <KeyboardArrowRightIcon
                      style={{
                        fill: colors.white,
                        borderRadius: "50%",
                        padding: 0,
                      }}
                    />
                  </div>
                </button>
              </div>
            );
          };

          const ServeEventAction = () => {
            if (!event_label && !event_link) return null;

            let LABEL = "Event";
            if (event_label) LABEL = event_label;

            return (
              <div
                style={{
                  fontSize: 12,
                  color: THEME_COLOR,
                  border: `1px solid ${THEME_COLOR}`,
                  borderRadius: 5,
                  width: "fit-content",
                  padding: `1em 2em`,
                }}
                onClick={() =>
                  setGoToAction({ path: event_label.url, actions })
                }
              >
                <Html2React html={LABEL} />
              </div>
            );
          };

          const ServeCardImage = () => {
            if (!background_image) return null;
            const alt = title || "BAD";

            return (
              <div style={{ width: "100%", height: "100%" }}>
                <Image
                  src={background_image.url}
                  alt={alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <ServeOverlay />
              </div>
            );
          };

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
                  position: "relative",
                  height: BANNER_HEIGHT,
                }}
              >
                <ServeCardImage />
                <BlockWrapper>
                  <div style={{ position: "relative" }}>
                    <Carousel.Caption
                      style={{
                        color: THEME_COLOR,
                        left: `${marginHorizontal}px`,
                        bottom: `5em`,
                      }}
                    >
                      <ServeEventAction />
                      <div
                        className="flex"
                        style={{
                          alignItems: "center",
                          height: BANNER_HEIGHT / 2,
                          maxWidth: "50%",
                        }}
                      >
                        <div
                          className="flex-col primary-title"
                          style={{
                            fontSize: 42,
                            textAlign: "start",
                          }}
                        >
                          <Html2React html={title} />
                        </div>
                      </div>
                      <ServeMoreAction />
                    </Carousel.Caption>
                  </div>
                </BlockWrapper>
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

export default connect(HomeBannerCarousel);
