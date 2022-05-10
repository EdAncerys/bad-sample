import Loading from "../components/loading";
import { useEffect } from "react";
import { connect, Global, css } from "frontity";
import BlockWrapper from "../components/blockWrapper";
import custom from "../css/custom.css";
import CheckMark from "../img/svg/checkMark.svg";
import Image from "@frontity/components/image";

const PaymentConfirmation = () => {
  const queryParams = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  let backurl = queryParams.redirect;

  // useEffect(() => {
  //   if (isSagepay) {
  //     setErrorAction({
  //       dispatch,
  //       isError: {
  //         message: `Your payment has been accepted`,
  //         image: "CheckMark",
  //       },
  //     });
  //   }
  // }, []);
  return (
    <>
      <Global
        styles={css`
          ${custom}
        `}
      />
      <BlockWrapper>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "4em",
          }}
        >
          <Image
            src={CheckMark}
            alt="BAD Error Image"
            style={{
              width: "300px",
              height: "300px",
              marginBottom: "1em",
            }}
          />
          <h3>PAYMENT CONFIRMED</h3>

          <div id="ask-to-close">
            Your payment has been confirmed. Thank you.
          </div>
          <a
            style={{ marginTop: "1em" }}
            href={backurl ? backurl : state.auth.APP_URL}
            class="blue-btn"
          >
            Go back
          </a>
        </div>
      </BlockWrapper>
    </>
  );
};

export default PaymentConfirmation;
