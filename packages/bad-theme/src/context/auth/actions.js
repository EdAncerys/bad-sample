import { setLoginModalAction, setFetchAction } from "../index";
import { handleSetCookie } from "../../helpers/cookie";

const COOKIE_NAME = "BAD-WebApp";

export const loginAction = async ({ state, dispatch, transId }) => {
  console.log("loginAction triggered");

  // --------------------------------------------------------------------------
  // 📌 STEP: Log onto the API server and get the Bearer token
  // --------------------------------------------------------------------------
  const jwt = await authenticateAppAction({ state, dispatch });
  if (!jwt) throw new Error("Cannot logon to server.");

  // --------------------------------------------------------------------------
  // 📌 STEP: Get User data from Dynamics
  // --------------------------------------------------------------------------
  await getUserAction({ state, dispatch, jwt, transId });
};

export const authenticateAppAction = async ({ state, dispatch }) => {
  console.log("authenticateAppAction triggered");
  setFetchAction({ dispatch, isFetching: true });

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
    console.log(response);
    if (response.token) {
      return response.token;
    } else {
      return null;
    }
  } catch (error) {
    console.log("error", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
  }
};

export const getUserAction = async ({ state, dispatch, jwt, transId }) => {
  console.log("getUserAction triggered");

  const contactid = await getUserContactId({ state, dispatch, jwt, transId });
  await getUserDataByContactId({
    state,
    dispatch,
    jwt,
    contactid,
  });
};

export const getUserContactId = async ({ state, dispatch, jwt, transId }) => {
  console.log("getUserTransId triggered");
  setFetchAction({ dispatch, isFetching: true });

  const URL = state.auth.DYNAMICS_BRIDGE;
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwt,
    },
    body: JSON.stringify({ transId }),
  };

  try {
    const data = await fetch(URL, requestOptions);
    const response = await data.json();
    if (response.success) {
      return response.data.user.contactid;
    }
  } catch (error) {
    console.log("error", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
  }
};

export const getUserDataByContactId = async ({
  state,
  dispatch,
  jwt,
  contactid,
}) => {
  console.log("getUserDataByContactId triggered");
  setFetchAction({ dispatch, isFetching: true });

  const URL = state.auth.APP_HOST + `/catalogue/data/contacts(${contactid})`;

  const requestOptions = {
    method: "GET",
    headers: { Authorization: "Bearer " + jwt },
  };

  try {
    const data = await fetch(URL, requestOptions);
    const response = await data.json();
    if (response) {
      // handleSetCookie({ name: COOKIE_NAME, value: state.router.link });
      state.context.isActiveUser = response;
      seJWTAction({ dispatch, jwt });
      setLoginModalAction({ dispatch, loginModalAction: false });
    }
  } catch (error) {
    console.log("error", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
  }
};

export const logoutAction = async ({ state, actions, dispatch }) => {
  console.log("logoutAction triggered");

  seJWTAction({ dispatch, jwt: null });
  state.context.isActiveUser = null;

  handleSetCookie({ name: COOKIE_NAME, deleteCookie: true });
  actions.router.set(`https://badadmin.skylarkdev.co`);
};

// SET CONTEXT ---------------------------------------------------
export const seJWTAction = ({ dispatch, jwt }) => {
  console.log("seJWTAction triggered"); //debug
  dispatch({ type: "SET_JWT_ACTION", payload: jwt });
};
