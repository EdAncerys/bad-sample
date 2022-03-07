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

  const [category, setCategory] = useState(() => {
    if (!applicationData) return "";
    let applicationCategory = "";
    applicationData.map((data) => {
      if (data.name === "bad_organisedfor") applicationCategory = data.value;
      return "";
    });

    return applicationCategory;
  });

  console.log(category);

  let stepOne,
    stepTwo,
    stepThree,
    stepFour,
    stepFive = defaultStyle;

  if (slug.includes("step-1")) stepOne = activeStyle;
  if (slug.includes("step-2")) stepTwo = activeStyle;
  if (slug.includes("step-3")) stepThree = activeStyle;
  if (slug.includes("step-4")) stepFour = activeStyle;
  if (slug.includes("step-5")) stepFive = activeStyle;

  useEffect(() => {
    // redirect to /dashboard if isActiveUser && !applicationData
    if (isActiveUser && !applicationData) {
      console.log(
        "⬇️ user have no application data created - redirect to /dashboard"
      );
      setGoToAction({ path: `/dashboard/`, actions });
      return;
    }
    // redirect to / if !isActiveUser || !applicationData
    if (!isActiveUser) {
      console.log("⬇️ no user - redirect to /");
      setGoToAction({ path: `/`, actions });
    }
  }, [isActiveUser, applicationData]);

  // return loading placeholder if if !isActiveUser || !applicationData
  if (!isActiveUser || !applicationData) return <Loading />;

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    return (
      <div
        className="primary-title"
        style={{
          fontSize: 20,
          borderBottom: `1px solid ${colors.silverFillTwo}`,
          padding: `0 1em 1em 0`,
        }}
      >
        Apply to become a member of BAD
      </div>
    );
  };

  const ServeContent = () => {
    const ServeStepFive = () => {
      if (category !== "810170001") return null; // SIG application link

      return (
        <div
          className="title-link-animation"
          style={{ ...stepFive, padding: `0.5em 0` }}
          onClick={() => {
            if (slug === "/membership/thank-you/") return null;
            setGoToAction({
              path: `/membership/step-5-sig-questions/`,
              actions,
            });
          }}
        >
          Step TBC - SIG Questions
        </div>
      );
    };

    return (
      <div style={{ padding: `2em 0` }}>
        <div
          className="title-link-animation"
          style={{ ...stepOne, padding: `0.5em 0` }}
          onClick={() => {
            // if (slug === "/membership/thank-you/") return null;
            setGoToAction({
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
              path: `/membership/step-2-category-selection/`,
              actions,
            });
          }}
        >
          Step 2 - Category Selection
        </div>
        {category === "810170000" && (
          <div>
            <div
              className="title-link-animation"
              style={{ ...stepThree, padding: `0.5em 0` }}
              onClick={() => {
                setGoToAction({
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
