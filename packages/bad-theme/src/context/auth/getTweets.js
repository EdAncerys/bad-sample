import {
  authenticateAppAction,
  setFetchAction,
  setEnquireAction,
} from "../index";

export const getTweetsAction = async ({ state, dispatch }) => {
  console.log("getTweetsAction triggered");

  setFetchAction({ dispatch, isFetching: true });
  const URL = state.auth.APP_HOST + `/twitter/tweets?limit=3`;
  const jwt = await authenticateAppAction({ state });

  const requestOptions = {
    method: "GET",
    headers: { Authorization: `Bearer ${jwt}` },
  };

  try {
    const data = await fetch(URL, requestOptions);
    const tweets = await data.json();

    setFetchAction({ dispatch, isFetching: null });
    setTweetsAction({ dispatch, tweets });
  } catch (error) {
    console.log("error", error);
    setFetchAction({ dispatch, isFetching: null });
  }
};

// SET CONTEXT ---------------------------------------------------
export const setTweetsAction = ({ dispatch, tweets }) => {
  console.log("setTweetsAction triggered"); //debug
  dispatch({ type: "SET_TWEETS_ACTION", payload: tweets });
};
