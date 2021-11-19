import React, { useState, useEffect } from "react";
import { connect, Global, css } from "frontity";
import bootStrapCSS from "../../css/bootstrap.min.css";
import { colors } from "../../config/colors";
// css imports ------------------------------------------------------------
import globalCSS from "../../css/main.css";
import carousel from "../../css/carousel.css";
import accordion from "../../css/accordion.css";

// COMPONENTS -------------------------------------------------------------
import HTMLHead from "./htmlHead";
import NavigationActions from "./navigationActions";
import HeaderActions from "./headerActions";

const Header = ({ state, actions }) => {
  const data = state.source.get(state.router.link);

  return (
    <>
      <Global
        styles={css`
          ${bootStrapCSS}, ${globalCSS}, ${carousel}, ${accordion}
        `}
      />
      <HTMLHead />
      <div>
        <div className="flex-col" style={styles.container}>
          <HeaderActions />
          <NavigationActions />
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    height: 245,
    backgroundColor: `${colors.white}`,
    borderBottom: `2px solid ${colors.lightSilver}`,
  },
};

export default connect(Header);
