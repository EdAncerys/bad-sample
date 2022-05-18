import { fetchDataHandler } from "../index";

export const getTestUserAccountsAction = async ({ state, dispatch }) => {
  // console.log("getTestUserAccountsAction triggered");

  const path =
    state.auth.APP_HOST +
    `/catalogue/data/contacts?$filter=firstname eq 'Andy'`;

  try {
    const data = await fetchDataHandler({ path, state });

    const result = await data.json();
    if (!result) throw new Error("Error getting userData.");

    if (result.value) return result.value;
    return null;
  } catch (error) {
    // console.log("error", error);
  }
};
