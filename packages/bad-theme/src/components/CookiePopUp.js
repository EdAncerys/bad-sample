import { useEffect, useState } from "react";
import { connect } from "frontity";
import { handleSetCookie, handleGetCookie } from "../helpers/cookie";
import ReactGA from "react-ga";
import BlockWrapper from "./blockWrapper";
// --------------------------------------------------------------------------------
import { setGoToAction } from "../context";

const CookiePopUp = ({ state, actions }) => {
  const [policy, setPolicie] = useState({ cokie: "", show: false });
  console.log("policy ", policy); // debug

  const handleConsent = async (type) => {
    handleSetCookie({
      name: "BAD-cookie-popup",
      value: type,
      domain: `${state.auth.APP_URL}`, // set cookie domain
      days: 7, // 7 days cookie expiration time
    });
    setPolicie({ cookie: type, show: false });
  };

  useEffect(() => {
    let cookie = handleGetCookie({ name: `BAD-cookie-popup` });

    setPolicie({ cookie, show: cookie ? false : true }); // show cookie popup only if cookie is not set
  }, []);

  useEffect(() => {
    if (!!policy?.cookie) return;

    // --------------------------------------------------------------------------------
    // 📌  Add Google Analytics Cookies
    // --------------------------------------------------------------------------------
    const cookie = handleGetCookie({ name: `BAD-cookie-popup` });

    // set analitics cookie
    if (cookie && cookie === "all-cookies") {
      ReactGA.initialize("UA-50027583-1");
      ReactGA.pageview(window.location.pathname + window.location.search);

      return;
    }
    //remove analytics cookie if user has not consented
    if (cookie && cookie === "essential-only") {
      handleSetCookie({ name: "_gat", deleteCookie: true });
      handleSetCookie({ name: "_gid", deleteCookie: true });
      handleSetCookie({ name: "_ga", deleteCookie: true });
    }
  }, [policy]);

  if (!policy?.show) return null; // do not render if cookie is set

  // --------------------------------------------------------------------------------
  // 📌  Cookie popup component markup and logic for consent
  // --------------------------------------------------------------------------------
  return (
    <div className="cookie-consent">
      <BlockWrapper>
        <div className="cookie-wrapper" style={{ padding: `1em 0` }}>
          <div className="flex-col">
            <h5>We value your privacy</h5>{" "}
            <p style={{ fontSize: 12 }}>
              We use cookies to run our services and analyse our traffic. We
              need some of those cookies to provide the best online experience
              while others allow us to monitor the site performance.{" "}
              <span
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
              </span>
            </p>
          </div>
          <div className="cookie-actions">
            <div className="flex" style={{ justifyContent: "space-around" }}>
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
      </BlockWrapper>
    </div>
  );
};

export default connect(CookiePopUp);
