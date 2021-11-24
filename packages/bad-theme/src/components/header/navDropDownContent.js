import { useState, useEffect } from "react";
import { connect } from "frontity";

import BlockBuilder from "../../components/builder/blockBuilder";
import { colors } from "../../config/colors";

const NavBarDropDownContent = ({ state, actions }) => {
  const data = state.source.get("/bad-constitution");
  const menu = state.source[data.type][data.id];
  const wpBlocks = menu.acf.blocks;

  // HELPERS ---------------------------------------------

  return (
    <div
      className="flex-center-row"
      style={{ flex: 2, overflow: "auto", backgroundColor: colors.darkSilver }}
    >
      BAD MENU CONTENT
      {/* <BlockBuilder blocks={wpBlocks} isMenu /> */}
    </div>
  );
};

const styles = {
  container: {
    overflow: "auto",
  },
};

export default connect(NavBarDropDownContent);
