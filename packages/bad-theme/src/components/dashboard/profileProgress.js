import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/imports";
import date from "date-and-time";
const DATE_MODULE = date;
import ActionPlaceholder from "../../components/actionPlaceholder";

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

  const { dynamicsApps, applicationData, isActiveUser } = useAppState();
  const dispatch = useAppDispatch();

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

  useEffect(() => {
    if (!applicationData) return null;

    const appData = applicationData[0]; // application info data
    let progressName = "";
    // if application record & no steps completed return application name
    if (appData.bad_categorytype) {
      progressName = ` - Started ${appData.bad_categorytype} application`;
    }

    if (appData.stepOne) progressName = "Step 1 - The Process";
    if (appData.stepTwo) progressName = "Step 2 - Personal Information";
    if (appData.stepThree) progressName = "Step 3 - Category Selection";
    if (appData.stepFour) progressName = "Step 4 - Professional Details";

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

    // dont display for SIG applications
    if (isSIG) return null;

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
            Application
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
          <div className="flex">
            <div
              className="flex primary-title"
              style={{
                fontSize: 20,
                fontWeight: "bold",
                justifyItems: "center",
                lineHeight: "unset",
              }}
            >
              Application Progress <span>{applicationStep}</span>
            </div>
            <ServeActions />
          </div>

          <ServeProgressBar />
        </div>
      </div>
    );
  };

  const ServeApplicationList = () => {
    if (!dynamicsApps) return null; // if application data exist & not under review return null
    // see if application list have approved applications and if so show them
    const subsData = dynamicsApps.subs.data; // get subs data form dynamic apps
    // hide component if application list has no approved applications
    if (subsData.length === 0) return null;

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
          {subsData.map((app, key) => {
            const {
              bad_organisedfor,
              core_name,
              createdon,
              bad_approvalstatus,
            } = app;

            // get application date
            let appData = createdon.split(" ")[0];
            // split string and revert date with month format
            appData = appData.split("/");
            appData = `${appData[1]}/${appData[0]}/${appData[2]}`;

            const dateObject = new Date(appData);
            const formattedDate = DATE_MODULE.format(dateObject, "DD MMM YYYY");

            return (
              <div key={key} className="flex-col" style={{ paddingTop: `1em` }}>
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

  const ServeSubmittedApplicationList = () => {
    if (!dynamicsApps) return null; // if application data exist & not under review return null
    // see if application list have approved applications and if so show them
    let appsData = dynamicsApps.apps.data; // get subs data form dynamic apps
    // hide component if application list has no approved applications
    if (appsData.length === 0) return null;
    // sort by application date created newest by default
    appsData = appsData.sort((a, b) => {
      const dateA = new Date(a.createdon);
      const dateB = new Date(b.createdon);
      return dateB - dateA;
    });

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
            Pending For Approval Applications
          </div>
          {appsData.map((app, key) => {
            const {
              bad_organisedfor,
              core_name,
              createdon,
              bad_approvalstatus,
            } = app;

            // get application date
            let appData = createdon.split(" ")[0];
            // split string and revert date with month format
            appData = appData.split("/");
            appData = `${appData[1]}/${appData[0]}/${appData[2]}`;

            const dateObject = new Date(appData);
            const formattedDate = DATE_MODULE.format(dateObject, "DD MMM YYYY");

            return (
              <div key={key} className="flex-col" style={{ paddingTop: `1em` }}>
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
      <ServeSubmittedApplicationList />
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
