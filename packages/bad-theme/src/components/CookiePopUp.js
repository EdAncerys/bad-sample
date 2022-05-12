import React from "react";
import { connect } from "frontity";
import { handleSetCookie, handleGetCookie } from "../helpers/cookie";
const CookiePopUp = ({ state, hide }) => {
  const [show, setShow] = React.useState();
  const handleConsent = async () => {
    handleSetCookie({
      name: "BAD-cookie-popup",
      value: "true",
      domain: `${state.auth.APP_URL}`,
    });
    setShow("true");
  };

  React.useEffect(() => {
    let popUpCookie = handleGetCookie({ name: `BAD-cookie-popup` });
    if (popUpCookie === null) {
      popUpCookie = "false";
    }
    setShow(popUpCookie);
  });
  if (!show) return null;
  if (show && show === "true") return null;
  return (
    <div
      className="container-fluid"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        zIndex: 999,
        backgroundColor: "white",
        padding: "1em 0",
      }}
    >
      <div className="row d-flex p-3" style={{ justifyContent: "center" }}>
        <div className="col-lg-6 col-12">
          <h5>We value your privacy</h5>{" "}
          <p style={{ fontSize: 12 }}>
            We use cookies to give you the best online experience and analyse
            our traffic. By clicking ‘I understand’ you agree to our use of
            cookies.{" "}
            <a
              href="https://www.bad.org.uk/about-the-bad/our-values/our-policies/"
              style={{ color: "black", fontSize: 12 }}
            >
              Read more.
            </a>
          </p>
        </div>
        <div
          className="col-lg-2 col-12 d-flex"
          style={{ justifyContent: "space-around", alignItems: "center" }}
        >
          <button onClick={handleConsent} className="blue-btn-reverse">
            I understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default connect(CookiePopUp);
