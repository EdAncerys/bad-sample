import { useEffect, useState } from "react";
import { connect } from "frontity";
import { handleSetCookie, handleGetCookie } from "../helpers/cookie";
import ReactGA from "react-ga";
// --------------------------------------------------------------------------------
import { setGoToAction } from "../context";

const CookiePopUp = ({ state, actions }) => {
  const [show, setShow] = useState();

  const handleConsent = async (type) => {
    handleSetCookie({
      name: "BAD-cookie-popup",
      value: type,
      domain: `${state.auth.APP_URL}`,
    });
    setShow(type);
  };

  useEffect(() => {
    let cookie = handleGetCookie({ name: `BAD-cookie-popup` });

    // set cookie policie preferences
    setShow(cookie);
  });

  useEffect(() => {
    // --------------------------------------------------------------------------------
    // 📌  Add Google Analytics Cookies
    // --------------------------------------------------------------------------------
    const cookie = handleGetCookie({ name: `BAD-cookie-popup` });

    if (cookie && cookie === "all-cookies") {
      ReactGA.initialize("UA-50027583-1");
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }, [show]);

  if (show && show === "all-cookies") return null;
  if (show && show === "essential-only") return null;

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
        <div className="col-lg-5 col-12">
          <h5>We value your privacy</h5>{" "}
          <p style={{ fontSize: 12 }}>
            We use cookies to run our services and analyse our traffic. We need
            some of those cookies to provide the best online experience while
            others allow us to monitor the site performance.{" "}
            <spam
              onClick={() =>
                setGoToAction({
                  state,
                  path: "/about-the-bad/our-values/our-policies/",
                  actions,
                })
              }
              style={{ color: "black", fontSize: 12, cursor: "pointer" }}
            >
              Read more.
            </spam>
          </p>
        </div>
        <div
          className="col-lg-4 col-12 d-flex"
          style={{ justifyContent: "space-around", alignItems: "center" }}
        >
          <button
            onClick={() => handleConsent("all-cookies")}
            className="blue-btn-reverse"
          >
            Accept all cookies
          </button>
          <button
            onClick={() => handleConsent("essential-only")}
            className="blue-btn-reverse"
          >
            Only essential cookies
          </button>
        </div>
      </div>
    </div>
  );
};

export default connect(CookiePopUp);
