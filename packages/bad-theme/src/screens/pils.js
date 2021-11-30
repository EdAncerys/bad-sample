import React from "react";
import { connect } from "frontity";

import { colors } from "../config/colors";

const Post = ({ state }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;

  return (
    <div>
      <div>
        <p style={styles.title}>PIL</p>
      </div>
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
