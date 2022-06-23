import React from "react";
import { connect } from "frontity";

import BlockBuilder from "../components/builder/blockBuilder";
// --------------------------------------------------------------------------------
import { Parcer } from "../context";
// --------------------------------------------------------------------------------
import BlockWrapper from "../components/blockWrapper";

const BlocksPage = ({ state, libraries }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;
  // console.log("page data: ", page); // debug

  // 📌 if env is dev, show the blocks.
  if (state.auth.ENVIRONMENT !== "DEVELOPMENT") return null;
  let title = [];

  return (
    <div>
      <div className="flex-col" style={{ alignItems: "center" }}>
        <div className="flex primary-title">BLOCK BUILDER 😈</div>
        <div className="flex">
          <Parcer libraries={libraries} html={title} />
        </div>
      </div>

      <BlockBuilder blocks={wpBlocks} block={{ facebook_link: "" }} />
    </div>
  );
};

export default connect(BlocksPage);
