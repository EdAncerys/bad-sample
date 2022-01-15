import { setLoginModalAction } from "../index";
import { handleSetCookie } from "../../helpers/cookie";

const LOGIN_COOKIE = "BAD-WebApp";
const REDIRECT_URL = `https://bad-uat.powerappsportals.com/SignIn?returnUrl=%2fhandshake%3faction%3dlogin%2f`;

export const loginAction = async ({ state, dispatch, loginData }) => {
  console.log("loginAction triggered");

  const jwt = await authenticateAppAction({ state });
  // window.location.assign(REDIRECT_URL); // redirects to external website

  // fetch call to separate API to retrieve user data
  // user data from API
  if (jwt) {
    handleSetCookie({ name: LOGIN_COOKIE, value: state.router.link });
    state.context.isActiveUser = jwt;
    seJWTAction({ dispatch, jwt });
    setLoginModalAction({ dispatch, loginModalAction: false });
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
    console.log(response);
    if (response.token) {
      return response.token;
    } else {
      return null;
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const logoutAction = async ({ state, actions, dispatch }) => {
  console.log("logoutAction triggered");

  seJWTAction({ dispatch, jwt: null });
  state.context.isActiveUser = null;

  handleSetCookie({ name: LOGIN_COOKIE, deleteCookie: true });
  actions.router.set(`https://badadmin.skylarkdev.co`);
};

// SET CONTEXT ---------------------------------------------------
export const seJWTAction = ({ dispatch, jwt }) => {
  console.log("seJWTAction triggered"); //debug
  dispatch({ type: "SET_JWT_ACTION", payload: jwt });
};
