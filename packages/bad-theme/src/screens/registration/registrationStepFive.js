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

  const { applicationData } = useAppState();

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const [category, setCategory] = useState(() => {
    if (!applicationData) return "";
    const isSIG = applicationData[0].bad_organisedfor === "SIG";

    let applicationCategory = "";
    applicationData.map((data) => {
      if (data.bad_categorytype)
        applicationCategory = isSIG
          ? data._bad_sigid_value
          : data.bad_categorytype;
    });

    return applicationCategory;
  });

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
          Memberships Page
        </div>

        <div
          className="primary-title"
          style={{
            ...styles.title,
            paddingTop: `1em`,
            marginTop: `1em`,
            borderTop: `1px solid ${colors.silverFillTwo}`,
          }}
        >
          Category Selected : <span>{category}</span>
        </div>
        <div style={{ paddingTop: `0.75em` }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
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
