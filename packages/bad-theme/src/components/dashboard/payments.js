import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import { handleGetCookie } from "../../helpers/cookie";

import PaymentModal from "./paymentModal";
import Loading from "../loading";
const Payments = ({ state, actions, libraries, subscriptions, dashboard }) => {
  //component state
  const [paymentUrl, setPaymentUrl] = useState("");
  const [liveSubscriptions, setLiveSubscriptions] = useState(null);
  const [loading, setLoading] = useState(true);

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  // import values from the global state
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const cookie = handleGetCookie({ name: `BAD-WebApp` });
  const { contactid, jwt } = cookie;
  useEffect(() => {
    const fetchApplicationBillingStatus = async () => {
      const getUserApplicationData = await fetch(
        state.auth.APP_HOST + "/applications/billing/" + contactid,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      const json = await getUserApplicationData.json();
      if (json) setLiveSubscriptions(json);
    };
    fetchApplicationBillingStatus();

    setLoading(false);
  }, [loading]);
  // when should I return null ?
  if (!subscriptions) return null;
  if (subscriptions.subs.data.length === 0) return null;
  if (!liveSubscriptions) return <Loading />;
  const { subs } = subscriptions;

  //the url for redirect
  const the_url =
    state.auth.ENVIRONMENT === "DEVELOPMENT"
      ? "http://localhost:3000/"
      : state.auth.APP_URL;

  // HELPERS ----------------------------------------------------------------
  const handlePayment = async ({ core_membershipsubscriptionid }) => {
    const fetchVendorId = await fetch(
      state.auth.APP_HOST +
        "/sagepay/test/subscription/" +
        core_membershipsubscriptionid +
        `?redirecturl=${the_url}/payment-confirmation`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    if (fetchVendorId.ok) {
      const json = await fetchVendorId.json();
      console.log(json);
      const url =
        json.data.NextURL + "=" + json.data.VPSTxId.replace(/[{}]/g, "");
      setPaymentUrl(url);
    }
    // setPage({ page: "directDebit", data: block });
  };

  const resetPaymentUrl = () => {
    setPaymentUrl(null);
    setLoading(true);
  };

  // SERVERS ---------------------------------------------
  const ServePayments = ({ block, item }) => {
    console.log("SP_BLOCK", block);
    console.log("SP_ITEM", item);
    if (dashboard && block.bad_sagepayid !== null) return null;
    const ServeStatusOrAction = () => {
      // get important data
      const {
        bad_outstandingpayments,
        core_membershipsubscriptionid,
        bad_sagepayid,
      } = block;
      // is outstanding payments greater than 0?
      // const stringAmountToPay = bad_outstandingpayments.replace(
      //   /[^0-9.-]+/g,
      //   ""
      // );
      // const amountToPay = Number(stringAmountToPay);
      // const outstanding = amountToPay > 0;

      const ServePayButton = () => {
        if (bad_sagepayid) return null;
        return (
          <div
            type="submit"
            className="blue-btn"
            onClick={() => handlePayment({ core_membershipsubscriptionid })}
          >
            Pay now
          </div>
        );
      };

      const ServePaymentStatus = () => {
        if (!bad_sagepayid) return null;
        if (bad_sagepayid) return "Paid";
      };
      return (
        <div style={{ margin: `auto 0`, width: marginHorizontal * 2 }}>
          <div style={{ padding: `0 2em` }}>
            <ServePayButton />
            <ServePaymentStatus />
          </div>
        </div>
      );
    };

    const ServeInfo = () => {
      const dataLength = subs.data.length;
      const isLastItem = dataLength === item + 1;
      const { core_totalamount, core_name } = block;
      return (
        <div
          className="flex"
          style={{
            borderBottom: isLastItem
              ? "none"
              : `1px solid ${colors.darkSilver}`,
            padding: `1em`,
          }}
        >
          <div className="flex" style={styles.fontSize}>
            <div>{core_name}</div>
          </div>
          <div className="flex" style={styles.fontSize}>
            <div>{core_totalamount}</div>
          </div>
        </div>
      );
    };

    return (
      <div className="flex-row">
        <ServeInfo />
        <ServeStatusOrAction />
      </div>
    );
  };

  const ServeSubTitle = ({ title }) => {
    return <div style={{ padding: `1em 0` }}>{title}</div>;
  };

  const ServeListOfPayments = ({ type }) => {
    const zeroObjects =
      type === "applications"
        ? liveSubscriptions.apps.data.length === 0
        : liveSubscriptions.subs.data.length === 0;
    const appsOrSubs = type === "applications" ? "apps" : "subs";
    return (
      <div>
        <div className="primary-title" style={{ fontSize: 20 }}>
          Active {type}:
        </div>
        {zeroObjects ? (
          <ServeSubTitle title="No active entries at the moment" />
        ) : (
          <ServeSubTitle title={"Invoices"} />
        )}
        {liveSubscriptions[appsOrSubs].data.map((block, key) => {
          return <ServePayments key={key} block={block} item={key} />;
        })}
      </div>
    );
  };
  return (
    <div
      className="shadow"
      style={{ padding: `2em 4em`, marginBottom: `${marginVertical}px` }}
    >
      <PaymentModal
        payment_url={paymentUrl}
        resetPaymentUrl={resetPaymentUrl}
      />
      <ServeListOfPayments type="applications" />
      <ServeListOfPayments type="subscriptions" />
    </div>
  );
};

const styles = {
  text: {
    fontSize: 12,
  },
};

export default connect(Payments);
