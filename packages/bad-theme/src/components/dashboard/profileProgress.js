import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/imports";
import date from "date-and-time";
const DATE_MODULE = date;

import Ellipse from "../../img/svg/ellipse.svg";
import CheckMarkGreen from "../../img/svg/checkMarkGreen.svg";

// CONTEXT ----------------------------------------------------------------
import { useAppState, setGoToAction } from "../../context";
const ProfileProgress = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const { dynamicsApps, applicationData } = useAppState();

  const marginVertical = state.theme.marginVertical;
  const ICON_WIDTH = 30;

  const [applicationStep, setStep] = useState("Start new application");
  // application under review
  const isUnderReview =
    dynamicsApps &&
    dynamicsApps.length > 0 &&
    dynamicsApps[0].bad_approvalstatus === "Pending";
  const isApproved =
    dynamicsApps &&
    dynamicsApps.length > 0 &&
    dynamicsApps[0].bad_approvalstatus === "Approved";

  useEffect(() => {
    // if (!applicationData) return null - we need to check if the data exists in the API
    if (!applicationData && dynamicsApps.length === 0) return null; //if there is no application data and no active applications in the API - then return null
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
      progressName = "Application Submitted";
    if (isUnderReview) progressName = "Application Under Review";

    setStep(progressName);
  }, [applicationData]);

  // HELPERS ----------------------------------------------
  const handleApply = () => {
    let path = `/membership/step-1-the-process/`;
    if (applicationData && applicationData[0].stepOne)
      path = `/membership/step-2-category-selection/`;
    if (applicationData && applicationData[0].stepTwo)
      path = `/membership/step-3-personal-information/`;
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
      let status = complete;
      if (isUnderReview) status = true;

      return (
        <div
          style={{
            width: ICON_WIDTH,
            height: ICON_WIDTH,
          }}
        >
          <Image
            src={status ? CheckMarkGreen : Ellipse}
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
          <div>Application Submitted</div>
        </div>
      </div>
    );
  };

  const ServeActions = () => {
    if (
      (applicationData && applicationData[0].applicationComplete) ||
      isUnderReview
    )
      return null;

    return (
      <div type="submit" className="blue-btn" onClick={handleApply}>
        Application
      </div>
    );
  };

  const ServeApplicationConsole = () => {
    if (!applicationData || !isUnderReview) return null; // if application data exist & not under review return null

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

  const ServeApplicationList = () => {
    if (dynamicsApps && !isApproved) return null; // if application data exist & not under review return null

    return (
      <div
        className="flex-col shadow"
        style={{ padding: `2em 4em`, marginBottom: `${marginVertical}px` }}
      >
        <div className="flex-col">
          <div
            className="flex primary-title"
            style={{
              fontSize: 20,
              justifyItems: "center",
            }}
          >
            Existing Applications
          </div>
          {dynamicsApps.map((app) => {
            const { bad_organisedfor, core_name, createdon } = app;

            // get application date
            let appData = createdon.split(" ")[0];
            // split string and revert date with month format
            appData = appData.split("/");
            appData = `${appData[1]}/${appData[0]}/${appData[2]}`;

            const dateObject = new Date(appData);
            const formattedDate = DATE_MODULE.format(dateObject, "DD MMM YYYY");

            return (
              <div className="flex-col" style={{ paddingTop: `1em` }}>
                <div className="primary-title">{bad_organisedfor}</div>
                <div>{core_name}</div>
                <div>Application Date: {formattedDate}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <ServeApplicationConsole />
      <ServeApplicationList />
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
