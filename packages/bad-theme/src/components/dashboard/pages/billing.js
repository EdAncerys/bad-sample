import { useState, useEffect } from "react";
import { connect } from "frontity";

import DirectDebitNotification from "../directDebitNotification";
import Payments from "../payments";
import BillingHistory from "../billingHistory";
import OrderSummary from "../orderSummary";
import DirectDebitSetup from "../directDebitSetup";

const Billing = ({ state, actions, libraries, dashboardPath }) => {
  const [page, setPage] = useState({ page: "billing" });

  if (dashboardPath !== "Billing") return null;

  const marginHorizontal = state.theme.marginHorizontal;

  // SERVERS ---------------------------------------------
  const ServeDashboard = () => {
    if (page.page !== "billing") return null;

    return (
      <div>
        <DirectDebitNotification setPage={setPage} />
        <Payments setPage={setPage} />
        <BillingHistory />
      </div>
    );
  };

  const ServeOrderSummary = () => {
    if (page.page !== "directDebit") return null;

    return <OrderSummary setPage={setPage} />;
  };

  const ServeDirectDebitSetup = () => {
    if (page.page !== "directDebitSetup") return null;

    return <DirectDebitSetup setPage={setPage} />;
  };

  // RETURN ---------------------------------------------
  return (
    <div style={{ padding: `0 ${marginHorizontal}px` }}>
      <ServeDashboard />
      <ServeOrderSummary />
      <ServeDirectDebitSetup />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Billing);
