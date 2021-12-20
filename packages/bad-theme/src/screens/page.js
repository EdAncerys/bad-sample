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
  // console.log("pageData ", data, page); // debug

  const marginVertical = state.theme.marginVertical;
  const { sm, md, lg, xl } = muiQuery();

  return (
    <div style={{ padding: `${marginVertical}px 0` }}>
      <div>
        {/* <span>{`theme.breakpoints.down('sm') matches: ${sm}`}</span> */}
        {/* <span class="popup" citations="Right, finally">
          right
        </span> */}
      </div>
      <BlockBuilder blocks={wpBlocks} />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Post);
