import { useState, useEffect } from "react";
import { connect } from "frontity";

import JournalCard from "./journalCard";

import Loading from "../loading";

const JournalPromoBlock = ({ state, actions, block }) => {
  if (!block) return <Loading />;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // SERVERS ----------------------------------------------
  const ServeJournalCards = () => {
    return (
      <div>
        <div style={styles.container}>
          {block.thumbnails.map((block, key) => {
            return <JournalCard key={key} block={block} />;
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
