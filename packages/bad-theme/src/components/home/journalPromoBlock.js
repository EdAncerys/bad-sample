import { useState, useEffect } from "react";
import { connect } from "frontity";

import CardFS from "../cardFS";
import CardBlockHeader from "../cardBlockHeader";
import JournalCard from "./journalCard";

import Loading from "../loading";

const JournalPromoBlock = ({ state, actions, block }) => {
  if (!block) return <Loading />;

  // SERVERS ----------------------------------------------
  const ServeJournalCards = () => {
    return (
      <div>
        <div className="flex" style={styles.container}>
          {block.thumbnails.map((block, index) => {
            return <JournalCard key={index} block={block} />;
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <CardBlockHeader
        title="Journal Information"
        urlTitle="Learn More"
        url={`${block.link}`}
      />
      <ServeJournalCards />
      {/* <CardFS
        title={block[0].title}
        body={block[0].body}
        imgUrl={block[0].imgUrl}
      /> */}
    </div>
  );
};

const styles = {
  container: {
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
};

export default connect(JournalPromoBlock);
