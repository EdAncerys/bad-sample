import React from "react";
import { connect } from "frontity";

import { colors } from "../../config/colors";

const Registration = ({ state }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  return (
    <div>
      <div>
        <p style={styles.title}>REGISTRATION</p>
      </div>
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
