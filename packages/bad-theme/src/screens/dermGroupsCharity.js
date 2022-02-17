import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import BlockBuilder from "../components/builder/blockBuilder";
import { muiQuery } from "../context";
import TitleBlock from "../components/titleBlock";
import Card from "../components/card/card";
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
  const [isSIGApplication, setApplication] = useState(null);

  useEffect(async () => {
    if (!state.source.memberships)
      await getMembershipDataAction({ state, actions });

    const application = acf.sigs[0];
    if (!application) return null;

    const isSIG = state.source.memberships[application.ID];
    setApplication(isSIG);
  }, []);

  // HANDLERS --------------------------------------------------
  const handleApply = async () => {
    await handleApplyForMembershipAction({
      state,
      actions,
      dispatch,
      applicationData,
      isActiveUser,
      category: "SIG",
      type: isSIGApplication.acf.category_types || "", // application type name
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
    if (!isSIGApplication) return null;

    let applicationName = "SIG Application";
    if (isSIGApplication.acf)
      applicationName = isSIGApplication.acf.category_types.split(":")[1]; // remove membership type prefix

    return (
      <div>
        <div
          className="blue-btn"
          style={{ width: "fit-content", margin: `1em 0` }}
          onClick={handleApply}
        >
          <Html2React html={`Apply for ${applicationName} membership`} />
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
