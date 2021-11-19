import React, { useState, useEffect } from "react";
import { connect } from "frontity";
import { colors } from "../config/colors";
import { DATA } from "../config/data";

// COMPONENTS ----------------------------------------------------------------
import PromoBlock from "../components/promoBlock";
// import CardFS from "../components/cardFS";

const Home = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Components; // to render html contentment
  // <Html2React html={rendered} /> // get html content from state

  const data = state.source.get(state.router.link);
  const home = state.source[data.type];
  console.log("home data: ", home); // debug

  const handleSetLoading = () => {
    setLoadingAction({ dispatch, isLoading: true });
  };

  return (
    <div>
      <div>
        <p style={styles.title}>BAD Home</p>
      </div>

      {/* <PromoBlock item={DATA[2]} reverse /> */}
    </div>
  );
};

const styles = {
  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "500",
    color: colors.primary,
    backgroundColor: "#66806A",
  },
};

export default connect(Home);
