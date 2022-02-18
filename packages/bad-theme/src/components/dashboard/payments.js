import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import { handleGetCookie } from "../../helpers/cookie";
const Payments = ({ state, actions, libraries, setPage, subscriptions }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const { subs } = subscriptions;
  console.log(subs);
  // HELPERS ----------------------------------------------------------------
  const handlePayment = async ({ core_membershipsubscriptionid }) => {
    const cookie = handleGetCookie({ name: `BAD-WebApp` });
    const { contactid, jwt } = cookie;
    const fetchVendorId = await fetch(
      state.auth.APP_HOST +
        "/sagepay/test/subscription/" +
        core_membershipsubscriptionid,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    if (fetchVendorId.ok) {
      const json = await fetchVendorId.json();
      alert(
        "VendorTx for subscriptionId " +
          core_membershipsubscriptionid +
          " is " +
          json.VendorTxCode
      );
    }
    // setPage({ page: "directDebit", data: block });
  };

  // SERVERS ---------------------------------------------
  const ServePayments = ({ block, item }) => {
    const ServeActions = () => {
      const { bad_outstandingpayments, core_membershipsubscriptionid } = block;
      const stringAmountToPay = bad_outstandingpayments.replace(
        /[^0-9.-]+/g,
        ""
      );
      const amountToPay = Number(stringAmountToPay);
      const outstanding = amountToPay > 0;
      return (
        <div style={{ margin: `auto 0`, width: marginHorizontal * 2 }}>
          <div style={{ padding: `0 2em` }}>
            <div
              type="submit"
              className="blue-btn"
              onClick={() => handlePayment({ core_membershipsubscriptionid })}
            >
              {outstanding ? "Pay now" : "Already paid"}
            </div>
          </div>
        </div>
      );
    };

    const ServeInfo = () => {
      const dataLength = subs.data.length;
      const isLastItem = dataLength === item + 1;
      const { bad_outstandingpayments_date } = block;
      const date = bad_outstandingpayments_date.split(" ");
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
            <div>{block.core_name}</div>
          </div>
          <div className="flex" style={styles.fontSize}>
            <div>{date[0]}</div>
          </div>
        </div>
      );
    };

    return (
      <div className="flex-row">
        <ServeInfo />
        <ServeActions />
      </div>
    );
  };

  const ServeSubTitle = ({ title }) => {
    return <div style={{ padding: `1em 0` }}>{title}</div>;
  };

  return (
    <div
      className="shadow"
      style={{ padding: `2em 4em`, marginBottom: `${marginVertical}px` }}
    >
      <div className="primary-title" style={{ fontSize: 20 }}>
        Active subscriptions:
      </div>
      {subs.length === 0 ? (
        <ServeSubTitle title="No active subscriptions at the moment" />
      ) : (
        <ServeSubTitle title="Invoices" />
      )}
      {subs.data.map((block, key) => {
        return <ServePayments key={key} block={block} item={key} />;
      })}
    </div>
  );
};

const styles = {
  text: {
    fontSize: 12,
  },
};

export default connect(Payments);
