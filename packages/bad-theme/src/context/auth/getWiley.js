import { authenticateAppAction } from "../index";

export const getWileyAction = async ({
  state,
  dispatch,
  doi,
  isActiveUser,
  isFullAccess,
  url,
  refreshJWT,
}) => {
  console.log("getWileyAction triggered");

  let isValidId = "";
  // get wiley link for BAD members
  if (isActiveUser) {
    isValidId = isActiveUser.contactid;
  }

  const URL = state.auth.APP_HOST + `/wiley?contactid=${isValidId}`;
  const jwt = await authenticateAppAction({ state, dispatch, refreshJWT });
  let body = JSON.stringify({ doi: `doi/${doi}` }); // individual post access auth link
  if (isFullAccess) body = JSON.stringify({ target: url }); // full access auth link

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body,
  };

  try {
    const data = await fetch(URL, requestOptions);
    const wiley = await data.json();

    console.log("🐞 ", wiley); // debug
    if (wiley.success) return wiley.data;

    return null;
  } catch (error) {
    console.log("error", error);
  }
};
