import { setUserStoreAction, fetchDataHandler } from "../index";

export const createApplicationRecord = async ({
  state,
  dispatch,
  isActiveUser,
}) => {
  // console.log("createApplicationRecord triggered");

  // ⏬⏬  check if user application already exist ⏬⏬
  const userStoreData = await getUserStoreAction({
    state,
    isActiveUser,
    dispatch,
  });

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
  const path =
    state.auth.APP_HOST +
    `/catalogue/data/core_membershipapplications(${contactid})`;

  try {
    const data = await fetchDataHandler({
      path,
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      state,
    });

    const result = await data.json();

    if (result.success) {
      // ⏬  getting new user record ⏬
      const applicationData = await getApplicationRecord({ contactid });

      await setUserStoreAction({
        state,
        actions,
        dispatch,
        isActiveUser,
        data: applicationData,
      });
    }
  } catch (error) {
    // console.log("error", error);
  }
};

export const getApplicationRecord = async ({ contactid }) => {
  // console.log("getApplicationRecord triggered");

  const path =
    state.auth.APP_HOST +
    `/catalogue/data/core_membershipapplications(${contactid})`;

  try {
    const data = await fetchDataHandler({ path, state });
    const result = await data.json();

    // console.log("getApplicationRecord result", result); // debug

    if (result.success) {
      return result;
    }
    return null;
  } catch (error) {
    // console.log("error", error);
  }
};
