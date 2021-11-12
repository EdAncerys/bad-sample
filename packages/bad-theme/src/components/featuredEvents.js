import { useState, useEffect } from "react";
import { connect } from "frontity";

import CardBlockHeader from "./cardBlockHeader";
import MultiPostBlock from "./multiPostBlock";

import { DATA } from "../config/data.js";

const FeaturedEvents = ({ state, actions }) => {

  return (
    <div style={styles.container}>
      <CardBlockHeader
        title="Featured Events"
        urlTitle="View All"
        url="/learn-more"
      />
      <MultiPostBlock data={DATA} />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(FeaturedEvents);
