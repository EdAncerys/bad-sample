import {
  authenticateAppAction,
  getUserDataByContactId,
  setFetchAction,
  fetchDataHandler,
} from "../index";

export const updateAddressAction = async ({
  state,
  dispatch,
  data,
  isActiveUser,
  refreshJWT,
}) => {
  // console.log("updateAddressAction triggered");
  const { contactid } = isActiveUser;

  const path = state.auth.APP_HOST + `/catalogue/data/contacts(${contactid})`;

  setFetchAction({ dispatch, isFetching: true });
  // --------------------------------------------------------------------------
  // 📌 STEP: Log onto the API server and get the Bearer token
  // --------------------------------------------------------------------------
  const jwt = await authenticateAppAction({ state, dispatch, refreshJWT });
  if (!jwt) throw new Error("Cannot logon to server.");

  try {
    const response = await fetchDataHandler({
      path,
      method: "PATCH",
      body: data,
      headers: {
        "Content-Type": "application/json",
        "if-Match": "*",
      },
      state,
    });

    const responseData = await response.json();
    if (!responseData) throw new Error("Error updating profile.");

    if (responseData.success) {
      await getUserDataByContactId({
        state,
        dispatch,
        jwt,
        contactid,
        refreshJWT,
      });
    }
  } catch (error) {
    // console.log("error", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
  }
};

export const updateEthnicityAction = async ({
  state,
  dispatch,
  data,
  isActiveUser,
}) => {
  // console.log("updateEthnicityAction triggered");
  if (!isActiveUser) throw new Error("isActiveUser is required");

  const { contactid } = isActiveUser;
  const path = state.auth.APP_HOST + `/catalogue/data/contacts(${contactid})`;

  // --------------------------------------------------------------------------
  // 📌 STEP: Log onto the API server and get the Bearer token
  // --------------------------------------------------------------------------

  try {
    const response = await fetchDataHandler({
      path,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "if-Match": "*",
      },
      body: data,
      state,
    });
    const responseData = await response.json();
    if (!responseData) throw new Error("Error updating profile.");

    if (responseData.success) {
      return responseData;
    }
  } catch (error) {
    // console.log("error", error);
  }
};
