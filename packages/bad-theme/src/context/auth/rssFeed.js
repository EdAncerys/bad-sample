import { authenticateAppAction, setFetchAction } from "../index";

export const getBJDFeedAction = async ({ state, dispatch }) => {
  console.log("getBJDFeedAction triggered");

  setFetchAction({ dispatch, isFetching: true });
  const URL = state.auth.APP_HOST + `/rss/bjd?summary`;
  const jwt = await authenticateAppAction({ state });

  const requestOptions = {
    method: "GET",
    headers: { Authorization: `Bearer ${jwt}` },
  };

  try {
    const data = await fetch(URL, requestOptions);
    const result = await data.json();

    if (result.success) {
      const bjdFeed = result.data;

      setBJDFeedAction({ dispatch, bjdFeed });
      return bjdFeed;
    }
  } catch (error) {
    console.log("error", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
  }
};

// SET CONTEXT ---------------------------------------------------
export const setBJDFeedAction = ({ dispatch, bjdFeed }) => {
  console.log("setBJDFeedAction triggered"); //debug
  dispatch({ type: "SET_BJD_FEED_ACTION", payload: bjdFeed });
};
