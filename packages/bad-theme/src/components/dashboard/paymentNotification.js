import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import { handleGetCookie } from "../../helpers/cookie";
import PaymentModal from "./paymentModal";
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

  // HELPERS ----------------------------------------------------------------

  const handlePayment = async ({ sage_id }) => {
    const cookie = handleGetCookie({ name: `BAD-WebApp` });
    const { contactid, jwt } = cookie;

    const the_url =
      state.auth.ENVIRONMENT === "DEVELOPMENT"
        ? "http://localhost:3000/"
        : state.auth.APP_URL;

    const fetchVendorId = await fetch(
      state.auth.APP_HOST +
        "/sagepay/test/application/" +
        sage_id +
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
      const url =
        json.data.NextURL + "=" + json.data.VPSTxId.replace(/[{}]/g, "");
      setPaymentUrl(url);
    }
    // setPage({ page: "directDebit", data: block });
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
            type="submit"
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
        padding: `1em`,
        padding: 30,
      }}
    >
      <div
        className="primary-title flex"
        style={{ fontSize: 20, alignItems: "center" }}
      >
        Your application has been approved. Now it is time to pay!
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
  text: {
    fontSize: 12,
  },
};

export default connect(PaymentNotification);
