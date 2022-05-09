import Loading from "../components/loading";
import { useEffect } from "react";
import { connect, Global, css } from "frontity";

import custom from "../css/custom.css";
const PaymentConfirmation = () => {
  return (
    <>
      <Global
        styles={css`
          ${custom}
        `}
      />
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h3>PAYMENT CONFIRMED</h3>

        <div id="ask-to-close">Your payment has been confirmed. Thank you.</div>
      </div>
    </>
  );
};

export default PaymentConfirmation;
