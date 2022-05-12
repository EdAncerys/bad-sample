import { connect } from "frontity";

import PrivacyPreferences from "../privacyPreferences";
import FindDermatologistOptions from "../findDermOptions";
// CONTEXT ------------------------------------------------------------------
import { useAppState, useAppDispatch } from "../../../context";

const Settings = ({ state, actions, libraries }) => {
  const dispatch = useAppDispatch();
  const { dashboardPath } = useAppState();

  if (dashboardPath !== "Preferences") return null;

  const marginHorizontal = state.theme.marginHorizontal;

  // RETURN ---------------------------------------------
  return (
    <div style={{ padding: `0 ${marginHorizontal}px` }}>
      <PrivacyPreferences />
      <FindDermatologistOptions />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Settings);
