import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Transition, useSpring, animated } from "react-spring";

import Placeholder from "../img/svg/badLogoHeader.svg";
import { useAppState } from "../context";
import { colors } from "../config/imports";

const AnimatedPlaceholder = ({ state, actions }) => {
  const { isPlaceholder } = useAppState();

  // HELPERS ---------------------------------------------

  return (
    <div>
      <div
        style={{
          width: "90vw",
          maxWidth: state.theme.contentContainer / 2,
          height: "100%",
          overflow: "hidden",
          margin: "0 auto",
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
      </div>
    </div>
  );
};

export default connect(AnimatedPlaceholder);
