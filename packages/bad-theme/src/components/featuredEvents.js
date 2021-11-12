import { useState, useEffect } from "react";
import { connect } from "frontity";

import CardBlockHeader from "./cardBlockHeader";
import MultiPostBlock from "./multiPostBlock";

const FeaturedEvents = ({ state, actions }) => {
  const data = [1, 2]; // TBD

  return (
    <div style={styles.container}>
      <CardBlockHeader
        title="Featured Events"
        urlTitle="View All"
        url="/learn-more"
      />
      <MultiPostBlock data={data} />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(FeaturedEvents);
