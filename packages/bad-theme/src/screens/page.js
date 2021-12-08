import { useContext } from "react";
import { connect } from "frontity";

import { colors } from "../config/colors";
import BlockBuilder from "../components/builder/blockBuilder";
import { muiQuery } from "../context";

const Post = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;
  console.log("pageData ", data, page);

  const { sm, md, lg, xl } = muiQuery();

  return (
    <div>
      <div>
        <p style={styles.title}>PAGE</p>
      </div>
      <span>{`theme.breakpoints.down('sm') matches: ${sm}`}</span>
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
