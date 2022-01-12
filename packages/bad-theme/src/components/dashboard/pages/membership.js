import { useState, useEffect } from "react";
import { connect } from "frontity";

import ProfileProgress from "../profileProgress";

const Membership = ({ state, actions, libraries, dashboardPath }) => {
  if (dashboardPath !== "Membership") return null;

  const marginHorizontal = state.theme.marginHorizontal;

  // SERVERS ---------------------------------------------
  const ServeDashboard = () => {
    return (
      <div style={{ padding: `0 ${marginHorizontal}px` }}>
        <ProfileProgress />
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

export default connect(Membership);
