import { fetchDataHandler } from "../context";

export const getFadPermision = async ({ state, contactid }) => {
  // --------------------------------------------------------------------------------
  // 📌  Get FAD dir permision levvel
  // --------------------------------------------------------------------------------
  let path = state.auth.APP_HOST + `/catalogue/fad/check/${contactid}`;

  try {
    if (!contactid) throw new Error("User contact id not provided");

    const response = await fetchDataHandler({ path, state });
    const data = await response.json();

    if (data && data.success) return data.FAD;

    return null;
  } catch (error) {
    // console.log("error", error);
  }
};
