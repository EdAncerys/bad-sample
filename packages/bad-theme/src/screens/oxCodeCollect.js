import { connect } from "frontity";
import { useEffect } from "react";
// --------------------------------------------------------------------------------
import Loading from "../components/loading";

const OACodecCollect = ({ state, actions, libraries }) => {
  // --------------------------------------------------------------------------------
  // 📌 Oxford Academics recollect redirect landing page. PATH ouredirect
  // path route example 👇
  // /ouredirect?redirect=https://www.bad.org.uk/&state=hello
  // --------------------------------------------------------------------------------
  const path = state.router.link;
  console.log("⭐️ DOM LOAD, path", path);

  useEffect(() => {
    (async () => {
      try {
        let URL = new URLSearchParams(window.location.search);
        const isOURedirect = URL.get("redirect");
        const isOrigUrl = URL.get("origurl");
        console.log("⭐️ %s URL isOURedirect ", isOURedirect);
        console.log("⭐️ %s URL isOrigUrl ", isOrigUrl);

        const path = isOURedirect; // ⚠️ redirect path from BAD. Extend with additional params if needed

        if (isOrigUrl) {
          // --------------------------------------------------------------------------------
          // 📌  Check if BAD cookie exist in headers
          // --------------------------------------------------------------------------------
          const res = await fetch(state.auth.APP_HOST + "/utils/cookie");
          const data = await res.json();
          const isAuth = data?.success;
          console.log("⭐️ auth user", isAuth);
          // await new Promise((resolve) => setTimeout(resolve, 2000));

          if (isAuth) {
            // --------------------------------------------------------------------------------
            // 📌  Redirect auth users to provided url
            // --------------------------------------------------------------------------------
            let meta = document.createElement("meta");
            meta.httpEquiv = "refresh";
            meta.content = `0; url=${isOrigUrl}`;
            document.getElementsByTagName("head")[0].appendChild(meta);
          } else {
            // --------------------------------------------------------------------------------
            // 📌  Redirect to B2C login page
            // --------------------------------------------------------------------------------

            const redirectPath = `&redirect_uri=${state.auth.APP_URL}/ouredirect?state=${isOrigUrl}`; // 📌 auth B2c redirect url
            let action = "login";

            const b2cRedirect =
              state.auth.B2C +
              `${redirectPath}&scope=openid&response_type=id_token&prompt=${action}`;

            // --------------------------------------------------------------------------------
            // 📌  Add meta tag with redirect from current path in 0s to url provided
            // --------------------------------------------------------------------------------
            window.location.href = b2cRedirect;
          }

          return;
        }

        if (isOURedirect) {
          // --------------------------------------------------------------------------------
          // 📌  Add meta tag to headers
          // --------------------------------------------------------------------------------
          const meta1 = document.createElement("meta");
          meta1.name = "referrer";
          meta1.content = "no-referrer-when-downgrade";
          document.head.appendChild(meta1);

          // --------------------------------------------------------------------------------
          // 📌  Add meta tag with redirect from current path in 0s to url provided
          // --------------------------------------------------------------------------------
          let meta = document.createElement("meta");
          meta.httpEquiv = "refresh";
          meta.content = `0; url=${path}`;
          document.getElementsByTagName("head")[0].appendChild(meta);

          return;
        }

        // --------------------------------------------------------------------------------
        // 📌  If none of the above conditions match - redirect back to home page
        // --------------------------------------------------------------------------------
        actions.router.set("/"); // ⚠️ redirect to home landing page
      } catch (error) {
        console.log("⭐️ %s", __filename, error);

        actions.router.set("/"); // ⚠️ redirect to home landing page
      }
    })();
  }, []);

  return <Loading />;
};

export default connect(OACodecCollect);
