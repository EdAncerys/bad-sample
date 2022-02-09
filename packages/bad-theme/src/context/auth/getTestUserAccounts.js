import { authenticateAppAction } from "../index";

export const getTestUserAccountsAction = async ({ state }) => {
  console.log("getTestUserAccountsAction triggered");

  const URL =
    state.auth.APP_HOST +
    `/catalogue/data/contacts?$filter=firstname eq 'Andy'`;
  const jwt = await authenticateAppAction({ state });

  const requestOptions = {
    method: "GET",
    headers: { Authorization: `Bearer ${jwt}` },
  };

  try {
    const data = await fetch(URL, requestOptions);
    const result = await data.json();

    console.log("getTestUserAccountsAction result", result); // debug

    if (result.value) return result.value;
    return null;
  } catch (error) {
    console.log("error", error);
  }
};
