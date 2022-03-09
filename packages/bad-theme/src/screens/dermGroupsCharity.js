import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import BlockBuilder from "../components/builder/blockBuilder";
import { muiQuery } from "../context";
import TitleBlock from "../components/titleBlock";
import Card from "../components/card/card";
import Loading from "../components/loading";
// CONTEXT -----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  handleApplyForMembershipAction,
  getSIGGroupeData,
} from "../context";
// BLOCK WIDTH WRAPPER -------------------------------------------------------
import BlockWrapper from "../components/blockWrapper";

const DermGroupsCharity = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { applicationData, isActiveUser, dynamicsApps } = useAppState();
  const [sigGroup, setGroupe] = useState(null);

  const data = state.source.get(state.router.link);
  const dermGroupe = state.source[data.type][data.id];
  console.log("dermGroupe", dermGroupe); // debug

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const { content, title, acf } = dermGroupe;
  const useEffectRef = useRef(null);

  useEffect(async () => {
    if (!state.source.sig_group) {
      // pre-fetch SIG groupe data
      await getSIGGroupeData({ state, actions });
    }

    let sigGroupe = Object.values(state.source.sig_group);
    setGroupe(sigGroupe);

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, []);

  // HANDLERS --------------------------------------------------
  const handleApply = async ({ catType }) => {
    await handleApplyForMembershipAction({
      state,
      actions,
      dispatch,
      applicationData,
      isActiveUser,
      dynamicsApps,
      category: "SIG",
      type: catType || "", // application type name
      membershipApplication: {
        stepOne: false,
        stepTwo: false,
        stepThree: false,
        stepFour: false,
      },
      path: "/membership/sig-questions/", // redirect to SIG form page
    });
  };

  // SERVERS ---------------------------------------------------
  const ServeContent = () => {
    return (
      <div>
        <TitleBlock
          block={{ title: title.rendered }}
          margin={`0 0 ${marginVertical}px 0`}
        />
        <Html2React html={content.rendered} />
        <ApplyForMembership />
      </div>
    );
  };

  const ApplyForMembership = () => {
    if (!acf.sigs || !sigGroup) return null;

    // filter sig by id and return name of the groupe
    const sig = sigGroup.filter((sig) => sig.id === acf.sigs);
    // if sig data is empty then return null
    if (!sig.length) return null;
    let sigAppName = "";
    if (sig.length > 0) {
      sigAppName = sig[0].name;
    }

    return (
      <div style={{ paddingTop: `2em` }}>
        <div
          className="blue-btn"
          style={{ width: "fit-content", margin: `1em 0` }}
          onClick={() => handleApply({ catType: sigAppName })}
        >
          <Html2React html={`Apply for ${sigAppName} membership`} />
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <BlockWrapper>
      <div style={{ padding: `${marginVertical}px ${marginHorizontal}px` }}>
        <div style={styles.container}>
          <ServeContent />
          <div style={{ minWidth: 300 }}>
            <Card
              dermGroupe={acf}
              colour={colors.primary}
              cardHeight="fit-content"
              cardMinHeight={300}
              shadow
            />
          </div>
        </div>
      </div>
    </BlockWrapper>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `1fr auto`,
    gap: "2em",
  },
};

export default connect(DermGroupsCharity);
