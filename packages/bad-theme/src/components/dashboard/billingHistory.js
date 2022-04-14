import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import ActionPlaceholder from "../actionPlaceholder";
import { colors } from "../../config/imports";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  muiQuery,
  getInvoiceAction,
} from "../../context";

const BillingHistory = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const { sm, md, lg, xl } = muiQuery();

  const dispatch = useAppDispatch();
  const { dynamicsApps, isActiveUser, refreshJWT } = useAppState();

  const [isFetching, setFetching] = useState(null);
  const [subApps, setSubApps] = useState([]);
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const useEffectRef = useRef(null);

  useEffect(async () => {
    if (!dynamicsApps)
      await getApplicationStatus({
        state,
        dispatch,
        contactid: isActiveUser.contactid,
        refreshJWT,
      });

    // get approved memberships
    if (dynamicsApps) setSubApps(dynamicsApps.subs.data);

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, []);

  // HELPERS ----------------------------------------------------------------
  const handleDownloadPayment = async () => {
    try {
      setFetching(true);
      const url = await getInvoiceAction({
        state,
        isActiveUser,
        dispatch,
        refreshJWT,
      });
      // await for link to download & open in new window to download
      window.open(url, "_blank");
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

  // SERVERS ---------------------------------------------
  const ServeDownloadAction = ({ currentPayYear, isFirst }) => {
    if (!isFirst) return null;
    // if currentPayYear is not current year, return null
    // get current year from date
    const currentYear = new Date().getFullYear();
    if (Number(currentPayYear) !== currentYear) return null;

    return (
      <div className="flex" style={{ padding: "1em 0" }}>
        <div className="flex" style={{ display: "grid", alignItems: "center" }}>
          {currentPayYear}
        </div>
        <div style={{ alignItems: "center" }}>
          <div className="blue-btn" onClick={handleDownloadPayment}>
            Download Receipt
          </div>
        </div>
      </div>
    );
  };

  const ServePayments = ({ block, item }) => {
    const ServeInfo = () => {
      const isLastItem = subApps.length === item + 1; // item length helper
      const isFirst = item === 0; // item length helper
      const { core_name, core_totalamount, core_endon, bad_sagepayid } = block; // get block props
      // for core_endon date string & reverse month and day
      const [month, day, year] = core_endon.split("/");
      // EU format year
      const date = `${month}/${day}/${year}`;
      // ⬇️ if !bad_sagepayid then dont display entry
      if (!bad_sagepayid) return null;

      return (
        <div className="flex-col">
          <ServeDownloadAction currentPayYear={year} isFirst={isFirst} />
          <div
            className="flex"
            style={{
              borderBottom: isLastItem
                ? "none"
                : `1px solid ${colors.darkSilver}`,
              padding: `1em`,
              marginRight: marginHorizontal * 2,
            }}
          >
            <div className="flex" style={styles.textInfo}>
              <div>{core_name}</div>
            </div>
            <div className="flex" style={styles.textInfo}>
              <div>{core_endon}</div>
            </div>
            <div className="flex" style={styles.textInfo}>
              <div>{core_totalamount}</div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="flex-row">
        <ServeInfo />
      </div>
    );
  };

  // if no approved applications return placeholder with message
  if (!subApps.length)
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
        style={{ padding: `2em 4em`, marginBottom: `${marginVertical}px` }}
      >
        <div className="primary-title" style={{ fontSize: 20 }}>
          Billing History:
        </div>
        {subApps.map((block, key) => {
          return <ServePayments key={key} block={block} item={key} />;
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
