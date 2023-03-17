import { useState, useEffect, useRef } from "react";
import { handleGetCookie, handleSetCookie } from "../helpers/cookie";

// CONTEXT ----------------------------------------------------------------
import {
  useAppState,
  useAppDispatch,
  setPlaceholderAction,
  setGoToAction,
  getUserDataByEmail,
  setAuthenticationCookieAction,
} from "../context";

export const useB2CLogin = ({ state, actions }) => {
  // await for window object to be available
  const [isWindow, setWindow] = useState(null);
  const [hash, setHash] = useState(null);
  const useEffectRef = useRef(true);
  let urlPath = state.router.link;

  const dispatch = useAppDispatch();
  const {} = useAppState();

  // await to get window object & setWindow to true
  useEffect(() => {
    if (window) {
      // console.log("📌 B2C Login Hook. 📌"); // debug
      setWindow(window);
    }
  }, []);

  // await to get hash from url
  useEffect(() => {
    if (isWindow) {
      const hash = isWindow.location.hash;
      // get redirect url from cookie
      const redirectUrl = handleGetCookie({ name: "badLoginPath" });

      if (hash) setHash(hash);
      if (!hash && urlPath.includes("codecollect")) {
        // 🐞 redirect to url path if failed to get hash from url
        setGoToAction({ state, path: redirectUrl || "/", actions });
        setPlaceholderAction({ dispatch, isPlaceholder: false });
      }
    }
  }, [isWindow]);

  // --------------------------------------------------------------------------
  // This useEffect is triggered whenever the hash changes.  This happens when
  // B2C redirects after a successful signup or signon and even a forgotten
  // password flow.  We need to extract the id_token and then break out the
  // header (first part) and then the claims (second part)
  // --------------------------------------------------------------------------

  useEffect(async () => {
    // Decode the token
    if (!hash) return;
    // get all the parts of the token after #id_token=
    const b2cTaken = hash.split("#id_token=");
    let items = hash.replace("#id_token=", "");
    items = items ? items.split(".") : null;
    if (!items) return;

    try {
      // decode Base64 encoded url value
      items[0] = JSON.parse(atob(items[0]));
      items[1] = JSON.parse(atob(items[1]));
      // console.log("🐞 hash", hash);
      // console.log("🐞 b2cTakenz", b2cTaken);

      if (Array.isArray(items[1].emails)) {
        const email = items[1].emails[0];
        // console.log("🐞 email ", email); // debug

        // 📌 set auth cookie for authenticated requests
        await setAuthenticationCookieAction({ state, b2cTaken });
        // 📌 get user data by email
        const user = await getUserDataByEmail({
          state,
          dispatch,
          email,
        });
        if (!user) {
          // delete auth cookie if user not found
          handleSetCookie({ name: "badAuth", deleteCookie: true });
          throw new Error("Error getting user data.");
        }
      } else {
        // console.log("🐞 error. No email found. Redirect to home path");
      }
    } catch (error) {
      // console.log(error);
    } finally {
      // --------------------------------------------------------------------------------
      // 📌  Handle OU redirects from B2C logon
      // --------------------------------------------------------------------------------
      const originPath = new URL(window.location.href);
      const params = new URLSearchParams(originPath.hash.substring(1)); // get params from hash
      const stateParam = params.get("state");

      if (stateParam) {
        const redirect = "/ouredirect?auth=true&state=" + stateParam;
        actions.router.set(redirect); // ⚠️ redirect to redirect to handle redirect from B2C for OX

        return;
      }

      // get redirect url from cookie
      const redirectUrl = handleGetCookie({ name: "badLoginPath" });
      // console.log("🐞 redirectUrl ", redirectUrl); // debug

      // ⬇️ redirect to url with path ⬇️
      setGoToAction({ state, path: redirectUrl || "/", actions });
      // set placeholder to false
      // deprecated as of v3.0.0
      // setPlaceholderAction({ dispatch, isPlaceholder: false });
    }

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, [hash]);
};
