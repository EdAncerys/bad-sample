import { useState, useEffect } from "react";
import { connect } from "frontity";

import Card from "./card/card";
import Loading from "./loading";

const VenueHireGallery = ({ state, actions, block }) => {
  if (!block) return <Loading />;
  if (!block.room) return null;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <div style={styles.container}>
        {block.room.map((block, key) => {
          const { capacity, gallery, colour, title } = block;

          return (
            <div key={key} className="flex">
              <Card
                gallery={gallery}
                venueInfo={{ capacity, title }}
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

export default connect(VenueHireGallery);
