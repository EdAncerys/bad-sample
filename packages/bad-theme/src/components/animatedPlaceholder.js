import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Transition, useSpring, animated } from "react-spring";

import Placeholder from "../img/svg/badLogoHeader.svg";
import { useAppState } from "../context";
import { colors } from "../config/imports";

const AnimatedPlaceholder = ({ state, actions }) => {
  const { isPlaceholder } = useAppState();

  const [flip, set] = useState(false);

  // HELPERS ---------------------------------------------

  const styles = useSpring({
    to: [{ opacity: 1 }],
    from: { opacity: 0 },
    config: { delay: 200, duration: 4000 },
    reset: true,
    reverse: isPlaceholder,
  });

  return (
    <div
      className="no-selector"
      style={{
        backgroundColor: colors.white, // content background color
        color: colors.softBlack,
        display: "grid",
        width: "100%",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <animated.div style={styles}>
        <div
          style={{
            width: "90vw",
            maxWidth: state.theme.contentContainer,
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
      </animated.div>
    </div>
  );
};

export default connect(AnimatedPlaceholder);
