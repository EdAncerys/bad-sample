import { useState, useEffect } from "react";
import { connect } from "frontity";

import Payments from "../payments";
import BillingHistory from "../billingHistory";
import OrderSummary from "../orderSummary";

const Billing = ({ state, actions, libraries, dashboardPath }) => {
  const [payOrder, setPayOrder] = useState(null);

  if (dashboardPath !== "Billing") return null;

  const marginHorizontal = state.theme.marginHorizontal;

  // SERVERS ---------------------------------------------
  const ServeDashboard = () => {
    if (payOrder) return null;

    return (
      <div style={{ padding: `0 ${marginHorizontal}px` }}>
        <Payments setPayOrder={setPayOrder} />
        <BillingHistory />
      </div>
    );
  };

  const ServeOrderSummary = () => {
    if (!payOrder) return null;

    return (
      <div style={{ padding: `0 ${marginHorizontal}px` }}>
        <OrderSummary setPayOrder={setPayOrder} />
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
