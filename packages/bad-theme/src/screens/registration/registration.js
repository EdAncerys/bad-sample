import React from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import BlockWrapper from "../../components/blockWrapper";

const Registration = ({ state }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  return (
    <BlockWrapper>
      <div>
        <div className="primary-title" style={styles.title}>
          REGISTRATION
        </div>
      </div>
    </BlockWrapper>
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
