import { useState, useEffect } from "react";
import { connect } from "frontity";
// --------------------------------------------------------------------------------
import { useAppState } from "../context";
import BlockWrapper from "../components/blockWrapper";
import ApplicationSidePannel from "../components/applicationSidePannel";

const Applications = ({ state, actions, libraries }) => {
  // --------------------------------------------------------------------------------
  // 📌  BAD applications page.
  // --------------------------------------------------------------------------------
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  console.log("pageData ", data, page); // debug

  const { applicationData, isActiveUser } = useAppState();
  console.log("⭐️ applicationData,", applicationData); // debug
  console.log("⭐️ isActiveUser,", isActiveUser); // debug

  const [fetching, setFetching] = useState(false);
  const [form, setForm] = useState({
    step: 1,
  });

  useEffect(() => {
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

  // --------------------------------------------------------------------------------
  const goBackHandler = () => {
    console.log("goBackHandler");
    // setGoToAction({ state, path: `/membership/`, actions })
  };

  const saveExitHandler = () => {
    console.log("saveExitHandler");
  };

  const nextHandler = () => {
    console.log("nextHandler");
  };

  return (
    <BlockWrapper>
      <div className="flex-col applications-container">
        <div className="flex">
          <ApplicationSidePannel step={form?.step} form={form} />
          <div>applications</div>
        </div>

        <div className="application-actions">
          <div className="transparent-btn" onClick={goBackHandler}>
            Back
          </div>
          <div className="transparent-btn" onClick={saveExitHandler}>
            Save & Exit
          </div>
          <div className="blue-btn" onClick={nextHandler}>
            Next
          </div>
        </div>
      </div>
    </BlockWrapper>
  );
};

export default connect(Applications);
