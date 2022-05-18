import { fetchDataHandler } from "../context";

export const setAuthenticationCookieAction = async ({ state, b2cTaken }) => {
  let path =
    state.auth.APP_HOST + "/dynamicstest/users/b2c/auth?token=" + b2cTaken;

  const response = await fetchDataHandler({ path, state });
  const data = await response.json();

  console.log("🍪 setAuthenticationCookieAction. 🍪", data); // debug
};
