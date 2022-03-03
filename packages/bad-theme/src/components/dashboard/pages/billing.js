import { useState, useEffect } from "react";
import { connect } from "frontity";

import DirectDebitNotification from "../directDebitNotification";
import Payments from "../payments";
import BillingHistory from "../billingHistory";
import OrderSummary from "../orderSummary";
import DirectDebitSetup from "../directDebitSetup";
import DirectDebitPayment from "../directDebitPayment";
// CONTEXT ------------------------------------------------------------------
import { useAppState, useAppDispatch } from "../../../context";

const Billing = ({ state, actions, libraries }) => {
  const dispatch = useAppDispatch();
  const { dashboardPath, directDebitPath } = useAppState();

  if (dashboardPath !== "Billing") return null;

  const marginHorizontal = state.theme.marginHorizontal;

  // SERVERS ---------------------------------------------
  const ServeDashboard = () => {
    if (directDebitPath.page !== "billing") return null;

    return (
      <div>
        <DirectDebitNotification />
        <Payments />
        <BillingHistory />
      </div>
    );
  };

  const ServeOrderSummary = () => {
    if (directDebitPath.page !== "directDebit") return null;

    return <OrderSummary />;
  };

  const ServeDirectDebitSetup = () => {
    if (directDebitPath.page !== "directDebitSetup") return null;

    return <DirectDebitSetup />;
  };

  const ServeDirectDebitPayment = () => {
    if (directDebitPath.page !== "directDebitPayment") return null;

    return <DirectDebitPayment />;
  };

  // RETURN ---------------------------------------------
  return (
    <div style={{ padding: `0 ${marginHorizontal}px` }}>
      <ServeDashboard />
      <ServeOrderSummary />
      <ServeDirectDebitSetup />
      <ServeDirectDebitPayment />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Billing);
