import { useState, useEffect } from "react";
import { connect } from "frontity";

import Payments from "../payments";
import BillingHistory from "../billingHistory";
import OrderSummary from "../orderSummary";

const Billing = ({ state, actions, libraries, dashboardPath }) => {
  if (dashboardPath !== "Billing") return null;

  // const [payOrder, setPayOrder] = useState(null);
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

  const ServeOrderSummary = () => {
    return (
      <div style={{ padding: `0 ${marginHorizontal}px` }}>
        <OrderSummary />
      </div>
    );
  };

  // RETURN ---------------------------------------------
  return (
    <div>
      <ServeDashboard />
      <ServeOrderSummary />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Billing);
