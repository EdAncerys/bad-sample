import { connect } from "frontity";
import { useEffect } from "react";
// --------------------------------------------------------------------------------
import Loading from "../components/loading";

const OACodecCollect = ({ state, actions, libraries }) => {
  // --------------------------------------------------------------------------------
  // 📌 Oxford Academics recollect redirect landing page
  // path route example 👇
  // /ouredirect?redirect=https://www.bad.org.uk/&state=hello
  // --------------------------------------------------------------------------------
  const path = state.router.link;
  console.log("⭐️ DOM LOAD");

  useEffect(() => {
    try {
      let URL = new URLSearchParams(window.location.search);
      const isRedirect = URL.get("redirect");
      const state = URL.get("state");
      const path = state ? isRedirect + "?state=" + state : isRedirect;

      if (isRedirect) {
        let meta2 = document.createElement("meta");
        meta2.name = "referrer-policy";
        meta2.content = `no-referrer-when-downgrade`;
        document.getElementsByTagName("head")[0].appendChild(meta2);

        let meta = document.createElement("meta");
        meta.httpEquiv = "refresh";
        meta.content = `0; url=${path}`;
        document.getElementsByTagName("head")[0].appendChild(meta);
      }
    } catch (e) {
      console.log("⭐️ ", e);
    }
  }, []);

  return <Loading />;
};

export default connect(OACodecCollect);
