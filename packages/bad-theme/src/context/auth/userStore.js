import {
  authenticateAppAction,
  setFetchAction,
  setApplicationDataAction,
  setLoginModalAction,
} from "../index";

export const setUserStoreAction = async ({
  state,
  dispatch,
  applicationData,
  isActiveUser,
  data,
}) => {
  console.log("setUserStoreAction triggered");
  if (!isActiveUser) {
    // validate if isActiveUser 🤖
    setLoginModalAction({ dispatch, loginModalAction: true });
    return null;
  }

  setFetchAction({ dispatch, isFetching: true });

  try {
    const { contactid } = isActiveUser;
    if (!contactid)
      throw new Error("Cannot set user store. Contactid is missing.");

    let storeApplication = applicationData;

    if (!storeApplication) {
      // ⏬⏬  get application record from store ⏬⏬
      storeApplication = await getUserStoreAction({ state, isActiveUser });
    }

    if (!storeApplication) {
      // ⏬⏬  creat application record in Dynamics ⏬⏬
      const newApplicationRecord = await createNewApplicationAction({
        state,
        contactid,
      });
      storeApplication = newApplicationRecord;
    }

    // 🤖 update object with user input data
    storeApplication = updateMembershipApplication({ storeApplication, data });
    // console.log("Final storeApplication Record", storeApplication); // debug

    const URL = state.auth.APP_HOST + `/store/${contactid}/applications`;
    const jwt = await authenticateAppAction({ state });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(storeApplication),
    };

    const response = await fetch(URL, requestOptions);
    const userStore = await response.json();

    if (userStore.success)
      setApplicationDataAction({
        dispatch,
        applicationData: storeApplication,
      });
  } catch (error) {
    console.log("error", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
  }
};

export const getUserStoreAction = async ({ state, isActiveUser }) => {
  console.log("getUserStoreAction triggered");

  try {
    const { contactid } = isActiveUser;
    if (!contactid)
      throw new Error("Cannot set user store. Contactid is missing.");

    const URL = state.auth.APP_HOST + `/store/${contactid}/applications`;
    const jwt = await authenticateAppAction({ state });

    const requestOptions = {
      method: "GET",
      headers: { Authorization: `Bearer ${jwt}` },
    };

    const response = await fetch(URL, requestOptions);
    const userStore = await response.json();

    if (userStore.success) {
      console.log("⏬ Membership Record ⏬");
      console.log(userStore.data);
      return userStore.data;
    } else {
      console.log("⏬ Membership Record Not Found ⏬");
      return null;
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const createNewApplicationAction = async ({ state, contactid }) => {
  console.log("createNewApplicationAction triggered");

  // ⏬⏬  create application record in dynamics ⏬⏬
  const URL = state.auth.APP_HOST + `/applications/new/${contactid}`;
  const jwt = await authenticateAppAction({ state });

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  };

  try {
    const data = await fetch(URL, requestOptions);
    const result = await data.json();

    // console.log("createNewApplicationAction result", result); // debug

    if (result.success) {
      return result.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log("error", error);
  }
};

const updateMembershipApplication = ({ storeApplication, data }) => {
  console.log("⏬ UPDATING Membership Record ⏬");
  let newApplicationRecord = storeApplication;

  newApplicationRecord.map((application) => {
    //⏬ step one of the application process
    if (data.core_name && application.name === "core_name")
      application.value = data.core_name;
    if (
      data.core_membershipapplicationid &&
      application.name === "core_membershipapplicationid"
    )
      application.value = data.core_membershipapplicationid;

    //⏬ personal info of the application process
    if (data.py3_title && application.name === "py3_title")
      application.value = data.py3_title;
    if (
      data.py3_firstname &&
      application.name === "core_membershipapplicationid"
    )
      application.value = data.py3_firstname;
    if (data.py3_lastname && application.name === "py3_firstname")
      application.value = data.py3_lastname;
    if (data.py3_gender && application.name === "py3_gender")
      application.value = data.py3_gender;
    if (data.py3_email) application.value = data.py3_email;
    if (data.py3_mobilephone && application.name === "py3_mobilephone")
      application.value = data.py3_mobilephone;
    if (data.py3_address1ine1 && application.name === "py3_address1ine1")
      application.value = data.py3_address1ine1;
    if (data.py3_addressline2 && application.name === "py3_addressline2")
      application.value = data.py3_addressline2;
    if (data.py3_addresstowncity && application.name === "py3_addresstowncity")
      application.value = data.py3_addresstowncity;
    if (
      data.py3_addresszippostalcode &&
      application.name === "py3_addresszippostalcode"
    )
      application.value = data.py3_addresszippostalcode;
    if (data.py3_addresscountry && application.name === "py3_addresscountry")
      application.value = data.py3_addresscountry;

    //⏬ category section of the application process
  });
  console.log("User Input Data ", data);

  return newApplicationRecord;
};
