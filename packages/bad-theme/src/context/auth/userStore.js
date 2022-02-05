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

    // ⏬⏬  get application record from store ⏬⏬
    let storeApplication = null;
    storeApplication = await getUserStoreAction({ state, isActiveUser });

    if (!storeApplication) {
      const newApplicationRecord = await createNewApplicationAction({
        state,
        contactid,
      });
      if (newApplicationRecord) storeApplication = newApplicationRecord;
    }

    // update storeApplication with new data

    console.log("⏬ Membership Record ⏬");
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
