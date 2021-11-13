import { useState, useEffect } from "react";
import { connect } from "frontity";

import CardFS from "../cardFS";
import CardBlockHeader from "../cardBlockHeader";
import JournalCard from "./journalCard";
import { DATA } from "../../config/data";

const JournalPromoBlock = ({ state, actions }) => {
  const array = DATA; // TBD

  const ServeJournalCards = () => {
    return (
      <div>
        <div className="flex" style={styles.container}>
          {array.map((item) => {
            return <JournalCard key={item} item={item} />;
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
        url="/learn-more"
      />
      <ServeJournalCards />
      <CardFS
        title="It is a long established fact that a reader will be distracted by the readable"
        body="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
      />
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
