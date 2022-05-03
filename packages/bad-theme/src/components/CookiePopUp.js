import React from "react";
import { connect } from "frontity";
const CookiePopUp = ({ state }) => {
  const handleConsent = async () => {
    alert("Handle consent clicked");
    handleSetCookie({
      name: "BAD-cookie-popup",
      value: "true",
      domain: state.auth.APP_URL,
    });
  };
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
            We use cookies to enhance your browsing experience, serve
            personalised ads or content, and analyse our traffic. By clicking
            "Accept All", you consent to our use of cookie.
            <a href="https://www.bad.org.uk/about-the-bad/our-values/our-policies/">
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
