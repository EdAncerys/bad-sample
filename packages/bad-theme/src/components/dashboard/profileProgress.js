import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/imports";
import ActionPlaceholder from "../../components/actionPlaceholder";
import Ellipse from "../../img/svg/ellipse.svg";
import CheckMarkGreen from "../../img/svg/checkMarkGreen.svg";

// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setGoToAction,
  deleteApplicationAction,
  muiQuery,
  setApplicationDataAction,
} from "../../context";
import { getUserStoreAction } from "../../helpers/inputHelpers";

const ProfileProgress = ({ state, actions, libraries }) => {
  const { lg } = muiQuery();
  const dispatch = useAppDispatch();
  const { dynamicsApps, isActiveUser } = useAppState();

  const marginVertical = state.theme.marginVertical;
  const ICON_WIDTH = 30;
  const [isFetching, setFetching] = useState(false);

  const [applicationStep, setStep] = useState("Application");
  const [applicationData, setAppData] = useState("Application");
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
    (async () => {
      try {
        const id = isActiveUser?.contactid || "";
        const dynamicsApplication = await getUserStoreAction({ state, id });
        console.log("🐞 APP UPDATE", dynamicsApplication);

        if (dynamicsApplication.success) {
          setApplicationDataAction({
            dispatch,
            applicationData: updatedMembershipData,
          });
        }

        const appData = dynamicsApplication?.[0]; // application info data

        let progressName = ` - Started ${appData.bad_categorytype} application`;
        if (appData.step === 1) progressName = "Step 1 - The Process";
        if (appData.step === 2) progressName = "Step 2 - Personal Information";
        if (appData.step === 3) progressName = "Step 3 - Personal Information";
        if (appData.step === 4) progressName = "Step 4 - Professional Details";
        if (appData.step === 5) progressName = "Step 5: Application Submission";
        if (appData.step === 8)
          progressName = ` - BAD ${appData.bad_categorytype} membership category change`;

        setStep(progressName);
        setAppData(dynamicsApplication);
      } catch (error) {
        console.log("🐞 error", error);
      }
    })();
  }, []);

  // HELPERS ----------------------------------------------
  const handleApply = () => {
    let path = `/membership/applications/`;

    setGoToAction({ state, path: path, actions });
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

      setApplicationDataAction({ dispatch, applicationData: null }); // 👉 update context
      setAppData(null); // update local state
    } catch (error) {
      // console.log(error);
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
            <ServeProgressIcon complete={appData.step >= 1} />
            <ServeProgressIcon complete={appData.step >= 2} />
            <ServeProgressIcon complete={appData.step >= 3} />
            <ServeProgressIcon complete={appData.step >= 4} />
            <ServeProgressIcon complete={appData.step >= 5} />
          </div>
        </div>
      );
    };

    return (
      <div>
        <ServeLine />

        <div className="flex" style={styles.progressMenuBar}>
          <div style={{ textAlign: "start" }}>Step 1 - The Process</div>
          <div style={{ textAlign: "start" }}>Step 2 - Category Selection</div>
          <div>Step 3 - Personal Information</div>
          <div>Step 4 - Professional Details</div>
          <div>Application Submitted</div>
        </div>
      </div>
    );
  };

  const ServeActions = () => {
    return (
      <div
        className={!lg ? "flex" : "flex-col"}
        style={{ paddingTop: "1.5em" }}
      >
        <div
          className="blue-btn"
          onClick={handleCancelApplication}
          style={{
            marginRight: !lg ? "1em" : 0,
            backgroundColor: colors.danger,
            padding: !lg ? null : 10,
            marginBottom: !lg ? null : "1em",
          }}
        >
          Cancel Application
        </div>
        <div className="blue-btn" onClick={handleApply}>
          Continue Application
        </div>
      </div>
    );
  };

  // 👉 if no applicationData is typof string, return null
  if (typeof applicationData === "string" || !applicationData) return null;

  console.log("🐞e⭐️ applicationData", applicationData);

  // get application name & type & concat in string
  const appData = applicationData[0]; // application info data
  if (!appData) return null;
  let appProgress = `${appData.bad_organisedfor} - ${appData.bad_categorytype}: ${applicationStep}`; // BAD category application name
  if (appData.bad_organisedfor === "SIG")
    appProgress = `${appData.bad_organisedfor} - ${appData?._bad_sigid_value}`; // SIG application name

  return (
    <div style={{ position: "relative" }}>
      <ActionPlaceholder isFetching={isFetching} background="transparent" />
      <div
        className="flex-col shadow"
        style={{
          padding: !lg ? `2em 4em` : `1em`,
          marginBottom: `${marginVertical}px`,
        }}
      >
        <div className="flex-col">
          <div
            className="flex-col primary-title"
            style={{
              fontSize: 20,
              fontWeight: "bold",
              justifyItems: "center",
              lineHeight: "unset",
              flexWrap: "wrap",
            }}
          >
            <span>Current Application Progress</span>
            <span>{appProgress}</span>
          </div>
          <ServeProgressBar />
          <ServeActions />
        </div>
      </div>
    </div>
  );
};

const styles = {
  progressMenuBar: {
    display: "grid",
    gridTemplateColumns: `1fr 1fr 1fr 1fr 1fr`,
    textAlign: "end",
    fontSize: 12,
  },
};

export default connect(ProfileProgress);
