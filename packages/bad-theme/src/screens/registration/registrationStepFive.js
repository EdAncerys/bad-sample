import { useState, useEffect } from "react";
import { connect } from "frontity";

import SideBarMenu from "./sideBarMenu";
import BlockWrapper from "../../components/blockWrapper";
import SIGApplication from "./forms/sigApplication";

// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState } from "../../context";

const RegistrationStepFive = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];

  const { applicationData } = useAppState();

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const [applicationType, setType] = useState("SIG Application");

  useEffect(() => {
    if (!applicationData) return null;
    // get SIG application category type from applicationData
    const type = applicationData[0].bad_categorytype;
    setType(type);
  }, []);

  // SERVERS ---------------------------------------------
  const ServeContent = () => {
    return (
      <div style={{ padding: `0 1em 1em` }}>
        <div
          className="primary-title"
          style={{
            fontSize: 20,
            paddingBottom: `1em`,
          }}
        >
          Category Selected: <span>{applicationType}</span>
        </div>

        <div>
          <span className="required" />
          Mandatory fields
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
};

export default connect(RegistrationStepFive);
