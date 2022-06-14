import { fetchDataHandler } from "../context";

export const setAuthenticationCookieAction = async ({ state, b2cTaken }) => {
  // --------------------------------------------------------------------------------
  // 📌  Set server side cookie
  // --------------------------------------------------------------------------------
  let path = state.auth.APP_HOST + "/users/b2c/auth?token=" + b2cTaken;

  try {
    await fetchDataHandler({ path, state });
    // console.log("🍪 setAuthenticationCookieAction. 🍪", data); // debug
    return null;
  } catch (error) {
    // console.log("error", error);
  }
};
