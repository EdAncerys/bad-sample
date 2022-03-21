import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/imports";
import date from "date-and-time";
const DATE_MODULE = date;
import ActionPlaceholder from "../../components/actionPlaceholder";
import SubmittedApplications from "./submittedApplications";
import ApplicationList from "./applicationList";

import Ellipse from "../../img/svg/ellipse.svg";
import CheckMarkGreen from "../../img/svg/checkMarkGreen.svg";

// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setGoToAction,
  deleteApplicationAction,
} from "../../context";

const ProfileProgress = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { dynamicsApps, applicationData, isActiveUser, dashboardPath } =
    useAppState();
  // console.log("dynamicsApps", dynamicsApps); // debug

  const marginVertical = state.theme.marginVertical;
  const ICON_WIDTH = 30;
  const [isFetching, setFetching] = useState(false);

  const [applicationStep, setStep] = useState("Application");
  // application under review
  let isUnderReview = false;
  if (dynamicsApps) {
    const subsData = dynamicsApps.subs.data; // get approved subs data form dynamic apps
    const appsData = dynamicsApps.apps.data; // get pending too approve apps data form dynamic apps

    isUnderReview =
      appsData.filter((item) => item.bad_approvalstatus === "Pending").length >
      0;
  }

  // if (isUnderReview) return null;

  useEffect(() => {
    if (!applicationData) return null;

    const appData = applicationData[0]; // application info data
    let progressName = "";
    // if application record & no steps completed return application name
    if (appData.bad_categorytype) {
      progressName = `- Started ${appData.bad_categorytype} application`;
    }

    if (appData.stepOne) progressName = "Step 1 - The Process";
    if (appData.stepTwo) progressName = "Step 2 - Personal Information";
    if (appData.stepThree) progressName = "Step 3 - Category Selection";
    if (appData.stepFour) progressName = "Step 4 - Professional Details";
    if (appData.changeAppCategory)
      progressName = ` - BAD ${appData.bad_categorytype} membership category change`;

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
      path = `/membership/thank-you/`;
    // SIG application path
    if (applicationData && applicationData[0].bad_organisedfor === "SIG")
      path = `/membership/sig-questions/`;
    // BAD application category change path
    if (applicationData && applicationData[0].changeAppCategory)
      path = `/membership/application-change/`;

    setGoToAction({ path: path, actions });
  };

  const handleCancelApplication = async () => {
    // call to API to delete Application
    try {
      setFetching(true);
      await deleteApplicationAction({
        state,
        dispatch,
        applicationData,
        contactid: isActiveUser.contactid,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

  // SERVERS ---------------------------------------------
  const ServeProgressBar = () => {
    if (!applicationData) return null;

    const appData = applicationData[0]; // application info data
    const isSIG = appData.bad_organisedfor === "SIG";
    const isBADCategoryChange = appData.changeAppCategory;

    // dont display for SIG || BAD cat change applications
    if (isSIG || isBADCategoryChange) return null;

    const ServeProgressIcon = ({ complete }) => {
      const alt = complete ? "complete" : "in-progress";
      let status = complete;

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
              gridTemplateColumns: `${ICON_WIDTH}px 1.3fr ${ICON_WIDTH}px 1.3fr ${ICON_WIDTH}px`,
              width: "100%",
              left: 0,
              top: -ICON_WIDTH / 3,
              justifyItems: "center",
            }}
          >
            <ServeProgressIcon complete={appData.stepOne} />
            <ServeProgressIcon complete={appData.stepTwo} />
            <ServeProgressIcon complete={appData.stepThree} />
            <ServeProgressIcon complete={appData.stepFour} />
            <ServeProgressIcon complete={appData.applicationComplete} />
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
    return (
      <div>
        <div className="flex">
          <div
            type="submit"
            className="blue-btn"
            onClick={handleCancelApplication}
            style={{ marginRight: "1em", backgroundColor: colors.danger }}
          >
            Cancel Application
          </div>
          <div type="submit" className="blue-btn" onClick={handleApply}>
            Continue Application
          </div>
        </div>
      </div>
    );
  };

  const ServeApplicationConsole = () => {
    if (!applicationData) return null; // if no applicationData return null

    return (
      <div style={{ position: "relative" }}>
        <ActionPlaceholder isFetching={isFetching} background="transparent" />
        <div
          className="flex-col shadow"
          style={{
            padding: `2em 4em`,
            marginBottom: `${marginVertical}px`,
          }}
        >
          <div className="flex" style={{ alignItems: "center" }}>
            <div
              className="flex primary-title"
              style={{
                fontSize: 20,
                fontWeight: "bold",
                justifyItems: "center",
                lineHeight: "unset",
              }}
            >
              Application Progress
              <span style={{ paddingLeft: "0.5em" }}>{applicationStep}</span>
            </div>
            <ServeActions />
          </div>

          <ServeProgressBar />
        </div>
      </div>
    );
  };

  return (
    <div>
      <ServeApplicationConsole />
      <ApplicationList />
      <SubmittedApplications />
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
