import { useState } from "react";
import { connect } from "frontity";
import { useTransition, animated } from "react-spring";
import Logo from "../img/svg/bad_logo_animate.svg";
import { colors } from "../config/imports";
import { useB2CLogin } from "../hooks/useB2CLogin";

// COMPONENTS ----------------------------------------------------------------
import Loading from "../components/loading";

const Codecollect = ({ state, actions, libraries }) => {
  // --------------------------------------------------------------------------------
  // 📌  This is B2C login handler.
  // --------------------------------------------------------------------------------
  useB2CLogin({ state });

  console.log("🐞 B2C component ");

  const [toggle, set] = useState(false);
  // animation transition handler
  const transitions = useTransition(toggle, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    reverse: toggle,
    delay: 200,
    config: { mass: 1, tension: 280, friction: 120 },
    onRest: () => set(!toggle),
  });

  return transitions(({ opacity }) => (
    <div
      className="flex"
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.navy,

        // position: "absolute",
        // top: 0,
        // left: 0,
        // width: "100%",
        // height: "100vh",
        // zIndex: 9,
      }}
    >
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
        ></object>{" "}
        😀
      </animated.div>
    </div>
  ));
};

const styles = {
  container: {},
};

export default connect(Codecollect);
