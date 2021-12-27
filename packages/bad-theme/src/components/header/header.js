import React, { useState, useEffect } from "react";
import { connect, Global, css } from "frontity";
import bootStrapCSS from "../../css/bootstrap.min.css";
import { colors } from "../../config/imports";
// css imports ------------------------------------------------------------
import globalCSS from "../../css/main.css";
import carousel from "../../css/carousel.css";
import accordion from "../../css/accordion.css";
import nav from "../../css/nav.css";
import input from "../../css/input.css";
import custom from "../../css/custom.css";
import buttons from "../../css/buttons.css";

// COMPONENTS -------------------------------------------------------------
import HTMLHead from "./htmlHead";
import HeaderActions from "./headerActions";
import Navigation from "./navigation";

const Header = ({ state, actions }) => {
  const data = state.source.get(state.router.link);

  return (
    <>
      <Global
        styles={css`
          ${bootStrapCSS}, ${globalCSS}, ${carousel}, ${accordion}, ${nav}, ${input}, ${custom}, ${buttons},
        `}
      />
      <HTMLHead />
      <div style={styles.container}>
        <HeaderActions />
        <Navigation />
      </div>
    </>
  );
};

const styles = {
  container: {
    backgroundColor: `${colors.white}`,
  },
};

export default connect(Header);
