import { authenticateAppAction, setUserStoreAction } from "../index";

export const createApplicationRecord = async ({
  state,
  dispatch,
  isActiveUser,
}) => {
  console.log("createApplicationRecord triggered");

  // ⏬⏬  check if user application already exist ⏬⏬
  const userStoreData = await getUserStoreAction({ state, isActiveUser });
  if (userStoreData) {
    await setUserStoreAction({
      state,
      actions,
      dispatch,
      isActiveUser,
      data: userStoreData,
    });
    return;
  }

  const { contactid } = isActiveUser;

  // ⏬⏬  creating new user record ⏬⏬
  const URL =
    state.auth.APP_HOST +
    `/catalogue/data/core_membershipapplications(${contactid})`;
  const jwt = await authenticateAppAction({ state });

  const requestOptions = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const data = await fetch(URL, requestOptions);
    const result = await data.json();

    // console.log("createApplicationRecord result", result); // debug

    if (result.success) {
      // ⏬  getting new user record ⏬
      const applicationData = await getApplicationRecord({ jwt, contactid });

      await setUserStoreAction({
        state,
        actions,
        dispatch,
        isActiveUser,
        data: applicationData,
      });
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const getApplicationRecord = async ({ jwt, contactid }) => {
  console.log("getApplicationRecord triggered");

  const URL =
    state.auth.APP_HOST +
    `/catalogue/data/core_membershipapplications(${contactid})`;

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  };

  try {
    const data = await fetch(URL, requestOptions);
    const result = await data.json();

    // console.log("getApplicationRecord result", result); // debug

    if (result.success) {
      return result;
    }
    return null;
  } catch (error) {
    console.log("error", error);
  }
};
