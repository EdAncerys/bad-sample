import React, { useState, useEffect } from "react";
import { connect, Global, css } from "frontity";
import bootStrapCSS from "../../css/bootstrap.min.css";
import globalCSS from "../../css/main.css";
import { colors } from "../../config/colors";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState, setLoginAction } from "../../context";
// COMPONENTS ----------------------------------------------------------------
import HTMLHead from "./htmlHead";
import NavigationActions from "./navigationActions";
import HeaderActions from "./headerActions";

const Header = ({ state, actions }) => {
  const dispatch = useAppDispatch();
  const { setLogin } = useAppState();
  const data = state.source.get(state.router.link);

  return (
    <>
      <Global
        styles={css`
          ${bootStrapCSS}, ${globalCSS}
        `}
      />
      <HTMLHead />
      <div style={styles.container}>
        <HeaderActions />
        <NavigationActions />
      </div>
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    backgroundColor: `${colors.white}`,
    borderBottom: `2px solid ${colors.silver}`,
  },
};

export default connect(Header);
