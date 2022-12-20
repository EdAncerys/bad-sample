// CONTEXT ----------------------------------------------------------------
import {
  setErrorAction,
  handleApplyForMembershipAction,
  handleValidateMembershipChangeAction,
} from "../context";

export const handleUpdateMembershipApplication = async ({
  state,
  actions,
  dispatch,
  isActiveUser,
  dynamicsApps,
  app,
  applicationData,
  setFetching,
}) => {
  // if no app data found break & display error
  if (!app) {
    const confirmationMsg = `No BAD applications found. Please apply for BAD membership first.`;

    setErrorAction({
      dispatch,
      isError: {
        message: confirmationMsg,
        image: "Error",
      },
    });
    return;
  }
  // if user have application in progress break & display error
  if (applicationData) {
    const type = applicationData[0].bad_categorytype;
    const confirmationMsg = `You already have ${type} application open and unsubmitted! Please complete it before changing BAD application category.`;

    setErrorAction({
      dispatch,
      isError: {
        message: confirmationMsg,
        image: "Error",
      },
    });
    return;
  }

  // handle create new application in Dynamics
  try {
    setFetching(true);
    const { core_membershipsubscriptionid } = app;
    // chenck if user have previously submited application for category change
    let isSubmitted = await handleValidateMembershipChangeAction({
      state,
      core_membershipsubscriptionid,
      isActiveUser,
      dispatch,
    });

    if (isSubmitted) {
      // check if user have submitted application for this category
      isSubmitted = isSubmitted.filter((app) => {
        return (
          app._bad_existingsubscriptionid_value ===
          core_membershipsubscriptionid
        );
      });
    }

    if (isSubmitted && isSubmitted.length > 0) {
      const confirmationMsg = `You alteady submited you request for change of category. BAD category change pending approval.`;

      setErrorAction({
        dispatch,
        isError: {
          message: confirmationMsg,
          image: "Error",
        },
      });
      return;
    }

    // create membership application change record
    const appData = await handleApplyForMembershipAction({
      state,
      actions,
      dispatch,
      applicationData,
      isActiveUser,
      dynamicsApps,
      category: "BAD",
      type: app.bad_categorytype, //🤖 application type name from appData
      membershipApplication: {
        stepOne: false,
        stepTwo: false,
        stepThree: false,
        stepFour: false,
        changeAppCategory: app, // change of application
      },
      path: "/membership/application-change/", // redirect to application change page
      changeAppCategory: app, // change of application
    });
    if (!appData) throw new Error("Failed to create application");
  } catch (error) {
    // console.log(error);

    setErrorAction({
      dispatch,
      isError: {
        message: "Failed to create application record. Please try again.",
        image: "Error",
      },
    });
  } finally {
    setFetching(false);
  }
};
