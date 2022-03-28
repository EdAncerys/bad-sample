import React from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Carousel } from "react-bootstrap";
import ReactPlayer from "react-player";
import LeftIcon from "../../img/svg/carouselIconLeft.svg";
import RightIcon from "../../img/svg/carouselIconRight.svg";
import { colors } from "../../config/imports";

const GalleryCarousel = ({
  state,
  actions,
  libraries,
  gallery,
  height,
  padding,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const marginHorizontal = state.theme.marginHorizontal;
  let carouselPadding = 0;
  if (padding) carouselPadding = padding;
  let carouselHeight = 370;
  if (height) carouselHeight = height;
  if (!gallery) return null;

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
          top: carouselHeight / 2,
          right: right ? 0 : "",
          marginLeft: left ? `-4em` : "auto",
          marginRight: right ? `-4em` : "auto",
        }}
      >
        <Image className="d-block h-100" src={icon} />
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div style={{ padding: carouselPadding }}>
      <div style={{ position: "relative", margin: `0 ${marginHorizontal}px` }}>
        <ServeIcon icon={LeftIcon} left />
        <ServeIcon icon={RightIcon} right />
      </div>

      <Carousel interval={null} className="gallery-carousel">
        {gallery.map((block, key) => {
          const { subtype, url, title } = block;

          const ServeCardImage = () => {
            if (!url || subtype !== "jpeg") return null;
            const alt = title || "BAD";

            return (
              <div style={{ width: "100%", height: "100%" }}>
                <Image
                  src={url}
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

          const ServeCardVideo = () => {
            if (!url || subtype !== "mp4") return null;
            const alt = title || "BAD";

            return (
              <div style={{ width: "100%", height: "100%" }}>
                <ReactPlayer
                  url={url}
                  alt={alt}
                  width="100%"
                  height="100%"
                  style={{
                    objectFit: "cover",
                  }}
                  // playing
                  muted
                  controls
                />
              </div>
            );
          };

          return (
            <Carousel.Item key={key}>
              <div
                style={{
                  position: "relative",
                  height: carouselHeight,
                }}
              >
                <ServeCardImage />
                <ServeCardVideo />
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

export default connect(GalleryCarousel);
