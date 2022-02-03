import React from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import { setGoToAction } from "../../context";
// CONTEXT ----------------------------------------------------------------
import { useAppState } from "../../context";

const SideBarMenu = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const slug = state.router.link;

  const { applicationData } = useAppState();

  const defaultStyle = {};
  const activeStyle = {
    fontWeight: 800,
    color: colors.blue,
  };

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

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    return (
      <div
        className="primary-title"
        style={{
          fontSize: 22,
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
      if (
        !applicationData ||
        (applicationData && applicationData.type !== "SIG Membership")
      )
        return null;

      return (
        <div
          className="title-link-animation"
          style={{ ...stepFive, padding: `0.5em 0` }}
          onClick={() => {
            if (slug === "/membership/final-step-thank-you/") return null;
            setGoToAction({
              path: `/membership/step-4-professional-details/`,
              actions,
            });
          }}
        >
          Step 5 - SIG Questions
        </div>
      );
    };

    return (
      <div style={{ padding: `2em 0` }}>
        <div
          className="title-link-animation"
          style={{ ...stepOne, padding: `0.5em 0` }}
          onClick={() => {
            if (slug === "/membership/final-step-thank-you/") return null;
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
            if (slug === "/membership/final-step-thank-you/") return null;
            setGoToAction({
              path: `/membership/step-2-personal-information/`,
              actions,
            });
          }}
        >
          Step 2 - Personal Information
        </div>
        <div
          className="title-link-animation"
          style={{ ...stepThree, padding: `0.5em 0` }}
          onClick={() => {
            if (slug === "/membership/final-step-thank-you/") return null;
            setGoToAction({
              path: `/membership/step-3-category-selection/`,
              actions,
            });
          }}
        >
          Step 3 - Category Selection
        </div>
        <div
          className="title-link-animation"
          style={{ ...stepFour, padding: `0.5em 0` }}
          onClick={() => {
            if (slug === "/membership/final-step-thank-you/") return null;
            setGoToAction({
              path: `/membership/step-4-professional-details/`,
              actions,
            });
          }}
        >
          Step 4 - Professional Details
        </div>
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
