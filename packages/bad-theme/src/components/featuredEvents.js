import { useState, useEffect } from "react";
import { connect } from "frontity";

import CardBlockHeader from "./cardBlockHeader";
import MultiPostBlock from "./multiPostBlock";
import Loading from "./loading";

const FeaturedEvents = ({ state, actions, item }) => {
  if (!item) return <Loading />;
  // RETURN ---------------------------------------------------
  return (
    <div style={styles.container}>
      <CardBlockHeader
        title="Featured Events"
        urlTitle="View All"
        url="/learn-more"
      />
      <MultiPostBlock item={item} />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(FeaturedEvents);
