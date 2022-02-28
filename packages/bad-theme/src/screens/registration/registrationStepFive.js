import { useState } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import { setGoToAction } from "../../context";
import SideBarMenu from "./sideBarMenu";
import BlockWrapper from "../../components/blockWrapper";
import SIGApplication from "./forms/sigApplication";

// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState } from "../../context";

const RegistrationStepFive = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // SERVERS ---------------------------------------------
  const ServeContent = () => {
    return (
      <div style={{ padding: `0 1em 1em` }}>
        <div className="primary-title" style={styles.title}>
          SIG Questions
        </div>
        <div style={{ paddingTop: `0.75em` }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </div>
        <div>
          <span className="required" />
          Mandatory fields
        </div>
        <div
          className="caps-btn"
          onClick={() =>
            setGoToAction({
              path: `/membership/categories-of-membership/`,
              actions,
            })
          }
          style={{ paddingTop: `1em` }}
        >
          BAD membership categories
        </div>

        <SIGApplication />
      </div>
    );
  };

  return (
    <BlockWrapper>
      <div
        style={{
          margin: `${marginVertical}px ${marginHorizontal}px`,
        }}
      >
        <div style={styles.container}>
          <SideBarMenu />
          <ServeContent />
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
  title: {
    fontSize: 22,
  },
};

export default connect(RegistrationStepFive);
