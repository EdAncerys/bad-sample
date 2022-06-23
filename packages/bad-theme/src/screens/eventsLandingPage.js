import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import BlockBuilder from "../components/builder/blockBuilder";
import { muiQuery } from "../context";
import Loading from "../components/loading";

const EventsLandingPage = ({ state, actions, libraries }) => {
  const [wpBlocks, setWpBlocks] = useState(false); // event data
  const mountedRef = useRef(true);
  const { sm, md, lg, xl } = muiQuery();

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    const path = `/events-content/`;
    await actions.source.fetch(path); // fetch CPT events

    const data = state.source.get(path);
    const events = state.source[data.type][data.id];
    const wpBlocks = events.acf.blocks;
    setWpBlocks(wpBlocks);

    return () => {
      mountedRef.current = false; // clean up function
    };
  }, []);
  // DATA pre FETCH ----------------------------------------------------------------

  if (!wpBlocks) return <Loading />;

  return (
    <div>
      <BlockBuilder blocks={wpBlocks} />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(EventsLandingPage);
