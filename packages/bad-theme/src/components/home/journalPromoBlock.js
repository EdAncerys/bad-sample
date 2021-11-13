import { useState, useEffect } from "react";
import { connect } from "frontity";

import CardFS from "../cardFS";
import CardBlockHeader from "../cardBlockHeader";
import JournalCard from "./journalCard";
import { DATA } from "../../config/data";

const JournalPromoBlock = ({ state, actions, item }) => {
  // SERVERS ----------------------------------------------
  const ServeJournalCards = () => {
    return (
      <div>
        <div className="flex" style={styles.container}>
          {item.map((item) => {
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
        title={item[0].title}
        body={item[0].body}
        imgUrl={item[0].imgUrl}
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
