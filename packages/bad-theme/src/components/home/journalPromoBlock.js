import { useState, useEffect } from "react";
import { connect } from "frontity";

import Loading from "../loading";
import JournalCard from "./journalCard";
import { muiQuery } from "../../context";

const JournalPromoBlock = ({ state, actions, block }) => {
  const { sm, md, lg, xl } = muiQuery();

  if (!block) return <Loading />;
  if (!block.thumbnails) return null;

  const { disable_vertical_padding } = block;

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // SERVERS ----------------------------------------------
  const ServeJournalCards = () => {
    return (
      <div>
        <div style={!lg ? styles.container : styles.containerMobile}>
          {block.thumbnails.map((block, key) => {
            const { image, link, title } = block;

            return (
              <JournalCard
                key={key}
                image={image}
                title={title}
                link={link}
                shadow
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{ margin: `${marginVertical}px ${marginHorizontal}px` }}>
      <ServeJournalCards />
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(3, 1fr)`,
    justifyContent: "space-between",
    gap: 15,
  },
  containerMobile: {
    display: "grid",
    gridTemplateColumns: `repeat(1, 1fr)`,
    justifyContent: "space-between",
    gap: 10,
  },
};

export default connect(JournalPromoBlock);
