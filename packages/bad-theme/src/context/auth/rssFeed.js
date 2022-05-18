import { setFetchAction, fetchDataHandler } from "../index";

export const getBJDFeedAction = async ({ state, dispatch }) => {
  // console.log("getBJDFeedAction triggered");

  setFetchAction({ dispatch, isFetching: true });
  const path = state.auth.APP_HOST + `/rss/bjd`;

  try {
    const data = await fetchDataHandler({ path, state });

    if (!data) throw new Error("Error getting data.");
    const result = await data.json();

    if (result.success) {
      const bjdFeed = result.data.item;

      setBJDFeedAction({ dispatch, bjdFeed });
      return bjdFeed;
    }
  } catch (error) {
    // console.log("error", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
  }
};

export const getCEDFeedAction = async ({ state, dispatch }) => {
  // console.log("getCEDFeedAction triggered");

  setFetchAction({ dispatch, isFetching: true });
  const path = state.auth.APP_HOST + `/rss/ced`;

  try {
    const data = await fetchDataHandler({ path, state });
    if (!data) throw new Error("Error getting data.");
    const result = await data.json();

    if (result.success) {
      const cedFeed = result.data.item;

      setCEDFeedAction({ dispatch, cedFeed });
      return cedFeed;
    }
  } catch (error) {
    // console.log("error", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
  }
};

export const getSHDFeedAction = async ({ state, dispatch }) => {
  // console.log("getSHDFeedAction triggered");

  setFetchAction({ dispatch, isFetching: true });
  const path = state.auth.APP_HOST + `/rss/shd`;

  try {
    const data = await fetchDataHandler({ path, state });
    if (!data) throw new Error("Error getting data.");
    const result = await data.json();

    if (result.success) {
      const shdFeed = result.data.item;

      setSHDFeedAction({ dispatch, shdFeed });
      return shdFeed;
    }
  } catch (error) {
    // console.log("error", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
  }
};

// SET CONTEXT ---------------------------------------------------
export const setBJDFeedAction = ({ dispatch, bjdFeed }) => {
  // console.log("setBJDFeedAction triggered"); //debug
  dispatch({ type: "SET_BJD_FEED_ACTION", payload: bjdFeed });
};
export const setCEDFeedAction = ({ dispatch, cedFeed }) => {
  // console.log("setCEDFeedAction triggered"); //debug
  dispatch({ type: "SET_CED_FEED_ACTION", payload: cedFeed });
};
export const setSHDFeedAction = ({ dispatch, shdFeed }) => {
  // console.log("setSHDFeedAction triggered"); //debug
  dispatch({ type: "SET_SHD_FEED_ACTION", payload: shdFeed });
};
