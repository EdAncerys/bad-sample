import { useState, useEffect } from "react";
import { connect } from "frontity";

import HeaderBlock from "./HeaderBlock";
import MultiPostBlock from "./multiPostBlock";
import Loading from "./loading";

const FeaturedEvents = ({ state, actions, item }) => {
  if (!item) return <Loading />;
  // RETURN ---------------------------------------------------
  return (
    <div style={styles.container}>
      <HeaderBlock
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
