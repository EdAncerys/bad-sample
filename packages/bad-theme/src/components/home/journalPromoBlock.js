import { useState, useEffect } from "react";
import { connect } from "frontity";

import JournalCard from "./journalCard";

import Loading from "../loading";

const JournalPromoBlock = ({ state, actions, block }) => {
  if (!block) return <Loading />;

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
    <div>
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
