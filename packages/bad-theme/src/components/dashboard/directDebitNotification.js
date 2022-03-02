import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
// CONTEXT ------------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  getApplicationStatus,
  getDirectDebitAction,
} from "../../context";

const DirectDebitNotification = ({
  state,
  actions,
  libraries,
  setPage,
  visible,
  setVisible,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { isDirectDebit, dynamicsApps, isActiveUser } = useAppState();

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
    console.log("isDirectDebit", isDirectDebit); // debug
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
  if (!visible) isSetupDirectDebit = true;
  if (isDebitSetup) isSetupDirectDebit = true;

  console.log("⬇️ isSetupDirectDebit", isSetupDirectDebit);
  console.log("⬇️ isApprovedMemberships", isApprovedMemberships);

  // if direct debit setup or no approved applications, return null
  if (isSetupDirectDebit || !isApprovedMemberships) return null;

  // HELPERS ----------------------------------------------------------------
  const handlePayment = () => {
    setPage({ page: "directDebitSetup" });
  };

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    return (
      <div className="flex" style={{ margin: `auto 0` }}>
        <div style={{ padding: `0 2em` }}>
          <div type="submit" className="blue-btn" onClick={handlePayment}>
            Setup Direct Debit
          </div>
        </div>
        <div>
          <div
            type="submit"
            className="transparent-btn"
            onClick={() => setVisible(false)}
          >
            Dismiss
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="shadow"
      style={{
        display: "grid",
        gridTemplateColumns: `1fr auto`,
        gap: "1em",
        padding: `2em 4em`,
        marginBottom: `${marginVertical}px`,
      }}
    >
      <div
        className="primary-title flex"
        style={{ fontSize: 20, alignItems: "center" }}
      >
        Please complete the Direct Debit Guarantee to automatically renew your
        membership.
      </div>
      <ServeActions />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(DirectDebitNotification);
