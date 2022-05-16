import { handleSetCookie, handleGetCookie } from "../../helpers/cookie";
import {
  setGoToAction,
  getApplicationStatus,
  getUserApplicationAction,
  setFetchAction,
  setLoginModalAction,
  fetchDataHandler,
} from "../index";

// --------------------------------------------------------------------------------
// 📌 INITIALIZE APP TAKEN via atom STATE
// --------------------------------------------------------------------------------

export const loginActionViaModal = async ({ state, dispatch, transId }) => {
  // console.log("loginAction triggered");
  setFetchAction({ dispatch, isFetching: true });

  try {
    // --------------------------------------------------------------------------
    // 📌 STEP: Log onto the API server and get the Bearer token
    // --------------------------------------------------------------------------

    // --------------------------------------------------------------------------
    // 📌 STEP: Get User data from Dynamics
    // --------------------------------------------------------------------------
    const response = await getUserAction({ state, dispatch, transId });
    if (!response) throw new Error("Error login in.");

    setLoginModalAction({ dispatch, loginModalAction: false });
    setGoToAction({ state, path: `/dashboard`, actions });
    return response;
  } catch (error) {
    // console.log("loginAction error", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
  }
};

export const loginAction = async ({ state }) => {
  // console.log("loginAction triggered");

  try {
    // --------------------------------------------------------------------------------
    // 📌  B2C login auth path endpoint
    // --------------------------------------------------------------------------------
    // 📌 auth B2c redirect url based on App default url
    const redirectPath = `&redirect_uri=${state.auth.APP_URL}/codecollect`;
    let action = "login";

    const url =
      state.auth.B2C +
      `${redirectPath}&scope=openid&response_type=id_token&prompt=${action}`;
    const urlPath = state.router.link;
    console.log("LOGIN path + REDIRECT", redirectPath);
    // get current url path and store in cookieValue
    handleSetCookie({ name: "loginPath", value: urlPath });

    // redirect to B2C auth set window location to login page
    window.location.href = url;
  } catch (error) {
    // console.log("loginAction error", error);
  }
};

export const authenticateAppAction = async ({ state, dispatch }) => {
  // console.log("authenticateAppAction triggered");
  let contactid = null;
  let refreshTaken = null;
  let appTaken = null;

  // check if cookie is present and if so get the tokens
  const cookieValue = handleGetCookie({ name: state.auth.AUTH_COOKIE });
  if (cookieValue) {
    refreshTaken = cookieValue.refreshTaken;
    appTaken = cookieValue.appJWT;
    contactid = cookieValue.contactid;
  }

  try {
    // 📌 if refresh token is not valid or null auth via app credentials
    if (!appTaken) {
      // console.log("🐞 REFRESH TAKEN NOT PRESENT OR NOT VALID"); // debug
      const username = state.auth.APP_USERNAME;
      const password = state.auth.APP_PASSWORD;
      let path = state.auth.APP_HOST + `/users/login`;

      const data = await fetchDataHandler({
        path,
        method: "POST",
        body: {
          username,
          password,
        },
        headers: { "Content-Type": "application/json" },
        state,
      });
      const response = await data.json();

      if (response.success) {
        const jwt = response.data.AuthenticationResult.RefreshToken;
        refreshTaken = jwt;
        appTaken = response.token;

        // 📌 set cookie for refresh token and app token
        handleSetCookie({
          name: state.auth.AUTH_COOKIE,
          value: {
            refreshTaken: refreshTaken,
            appJWT: appTaken,
          },
          days: 1,
        });
        // 📌 replace WebApp cookie
        handleSetCookie({
          name: state.auth.COOKIE_NAME,
          value: { jwtL: appTaken, contactid },
        });
      }
    }

    return appTaken;
  } catch (error) {
    // console.log("error", error);
  }
};

export const getUserAction = async ({ state, dispatch, transId }) => {
  // console.log("getUserAction triggered");

  try {
    const contactid = await getUserContactId({ state, dispatch, transId });
    if (!contactid) throw new Error("Error getting contactid.");

    const userData = await getUserDataByContactId({
      state,
      dispatch,
      contactid,
    });
    if (!userData) throw new Error("Error getting userData.");

    return userData;
  } catch (error) {
    // console.log("error", error);
  }
};

export const getUserContactId = async ({ state, dispatch, transId }) => {
  // console.log("getUserContactId triggered");

  const path = state.auth.DYNAMICS_BRIDGE;

  try {
    const data = await fetchDataHandler({
      path,
      method: "POST",
      body: { transId },
      headers: { "Content-Type": "application/json" },
      state,
    });
    const response = await data.json();
    if (response.success) {
      return response.data.user.contactid;
    }
  } catch (error) {
    // console.log("error", error);
  }
};

export const getUserDataByContactId = async ({
  state,
  dispatch,
  contactid,
}) => {
  // console.log("getUserDataByContactId triggered");

  const path = state.auth.APP_HOST + `/catalogue/data/contacts(${contactid})`;

  try {
    const data = await fetchDataHandler({ path, state });
    if (!data) throw new Error("Error getting userData.");
    const response = await data.json();

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

    return response;
  } catch (error) {
    // console.log("error", error);
  }
};

export const getUserDataByEmail = async ({ state, dispatch, email }) => {
  // console.log("getUserDataByEmail triggered");

  console.log("🐞 APP_HOST PATH ALTERED");
  const path = `https://uatservices.bad.org.uk/dynamicstest/catalogue/data/contacts?$filter=emailaddress1 eq '${email}'`;
  // const path =
  //   state.auth.APP_HOST +
  //   `/catalogue/data/contacts?$filter=emailaddress1 eq '${email}'`;

  try {
    const data = await fetchDataHandler({ path, state });
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
      });
      if (!dynamicApps.apps.success)
        throw new Error("Error dynamicApps userData.");

      setActiveUserAction({ dispatch, isActiveUser: userData });
      return userData;
    }

    return null;
  } catch (error) {
    // console.log("error", error);
  }
};

export const getUserDataFromDynamics = async ({ state, contactid }) => {
  // console.log("getUserDataFromDynamics triggered");

  const path = state.auth.APP_HOST + `/catalogue/data/contacts(${contactid})`;

  try {
    const data = await fetchDataHandler({ path, state });

    const response = await data.json();
    if (!response) throw new Error("Error getting userData.");
    // console.log("⏬ FED data successfully fetched ⏬");
    // console.log(response);

    return response;
  } catch (error) {
    // console.log("error", error);
  }
};

export const logoutAction = async ({ state, actions, dispatch }) => {
  // console.log("logoutAction triggered");
  // ⬇️ stack order important to unmount components correctly
  // 🍪 delete stored cookies
  handleSetCookie({ name: state.auth.COOKIE_NAME, deleteCookie: true });
  handleSetCookie({ name: state.auth.AUTH_COOKIE, deleteCookie: true });
  handleSetCookie({ name: "badAuth", deleteCookie: true });

  // reddirect user to home page
  setGoToAction({ state, path: `/`, actions });

  seJWTAction({ dispatch, jwt: null });
  setActiveUserAction({ dispatch, isActiveUser: null });
};

// SET CONTEXT ---------------------------------------------------
export const seJWTAction = ({ dispatch, jwt }) => {
  // console.log("seJWTAction triggered"); //debug
  dispatch({ type: "SET_JWT_ACTION", payload: jwt });
};
export const setActiveUserAction = ({ dispatch, isActiveUser }) => {
  // console.log("setActiveUserAction triggered"); //debug
  dispatch({ type: "SET_ACTIVE_USER_ACTION", payload: isActiveUser });
};
