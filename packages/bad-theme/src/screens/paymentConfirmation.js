import Loading from "../components/loading";
import { useEffect, useState } from "react";
import { connect, Global, css } from "frontity";
import BlockWrapper from "../components/blockWrapper";
import custom from "../css/custom.css";
import CheckMark from "../img/svg/checkMark.svg";
import Error from "../img/svg/error.svg";
import Image from "@frontity/components/image";

const PaymentConfirmation = ({ state }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const queryParams = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    const data = state.source.get(state.router.link);
    let backUrl = queryParams?.redirect;
    let success = data?.query?.sagepay === "success";

    setData((prev) => ({
      ...prev,
      backUrl,
      success,
    }));
  }, []);

  // --------------------------------------------------------------------------------
  // 📌  Component configuration.
  // --------------------------------------------------------------------------------
  let IMG = data?.success ? CheckMark : Error;
  let TITLE = data?.success ? "PAYMENT CONFIRMED" : "PAYMENT ERROR";
  let MESSAGE = data?.success
    ? "Your payment has been confirmed. Thank you."
    : "Your payment not been successful. Please try again.";

  // ⚠️ await data to confirm object is not empty
  if (!data) return <Loading />;

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
            src={IMG}
            alt="BAD Error Image"
            style={{
              width: "300px",
              height: "300px",
              marginBottom: "1em",
            }}
          />
          <h3>{TITLE}</h3>

          <div id="ask-to-close">{MESSAGE}</div>
          <a
            style={{ marginTop: "1em" }}
            href={data?.backUrl ? data?.backUrl : state.auth.APP_URL}
            className="blue-btn"
          >
            Go back
          </a>
        </div>
      </BlockWrapper>
    </>
  );
};

export default connect(PaymentConfirmation);
