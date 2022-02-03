import {
  authenticateAppAction,
  setFetchAction,
  setApplicationDataAction,
} from "../index";

export const setUserStoreAction = async ({
  state,
  dispatch,
  applicationData,
  isActiveUser,
  data,
}) => {
  console.log("setUserStoreAction triggered");
  setFetchAction({ dispatch, isFetching: true });

  try {
    const { contactid } = isActiveUser;
    if (!contactid)
      throw new Error("Cannot set user store. Contactid is missing.");

    const URL = state.auth.APP_HOST + `/store/${contactid}/applications`;
    const jwt = await authenticateAppAction({ state });
    const newDataObject = { ...applicationData, ...data };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(newDataObject),
    };

    const response = await fetch(URL, requestOptions);
    const userStore = await response.json();

    console.log("userStore", userStore);
    console.log("applicationData", newDataObject);

    if (userStore.success)
      setApplicationDataAction({
        dispatch,
        applicationData: newDataObject,
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

    console.log("userStore", userStore);

    if (userStore.success) return userStore.data;
  } catch (error) {
    console.log("error", error);
  }
};
