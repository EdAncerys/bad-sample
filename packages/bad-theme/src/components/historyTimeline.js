import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import Loading from "./loading";
import { colors } from "../config/colors";

const HistoryTimeline = ({ state, actions, libraries, block, reverse }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  if (!block) return <Loading />;
  if (!block.timeline_item) return null;

  const BANNER_HEIGHT = state.theme.bannerHeight;
  const IMG_WIDTH = 70;
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  let GRID_KEY = 0;
  let ROW_COUNTER = 0;
  let ROW = 1;
  const WIDTH = 4;

  const DATA_LENGTH = block.timeline_item.length / 5;

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div style={styles.container}>
        {block.timeline_item.map((block, key) => {
          const { body, image, year } = block;

          if (!body) return null;

          if (GRID_KEY === 5 && ROW_COUNTER === 1) {
            GRID_KEY = 0;
            ROW_COUNTER++;
          }
          if (GRID_KEY === 6 && ROW_COUNTER === 0) {
            GRID_KEY = 1;
            ROW_COUNTER++;
          }
          if (ROW_COUNTER === 2) {
            GRID_KEY = 0;
            ROW_COUNTER = 0;
          }

          GRID_KEY++;

          let BORDER_WIDTH = `0 0 ${WIDTH}px ${WIDTH}px`;
          if (ROW_COUNTER === 1) BORDER_WIDTH = `0 0 0 ${WIDTH}px`;
          if (ROW_COUNTER === 0 && ROW > 2)
            BORDER_WIDTH = `${WIDTH}px 0 0 ${WIDTH}px`;
          if (GRID_KEY === 5) ROW++;

          // SERVERS ----------------------------------------------------------------
          const ServeCardImage = () => {
            if (!image.url) return null;
            const alt = <Html2React html={year} /> || "BAD";

            return (
              <div style={{ width: IMG_WIDTH, height: IMG_WIDTH }}>
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

          const ServeCardContent = () => {
            // SERVERS ---------------------------------------------
            const ServeDate = () => {
              if (!year) return null;

              return (
                <div style={{ fontSize: 20, fontWeight: "bold" }}>
                  <Html2React html={year} />
                </div>
              );
            };

            const ServeBody = () => {
              if (!body) return null;

              return (
                <div style={{ fontSize: 12, padding: `1em 0` }}>
                  <Html2React html={body} />
                </div>
              );
            };

            return (
              <div className="flex-col">
                <ServeDate />
                <ServeBody />
              </div>
            );
          };

          return (
            <div
              key={key}
              className="flex-col"
              style={{
                gridColumnStart: GRID_KEY,
                border: `1px solid ${colors.darkSilver}`,
                borderWidth: BORDER_WIDTH,
                padding: `1em`,
              }}
            >
              <ServeCardContent />
              <ServeCardImage />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(6, 1fr)`,
    justifyContent: "space-between",
    gap: 0,
  },
  action: {
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: `0.5em 1.5em`,
    margin: `1em 1em 0 0`,
    boxShadow: `0 0.5rem 1rem rgba(0, 0, 0, 0.15)`,
  },
};

export default connect(HistoryTimeline);
