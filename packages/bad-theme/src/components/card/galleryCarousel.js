import React from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Carousel } from "react-bootstrap";
import ReactPlayer from "react-player";

import { colors } from "../../config/colors";

const GalleryCarousel = ({ state, actions, libraries, gallery }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const BANNER_HEIGHT = 370;

  if (!gallery) return null;

  // RETURN ---------------------------------------------------
  return (
    <div>
      <Carousel className="gallery-carousel">
        {gallery.map((block, key) => {
          const { subtype, url, title } = block;

          console.log("........", block);

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
                  playing
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
                  height: BANNER_HEIGHT,
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
