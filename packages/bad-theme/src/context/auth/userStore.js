import { ConstructionOutlined } from "@mui/icons-material";
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
    console.log("⏬ UPDATING Membership Record ⏬");
    //⏬ step one of the application process
    if (data.core_name) storeApplication[2].value = data.core_name;
    if (data.core_membershipapplicationid)
      storeApplication[0].value = data.core_membershipapplicationid;
    //⏬ step two of the application process
    if (data.py3_title) storeApplication[4].value = data.py3_title;
    if (data.py3_firstname) storeApplication[5].value = data.py3_firstname;
    if (data.py3_lastname) storeApplication[7].value = data.py3_lastname;
    if (data.py3_gender) storeApplication[9].value = data.py3_gender;
    if (data.py3_email) storeApplication[11].value = data.py3_email;
    if (data.py3_mobilephone) storeApplication[12].value = data.py3_mobilephone;
    if (data.py3_address1ine1)
    storeApplication[28].value = data.py3_address1ine1;
    if (data.py3_addressline2)
    storeApplication[29].value = data.py3_addressline2;
    if (data.py3_addresstowncity)
    storeApplication[30].value = data.py3_addresstowncity;
    if (data.py3_addresszippostalcode)
    storeApplication[32].value = data.py3_addresszippostalcode;
    if (data.py3_addresscountry)
    storeApplication[33].value = data.py3_addresscountry;
    //⏬ step two of the application process
    
    console.log(storeApplication);

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

    console.log("requestOptions", requestOptions);

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
