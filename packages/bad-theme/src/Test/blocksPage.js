import React from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import BlockBuilder from "../components/builder/blockBuilder";
import BlockWrapper from "../components/blockWrapper";

import Wiley from "../components/authentication/wiley";
import Sagepay from "../components/authentication/sagepay";
import OCP from "../components/authentication/ocp";

const BlocksPage = ({ state }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;
  // console.log("page data: ", page); // debug

  return (
    <div>
      <div>
        <div className="primary-title" style={styles.title}>
          BLOCK BUILDER 😈{" "}
        </div>

        <BlockWrapper>
          <Wiley />
          <Sagepay />
          <OCP />
        </BlockWrapper>
      </div>

      <BlockBuilder blocks={wpBlocks} />
    </div>
  );
};

const styles = {
  title: {
    fontSize: 40,
    textAlign: "center",
    fontWeight: "500",
    color: colors.primary,
    backgroundColor: "#66806A",
  },
};

export default connect(BlocksPage);
