import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/colors";

const NavBarDropDownContent = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const menu = state.source[data.type][data.id];

  // HELPERS ---------------------------------------------

  return (
    <div
      className="flex-center-row"
      style={{ flex: 2, overflow: "auto", backgroundColor: colors.darkSilver }}
    >
      BAD MENU CONTENT
    </div>
  );
};

const styles = {
  container: {
    overflow: "auto",
  },
};

export default connect(NavBarDropDownContent);
