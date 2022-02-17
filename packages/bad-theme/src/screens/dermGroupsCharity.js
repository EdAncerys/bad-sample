import { useState, useEffect } from "react";
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
  getMembershipDataAction,
} from "../context";
// BLOCK WIDTH WRAPPER -------------------------------------------------------
import BlockWrapper from "../components/blockWrapper";

const DermGroupsCharity = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { applicationData, isActiveUser } = useAppState();

  const data = state.source.get(state.router.link);
  const dermGroupe = state.source[data.type][data.id];
  console.log("dermGroupe", dermGroupe); // debug

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const { content, title, acf } = dermGroupe;
  const memberships = state.source.memberships;

  // HANDLERS --------------------------------------------------
  const handleApply = async ({ catType }) => {
    await handleApplyForMembershipAction({
      state,
      actions,
      dispatch,
      applicationData,
      isActiveUser,
      category: "SIG",
      type: catType || "", // application type name
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
    if (!acf.sigs || !memberships) return null;

    return (
      <div style={{ paddingTop: `2em` }}>
        {acf.sigs.map((application, key) => {
          const applicationData = memberships[application.ID];
          const catType = applicationData.acf.category_types;
          console.log(applicationData);

          let applicationName = "SIG Application";
          if (catType)
            applicationName =
              applicationData.acf.category_types.split(":")[1] ||
              applicationData.acf.category_types; // remove membership type prefix

          return (
            <div
              key={key}
              className="blue-btn"
              style={{ width: "fit-content", margin: `1em 0` }}
              onClick={() => handleApply({ catType })}
            >
              <Html2React html={`Apply for ${applicationName} membership`} />
            </div>
          );
        })}
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
