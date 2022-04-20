import { useEffect, useRef } from "react";
import { setRedirectAction, setGoToAction } from "../context";

export const useRedirect = ({
  state,
  dispatch,
  actions,
  redirects,
  urlPath,
}) => {
  // --------------------------------------------------------------------------------
  // 📌  Redirect handler for 301 redirects.
  // --------------------------------------------------------------------------------

  const useEffectRef = useRef(true);

  useEffect(async () => {
    if (redirects) return null; // skip if redirects are already set
    // ⬇️  get redirects url from wp
    const url =
      state.auth.WP_HOST + "/wp-json/acf/v3/options/options/301_redirects";

    // 📌  PRE-FETCH redirects from wp
    const response = await fetch(url);
    const data = await response.json();

    if (!data["301_redirects"]) return;
    // 📌  SET redirects to state
    setRedirectAction({ dispatch, redirects: data["301_redirects"] });

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, []);

  useEffect(() => {
    if (!redirects) return null; // skip if redirects are not set
    // 📌  check if urlPath is in redirects
    const redirect = redirects.find((redirect) =>
      urlPath.includes(redirect["301_from"])
    );
    if (!redirect) return null; // skip if redirect is not found
    console.log("🐞 REDIRECT TRIGERED", redirect);
    // 📌  set redirect to state
    setGoToAction({ state, path: redirect["301_to"], actions });
  }, [urlPath, redirects]);
};
