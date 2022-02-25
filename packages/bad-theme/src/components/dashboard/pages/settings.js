import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../../config/colors";

import PrivacyPreferences from "../privacyPreferences";
import FindDermatologistOptions from "../findDermatologistOptions";

const Settings = ({ state, actions, libraries, dashboardPath }) => {
  if (dashboardPath !== "Preferences") return null;

  const marginHorizontal = state.theme.marginHorizontal;

  // SERVERS ---------------------------------------------
  const ServeDashboard = () => {
    return (
      <div style={{ padding: `0 ${marginHorizontal}px` }}>
        <PrivacyPreferences />
        <FindDermatologistOptions />
      </div>
    );
  };

  // RETURN ---------------------------------------------
  return (
    <div>
      <ServeDashboard />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Settings);
