import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import { handleGetCookie } from "../../helpers/cookie";
import PaymentModal from "./paymentModal";
import { setErrorAction } from "../../context";
const PaymentNotification = ({
  state,
  actions,
  libraries,
  setPage,
  application,
}) => {
  const [paymentUrl, setPaymentUrl] = useState(null);
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  // HELPERS ----------------------------------------------------------------
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
    const cookie = handleGetCookie({ name: `BAD-WebApp` });
    const { contactid, jwt } = cookie;

    const the_url =
      state.auth.ENVIRONMENT === "DEVELOPMENT"
        ? "http://localhost:3000/"
        : state.auth.APP_URL;
    const sagepay_url =
      state.auth.ENVIRONMENT === "DEVELOPMENT"
        ? "/sagepay/live/application/"
        : "/sagepay/live/application/";
    const fetchVendorId = await fetch(
      state.auth.APP_HOST +
        sagepay_url +
        sage_id +
        `?redirecturl=${the_url}/payment-confirmation/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    if (fetchVendorId.ok) {
      const json = await fetchVendorId.json();
      const url =
        json.data.NextURL + "=" + json.data.VPSTxId.replace(/[{}]/g, "");
      displayPaymentModal(url);
    }
  };

  const resetPaymentUrl = () => {
    setPaymentUrl(null);
  };

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    return (
      <div style={{ margin: `auto 0`, width: marginHorizontal * 2 }}>
        <div style={{ padding: `0 2em` }}>
          <div
            className="blue-btn"
            onClick={() =>
              handlePayment({
                sage_id: application.core_membershipapplicationid,
              })
            }
          >
            Pay now
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
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
        Your application for {application.core_name} has been approved. Now it
        is time to pay!
      </div>
      <ServeActions />
      <PaymentModal
        payment_url={paymentUrl}
        resetPaymentUrl={resetPaymentUrl}
      />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(PaymentNotification);
