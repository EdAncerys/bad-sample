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
        <div id="loading-o">
          <Loading />
        </div>
        <div id="ask-to-close" hidden>
          Your payment has been confirmed. Thank you.
        </div>
      </div>
    </>
  );
};

export default PaymentConfirmation;
