import { useEffect, useRef } from "react";
import { setRedirectAction, setGoToAction, fetchDataHandler } from "../context";

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
    // ⬇️  get redirects path from wp
    const path =
      state.auth.WP_HOST + "/wp-json/acf/v3/options/options/301_redirects";
    console.log("SET triggered");
    // 📌  PRE-FETCH redirects from wp
    const response = await fetchDataHandler({ path, state });
    if (!response) return null;

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
    // remove last slash if present in urlPath
    const urlPathNoSlash = urlPath.replace(/\/$|((\.[a-z]{2,4}))\//, "$1");
    // console.log("URL PATH", urlPath, "NO SLASH", urlPathNoSlash);
    // console.log("REDIRECTS", redirects);
    const redirect = redirects.find(
      (redirect) => {
        if (doURLsMatch(redirect["301_from"], urlPath, state.auth.APP_URL)) {
          console.log(
            `Redirecting from ${redirect["301_from"]} to ${redirect["301_to"]}`
          );
        }
        return doURLsMatch(redirect["301_from"], urlPath, state.auth.APP_URL);
      }
      // redirect["301_from"].is_document
      //   ? urlPath === redirect["301_from"]
      //   : urlPathNoSlash === redirect["301_from"]
    );

    if (!redirect) return null; // skip if redirect is not found
    // 📌  set redirect to state
    setGoToAction({ state, path: redirect["301_to"], actions });
    // console.log("🐞 REDIRECT TRIGERED", redirect);
  }, [urlPath, redirects]);
};

function doURLsMatch(redirectFromUrl, redirectToUrl, hostname) {
  // check if meets criteria
  const isStartsWith =
    redirectFromUrl.startsWith("www.") || redirectFromUrl.startsWith("http");

  if (!redirectFromUrl || !redirectToUrl || !hostname || isStartsWith) {
    return false;
  }

  const redirectFrom = new URL(hostname + redirectFromUrl);
  const redirectTo = new URL(hostname + redirectToUrl);

  if (
    redirectFrom.pathname.replace(/\/$/, "") !==
    redirectTo.pathname.replace(/\/$/, "")
  ) {
    return false;
  }

  for (const [key, value] of redirectFrom.searchParams) {
    if (redirectTo.searchParams.get(key) !== value) {
      return false;
    }
  }

  return true;
}
