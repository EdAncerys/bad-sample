import { useContext } from "react";
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
  setGoToAction,
  setUserStoreAction,
  setLoginModalAction,
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
  const { apply_for_membership } = dermGroupe.acf;

  // HANDLERS --------------------------------------------------
  const handleApply = async () => {
    await setUserStoreAction({
      state,
      dispatch,
      applicationData,
      isActiveUser,
      data: {
        core_name: "810170001", // "Label": "BAD" readonly FIELD!
        core_membershipsubscriptionplanid: apply_for_membership, // type of membership for application
        bad_applicationfor: "810170000", // silent assignment
      },
    });
    if (isActiveUser)
      setGoToAction({ path: `/membership/step-1-the-process/`, actions });
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
    if (true) return null;

    return (
      <div>
        <div
          className="blue-btn"
          style={{ width: "fit-content" }}
          onClick={handleApply}
        >
          <Html2React html={`Apply for ${category_types} membership`} />
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
