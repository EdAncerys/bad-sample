import { useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import BlockBuilder from "../components/builder/blockBuilder";
import { muiQuery } from "../context";

const Post = ({ state, actions, libraries }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;
  // console.log("pageData ", data, page); // debug

  const marginVertical = state.theme.marginVertical;
  const { sm, md, lg, xl } = muiQuery();

  return (
    <div>
      <BlockBuilder blocks={wpBlocks} />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Post);
