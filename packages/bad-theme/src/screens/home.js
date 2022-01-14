import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
// COMPONENTS ----------------------------------------------------------------
import BlockBuilder from "../components/builder/blockBuilder";
import Loading from "../components/loading";

const Home = ({ state, actions, libraries }) => {
  const [wpBlocks, setWpBlocks] = useState(null);
  const mountedRef = useRef(true);

  useEffect(async () => {
    const home = await state.source["page"][22];
    // console.log("home data: ", home); // debug
    setWpBlocks(home.acf.blocks);

    return () => {
      mountedRef.current = false; // clean up function
    };
  }, []);

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

export default connect(Home);
