import { useState, useEffect } from "react";
import { connect } from "frontity";

import SideBarMenu from "./sideBarMenu";
import BlockWrapper from "../../components/blockWrapper";
import SIGApplication from "./forms/sigApplication";

// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState, muiQuery } from "../../context";

const RegistrationStepFive = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const { lg } = muiQuery();
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // SERVERS ---------------------------------------------

  return (
    <BlockWrapper>
      <div
        style={{
          margin: `${marginVertical}px ${marginHorizontal}px`,
        }}
      >
        <div style={!lg ? styles.container : styles.containerMobile}>
          <SideBarMenu />
          <div style={{ padding: `0 1em 1em` }}>
            <SIGApplication />
          </div>
        </div>
      </div>
    </BlockWrapper>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `1fr 2fr`,
    justifyContent: "space-between",
    gap: 20,
  },
  containerMobile: {
    display: "grid",
    gridTemplateColumns: `1fr`,
    justifyContent: "space-between",
    gap: 20,
  },
};

export default connect(RegistrationStepFive);
