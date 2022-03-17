import { authenticateAppAction } from "../index";

export const getWileyAction = async ({ state, doi, isActiveUser }) => {
  console.log("getWileyAction triggered");

  let isValidId = "";
  // get wiley link for BAD members
  if (isActiveUser) {
    isValidId = isActiveUser.contactid;
  }

  const URL = state.auth.APP_HOST + `/wiley?contactid=${isValidId}`;
  const jwt = await authenticateAppAction({ state });

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ doi: `doi/${doi}` }),
  };

  try {
    const data = await fetch(URL, requestOptions);
    const wiley = await data.json();
    // console.log("getWileyAction wiley", wiley); // debug
    // if (wiley.tps) console.log("secure link 👌 wia wileys"); // debug

    if (wiley.success) return wiley.data;
    return null;
  } catch (error) {
    console.log("error", error);
  }
};
