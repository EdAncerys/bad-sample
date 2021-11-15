import React from "react";
import { connect, styled } from "frontity";

import { colors } from "../config/colors";

const Post = ({ state }) => {
  const data = state.source.get(state.router.link);
  const post = state.source[data.type][data.id];
  console.log("post data: ", post); // debug

  return (
    <div>
      <div>
        <p style={styles.title}>POST</p>
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
