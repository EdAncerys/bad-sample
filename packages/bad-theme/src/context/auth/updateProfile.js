import { setLoginModalAction, setFetchAction } from "../index";

export const loginAction = async ({ state, dispatch, transId }) => {
  console.log("loginAction triggered");

  const URL = state.auth.DYNAMICS_BRIDGE;

  setFetchAction({ dispatch, isFetching: true });
  // --------------------------------------------------------------------------
  // 📌 STEP: Log onto the API server and get the Bearer token
  // --------------------------------------------------------------------------
  const jwt = await authenticateAppAction({ state });
  if (!jwt) throw new Error("Cannot logon to server.");

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
    console.log("data", data);
    const response = await data.json();
    console.log("response", response);
    if (response.success) {
      // handleSetCookie({ name: COOKIE_NAME, value: state.router.link });
      state.context.isActiveUser = response.data;
      seJWTAction({ dispatch, jwt });
      setFetchAction({ dispatch, isFetching: null });
      setLoginModalAction({ dispatch, loginModalAction: false });
    }
  } catch (error) {
    console.log("error", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
  }
};
