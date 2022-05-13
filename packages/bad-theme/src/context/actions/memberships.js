import {
  getBADMembershipSubscriptionData,
  setUserStoreAction,
  setGoToAction,
  loginAction,
  setErrorAction,
  authenticateAppAction,
  fetchDataHandler,
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
  membershipTypeChange,
}) => {
  const handleSetInputData = ({ data, name }) => {
    setData((prevFormData) => ({
      ...prevFormData,
      [name]: data[name],
    }));
  };
  console.log("DATA", applicationData);
  if (!applicationData) return null;

  // ⏬ validate inputs & pre fetch membership data
  if (!state.source.memberships)
    await getMembershipDataAction({ state, actions });
  const membershipTypes = Object.values(state.source.memberships);
  // console.log("⬇️ membershipTypes", membershipTypes); // debug

  let type = applicationData[0].bad_categorytype;
  console.log("TYPE", type);
  if (membershipTypeChange) type = membershipTypeChange; // apply for SIGs change of memberships
  membershipTypes.map((membership) => {
    // validate application type against store object for BAD & SIGs
    let appType =
      membership.acf.category_types === type ||
      membership.acf.category_types.split(":")[1] === type;

    if (appType) {
      const applicationForm = membership.acf;
      console.log("APPFORM", applicationForm);
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
  canUpdateApplication,
  changeAppCategory,
  refreshJWT,
}) => {
  try {
    if (!isActiveUser) {
      // validate if isActiveUser 🤖
      loginAction({ state });
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
        // console.log("🤖 user have application pending under reviewed status"); // debug
      } else {
        // console.log("🤖  NO  applications under reviewed status"); // debug
      }
    }

    if (applicationData) {
      // if user have application in progress redirect to dashboard

      // allow application to refetch id for BAD apps step 2 only
      if (!canUpdateApplication) {
        let confirmationMsg = `You already have application open and unsubmitted! Please go to your dashboard to continue or cancel this application`;
        if (applicationData) {
          let type = applicationData[0].bad_categorytype;
          if (type === "*") type = "Special Interest Group";
          confirmationMsg = `You already have ${type} application open and unsubmitted! Please go to your dashboard to continue or cancel this application`;
        }
        // if user have existing application show error msg
        setErrorAction({
          dispatch,
          isError: {
            message: confirmationMsg,
            goToPath: { label: "Dashboard", path: "/dashboard/" },
            image: "Error",
          },
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
        refreshJWT,
      });
      if (!response) throw new Error("Failed to get membership data");
      membershipData = response;
    }
    // set application id for apps
    let applicationId = membershipData.core_membershipsubscriptionplanid;
    // for change of category type then add application id for current application
    let bad_existingsubscriptionid = "";
    if (changeAppCategory) {
      // ⬇️ get existing subscription id for BAD apps & populate as current application id
      bad_existingsubscriptionid =
        changeAppCategory.core_membershipsubscriptionid;
      // get & assign membership id form old application record
      applicationId = ""; // reset user app category change
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
        core_membershipsubscriptionplanid: applicationId || "", // typeID of membership for application
        bad_existingsubscriptionid, // existing subscription id for BAD apps
        bad_applicationfor: changeAppCategory ? "810170001" : "810170000", // for new apps 810170000 for change of cat for BAD and 810170001
      },
      refreshJWT,
    });

    // ⏬ redirect to application form if active user
    if (isActiveUser && store) {
      setGoToAction({
        state,
        path: path || `/membership/step-1-the-process/`,
        actions,
      });
    } else {
      // console.log(store);
      setErrorAction({
        dispatch,
        isError: {
          message: "Only registered users can apply for membership.",
          image: "Error",
        },
      });
    }

    return store; // return store
  } catch (error) {
    // console.log("ERROR: ", error);
  }
};

export const handleValidateMembershipChangeAction = async ({
  state,
  isActiveUser,
  core_membershipsubscriptionid,
  dispatch,
  refreshJWT,
}) => {
  try {
    if (!isActiveUser || !core_membershipsubscriptionid)
      throw new Error("Must have valid user & membership id"); // validate if isActiveUser 🤖
    const { contactid } = isActiveUser;

    // ⏬ check if user have application change of category submitted
    const path =
      state.auth.APP_HOST +
      `/catalogue/data/core_membershipapplications?$filter=statuscode eq 1 and _core_contactid_value eq ${contactid} and _bad_existingsubscriptionid_value eq ${core_membershipsubscriptionid}&$select=_bad_existingsubscriptionid_value`;
    const jwt = await authenticateAppAction({ state, dispatch, refreshJWT });

    const requestOptions = {
      method: "GET",
      headers: { Authorization: `Bearer ${jwt}` },
    };

    const data = await fetchDataHandler({ path, state });
    const result = await data.json();

    // ⏬ submitted application data for change of category
    if (result.value) {
      return result.value; // return application data
    }
  } catch (error) {
    // console.log("ERROR: ", error);
  }
};
