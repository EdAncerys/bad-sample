import { fetchDataHandler } from "../context";

export const setAuthenticationCookieAction = async ({ state, b2cTaken }) => {
  let path = state.auth.APP_HOST + "/users/b2c/auth?token=" + b2cTaken;

  await fetchDataHandler({ path, state });
  // console.log("🍪 setAuthenticationCookieAction. 🍪", data); // debug
  return null;
};
