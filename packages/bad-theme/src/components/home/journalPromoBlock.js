import { useState, useEffect } from "react";
import { connect } from "frontity";

import CardBlockHeader from "../cardBlockHeader";
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
      <CardBlockHeader
        title={`${block.title}`}
        urlTitle="Learn More"
        url={`${block.link}`}
      />
      <ServeJournalCards />
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(3, 1fr)`,
    justifyContent: "space-around",
  },
};

export default connect(JournalPromoBlock);
