import { authenticateAppAction, setFetchAction } from "../index";

export const getRSSFeedAction = async ({ state, dispatch }) => {
  console.log("getRSSFeedAction triggered");

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
      const rssFeed = result.data;

      setRSSFeedAction({ dispatch, rssFeed });
      return rssFeed;
    }
  } catch (error) {
    console.log("error", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
  }
};

// SET CONTEXT ---------------------------------------------------
export const setRSSFeedAction = ({ dispatch, rssFeed }) => {
  console.log("setRSSFeedAction triggered"); //debug
  dispatch({ type: "SET_RSS_FEED_ACTION", payload: rssFeed });
};
