import React from "react";
import { connect } from "frontity";

import { colors } from "../config/colors";
import BlockBuilder from "../components/builder/blockBuilder";

const Post = ({ state }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;

  return (
    <div>
      <div>
        <p style={styles.title}>PAGE</p>
      </div>

      <BlockBuilder blocks={wpBlocks} />
    </div>
  );
};

const styles = {
  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "500",
    color: colors.primary,
  },
};

export default connect(Post);
