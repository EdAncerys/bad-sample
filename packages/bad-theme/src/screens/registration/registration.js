import React from "react";
import { connect } from "frontity";

import { colors } from "../../config/colors";
import SearchDermatologists from "../../components/searchDermatologists";
import PilGuidelines from "../../components/home/pilGuidelines";


const Registration = ({ state }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  return (
    <div>
      <div>
        <p style={styles.title}>REGISTRATION</p>
      </div>
      <SearchDermatologists />

      <PilGuidelines />
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

export default connect(Registration);
