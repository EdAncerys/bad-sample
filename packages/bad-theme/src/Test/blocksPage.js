import React from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import BlockBuilder from "../components/builder/blockBuilder";
import BlockWrapper from "../components/blockWrapper";
// --------------------------------------------------------------------------------
import Referrals from "../screens/referrals";

const BlocksPage = ({ state }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;
  // console.log("page data: ", page); // debug

  // 📌 if env is dev, show the blocks.
  if (state.auth.ENVIRONMENT !== "DEVELOPMENT") return null;

  return (
    <div>
      <div>
        <div className="primary-title" style={styles.title}>
          BLOCK BUILDER 😈
        </div>

        <BlockWrapper>
          <Referrals />
        </BlockWrapper>
      </div>

      <BlockBuilder blocks={wpBlocks} block={{ facebook_link: "" }} />
    </div>
  );
};

const styles = {
  title: {
    fontSize: 26,
    textAlign: "center",
    fontWeight: "500",
    color: colors.primary,
    backgroundColor: "#66806A",
  },
};

export default connect(BlocksPage);
