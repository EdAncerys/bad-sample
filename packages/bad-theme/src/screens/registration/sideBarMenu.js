import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import { setGoToAction } from "../../context";
import Loading from "../../components/loading";
// CONTEXT ----------------------------------------------------------------
import { useAppState } from "../../context";

const SideBarMenu = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const slug = state.router.link;

  const { applicationData, isActiveUser } = useAppState();

  const defaultStyle = {};
  const activeStyle = {
    fontWeight: 800,
    color: colors.blue,
  };

  const [form, setForm] = useState(() => {
    let form = {
      bad_organisedfor: "",
      _bad_sigid_value: "Form", // fall back value
    };

    // application data not available, default to Form
    if (!applicationData) return form;

    applicationData.map((data) => {
      if (data.name === "bad_organisedfor") form.bad_organisedfor = data.value;
      if (data._bad_sigid_value) form._bad_sigid_value = data._bad_sigid_value;
    });

    return form;
  });

  let stepOne,
    stepTwo,
    stepThree,
    stepFour,
    stepFive = defaultStyle;

  if (slug.includes("step-1")) stepOne = activeStyle;
  if (slug.includes("step-2")) stepTwo = activeStyle;
  if (slug.includes("step-3")) stepThree = activeStyle;
  if (slug.includes("step-4")) stepFour = activeStyle;

  useEffect(() => {
    // 📌 redirect to / if !isActiveUser || !applicationData
    if (!isActiveUser) {
      // console.log("⬇️ no user - redirect to /");
      setGoToAction({ state, path: `/`, actions });
    }
    // 📌 redirect to /dashboard if isActiveUser && !applicationData
    if (isActiveUser && !applicationData && slug !== "/membership/thank-you/") {
      setGoToAction({ state, path: `/dashboard/`, actions });
      return;
    }

    // 📌 auth/manage application steps for apps & redirects
    if (applicationData) {
      const appData = applicationData[0];
      if (slug.includes("step-2") && !appData.stepOne)
        stepTwo = setGoToAction({
          state,
          path: `/membership/step-1-the-process/`,
          actions,
        });
      if (slug.includes("step-3") && !appData.stepTwo)
        stepTwo = setGoToAction({
          state,
          path: `/membership/step-2-category-selection/`,
          actions,
        });
      if (slug.includes("step-4") && !appData.stepThree)
        stepTwo = setGoToAction({
          state,
          path: `/membership/step-3-personal-information/`,
          actions,
        });
    }
  }, [isActiveUser, applicationData]);

  // return loading placeholder if if !isActiveUser || !applicationData
  if (!isActiveUser) return <Loading />;

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    let title = "Apply to become a member of BAD";
    if (slug === "/membership/thank-you/") title = "Ethnicity Question";

    return (
      <div
        className="primary-title"
        style={{
          fontSize: 20,
          borderBottom: `1px solid ${colors.silverFillTwo}`,
          padding: `0 1em 1em 0`,
        }}
      >
        {title}
      </div>
    );
  };

  const ServeContent = () => {
    const ServeStepFive = () => {
      if (form.bad_organisedfor !== "810170001") return null; // SIG application link

      return (
        <div
          className="title-link-animation"
          style={{ ...stepFive, padding: `0.5em 0` }}
          onClick={() => {
            if (slug === "/membership/thank-you/") return null;
            setGoToAction({
              state,
              path: `/membership/sig-questions/`,
              actions,
            });
          }}
        >
          <span>{form._bad_sigid_value}</span> - SIG Questions
        </div>
      );
    };

    return (
      <div style={{ padding: `2em 0` }}>
        {form.bad_organisedfor === "810170000" && (
          <div>
            <div
              className="title-link-animation"
              style={{ ...stepOne, padding: `0.5em 0` }}
              onClick={() => {
                // if (slug === "/membership/thank-you/") return null;
                setGoToAction({
                  state,
                  path: `/membership/step-1-the-process/`,
                  actions,
                });
              }}
            >
              Step 1 - The Process
            </div>
            <div
              className="title-link-animation"
              style={{ ...stepTwo, padding: `0.5em 0` }}
              onClick={() => {
                setGoToAction({
                  state,
                  path: `/membership/step-2-category-selection/`,
                  actions,
                });
              }}
            >
              Step 2 - Category Selection
            </div>
            <div
              className="title-link-animation"
              style={{ ...stepThree, padding: `0.5em 0` }}
              onClick={() => {
                setGoToAction({
                  state,
                  path: `/membership/step-3-personal-information/`,
                  actions,
                });
              }}
            >
              Step 3 - Personal Information
            </div>
            <div
              className="title-link-animation"
              style={{ ...stepFour, padding: `0.5em 0` }}
              onClick={() => {
                setGoToAction({
                  state,
                  path: `/membership/step-4-professional-details/`,
                  actions,
                });
              }}
            >
              Step 4 - Professional Details
            </div>
          </div>
        )}
        <ServeStepFive />
      </div>
    );
  };

  return (
    <div
      className="flex-col"
      style={{
        paddingRight: `4em`,
        borderRight: `1px solid ${colors.silverFillTwo}`,
      }}
    >
      <ServeTitle />
      <ServeContent />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(SideBarMenu);
