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
} from "../../context";

const DirectDebitNotification = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const { sm, md, lg, xl } = muiQuery();

  const dispatch = useAppDispatch();
  const {
    isDirectDebit,
    dynamicsApps,
    isActiveUser,
    isVisibleNotification,
    refreshJWT,
  } = useAppState();

  const marginVertical = state.theme.marginVertical;

  const [isDebitSetup, setDebitSetup] = useState(false);
  const useEffectRef = useRef(null);

  useEffect(async () => {
    if (!dynamicsApps)
      await getApplicationStatus({
        state,
        dispatch,
        contactid: isActiveUser.contactid,
        refreshJWT,
      });

    if (!isDirectDebit)
      await getDirectDebitAction({
        state,
        dispatch,
        id: isActiveUser.contactid,
        refreshJWT,
      });

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
  if (!isVisibleNotification) isSetupDirectDebit = true;
  if (isDebitSetup) isSetupDirectDebit = true;

  // if direct debit setup or no approved applications, return null
  if (isSetupDirectDebit || !isApprovedMemberships) return null;

  // HELPERS ----------------------------------------------------------------
  const handlePayment = () => {
    setDebitHandlerAction({
      dispatch,
      directDebitPath: { page: "directDebitSetup" },
    });
  };

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    return (
      <div className="flex" style={{ margin: `auto 0` }}>
        <div style={{ padding: !lg ? `0 2em` : "1em" }}>
          <div className="blue-btn" onClick={handlePayment}>
            Setup Direct Debit
          </div>
        </div>
        <div>
          <div
            className="transparent-btn"
            onClick={() =>
              setNotificationAction({ dispatch, isVisibleNotification: false })
            }
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
        gridTemplateColumns: !lg ? `1fr auto` : `1fr`,
        gap: "1em",
        padding: !lg ? `2em 4em` : "1em",
        marginBottom: `${marginVertical}px`,
      }}
    >
      <div
        className="primary-title flex"
        style={{ fontSize: 20, alignItems: "center" }}
      >
        Please complete online Direct Debit mandate to automatically renew your
        membership subscription yeach year.
      </div>
      <ServeActions />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(DirectDebitNotification);
