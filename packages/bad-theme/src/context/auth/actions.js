import { setLoginModalAction, setFetchAction } from "../index";
import { handleSetCookie } from "../../helpers/cookie";
import {
  setGoToAction,
  getApplicationStatus,
  getUserApplicationAction,
} from "../index";

export const loginAction = async ({ state, dispatch, transId }) => {
  console.log("loginAction triggered");
  setFetchAction({ dispatch, isFetching: true });

  try {
    // --------------------------------------------------------------------------
    // 📌 STEP: Log onto the API server and get the Bearer token
    // --------------------------------------------------------------------------
    const jwt = await authenticateAppAction({ state, dispatch });
    if (!jwt) throw new Error("Cannot logon to server.");

    // --------------------------------------------------------------------------
    // 📌 STEP: Get User data from Dynamics
    // --------------------------------------------------------------------------
    const response = await getUserAction({ state, dispatch, jwt, transId });
    if (!response) throw new Error("Error login in.");

    setLoginModalAction({ dispatch, loginModalAction: false });
    setGoToAction({ state, path: `/dashboard`, actions });
    return response;
  } catch (error) {
    console.log("loginAction error", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
  }
};

export const authenticateAppAction = async ({ state }) => {
  console.log("authenticateAppAction triggered");

  const username = state.auth.APP_USERNAME;
  const password = state.auth.APP_PASSWORD;
  const URL = state.auth.APP_HOST + `/users/login`;

  const appCredentials = JSON.stringify({
    username,
    password,
  });

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: appCredentials,
  };

  try {
    const data = await fetch(URL, requestOptions);
    const response = await data.json();

    if (response.token) {
      // console.log("🐞 ", response.token); // debug
      return response.token;
    } else {
      return null;
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const getUserAction = async ({ state, dispatch, jwt, transId }) => {
  console.log("getUserAction triggered");

  try {
    const contactid = await getUserContactId({ state, dispatch, jwt, transId });
    if (!contactid) throw new Error("Error getting contactid.");

    const userData = await getUserDataByContactId({
      state,
      dispatch,
      jwt,
      contactid,
    });
    if (!userData) throw new Error("Error getting userData.");

    return userData;
  } catch (error) {
    console.log("error", error);
  }
};

export const getUserContactId = async ({ state, dispatch, jwt, transId }) => {
  console.log("getUserContactId triggered");

  const URL = state.auth.DYNAMICS_BRIDGE;
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwt,
    },
    body: JSON.stringify({ transId }),
  };
  // console.log(URL); // debug

  try {
    const data = await fetch(URL, requestOptions);
    const response = await data.json();
    if (response.success) {
      return response.data.user.contactid;
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const getUserDataByContactId = async ({
  state,
  dispatch,
  jwt,
  contactid,
}) => {
  console.log("getUserDataByContactId triggered");

  const URL = state.auth.APP_HOST + `/catalogue/data/contacts(${contactid})`;

  const requestOptions = {
    method: "GET",
    headers: { Authorization: "Bearer " + jwt },
  };

  try {
    const data = await fetch(URL, requestOptions);
    const response = await data.json();
    if (!response) throw new Error("Error getting userData.");

    // pre-fetch application data & populate to context store
    await getUserApplicationAction({ state, dispatch, contactid });

    // get application status against user in Dynamic
    const dynamicApps = await getApplicationStatus({
      state,
      dispatch,
      contactid,
    });
    if (!dynamicApps.apps.success)
      throw new Error("Error dynamicApps userData.");

    setActiveUserAction({ dispatch, isActiveUser: response });
    handleSetCookie({
      name: state.auth.COOKIE_NAME,
      value: { jwt, contactid },
    });
    seJWTAction({ dispatch, jwt });
    console.log("⬇️ user details successfully updated ⬇️ "); // debug
    return response;
  } catch (error) {
    console.log("error", error);
  }
};

export const getUserDataFromDynamics = async ({ state, jwt, contactid }) => {
  console.log("getUserDataByContactId triggered");

  const URL = state.auth.APP_HOST + `/catalogue/data/contacts(${contactid})`;

  const requestOptions = {
    method: "GET",
    headers: { Authorization: "Bearer " + jwt },
  };

  try {
    const data = await fetch(URL, requestOptions);
    const response = await data.json();
    if (!response) throw new Error("Error getting userData.");
    // console.log("⏬ FED data successfully fetched ⏬");
    // console.log(response);

    return response;
  } catch (error) {
    console.log("error", error);
  }
};

export const logoutAction = async ({ state, actions, dispatch }) => {
  console.log("logoutAction triggered");
  // ⬇️ stack order important to unmount components correctly
  handleSetCookie({ name: state.auth.COOKIE_NAME, deleteCookie: true });
  setGoToAction({ state, path: `/`, actions });

  seJWTAction({ dispatch, jwt: null });
  setActiveUserAction({ dispatch, isActiveUser: null });
};

// SET CONTEXT ---------------------------------------------------
export const seJWTAction = ({ dispatch, jwt }) => {
  console.log("seJWTAction triggered"); //debug
  dispatch({ type: "SET_JWT_ACTION", payload: jwt });
};
export const setActiveUserAction = ({ dispatch, isActiveUser }) => {
  console.log("setActiveUserAction triggered"); //debug
  dispatch({ type: "SET_ACTIVE_USER_ACTION", payload: isActiveUser });
};
