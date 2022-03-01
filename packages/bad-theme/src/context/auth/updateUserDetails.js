import {
  authenticateAppAction,
  getUserDataByContactId,
  setFetchAction,
} from "../index";

export const updateAddressAction = async ({
  state,
  dispatch,
  data,
  isActiveUser,
}) => {
  console.log("updateAddressAction triggered");
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

export const updateEthnicityAction = async ({ state, data, isActiveUser }) => {
  console.log("updateEthnicityAction triggered");
  const { contactid } = isActiveUser;

  const URL = state.auth.APP_HOST + `/catalogue/data/contacts(${contactid})`;

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
    body: JSON.stringify({ py3_ethnicity: data }),
  };

  try {
    const data = await fetch(URL, requestOptions);
    const response = await data.json();
    if (response.success) {
      console.log("⬇️ user recorded successfully updated", response);
      return response;
    }
  } catch (error) {
    console.log("error", error);
  }
};
