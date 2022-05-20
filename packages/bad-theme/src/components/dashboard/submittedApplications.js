import { useState, useEffect } from "react";
import { connect } from "frontity";

import date from "date-and-time";
const DATE_MODULE = date;
import PaymentModal from "./paymentModal";

// CONTEXT ----------------------------------------------------------------
import {
  useAppState,
  useAppDispatch,
  muiQuery,
  setErrorAction,
  fetchDataHandler,
} from "../../context";

const SubmittedApplications = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { dynamicsApps } = useAppState();
  const marginVertical = state.theme.marginVertical;
  const { lg } = muiQuery();

  const [submitedApps, setSubmitedApps] = useState(null);
  const [pendingPaymentApps, setPendingPaymentdApps] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);

  useEffect(() => {
    if (!dynamicsApps) return null; // if application data exist & not under review return null

    // see if application list have submited applications and if so show them
    let appsData = dynamicsApps.apps.data;
    if (appsData.length === 0) return null;
    // sort by application date created newest by default
    appsData = appsData.sort((a, b) => {
      // get date created from application
      let dateCreatedA = a.createdon;
      let dateCreatedB = b.createdon;
      // strip trailing time from date.
      dateCreatedA = dateCreatedA.split(" ")[0];
      dateCreatedB = dateCreatedB.split(" ")[0];
      // for date string reverse month and day
      const [monthA, dayA, yearA] = dateCreatedA.split("/");
      const [monthB, dayB, yearB] = dateCreatedB.split("/");
      // EU format year
      dateCreatedA = `${dayA}/${monthA}/${yearA}`;
      dateCreatedB = `${dayB}/${monthB}/${yearB}`;

      // return date created newest first
      return new Date(dateCreatedB) - new Date(dateCreatedA);
    });

    // filter apps that have Pending status
    const pending = appsData.filter((app) => {
      return app.bad_approvalstatus === "Pending";
    });
    const needPayment = appsData.filter((app) => {
      return app.bad_approvalstatus === "Approved";
    });

    setSubmitedApps(pending);
    setPendingPaymentdApps(needPayment);
  }, [dynamicsApps]);

  // HELPERS ----------------------------------------------
  const displayPaymentModal = (url) => {
    console.log("PM URL", url);
    setErrorAction({
      dispatch,
      isError: {
        message: `The card payment industry is currently in the process of making significant changes to the way card payments are processed online. Unfortunately, because of these changes, some users are experiencing temporary issues with making card payments through the website. If you cannot make a payment through the website, please contact membership@bad.org.uk to discuss alternative arrangements for making payments.`,
        image: "Error",
        goToPath: { label: "Continue", path: url },
      },
    });
  };
  const handlePayment = async ({ sage_id }) => {
    const url = state.auth.APP_URL;

    const sagepay_url =
      state.auth.ENVIRONMENT === "DEVELOPMENT"
        ? "/sagepay/test/application/"
        : "/sagepay/live/application/";

    const path =
      state.auth.APP_HOST +
      sagepay_url +
      sage_id +
      `?redirecturl=${url}/payment-confirmation/?redirect=${state.router.link}`;
    const fetchVendorId = await fetchDataHandler({
      path,
      method: "POST",
      // body: appCredentials,
      state,
    });

    if (fetchVendorId.ok) {
      const json = await fetchVendorId.json();
      const url =
        json.data.NextURL + "=" + json.data.VPSTxId.replace(/[{}]/g, "");
      displayPaymentModal(url);
    }
  };

  if (!submitedApps) return null;

  // SERVERS ----------------------------------------------
  const ServePendingApps = () => {
    if (submitedApps.length === 0) return null;

    return (
      <div className="flex-col">
        <div
          className="flex primary-title"
          style={{
            fontSize: 20,
            justifyItems: "center",
          }}
        >
          Applications Pending Approval
        </div>
        {submitedApps.map((app, key) => {
          const { bad_organisedfor, core_name, createdon, bad_approvalstatus } =
            app;

          // get application date
          let appData = createdon.split(" ")[0];
          // split string and revert date with month format
          appData = appData.split("/");
          appData = `${appData[1]}/${appData[0]}/${appData[2]}`;

          const dateObject = new Date(appData);
          const formattedDate = DATE_MODULE.format(dateObject, "DD MMM YYYY");

          return (
            <div key={key} className="flex-col" style={{ paddingTop: `1em` }}>
              <div className="primary-title">{bad_organisedfor}</div>
              <div>{core_name}</div>
              <div>Application Date: {formattedDate}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const ServePendingPaymentApps = () => {
    if (pendingPaymentApps.length === 0) return null;

    return (
      <div className="flex-col">
        <div
          className="flex primary-title"
          style={{
            fontSize: 20,
            justifyItems: "center",
            paddingTop: "1em",
          }}
        >
          Applications Approved Pending Payment
        </div>
        {pendingPaymentApps.map((app, key) => {
          const {
            bad_organisedfor,
            core_name,
            createdon,
            core_membershipapplicationid,
          } = app;

          // get application date
          let appData = createdon.split(" ")[0];
          // split string and revert date with month format
          appData = appData.split("/");
          appData = `${appData[1]}/${appData[0]}/${appData[2]}`;

          const dateObject = new Date(appData);
          const formattedDate = DATE_MODULE.format(dateObject, "DD MMM YYYY");

          return (
            <div key={key} className="flex">
              <div className="flex-col" style={{ paddingTop: `1em` }}>
                <div className="primary-title">{bad_organisedfor}</div>
                <div>{core_name}</div>
                <div>Application Date: {formattedDate}</div>
              </div>

              <div style={{ display: "grid", alignItems: "center" }}>
                <div
                  className="blue-btn"
                  onClick={() =>
                    handlePayment({
                      sage_id: core_membershipapplicationid,
                    })
                  }
                >
                  Pay now
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // RETURN -----------------------------------------------
  return (
    <div
      className="flex-col shadow"
      style={{
        padding: !lg ? `2em 4em` : `1em`,
        marginBottom: `${marginVertical}px`,
      }}
    >
      <ServePendingApps />
      <ServePendingPaymentApps />

      <PaymentModal
        payment_url={paymentUrl}
        resetPaymentUrl={() => setPaymentUrl(null)}
      />
    </div>
  );
};

const styles = {
  component: {},
};

export default connect(SubmittedApplications);
