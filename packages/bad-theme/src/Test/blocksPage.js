import React from "react";
import { connect } from "frontity";

import { colors } from "../config/colors";
import BlockBuilder from "../components/builder/blockBuilder";

const BlocksPage = ({ state }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;

  // console.log("page data: ", wpBlocks); // debug

  return (
    <div>
      <BlockBuilder blocks={wpBlocks} />
    </div>
  );
};

const styles = {
  component: {},
};

export default connect(BlocksPage);
