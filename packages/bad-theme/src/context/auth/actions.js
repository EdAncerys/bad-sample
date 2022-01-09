import { setLoginModalAction } from "../index";

export const loginAction = async ({ state, dispatch, loginData }) => {
  console.log("loginAction triggered");

  const jwt = authenticateAppAction({ state });
  const user = { user: "user", jwt };
  if (jwt) {
    setUserAction({ dispatch, user });
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

// SET CONTEXT ---------------------------------------------------
export const setUserAction = ({ dispatch, user }) => {
  console.log("setUserAction triggered"); //debug
  dispatch({ type: "SET_USER_ACTION", payload: user });
};

export const seJWTAction = ({ dispatch, jwt }) => {
  console.log("seJWTAction triggered"); //debug
  dispatch({ type: "SET_JWT_ACTION", payload: jwt });
};
