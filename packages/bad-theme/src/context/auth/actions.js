import { setLoginModalAction, setFetchAction } from "../index";
import { handleSetCookie } from "../../helpers/cookie";

const COOKIE_NAME = "BAD-WebApp";

export const loginAction = async ({ state, dispatch, transId }) => {
  console.log("loginAction triggered");
  const URL = process.env.DYNAMICS_BRIDGE;

  setFetchAction({ dispatch, isFetching: true });
  if (!jwt) {
    console.log("Error. No JWT found");
    return;
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwt,
    },
    body: JSON.stringify({ transId }),
  };

  // --------------------------------------------------------------------------
  // 📌 STEP: Log onto the API server and get the Bearer token
  // --------------------------------------------------------------------------
  const jwt = await authenticateAppAction({ state });

  if ("token" in res) token = res.token;
  if (!jwt) throw new Error("Cannot logon to server.");

  console.log("Getting transId information....");
  let user = await fetch(
    "https://skylarkdev.digital/dynamicsbridge/redirect/CoreModule.aspx/trans",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
      },
      body: JSON.stringify({
        transId: transId,
      }),
    }
  );

  user = await user.json();

  setLoginModalAction({ dispatch, loginModalAction: false });
  state.context.isActiveUser = user;
  console.log("userInfo", user);

  // try {
  //   // const data = await fetch(URL, requestOptions);
  //   // const response = await data.json();
  //   // console.log(response);
  //   // if (response.data) {
  //   //   // handleSetCookie({ name: COOKIE_NAME, value: state.router.link });
  //   //   state.context.isActiveUser = response;
  //   //   seJWTAction({ dispatch, jwt });
  //   //   setFetchAction({ dispatch, isFetching: null });
  //   //   setLoginModalAction({ dispatch, loginModalAction: false });

  //   //   console.log("userInfo", response);
  //   //   return response;
  //   // } else {
  //   //   console.log(`Error. Response ${response}`);
  //   //   setFetchAction({ dispatch, isFetching: null });
  //   //   return null;
  //   // }

  //   let user = await fetch(
  //     "https://skylarkdev.digital/dynamicsbridge/redirect/CoreModule.aspx/trans",
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + jwt,
  //       },
  //       body: JSON.stringify({ transId }),
  //     }
  //   );

  //   user = await user.json();
  //   console.log(user);
  // } catch (error) {
  //   console.log("error", error);
  // }
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

  handleSetCookie({ name: COOKIE_NAME, deleteCookie: true });
  actions.router.set(`https://badadmin.skylarkdev.co`);
};

// SET CONTEXT ---------------------------------------------------
export const seJWTAction = ({ dispatch, jwt }) => {
  console.log("seJWTAction triggered"); //debug
  dispatch({ type: "SET_JWT_ACTION", payload: jwt });
};
