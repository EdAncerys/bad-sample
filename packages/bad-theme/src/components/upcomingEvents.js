import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import Loading from "./loading";
import { colors } from "../config/colors";

const PromoBlock = ({ state, actions, libraries, block, reverse }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  if (!block) return <Loading />;

  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div style={{ minHeight: `${BANNER_HEIGHT / 2}` }}>
        {block.card.map((block, key) => {
          const {
            body,
            condition,
            date,
            image,
            information,
            procedure,
            service,
            title,
          } = block;

          if (!title && !image && !body) return null;

          // SERVERS ----------------------------------------------------------------
          const ServeCardImage = () => {
            if (!image.url) return null;
            const alt = <Html2React html={title} /> || "BAD";

            return (
              <div style={{ width: "100%", height: "100%" }}>
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
              if (!date) return null;

              return (
                <div style={{ fontSize: 12 }}>
                  <Html2React html={date} />
                </div>
              );
            };

            const ServeTitle = () => {
              if (!title) return null;

              return (
                <div
                  style={{ fontSize: 22, fontWeight: "bold", padding: `1em 0` }}
                >
                  <Html2React html={title} />
                </div>
              );
            };

            const ServeInformation = () => {
              if (!information) return null;

              return (
                <div style={{ fontSize: 16, color: colors.blue }}>
                  <Html2React html={information} />
                </div>
              );
            };

            const ServeBody = () => {
              if (!body) return null;

              return (
                <div style={{ fontSize: 16, padding: `1em 0 0` }}>
                  <Html2React html={body} />
                </div>
              );
            };

            const ServeActions = () => {
              if (!body) return null;

              return (
                <div className="flex-row" style={{ flexWrap: "wrap" }}>
                  <div style={styles.action}>
                    <Html2React html={condition} />
                  </div>
                  <div style={styles.action}>
                    <Html2React html={procedure} />
                  </div>
                  <div style={styles.action}>
                    <Html2React html={service} />
                  </div>
                </div>
              );
            };

            return (
              <div className="flex-col" style={{ padding: `1em 0` }}>
                <ServeDate />
                <ServeTitle />
                <ServeInformation />
                <ServeBody />
                <ServeActions />
              </div>
            );
          };

          return (
            <div key={key} style={styles.container}>
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
    gridTemplateColumns: `3fr 1fr`,
    gap: 20,
  },
  action: {
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: `0.5em 1.5em`,
    margin: `1em 1em 0 0`,
  },
};

export default connect(PromoBlock);
