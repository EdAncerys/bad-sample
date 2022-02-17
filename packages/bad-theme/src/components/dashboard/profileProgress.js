import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/imports";

import Ellipse from "../../img/svg/ellipse.svg";
import CheckMarkGreen from "../../img/svg/checkMarkGreen.svg";

// CONTEXT ----------------------------------------------------------------
import { useAppState, setGoToAction } from "../../context";

const ProfileProgress = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const { applicationData } = useAppState();

  const marginVertical = state.theme.marginVertical;
  const ICON_WIDTH = 30;

  const [applicationStep, setStep] = useState("Start new application");

  useEffect(() => {
    if (!applicationData) return null;

    let progressName = "";
    if (applicationData[0].stepOne) progressName = "Step 1 - The Process";
    if (applicationData[0].stepTwo)
      progressName = "Step 2 - Personal Information";
    if (applicationData[0].stepThree)
      progressName = "Step 3 - Category Selection";
    if (applicationData[0].stepFour)
      progressName = "Step 4 - Professional Details";
    if (applicationData[0].stepFive) progressName = "Step 5 - SIG Questions";
    if (applicationData[0].applicationComplete)
      progressName = "Application Complete";

    setStep(progressName);
  }, [applicationData]);

  // HELPERS ----------------------------------------------
  const handleApply = () => {
    let path = `/membership/step-1-the-process/`;
    if (applicationData && applicationData[0].stepOne)
      path = `/membership/step-2-personal-information/`;
    if (applicationData && applicationData[0].stepTwo)
      path = `/membership/step-3-category-selection/`;
    if (applicationData && applicationData[0].stepThree)
      path = `/membership/step-4-professional-details/`;
    if (applicationData && applicationData[0].stepFour)
      path = `/membership/final-step-thank-you/`;

    setGoToAction({ path: path, actions });
  };

  // SERVERS ---------------------------------------------
  const ServeProgressBar = () => {
    const ServeProgressIcon = ({ complete }) => {
      const alt = complete ? "complete" : "in-progress";

      return (
        <div
          style={{
            width: ICON_WIDTH,
            height: ICON_WIDTH,
          }}
        >
          <Image
            src={complete ? CheckMarkGreen : Ellipse}
            alt={alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      );
    };

    const ServeLine = () => {
      return (
        <div
          className="flex"
          style={{
            position: "relative",
            borderBottom: `15px solid ${colors.primary}`,
            margin: `2em 0`,
          }}
        >
          <div
            style={{
              position: "absolute",
              zIndex: 1,
              display: "grid",
              gridTemplateColumns: `0.5fr 1fr 1fr 1fr 1fr`,
              width: "100%",
              left: 0,
              top: -ICON_WIDTH / 3,
              justifyItems: "flex-end",
            }}
          >
            <ServeProgressIcon
              complete={applicationData && applicationData[0].stepOne}
            />
            <ServeProgressIcon
              complete={applicationData && applicationData[0].stepTwo}
            />
            <ServeProgressIcon
              complete={applicationData && applicationData[0].stepThree}
            />
            <ServeProgressIcon
              complete={applicationData && applicationData[0].stepFour}
            />
            <ServeProgressIcon
              complete={
                applicationData && applicationData[0].applicationComplete
              }
            />
          </div>
        </div>
      );
    };

    return (
      <div>
        <ServeLine />

        <div className="flex" style={styles.progressMenuBar}>
          <div>Step 1 - The Process</div>
          <div>Step 2 - Personal Information</div>
          <div>Step 3 - Category Selection</div>
          <div>Step 4 - Professional Details</div>
          <div>Review</div>
        </div>
      </div>
    );
  };

  const ServeActions = () => {
    if (applicationData && applicationData[0].applicationComplete) return null;

    return (
      <div type="submit" className="blue-btn" onClick={handleApply}>
        Application
      </div>
    );
  };

  return (
    <div
      className="flex-col shadow"
      style={{ padding: `2em 4em`, marginBottom: `${marginVertical}px` }}
    >
      <div className="flex">
        <div
          className="flex primary-title"
          style={{
            fontSize: 20,
            fontWeight: "bold",
            justifyItems: "center",
          }}
        >
          Application Progress - <span>{applicationStep}</span>
        </div>
        <ServeActions />
      </div>

      <ServeProgressBar />
    </div>
  );
};

const styles = {
  progressMenuBar: {
    display: "grid",
    gridTemplateColumns: `0.5fr 1fr 1fr 1fr 1fr`,
    textAlign: "end",
    fontSize: 12,
  },
};

export default connect(ProfileProgress);
