import React, { useState, useEffect } from "react";
import { connect } from "frontity";
import Link from "@frontity/components/link";
import Image from "@frontity/components/image";
import Loading from "../components/loading";

import { colors } from "../config/colors";

const home = ({ state, actions }) => {
  const data = state.source.get(state.router.link);

  if (false) return <Loading />;

  return (
    <div>
      <div>
        <p style={styles.title}>BAD</p>
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

export default connect(home);
