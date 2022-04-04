import { useState, useEffect, useRef } from "react";
import { handleGetCookie, handleSetCookie } from "../helpers/cookie";

// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  setPlaceholderAction,
  setGoToAction,
  getUserDataByEmail,
} from "../context";

export const useB2CLogin = ({ state, actions }) => {
  // await for window object to be available
  const [isWindow, setWindow] = useState(null);
  const [hash, setHash] = useState(null);
  const useEffectRef = useRef(true);
  let urlPath = state.router.link;

  const dispatch = useAppDispatch();

  // await to get window object & setWindow to true
  useEffect(() => {
    if (window) {
      console.log("📌 B2C Login Hook. 📌"); // debug
      setWindow(window);
    }
  }, []);

  // await to get hash from url
  useEffect(() => {
    if (isWindow) {
      const hash = isWindow.location.hash;
      // get redirect url from cookie
      const redirectUrl = handleGetCookie({ name: "loginPath" });

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
    let items = hash.replace("#id_token=", "");
    items = items ? items.split(".") : null;
    if (!items) return;

    try {
      // decode Base64 encoded url value
      items[0] = JSON.parse(atob(items[0]));
      items[1] = JSON.parse(atob(items[1]));
      if (Array.isArray(items[1].emails)) {
        const email = items[1].emails[0];
        // setContactEmail(items[1].emails[0]);
        console.log("🐞 email ", email);
        const user = await getUserDataByEmail({ state, dispatch, email });
        if (!user) throw new Error("Error getting user data.");
      } else {
        console.log("🐞 error. Redirect to home path");
      }
    } catch (error) {
      console.log(error);
    } finally {
      // get redirect url from cookie
      const redirectUrl = handleGetCookie({ name: "loginPath" });
      console.log("🐞 redirectUrl ", redirectUrl);

      // ⬇️ redirect to url with path ⬇️
      setGoToAction({ state, path: redirectUrl || "/", actions });
      // set placeholder to false
      setPlaceholderAction({ dispatch, isPlaceholder: false });
      // delate redirect cookie to prevent redirect loop
      handleSetCookie({ name: "loginPath", deleteCookie: true });
    }
    console.log(items); // debug

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, [hash]);
};
