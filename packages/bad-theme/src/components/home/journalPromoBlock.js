import { useState, useEffect } from "react";
import { connect } from "frontity";

import Loading from "../loading";
import JournalCard from "./journalCard";

const JournalPromoBlock = ({ state, actions, block }) => {
  if (!block) return <Loading />;
  if (!block.thumbnails) return null;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // SERVERS ----------------------------------------------
  const ServeJournalCards = () => {
    return (
      <div>
        <div style={styles.container}>
          {block.thumbnails.map((block, key) => {
            const { image, link, title } = block;

            return (
              <JournalCard key={key} image={image} title={title} link={link} shadow />
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
};

export default connect(JournalPromoBlock);
