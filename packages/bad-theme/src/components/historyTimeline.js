import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

import Loading from "./loading";
import { colors } from "../config/imports";

const HistoryTimeline = ({ state, actions, libraries, block, reverse }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  if (!block) return <Loading />;
  if (!block.timeline_item) return null;

  const { disable_vertical_padding } = block;

  const IMG_WIDTH = 70;
  let GRID_KEY = 0;
  let ROW_COUNTER = 0;
  let ROW = 1;
  const WIDTH = 4;

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // HELPERS ----------------------------------------------------------------
  const slide = (direction) => {
    const container = document.getElementById("carousel-container");
    let scrollCompleted = 0;
    const slideVar = setInterval(function () {
      if (direction == "left") {
        container.scrollLeft -= 100;
      } else {
        container.scrollLeft += 100;
      }
      scrollCompleted += 100;
      if (scrollCompleted >= 1000) {
        window.clearInterval(slideVar);
      }
    }, 50);
  };

  const HistoryButton = ({ next }) => {
    return (
      <button
        onClick={() => {
          next ? slide("right") : slide("left");
        }}
        style={{
          backgroundColor: colors.white,
          textTransform: "uppercase",
          display: "flex",
          justifyContent: next ? "end" : "start",
          alignItems: "center",
          borderRadius: "5px",
          border: 0,
          marginBottom: 0,
        }}
      >
        {next ? (
          <div
            className="flex shadow"
            style={{ padding: `0.5em 2em`, alignItems: "center" }}
          >
            <div>Next</div>
            <KeyboardArrowRight sx={{ fontSize: 24 }} />
          </div>
        ) : (
          <div
            className="flex shadow"
            style={{ padding: `0.5em 2em`, alignItems: "center" }}
          >
            <KeyboardArrowLeft sx={{ fontSize: 24 }} />
            <div>Previous</div>
          </div>
        )}
      </button>
    );
  };
  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div className="d-flex justify-content-between">
        <HistoryButton next={false} />
        <HistoryButton next={true} />
      </div>
      <div style={styles.container} id="carousel-container">
        {block.timeline_item.map((block, key) => {
          const { body, title, image, year } = block;

          if (!body && !title) return null;

          let BORDER_WIDTH = `0 0 ${WIDTH}px ${WIDTH}px`;
          if (ROW_COUNTER === 1) BORDER_WIDTH = `0 0 0 ${WIDTH}px`;
          if (ROW_COUNTER === 0 && ROW > 2)
            BORDER_WIDTH = `${WIDTH}px 0 0 ${WIDTH}px`;
          if (GRID_KEY === 5) ROW++;

          // SERVERS -----------------------------------------------

          const ServeCardContent = () => {
            // SERVERS ---------------------------------------------
            const ServeDate = () => {
              if (!year) return null;

              return (
                <>
                  <div className="container">
                    <div className="row">
                      <div
                        className="primary-title"
                        style={{
                          fontSize: 40, // exception for timeline date
                          zIndex: 12,
                        }}
                        className="col-4"
                      >
                        <Html2React
                          html={year}
                          style={{ backgroundColor: "white" }}
                        />
                      </div>
                      <div
                        className="col-8 d-flex p-0 flex-column justify-content-center"
                        style={{ overflow: "hidden" }}
                      >
                        <hr style={{ width: "100%" }} />
                      </div>
                    </div>
                  </div>
                </>
              );
            };

            const ServeCardImage = () => {
              if (!image) return null;
              const alt = title || "BAD";

              return (
                <div style={{ height: 150, width: 150 }}>
                  <Image
                    src={image.url}
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

            const ServeTitle = () => {
              if (!title) return null;

              return (
                <div
                  className="primary-title"
                  style={{ fontSize: 12, padding: `1em 0` }}
                >
                  <Html2React html={title} />
                </div>
              );
            };

            const ServeBody = () => {
              if (!body) return null;

              return (
                <div style={{ fontSize: 12, padding: title ? 0 : `1em 0` }}>
                  <Html2React html={body} />
                </div>
              );
            };

            return (
              <div style={{ width: "300px" }}>
                <div style={{ width: "100%", display: "table" }}>
                  <ServeDate />
                </div>
                <ServeTitle />
                <ServeBody />
                <ServeCardImage />
              </div>
            );
          };

          return (
            <div
              key={key}
              className="flex-col"
              style={{
                padding: `1em`,
                width: "33%",
              }}
            >
              <ServeCardContent />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    overflowX: "auto",
    gap: 0,
  },
};

export default connect(HistoryTimeline);
