import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../config/colors";
import BlockBuilder from "../components/builder/blockBuilder";
import { muiQuery } from "../context";
import Loading from "../components/loading";

const EventsLandingPage = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const [wpBlocks, setWpBlocks] = useState(false); // event data
  const { sm, md, lg, xl } = muiQuery();

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    const path = `/events-content/`;
    await actions.source.fetch(path); // fetch CPT events

    const data = state.source.get(path);
    const events = state.source[data.type][data.id];
    const wpBlocks = events.acf.blocks;
    setWpBlocks(wpBlocks);
  }, []);
  // DATA pre FETCH ----------------------------------------------------------------

  if (!wpBlocks) return <Loading />;

  return (
    <div>
      events landing page
      <BlockBuilder blocks={wpBlocks} />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(EventsLandingPage);
