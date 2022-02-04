import { authenticateAppAction, setFetchAction } from "../index";

export const getWileyAction = async ({ state, dispatch, doi }) => {
  console.log("getWileyAction triggered");

  // setFetchAction({ dispatch, isFetching: true });
  const URL = state.auth.APP_HOST + `/wiley`;
  const jwt = await authenticateAppAction({ state });

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ doi: "10.1038/ncomms8983" }),
  };

  try {
    const data = await fetch(URL, requestOptions);
    const wiley = await data.json();

    if (wiley.success) return wiley.data;
    return null;
  } catch (error) {
    console.log("error", error);
  } finally {
    // setFetchAction({ dispatch, isFetching: false });
  }
};
