import { useState, useEffect } from "react";
import { connect } from "frontity";

import Card from "./card/card";
import Loading from "./loading";

const VideoGallery = ({ state, actions, block }) => {
  if (!block) return <Loading />;
  if (!block.video_card) return null;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div style={styles.container}>
        {block.video_card.map((block, key) => {
          const {
            body,
            colour,
            condition,
            date,
            procedure,
            service,
            title,
            video,
          } = block;

          return (
            <div key={key} className="flex">
              <Card
                gallery={video}
                videoGalleryInfo={{
                  body,
                  condition,
                  date,
                  procedure,
                  service,
                  title,
                }}
                colour={colour}
                shadow // optional param
              />
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
    gridTemplateColumns: `repeat(2, 1fr)`,
    justifyContent: "space-between",
    gap: 20,
  },
};

export default connect(VideoGallery);
