import React, { useState, useEffect } from "react";
import { connect, Global, css } from "frontity";
import bootStrapCSS from "../../css/bootstrap.min.css";
import { colors } from "../../config/colors";
// css imports ------------------------------------------------------------
import globalCSS from "../../css/main.css";
import carousel from "../../css/carousel.css";
import accordion from "../../css/accordion.css";
import nav from "../../css/nav.css";
import input from "../../css/input.css";
import custom from "../../css/custom.css";

import FamilyGuy from "../../config/fonts/Family-Guy-Font.ttf";

// COMPONENTS -------------------------------------------------------------
import HTMLHead from "./htmlHead";
import HeaderActions from "./headerActions";
import Navigation from "./navigation";
import BlockWrapper from "../blockWrapper";

const Header = ({ state, actions }) => {
  const data = state.source.get(state.router.link);

  return (
    <>
      <Global
        styles={css`
          ${bootStrapCSS}, ${globalCSS}, ${carousel}, ${accordion}, ${nav}, ${input}, ${custom},  
          @font-face {
            font-family: "FamilyGuy";
            font-style: normal;
            font-weight: normal;
            font-display: fallback;
            src: url("${FamilyGuy}") format("truetype");
          }
        `}
      />
      <HTMLHead />
      <BlockWrapper>
        <div className="flex-col" style={styles.container}>
          <HeaderActions />
          <Navigation />
        </div>
      </BlockWrapper>
    </>
  );
};

const styles = {
  container: {
    minHeight: 245,
    backgroundColor: `${colors.white}`,
    borderBottom: `2px solid ${colors.lightSilver}`,
  },
};

export default connect(Header);
