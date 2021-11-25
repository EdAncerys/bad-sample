import React from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Carousel } from "react-bootstrap";
import { colors } from "../../config/colors";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import Loading from "../loading";

const HomeBannerCarousel = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  if (!block.slides) return null;

  // SERVERS ----------------------------------------------------------------
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
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <Carousel>
        {block.slides.map((block, key) => {
          const {
            add_button,
            background_image,
            category,
            label,
            link,
            selected_page,
            selected_post,
            slide_type,
            title,
          } = block;

          let THEME_COLOR = colors.white;
          if (!background_image) THEME_COLOR = colors.danger;

          // HELPERS ----------------------------------------------------
          const handleGoToAction = () => {
            if (!link.url) return null;
            actions.router.set(`${link.url}`);
          };

          // SERVERS ----------------------------------------------------
          const ServeFindOutMoreAction = () => {
            return (
              <button
                className="btn btn-outline-light flex-center-row mt-4"
                style={{
                  textTransform: "uppercase",
                  color: THEME_COLOR,
                  borderColor: THEME_COLOR,
                }}
                onClick={handleGoToAction}
              >
                <Html2React html={label} />
                <div>
                  <KeyboardArrowRightIcon style={{ fill: THEME_COLOR }} />
                </div>
              </button>
            );
          };

          const ServeEventAction = () => {
            if (!add_button) return null;

            return (
              <button
                className="btn btn-outline-light flex-center-row mb-4"
                style={{ color: THEME_COLOR, borderColor: THEME_COLOR }}
                onClick={handleGoToAction}
              >
                <div>Event</div>
              </button>
            );
          };

          const ServeCardImage = () => {
            if (!background_image) return null;
            const alt = title || "BAD";

            return (
              <div
                style={{ width: "100%", height: "100%", overflow: "hidden" }}
              >
                <Image
                  src={background_image.url}
                  className="d-block h-100"
                  alt={alt}
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
                <div style={{ paddingLeft: "2em" }}>
                  <Carousel.Caption style={{ color: THEME_COLOR }}>
                    <ServeEventAction />
                    <div style={{ maxWidth: "75%" }}>
                      <h3 style={{ fontSize: "2em", textAlign: "start" }}>
                        <Html2React html={title} />
                      </h3>
                    </div>
                    <ServeFindOutMoreAction />
                  </Carousel.Caption>
                </div>
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
