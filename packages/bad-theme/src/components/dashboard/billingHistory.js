import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import ActionPlaceholder from "../actionPlaceholder";
import PaymentHistory from "./paymentHistory";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  muiQuery,
  getApplicationStatus,
} from "../../context";

const BillingHistory = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const { sm, md, lg, xl } = muiQuery();

  const dispatch = useAppDispatch();
  const { dynamicsApps, isActiveUser } = useAppState();

  const [isFetching, setFetching] = useState(null);
  const [subAppHistory, setAppHistory] = useState([]);
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const useEffectRef = useRef(null);

  useEffect(async () => {
    // 📌 get application status if not already set
    if (!dynamicsApps)
      await getApplicationStatus({
        state,
        dispatch,
        contactid: isActiveUser.contactid,
      });

    if (dynamicsApps) {
      // get apps with billinghistory for payments
      // get current year
      const currentYear = new Date().getFullYear();
      // get apps that billing ending year is not current year
      const apps = dynamicsApps.subs.data.filter(
        (app) => !app.core_endon.includes(currentYear)
      );

      setAppHistory(apps);
    }

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, [dynamicsApps]);

  // SERVERS ---------------------------------------------
  // if no approved applications return placeholder with message
  if (!subAppHistory.length)
    return (
      <div
        className="shadow"
        style={{
          padding: !lg ? `2em 4em` : "1em",
          marginBottom: `${marginVertical}px`,
        }}
      >
        <div className="primary-title" style={{ fontSize: 20 }}>
          Billing History:
        </div>
        <div style={{ paddingTop: "1em" }}>
          No billing history available. It will appear here once it's available.
        </div>
      </div>
    );

  return (
    <div style={{ position: "relative" }}>
      <ActionPlaceholder isFetching={isFetching} background="transparent" />
      <div
        className="shadow"
        style={{
          padding: !lg ? `2em 4em` : "1em",
          marginBottom: `${marginVertical}px`,
        }}
      >
        <div className="primary-title" style={{ fontSize: 20 }}>
          Billing History:
        </div>
        {subAppHistory.map((block, key) => {
          return (
            <PaymentHistory
              key={key}
              block={block}
              item={key}
              subAppHistory={subAppHistory}
              setFetching={setFetching}
            />
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  textInfo: {
    textInfo: 12,
  },
};

export default connect(BillingHistory);
