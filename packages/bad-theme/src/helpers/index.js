import { handleGetCookie, handleSetCookie } from "./cookie";
import { authenticateAppAction } from "../context";

export const authLogViaCookie = async ({ state, initialState }) => {
  const cookie = handleGetCookie({ name: `BAD-WebApp` });

  // handle API call to fetch user data
  if (cookie) {
    console.log("API to get user data", cookie);

    const URL =
      state.auth.APP_HOST + `/catalogue/data/contacts(${cookie.contactid})`;

    const requestOptions = {
      method: "GET",
      headers: { Authorization: "Bearer " + cookie.jwt },
    };

    try {
      const data = await fetch(URL, requestOptions);
      const response = await data.json();
      console.log(response);
      if (response) {
        initialState.isActiveUser = response;
        initialState.jwt = cookie.jwt;
        const taken = await authenticateAppAction({ state }); // replace taken with new one
        handleSetCookie({
          name: state.auth.COOKIE_NAME,
          value: { jwt: taken, contactid },
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  }
};
