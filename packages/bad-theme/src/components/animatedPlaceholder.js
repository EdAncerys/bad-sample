import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import CircularProgress from "@mui/material/CircularProgress";
import { Transition, useSpring, animated } from "react-spring";

import Placeholder from "../img/svg/badLogoHeader.svg";
import { useAppState } from "../context";
import { colors } from "../config/imports";

const AnimatedPlaceholder = ({ state, actions, opacity }) => {
  const { isPlaceholder } = useAppState();

  // HELPERS ---------------------------------------------

  return (
    <div
      className="no-selector"
      style={{
        position: "absolute",
        backgroundColor: colors.white, // content background color
        color: colors.softBlack,
        display: "grid",
        width: "100%",
        alignItems: "center",
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
          margin: "0 auto",
          opacity: opacity.to({ range: [0.0, 1.0], output: [0.1, 1] }),
        }}
      >
        <Image
          src={Placeholder}
          alt="BAD Placeholder"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
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
