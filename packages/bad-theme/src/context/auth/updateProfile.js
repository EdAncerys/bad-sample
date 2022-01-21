import {
  authenticateAppAction,
  getUserDataByContactId,
  setFetchAction,
} from "../index";

export const updateProfileAction = async ({ state, dispatch, data }) => {
  console.log("updateProfileAction triggered");
  const user = state.context.isActiveUser;
  const { contactid } = user;

  const URL = state.auth.APP_HOST + `/catalogue/data/contacts(${contactid})`;

  setFetchAction({ dispatch, isFetching: true });
  // --------------------------------------------------------------------------
  // 📌 STEP: Log onto the API server and get the Bearer token
  // --------------------------------------------------------------------------
  const jwt = await authenticateAppAction({ state });
  if (!jwt) throw new Error("Cannot logon to server.");

  const requestOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "if-Match": "*",
      Authorization: "Bearer " + jwt,
    },
    body: JSON.stringify(data),
  };

  try {
    const data = await fetch(URL, requestOptions);
    const response = await data.json();
    if (response.success) {
      await getUserDataByContactId({
        state,
        dispatch,
        jwt,
        contactid,
      });
    }
  } catch (error) {
    console.log("error", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
  }
};