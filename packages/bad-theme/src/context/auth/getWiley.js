import { fetchDataHandler } from "../index";

export const getWileyAction = async ({
  state,
  dispatch,
  doi,
  isActiveUser,
  isFullAccess,
  url,
}) => {
  // console.log("getWileyAction triggered");

  let isValidId = "";
  // get wiley link for BAD members
  if (isActiveUser) {
    isValidId = isActiveUser.contactid;
  }

  const path = state.auth.APP_HOST + `/wiley?contactid=${isValidId}`;
  let body = { doi: `doi/${doi}` }; // individual post access auth link
  if (isFullAccess) body = { target: url }; // full access auth link

  try {
    const data = await fetchDataHandler({
      path,
      method: "POST",
      body,
      state,
    });

    const wiley = await data.json();
    if (wiley.success) return wiley.data;

    return null;
  } catch (error) {
    // console.log("error", error);
  }
};
