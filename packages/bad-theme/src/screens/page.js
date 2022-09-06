import { connect } from "frontity";
// --------------------------------------------------------------------------------
import BlockBuilder from "../components/builder/blockBuilder";

const Post = ({ state, actions, libraries }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;
  // console.log("pageData ", data, page); // debug

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
