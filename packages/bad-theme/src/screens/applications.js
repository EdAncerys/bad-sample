import { useState, useEffect } from "react";
import { connect } from "frontity";
// --------------------------------------------------------------------------------
import BlockWrapper from "../components/blockWrapper";
import ApplicationSidePannel from "../components/applicationSidePannel";

const Applications = ({ state, actions, libraries }) => {
  // --------------------------------------------------------------------------------
  // 📌  BAD applications page.
  // --------------------------------------------------------------------------------
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  console.log("pageData ", data, page); // debug

  const [fetching, setFetching] = useState(false);
  const [form, setForm] = useState({
    step: 1,
  });

  useEffect(() => {
    console.log("🐞 DATA fetch");

    (async () => {
      try {
        setFetching(true);
      } catch (error) {
        console.log("error", error);
      } finally {
        setFetching(false);
      }
    })();
  }, []);

  return (
    <BlockWrapper>
      <div className="flex applications-container">
        <ApplicationSidePannel step={form?.step} />
        <div>applications</div>
      </div>
    </BlockWrapper>
  );
};

export default connect(Applications);
