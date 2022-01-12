import { useState, useEffect } from "react";
import { connect } from "frontity";

import Payments from "../payments";
import BillingHistory from "../billingHistory";

const Billing = ({ state, actions, libraries, dashboardPath }) => {
  if (dashboardPath !== "Billing") return null;

  const marginHorizontal = state.theme.marginHorizontal;

  // SERVERS ---------------------------------------------
  const ServeDashboard = () => {
    return (
      <div style={{ padding: `0 ${marginHorizontal}px` }}>
        <Payments />
        <BillingHistory />
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

export default connect(Billing);
