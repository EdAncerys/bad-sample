import { connect } from "frontity";
import { colors } from "../config/imports";
import { useTransition, animated } from "react-spring";

// COMPONENTS ---------------------------------------------------------

// SCREENS --------------------------------------------------------------

import BlockWrapper from "../components/blockWrapper";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState } from "../context";

const App = ({ state, actions }) => {
  const { isActiveUser, isPlaceholder } = useAppState();

  let endPoint = state.router.link;
  const data = state.source.get(endPoint);
  console.log("👉 INDEX data", data); // debug

  const transitions = useTransition(isPlaceholder, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    reverse: isPlaceholder,
    delay: 200,
    config: { mass: 1, tension: 280, friction: 120 },
  });

  // RETURN --------------------------------------------------------------------
  return transitions(({ opacity }, appContent) => (
    <animated.div
      style={{ opacity: opacity.to({ range: [0.0, 1.0], output: [0.1, 1] }) }}
    >
      <div
        onClick={(e) => {
          state.theme.childMenuRef = ""; // reset child menu ref value
          state.theme.activeDropDownRef = "menu reset"; // reset menu ref value
        }}
      >
        <div style={{ ...styles.container }}>
          <BlockWrapper>
            <div className="flex-col">
              <h1>BAD SAMPLE APP</h1>
            </div>
          </BlockWrapper>
        </div>
      </div>
    </animated.div>
  ));
};

const styles = {
  container: {
    backgroundColor: colors.white, // content background color
    color: colors.softBlack,
    // apply full height to viewport
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    margin: "0 auto",
  },
};

export default connect(App);
