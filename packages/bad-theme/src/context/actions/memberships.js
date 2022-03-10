import {
  getBADMembershipSubscriptionData,
  setUserStoreAction,
  setGoToAction,
  setLoginModalAction,
  setErrorAction,
} from "../index";

export const getMembershipDataAction = async ({ state, actions }) => {
  const path = `/memberships/`;
  await actions.source.fetch(path); // fetch membership application data
  const memberships = state.source.get(path);
  const { totalPages, page, next } = memberships; // check if memberships have multiple pages
  // fetch memberships via wp API page by page
  let isThereNextPage = next;
  while (isThereNextPage) {
    await actions.source.fetch(isThereNextPage); // fetch next page
    const nextPage = state.source.get(isThereNextPage).next; // check ifNext page & set next page
    isThereNextPage = nextPage;
  }
};

export const validateMembershipFormAction = async ({
  state,
  actions,
  setData,
  applicationData,
}) => {
  const handleSetInputData = ({ data, name }) => {
    setData((prevFormData) => ({
      ...prevFormData,
      [name]: data[name],
    }));
  };

  if (!state.source.memberships) return null;
  if (!applicationData) return null;

  // ⏬ validate inputs
  const membershipTypes = Object.values(state.source.memberships);
  // console.log("membershipTypes", membershipTypes); // debug

  membershipTypes.map((membership) => {
    // validate application type against store object
    const applicationType =
      membership.acf.category_types === applicationData[0].bad_categorytype ||
      membership.acf.category_types.split(":")[1] ===
        applicationData[0].bad_categorytype;

    if (applicationType) {
      const applicationForm = membership.acf;
      // console.log(applicationForm); // debug

      Object.keys(applicationForm).map((keyName) => {
        handleSetInputData({ data: applicationForm, name: keyName });
      });
    }
  });
};

export const handleApplyForMembershipAction = async ({
  state,
  actions,
  dispatch,
  applicationData,
  isActiveUser,
  category,
  type,
  path,
  membershipApplication,
  dynamicsApps,
}) => {
  try {
    if (!isActiveUser) {
      // validate if isActiveUser 🤖
      setLoginModalAction({ dispatch, loginModalAction: true });
      return null;
    }
    const isBADApp = category === "BAD"; // check if isBADApp

    if (dynamicsApps) {
      const appsData = dynamicsApps.apps.data; // get pending too approve apps data form dynamic apps
      // check if user have application pending under reviewed status
      const isPending =
        appsData.filter((item) => item.bad_approvalstatus === "Pending")
          .length > 0;
      const isSIGPending =
        appsData.filter((item) => item.bad_organisedfor === "SIG").length > 0;

      if (isPending) {
        console.log("🤖 user have application pending under reviewed status"); // debug
      } else {
        console.log(
          "🤖 user have NO pending applications under reviewed status"
        ); // debug
      }
    }

    if (applicationData) {
      // if user have application in progress redirect to dashboard
      console.log(
        "🤖 user have application in progress. Redirect to Dashboard"
      );
      // allow application to refetch id for BAD apps step 2 only
      if (!applicationData[0].stepOne) {
        let confirmationMsg = `You already have application open and unsubmitted! Please go to your dashboard to continue or cancel this application`;
        if (applicationData) {
          const type = applicationData[0].bad_categorytype;
          confirmationMsg = `You already have ${type} application open and unsubmitted! Please go to your dashboard to continue or cancel this application`;
        }
        // if user have existing application show error msg
        setErrorAction({
          dispatch,
          isError: { message: confirmationMsg, goToDashboard: true },
        });

        return;
      }
    }

    // default application data
    let membershipData = {
      bad_organisedfor: "SIG",
      bad_categorytype: type,
      core_membershipsubscriptionplanid: "",
      core_name: "",
    }; // membership data

    if (isBADApp) {
      // ⏬ get appropriate membership ID for BAD applications only
      const response = await getBADMembershipSubscriptionData({
        state,
        category,
        type,
      });
      console.log("getBADMembershipSubscriptionData", response);
      if (!response) throw new Error("Failed to get membership data");
      membershipData = response;
    }

    // ⏬ create user application record in Store
    const store = await setUserStoreAction({
      state,
      dispatch,
      applicationData,
      isActiveUser,
      membershipApplication: { ...membershipData, ...membershipApplication },
      data: {
        bad_organisedfor: isBADApp ? "810170000" : "810170001", // BAD members category
        core_membershipsubscriptionplanid:
          membershipData.core_membershipsubscriptionplanid || "", // type of membership for application
        bad_applicationfor: "810170000", // silent assignment
      },
    });

    // ⏬ redirect to application form if active user
    if (isActiveUser && store) {
      setGoToAction({
        path: path || `/membership/step-1-the-process/`,
        actions,
      });
    } else {
      console.log("🤖 user is not active");
      console.log(store);
      setGoToAction({ path: "/dashboard/", actions });
    }
  } catch (error) {
    console.log("ERROR: ", error);
  }
};
