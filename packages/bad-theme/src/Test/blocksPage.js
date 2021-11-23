import React from "react";
import { connect } from "frontity";

import { colors } from "../config/colors";
import PilGuidelines from "../components/home/pilGuidelines";
import BlockBuilder from "../components/builder/blockBuilder";

const BlocksPage = ({ state }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;

  // console.log("page data: ", wpBlocks); // debug

  return (
    <div>
      <div>
        <p style={styles.title}>BLOCK BUILDER 😈 </p>
      </div>

      <BlockBuilder blocks={wpBlocks} />

      <div>
        <p style={styles.title}>STATIC COMPONENTS</p>
      </div>

      <PilGuidelines />
    </div>
  );
};

const styles = {
  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "500",
    color: colors.primary,
    backgroundColor: "#66806A",
  },
};

export default connect(BlocksPage);
