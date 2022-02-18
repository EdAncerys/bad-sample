import { authenticateAppAction } from "../index";

export const directDebit = async ({ state, doi }) => {
  console.log("directDebit triggered");

  const URL = state.auth.APP_HOST + `/wiley`;
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

    // console.log("directDebit wiley", wiley); // debug

    if (wiley.success) return wiley.data;
    return null;
  } catch (error) {
    console.log("error", error);
  }
};
