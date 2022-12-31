import React, { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
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
  Parcer,
} from "../context";
// BLOCK WIDTH WRAPPER -------------------------------------------------------
import BlockWrapper from "../components/blockWrapper";

const DermGroupsCharity = ({ state, actions, libraries }) => {
  const { lg } = muiQuery();
  const dispatch = useAppDispatch();
  const { applicationData, isActiveUser, dynamicsApps } = useAppState();
  const [sigGroup, setGroupe] = useState(null);
  const [loading, setLoading] = useState(false);

  const data = state.source.get(state.router.link);
  const dermGroupe = state.source[data.type][data.id];

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  let { content, title, acf } = dermGroupe;
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

  useEffect(() => {
    // --------------------------------------------------------------------------------
    // 📌  Hook to inject css to the layout
    //  👉 fix async state updates use hook without dependencies to rerender after state update
    // --------------------------------------------------------------------------------
    const container = document.querySelector(".groupe-charity-content");

    // ⚠️ add vertical padding to all p tags in the container
    const pTags = container.querySelectorAll("p");
    pTags.forEach((p) => {
      p.style.padding = "0.5em 0";
    });
  });

  // HANDLERS --------------------------------------------------
  const handleApply = async ({ catType }) => {
    try {
      setLoading(true);
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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // SERVERS ---------------------------------------------------
  const ServeContent = () => {
    return (
      <div
        style={{ margin: !lg ? null : "0.5em 1em" }}
        className="groupe-charity-content"
      >
        <TitleBlock
          block={{ title: title.rendered }}
          margin={`0 0 ${marginVertical}px 0`}
        />
        <Parcer libraries={libraries} html={content.rendered} />
        <ApplyForMembership />
      </div>
    );
  };

  const ApplyForMembership = () => {
    if (!acf.sigs || !sigGroup) return null;

    // filter sig by id and return name of the groupe
    const sig = sigGroup.filter((sig) => sig.id === acf.sigs);
    let catType = sig?.[0]?.name;

    return (
      <div style={{ paddingTop: `2em` }}>
        <div
          className="blue-btn"
          style={{ width: "fit-content", margin: `1em 0` }}
          // --------------------------------------------------------------------------------
          // ⚠️  Add prefix to SIG application type name
          // --------------------------------------------------------------------------------
          onClick={() => handleApply({ catType: "Full:" + catType })}
          title="Apply"
        >
          <Parcer
            libraries={libraries}
            html={`Apply for ${catType} membership`}
          />
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <BlockWrapper>
      <div style={{ padding: `${marginVertical}px ${marginHorizontal}px` }}>
        <div style={!lg ? styles.container : styles.containerMobile}>
          {loading && (
            <div className="fetching-icon">
              <Loading />
            </div>
          )}
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
    position: "relative",
    display: "grid",
    gridTemplateColumns: `1fr auto`,
    gap: "2em",
  },
  containerMobile: {
    position: "relative",
    display: "flex",
    flexDirection: "column-reverse",
    gap: "2em",
  },
};

export default connect(DermGroupsCharity);
