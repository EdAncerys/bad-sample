import React, { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import PaymentModal from "./paymentModal";
import Loading from "../loading";
import PaymentHistory from "./paymentHistory";
import ActionPlaceholder from "../actionPlaceholder";
// CONTEXT ---------------------------------------------
import {
  useAppState,
  getApplicationStatus,
  useAppDispatch,
  muiQuery,
  setErrorAction,
  fetchDataHandler,
  setGoToAction,
  handleSetCookie,
  setDashboardPathAction,
} from "../../context";

export const handlePayment = async ({
  core_membershipsubscriptionid,
  core_membershipapplicationid,
  state,
  dispatch,
  buttonId,
  actions,
}) => {
  let sagePayUrl = "";
  let isNameError = "";

  const handleSagePay = () => {
    actions.theme.addInitiatedPayment(buttonId);
    setGoToAction({ path: sagePayUrl, state, actions });
    // close error modal
    setErrorAction({ dispatch, isError: null });
    // set cookie with timestamp for payment
    handleSetCookie({ name: "payment", value: Date.now() });
  };

  const redirectHandler = () => {
    setDashboardPathAction({
      dispatch,
      dashboardPath: "My Profile",
    });
    // scroll to bottom of page to contact panel
    if (!isNameError)
      window.scrollTo({ top: Number.MAX_SAFE_INTEGER, behavior: "smooth" });
    // close error modal on user redirect
    setErrorAction({ dispatch, isError: null });
  };

  // --------------------------------------------------------------------------------
  const displayPaymentModal = () => {
    setErrorAction({
      dispatch,
      isError: {
        message: `The card payment industry is currently in the process of making significant changes to the way card payments are processed online. Unfortunately, because of these changes, some users are experiencing temporary issues with making card payments through the website. If you cannot make a payment through the website, please contact membership@bad.org.uk to discuss alternative arrangements for making payments.`,
        image: "Error",
        action: [
          {
            label: "Continue",
            handler: handleSagePay,
          },
        ],
      },
    });
  };

  const type = core_membershipsubscriptionid || core_membershipapplicationid;
  // const sagepay_live = "live";
  const sagepay_live =
    state.auth.ENVIRONMENT === "PRODUCTION" ? "live" : "test";
  const sagepayUrl = core_membershipsubscriptionid
    ? `/sagepay/${sagepay_live}/subscription/`
    : `/sagepay/${sagepay_live}/application/`;

  try {
    const path =
      state.auth.APP_HOST +
      sagepayUrl +
      type +
      `?redirecturl=${state.auth.APP_URL}/payment-confirmation/?redirect=${state.router.link}`;
    const response = await fetchDataHandler({
      path,
      method: "POST",
      state,
    });
    const data = await response.json();
    // console.log("🐞 data", data);

    if (!data.success) {
      // --------------------------------------------------------------------------------
      // 📌  General Sage pay error handler to notify user
      // --------------------------------------------------------------------------------
      let message = `Your address details appear to be incorrect. Please go to the 'My Profile' tab to confirm your address.`;
      let errorMsg = "";

      try {
        errorMsg = data.data || data.sageResult.StatusDetail; // Sage pay error message from API
      } catch (error) {
        errorMsg = "";
      }

      // --------------------------------------------------------------------------------
      // 📌  Notify user with potential error message based on sage pay response error
      // --------------------------------------------------------------------------------
      if (errorMsg.includes("5055") || errorMsg.includes("postcode")) {
        message = `Your postcode appears to be incorrect. Please go to the 'My Profile' tab to confirm your postcode.`;
      }
      if (errorMsg.includes("surname")) {
        message = `Your name appears to be incorrect. Please go to the 'My Profile' tab to confirm your name details.`;
        isNameError = true;
      }
      // console.log("🐞 errorMsg", errorMsg);

      setErrorAction({
        dispatch,
        isError: {
          message,
          image: "Error",
          action: [
            {
              label: "My Profile",
              handler: redirectHandler,
            },
          ],
        },
      });
    }

    if (data.success) {
      sagePayUrl =
        data.data.NextURL + "=" + data.data.VPSTxId.replace(/[{}]/g, "");
      displayPaymentModal();
    }
  } catch (error) {
    // console.log(error);

    setErrorAction({
      dispatch,
      isError: {
        message: `Something went wrong. Please try again.`,
        image: "Error",
      },
    });
  }
};

const Payments = ({ state, actions, libraries, subscriptions, dashboard }) => {
  const { lg } = muiQuery();
  const dispatch = useAppDispatch();
  const { dynamicsApps, isActiveUser } = useAppState();

  const [paymentUrl, setPaymentUrl] = useState("");
  const [liveSubscriptions, setLiveSubscriptions] = useState(null);
  const [subAppHistory, setAppHistory] = useState([]);
  const [isFetching, setFetching] = useState(null);

  const marginVertical = state.theme.marginVertical;

  useEffect(async () => {
    if (!dynamicsApps) return;
    // get apps with billinghistory for payments
    // get current year
    const currentYear = new Date().getFullYear();
    // get apps that billing ending year is current year
    const apps = dynamicsApps.subs.data.filter((app) =>
      app.core_endon.includes(currentYear)
    );

    setAppHistory(apps);
    setLiveSubscriptions(dynamicsApps);
  }, [dynamicsApps]);

  // when should I return null ?
  if (!subscriptions) return null;
  if (
    dynamicsApps.subs.data.length === 0 &&
    dynamicsApps.apps.data.length === 0
  )
    return null;

  if (!liveSubscriptions) return <Loading />;

  // HELPERS ----------------------------------------------------------------
  const resetPaymentUrl = async () => {
    setPaymentUrl(null);

    // update application status for the user
    if (isActiveUser)
      await getApplicationStatus({
        state,
        dispatch,
        contactid: isActiveUser.contactid,
      });
  };

  // SERVERS ---------------------------------------------
  const ServeBilingHistory = () => {
    if (subAppHistory.length === 0) return null;
    return (
      <div style={{ position: "relative" }}>
        <ActionPlaceholder isFetching={isFetching} background="transparent" />

        <div
          className="primary-title"
          style={{ fontSize: 20, padding: "1em 0" }}
        ></div>
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
    );
  };

  const ServePayments = ({ block, item, type, data }) => {
    const { core_totalamount, core_name, bad_approvalstatus } = block;

    // hide payed subscriptions in dashboard if payment is made
    if (dashboard && block.bad_sagepayid !== null) return null;
    // in dashboard show only Pending apps
    if (dashboard && bad_approvalstatus !== "Pending") return null;

    const ServeStatusOrAction = () => {
      // get important data
      const {
        bad_outstandingpayments,
        core_membershipsubscriptionid,
        core_membershipapplicationid,
        bad_sagepayid,
      } = block;

      const ServePayButton = () => {
        if (!core_totalamount) return "Processing";
        const buttonId = core_membershipapplicationid
          ? core_membershipapplicationid
          : core_membershipsubscriptionid;
        if (state.data.initiatedPayments.includes(buttonId)) {
          return "Payment initiated";
        }

        // --------------------------------------------------------------------------------
        // 📌  Pay button show conditions
        // --------------------------------------------------------------------------------
        if (
          bad_sagepayid ||
          core_totalamount === "£0.00" ||
          core_totalamount.includes("-") ||
          bad_approvalstatus === "Pending" ||
          bad_outstandingpayments === "£0.00" || // ⚠️ Pay Button show condition
          (bad_outstandingpayments && bad_outstandingpayments.includes("-"))
        )
          return null;

        // --------------------------------------------------------------------------------
        // 📌  Dont allow user to pay for a subscription if account is Lapsed
        // --------------------------------------------------------------------------------
        if (
          isActiveUser &&
          isActiveUser.bad_selfserviceaccess === state.theme.frozenMembership &&
          isActiveUser.core_membershipstatus === state.theme.lapsedMembership
        ) {
          return (
            <div style={{ maxWidth: 500 }}>
              {state.theme.lapsedMembershipBody}
            </div>
          );
        }

        return (
          <div
            className="blue-btn"
            onClick={() => {
              handlePayment({
                core_membershipsubscriptionid,
                core_membershipapplicationid,
                dispatch,
                state,
                buttonId,
                actions,
              });
            }}
          >
            Pay now
          </div>
        );
      };

      const ServePaymentStatus = () => {
        if (bad_approvalstatus == "Pending")
          return (
            <div style={{ textAlign: "center", minWidth: 145 }}>
              Pending approval
            </div>
          );

        if (!bad_sagepayid) return null;
        if (lg && bad_sagepayid) return "Status: paid";
        if (bad_sagepayid)
          return <div style={{ textAlign: "center", minWidth: 145 }}>Paid</div>;
      };

      // dont display if payment is made  in dashboard
      if (bad_approvalstatus == "Pending" && dashboard) return null;

      return (
        <div style={{ margin: `auto 0` }}>
          <div
            style={{ width: "fit-content", marginLeft: "4em", minWidth: 145 }}
          >
            <ServePayButton />
            <ServePaymentStatus />
          </div>
        </div>
      );
    };

    const ServeInfo = () => {
      if (!liveSubscriptions) return null;
      // 📌 bottom border show for the block if it's the last one
      // check how many outstanding app payments there are
      let paymentLength = data.length;
      const isLastItem = paymentLength === item + 1;

      return (
        <div
          className={!lg ? "flex" : "flex-col"}
          style={{
            borderBottom: !isLastItem
              ? `1px solid ${colors.darkSilver}`
              : "none",
            padding: !lg ? `1em` : 0,
          }}
        >
          <div className="flex" style={styles.fontSize}>
            <div>{core_name}</div>
          </div>
          <div className="flex" style={styles.fontSize}>
            <div>
              {core_totalamount
                ? core_totalamount.includes("-")
                  ? "Free"
                  : core_totalamount
                : ""}
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className={!lg ? "flex-row" : "flex-col"}>
        <ServeInfo />
        <ServeStatusOrAction />
      </div>
    );
  };

  const ServeSubTitle = ({ title }) => {
    return <div style={{ padding: `1em 0` }}>{title}</div>;
  };

  const ServeListOfPayments = ({ type }) => {
    let data = liveSubscriptions.subs.data;
    if (type === "applications") data = liveSubscriptions.apps.data;

    let padding = "2em 0 1em 0";
    if (type === "subscriptions") padding = "1em 0";

    // --------------------------------------------------------------------------------
    // 📌  Only show current year subscriptions as active or pending payment
    // --------------------------------------------------------------------------------
    data = data.filter((app) => {
      // 📌 get yesr of application date and current year
      const currentYear = new Date().getFullYear();
      const yearFromNow = currentYear + 1;

      // check if the application is current year or not
      let isValidApp = false;
      // if (app.core_endon)
      //   isValidApp = new Date(app.core_endon).getFullYear() >= currentYear;
      if (app.core_name)
        isValidApp =
          app.core_name.includes(currentYear) ||
          app.core_name.includes(yearFromNow);
      if (isValidApp) return app; // 📌 show current year applications only
    });

    return (
      <div>
        <div
          className="primary-title"
          style={{
            fontSize: 20,
            padding: !lg ? padding : 0,
            marginTop: !lg ? null : "1em",
          }}
        >
          {dashboard ? "Applications Pending Approval" : `Active ${type}:`}
        </div>

        {data.length === 0 && (
          <ServeSubTitle title="No active applications found" />
        )}

        {data.length > 0 && (
          <div>
            {data.map((block, key) => {
              return (
                <ServePayments
                  key={key}
                  block={block}
                  item={key}
                  type={type}
                  data={data}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  };

  let outstandingSubs = liveSubscriptions.subs.data.filter((sub) => {
    if (!sub.bad_outstandingpayments) return false;
    return !(
      sub.bad_outstandingpayments === null ||
      sub.bad_outstandingpayments.includes("-") ||
      sub.bad_outstandingpayments === "£0.00"
    );
  });
  let outstandingApps = liveSubscriptions.apps.data.filter((app) => {
    return !(app.bad_sagepayid === null);
  });

  // get app wherer bad_sagepayid is null & bad_approvalstatus is pending
  const validSubs = liveSubscriptions.subs.data.filter(
    (block) =>
      block.bad_sagepayid === null && block.bad_approvalstatus !== "Pending"
  );
  // dont show in dashboard if there are no validSubs
  // if (dashboard && validSubs.length === 0) return null;

  // if (dashboard && outstandingSubs.length === 0 && outstandingApps.length === 0)
  //   return null;

  // if no data is found & dashboard dont show component
  if (liveSubscriptions.apps.data.length === 0 && dashboard) return null;

  return (
    <div className="shadow">
      <div
        style={{
          padding: !lg ? `0 4em 2em 4em` : "1em",
          marginBottom: `${marginVertical}px`,
        }}
      >
        <PaymentModal
          payment_url={paymentUrl}
          resetPaymentUrl={resetPaymentUrl}
        />
        <ServeListOfPayments type="applications" />
        {!dashboard && <ServeListOfPayments type="subscriptions" />}
        {!dashboard && <ServeBilingHistory />}
      </div>
    </div>
  );
};

const styles = {
  text: {
    fontSize: 12,
  },
};

export default connect(Payments);
