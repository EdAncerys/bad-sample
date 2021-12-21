import React from "react";
import { connect } from "frontity";

import { colors } from "../../config/colors";
import SearchDermatologists from "../../components/searchDermatologists";
import PilGuidelines from "../../components/home/pilGuidelines";
import BlockWrapper from "../../components/blockWrapper";

const Registration = ({ state }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  return (
    <BlockWrapper>
      <div>
        <div style={styles.title}>REGISTRATION</div>
      </div>
      <SearchDermatologists />

      <PilGuidelines />
    </BlockWrapper>
  );
};

const styles = {
  title: {
    textAlign: "center",
    fontSize: 40,
    fontFamily: "Roboto",
    fontWeight: "500",
    color: colors.primary,
  },
};

export default connect(Registration);
