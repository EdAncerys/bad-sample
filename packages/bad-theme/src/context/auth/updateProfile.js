import {
  authenticateAppAction,
  getUserDataByContactId,
  setFetchAction,
} from "../index";

export const updateProfileAction = async ({
  state,
  dispatch,
  data,
  isActiveUser,
}) => {
  console.log("updateProfileAction triggered");
  const { contactid } = isActiveUser;

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
    if (!response) throw new Error("Error updating profile.");

    if (response.success) {
      console.log("⬇️ profile details successfully updated ⬇️ "); // debug
      console.log(response); // debug
      // update user profile in context
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
