import { handleSetCookie } from "../../helpers/cookie";
import {
  setGoToAction,
  getApplicationStatus,
  getUserApplicationAction,
  setFetchAction,
  setLoginModalAction,
} from "../index";

export const loginActionViaModal = async ({
  state,
  dispatch,
  transId,
  refreshJWT,
}) => {
  console.log("loginAction triggered");
  setFetchAction({ dispatch, isFetching: true });

  try {
    // --------------------------------------------------------------------------
    // 📌 STEP: Log onto the API server and get the Bearer token
    // --------------------------------------------------------------------------
    const jwt = await authenticateAppAction({ state, dispatch, refreshJWT });
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
export const loginAction = async ({ state }) => {
  console.log("loginAction triggered");

  try {
    // 📌 auth B2c redirect url based on App default url
    const redirectPath = `&redirect_uri=${state.auth.APP_URL}/codecollect`;
    // --------------------------------------------------------------------------------
    // 📌  B2C login auth path endpoint
    // --------------------------------------------------------------------------------

    const url =
      state.auth.B2C +
      `${redirectPath}&scope=openid&response_type=id_token&prompt=login`;
    const urlPath = state.router.link;

    // get current url path and store in cookieValue
    handleSetCookie({
      name: "loginPath",
      value: urlPath,
      days: 1,
    });

    // redirect to B2C auth set window location to login page
    window.location.href = url;
  } catch (error) {
    console.log("loginAction error", error);
  }
};

export const authenticateAppAction = async ({
  state,
  dispatch,
  refreshJWT,
}) => {
  console.log("authenticateAppAction triggered");

  try {
    // check if refresh token is set & valid if so use it
    if (refreshJWT) {
      console.log("🐞 APP HAVE REFRESH JWT");
      // authenticate via refresh token
      // replace app tokens with response object
    }

    // if refresh taken is not valid or null auth via app credentials
    if (!refreshJWT) {
      console.log("🐞 NO REFRESH JWT FOUND"); // debug
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

      const data = await fetch(URL, requestOptions);
      const response = await data.json();
      // console.log("🐞 ", response); // debug

      if (response.token) {
        return response.token;
      } else {
        return null;
      }
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
      refreshJWT,
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
  refreshJWT,
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
      refreshJWT,
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

export const getUserDataByEmail = async ({
  state,
  dispatch,
  email,
  refreshJWT,
}) => {
  console.log("getUserDataByEmail triggered");

  const URL =
    state.auth.APP_HOST +
    `/catalogue/data/contacts?$filter=emailaddress1 eq '${email}'`;

  try {
    const jwt = await authenticateAppAction({ state, dispatch, refreshJWT });
    if (!jwt) throw new Error("Cannot logon to server.");

    const requestOptions = {
      method: "GET",
      headers: { Authorization: "Bearer " + jwt },
    };

    const data = await fetch(URL, requestOptions);
    if (!data) throw new Error("Error getting userData.");
    const response = await data.json();

    if (response.value.length > 0) {
      const userData = response.value[0];
      const { contactid } = userData;

      // pre-fetch application data & populate to context store
      await getUserApplicationAction({ state, dispatch, contactid });
      // get application status against user in Dynamic
      const dynamicApps = await getApplicationStatus({
        state,
        dispatch,
        contactid,
        refreshJWT,
      });
      if (!dynamicApps.apps.success)
        throw new Error("Error dynamicApps userData.");

      setActiveUserAction({ dispatch, isActiveUser: userData });
      handleSetCookie({
        name: state.auth.COOKIE_NAME,
        value: { jwt, contactid },
      });
      console.log("⬇️ user data successfully fetched ⬇️ "); // debug
      console.log(userData); // debug
      return userData;
    }

    return null;
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
