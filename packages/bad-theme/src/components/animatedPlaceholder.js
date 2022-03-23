import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import CircularProgress from "@mui/material/CircularProgress";
import Logo from "../img/svg/bad_logo_animate.svg";
import { Transition, useSpring, animated } from "react-spring";
import Vivus from "vivus";

import Placeholder from "../img/svg/badLogoHeader.svg";
import { useAppState } from "../context";
import { colors } from "../config/imports";

const AnimatedPlaceholder = ({ state, actions, opacity }) => {
  const { isPlaceholder } = useAppState();

  useEffect(() => {
    document.querySelector("#my-svg").removeAttribute("hidden");
    new Vivus("my-svg", {
      type: "oneByOne",
      duration: 400,
      animTimingFunction: Vivus.EASE_OUT,
    });
  });

  // HELPERS ---------------------------------------------
  return (
    <div
      className="no-selector"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: colors.navy, // content background color
        color: colors.white,
        display: "grid",
        width: "100%",
        alignItems: "center",
        height: "100vh",
        padding: 0,
        margin: 0,
        justifyContent: "center",
        gridTemplateRows: "30vh 300px 100px",
      }}
    >
      <div />
      <animated.div
        style={{
          width: "90vw",
          maxWidth: state.theme.contentContainer / 2,
          overflow: "hidden",
          backgroundColor: colors.navy,
          margin: "0 auto",
          padding: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: opacity.to({ range: [0.0, 1.0], output: [0.1, 1] }),
        }}
      >
        <object
          id="my-svg"
          type="image/svg+xml"
          data={Logo}
          width="300px"
          height="300px"
          hidden
        ></object>
      </animated.div>
      <div
        style={{
          display: "grid",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          color: colors.primary,
        }}
      >
        <CircularProgress color="inherit" />
      </div>
    </div>
  );
};

export default connect(AnimatedPlaceholder);
