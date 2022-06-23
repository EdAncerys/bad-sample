import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Carousel } from "react-bootstrap";
import { colors } from "../../config/imports";

import Loading from "../loading";
import BlockWrapper from "../blockWrapper";
import LeftIcon from "../../img/svg/carouselIconLeft.svg";
import RightIcon from "../../img/svg/carouselIconRight.svg";
// --------------------------------------------------------------------------------
import { setGoToAction, muiQuery, Parcer } from "../../context";

const HomeBannerCarousel = ({ state, actions, libraries, block }) => {
  if (!block) return null;
  const { sm, md, lg, xl } = muiQuery();

  const { disable_vertical_padding, background_colour } = block;

  const BANNER_HEIGHT = state.theme.bannerHeight * 1.25;
  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  const [carouselSlides, setSlides] = useState([]);

  useEffect(() => {
    // 📌 set slide images depending on screen size
    let slides = block.slides;
    if (lg & !!block.slides_mobile) slides = block.slides_mobile;

    setSlides(slides);
  }, [lg]);

  // SERVERS ----------------------------------------------------------------
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

  const ServeOverlay = () => {
    return (
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: BANNER_HEIGHT,
          background: !sm
            ? `linear-gradient(90deg, rgba(31,51,94,1) 0%, rgba(133,133,148,0.1) 80%)`
            : `linear-gradient(180deg, rgba(133,133,148,0.1)  0%, rgba(31,51,94,1)80%)`,
        }}
      />
    );
  };

  if (!block) return <Loading />;

  // RETURN ---------------------------------------------------
  return (
    <div
      style={{
        margin: `${marginVertical}px 0`,
        backgroundColor: background_colour || null,
      }}
    >
      <BlockWrapper>
        {!lg && (
          <div
            style={{ position: "relative", margin: `0 ${marginHorizontal}px` }}
          >
            <ServeIcon icon={LeftIcon} left />
            <ServeIcon icon={RightIcon} right />
          </div>
        )}
      </BlockWrapper>
      <Carousel
        className={!lg ? "home-banner-carousel" : "home-banner-carousel-mobile"}
      >
        {carouselSlides.map((block, key) => {
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
                <div
                  className="banner-transparent-btn anim-fadeInLeft"
                  style={{ animationDelay: "1.2s" }}
                  onClick={() =>
                    setGoToAction({ state, path: link.url, actions })
                  }
                >
                  <div className="first-letter-capital">
                    <Parcer libraries={libraries} html={LABEL} />
                  </div>
                </div>
              </div>
            );
          };

          const ServeEventAction = () => {
            if (!event_label && !event_link) return null;

            let LABEL = "Event";
            if (event_label) LABEL = event_label;

            return (
              <div
                className="label anim-fadeInLeft"
                style={{
                  marginBottom: "1em",
                  animationDelay: "0.5s",
                  backgroundColor: colors.lightSilver,
                  color: colors.navy,
                  padding: "0.3em",
                }}
                onClick={() =>
                  setGoToAction({ state, path: event_label.url, actions })
                }
              >
                <Parcer libraries={libraries} html={LABEL} />
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
              <div
                style={{
                  position: "relative",
                  height: BANNER_HEIGHT,
                }}
              >
                <ServeCardImage />
                <BlockWrapper>
                  <div style={{ position: !lg ? "relative" : null }}>
                    <Carousel.Caption
                      style={{
                        color: THEME_COLOR,
                        left: `${marginHorizontal}px`,
                        bottom: `5em`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                          marginBottom: "2em",
                        }}
                      >
                        <ServeEventAction />
                        <div
                          className="flex anim-fadeInLeft"
                          style={{
                            alignItems: "center",
                            height: !lg ? BANNER_HEIGHT / 2 : null,
                            maxWidth: !lg ? "50%" : "100%",
                            margin: !lg ? null : "1em 0 1em 0",
                            animationDelay: "0.9s",
                          }}
                        >
                          <div
                            className="flex-col primary-title"
                            style={{
                              fontSize: !lg ? 36 : 26,
                              textAlign: "start",
                              color: colors.white,
                            }}
                          >
                            <Parcer libraries={libraries} html={title} />
                          </div>
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
