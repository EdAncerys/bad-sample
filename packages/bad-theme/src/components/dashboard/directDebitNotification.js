import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

// CONTEXT ------------------------------------------------------------------
import {
  muiQuery,
  useAppDispatch,
  useAppState,
  getApplicationStatus,
  getDirectDebitAction,
  setNotificationAction,
  setDebitHandlerAction,
  setDashboardPathAction,
} from "../../context";

const DirectDebitNotification = ({ state, actions, libraries }) => {
  const { sm, md, lg, xl } = muiQuery();

  const dispatch = useAppDispatch();
  const {
    isDirectDebit,
    dynamicsApps,
    isActiveUser,
    isDirectDebitNotification,
    directDebitPath,
    dashboardPath,
  } = useAppState();

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const [isDebitSetup, setDebitSetup] = useState(false);
  const useEffectRef = useRef(null);

  useEffect(async () => {
    if (!dynamicsApps)
      await getApplicationStatus({
        state,
        dispatch,
        contactid: isActiveUser.contactid,
      });

    if (!isDirectDebit)
      await getDirectDebitAction({
        state,
        dispatch,
        id: isActiveUser.contactid,
      });

    if (!isDirectDebit) return null;
    // if direct status is status is Active, set debit setup to true
    let debitStatus = isDirectDebit.filter(
      (debit) => debit.statecode === "Active"
    );
    // set tu truthy if debit status is active
    debitStatus = debitStatus.length > 0;

    setDebitSetup(debitStatus);

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, [isDirectDebit, isActiveUser]);

  // if no approved membership, return dont show direct debit
  let isApprovedMemberships = false;
  if (dynamicsApps && dynamicsApps.subs.data.length > 0)
    isApprovedMemberships = true;
  // conditional rendering of direct debit component
  let isSetupDirectDebit = false;
  if (!isDirectDebitNotification) isSetupDirectDebit = true;
  if (isDebitSetup) isSetupDirectDebit = true;

  // --------------------------------------------------------------------------------
  // 📌 if direct debit setup or no approved applications, return null
  // ⚠️ Conditional component rendering
  // --------------------------------------------------------------------------------
  if (isSetupDirectDebit || !isApprovedMemberships) return null;

  // HELPERS ----------------------------------------------------------------
  const handlePayment = () => {
    setDashboardPathAction({ dispatch, dashboardPath: "Billing" });
    setDebitHandlerAction({
      dispatch,
      directDebitPath: { page: "directDebitSetup" },
    });
  };

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    return (
      <div className="flex" style={{ margin: `auto 0` }}>
        <div
          className="blue-btn"
          style={{ margin: !lg ? `0 2em` : "1em" }}
          onClick={() =>
            setNotificationAction({
              dispatch,
              isDirectDebitNotification: false,
            })
          }
        >
          Dismiss
        </div>
        <div className="blue-btn" onClick={handlePayment}>
          Setup Direct Debit
        </div>
      </div>
    );
  };

  // 📌 hide notification if user has pane open || if user on dashboard
  let isBilling =
    dashboardPath === "Billing" && directDebitPath.page === "billing";
  let isDashboard = dashboardPath === "Dashboard";
  if (!isBilling && !isDashboard) return null;

  return (
    <div
      className="shadow"
      style={{
        display: "grid",
        gridTemplateColumns: !lg ? `1fr auto` : `1fr`,
        gap: "1em",
        padding: !lg ? `2em 4em` : "1em",
        margin: `0 ${marginHorizontal}px ${marginVertical}px ${marginHorizontal}px`,
      }}
    >
      <div
        className="primary-title flex"
        style={{ fontSize: 20, alignItems: "center" }}
      >
        Please set up a Direct Debit instruction to automatically renew your
        membership each year.
      </div>
      <ServeActions />
    </div>
  );
};

export default connect(DirectDebitNotification);
