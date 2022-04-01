import { useState, useEffect } from "react";
import { handleGetCookie } from "../helpers/cookie";

// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  setPlaceholderAction,
  setGoToAction,
} from "../context";

export const useB2CLogin = ({ state, actions }) => {
  // await for window object to be available
  const [isWindow, setWindow] = useState(null);
  const [hash, setHash] = useState(null);
  let urlPath = state.router.link;

  const dispatch = useAppDispatch();

  // await to get window object & setWindow to true
  useEffect(() => {
    if (window) {
      console.log("🐞  B2C Login Hook. Have window object 🐞"); // debug
      setWindow(window);
    }
  }, []);

  // await to get hash from url
  useEffect(() => {
    if (isWindow) {
      const hash = isWindow.location.hash;

      if (hash) setHash(hash);
      if (!hash && urlPath.includes("codecollect"))
        console.log("🐞 hash not found. REDIRECT");
    }
  }, [isWindow]);

  // --------------------------------------------------------------------------
  // This useEffect is triggered whenever the hash changes.  This happens when
  // B2C redirects after a successful signup or signon and even a forgotten
  // password flow.  We need to extract the id_token and then break out the
  // header (first part) and then the claims (second part)
  // --------------------------------------------------------------------------

  useEffect(() => {
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
        console.log("API CALL to fetch user blob");
        // get redirect url from cookie
        const redirectUrl = handleGetCookie({ name: "redirect" });
        console.log("🐞 redirectUrl ", redirectUrl);
        // if redirectUrl is not set then set it to default

        // ⬇️ redirect to url with path ⬇️
        setGoToAction({ state, path: redirectUrl, actions });
        // set placeholder to false
        setPlaceholderAction({ dispatch, isPlaceholder: false });
      } else {
        console.log("🐞 error. Redirect to home path");
      }
    } catch (error) {
      console.log(error);
    }
    console.log(items);
  }, [hash]);
};
