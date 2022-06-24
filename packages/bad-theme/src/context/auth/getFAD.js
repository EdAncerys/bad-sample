import { setFetchAction, fetchDataHandler } from "../index";

export const getFadAction = async ({ state, dispatch, page }) => {
  // console.log("getFadAction triggered");

  let perPage = 15;
  let skip = page ? page * perPage : 0; // define skip for pagination

  try {
    setFetchAction({ dispatch, isFetching: true });

    // while result length is equal perPage, then fetch next page
    let path =
      state.auth.APP_HOST + `/catalogue/md?limit=${perPage}&skip=${skip}&md`;
    const data = await fetchDataHandler({ path, state });

    if (!data) throw new Error("error fetching data form API");
    const result = await data.json();
    // console.log("🐞 MD LENGTH", result.data.length); // debug

    return result.data;
  } catch (error) {
    // console.log("error", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
  }
};

export const getFADSearchAction = async ({ state, query }) => {
  // console.log("getFADSearchAction triggered");

  // 📌 remove invalid url characters from query string
  let validString = query.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");

  try {
    // while result length is equal perPage, then fetch next page
    let path = state.auth.APP_HOST + `/catalogue/md?md&search=${validString}`;
    const data = await fetchDataHandler({ path, state });
    if (!data) throw new Error("error fetching data form API");
    const result = await data.json();

    return result.data;
  } catch (error) {
    // console.log("error", error);
  }
};

export const getAllFadAction = async ({ state, dispatch, page }) => {
  // console.log("getFadAction triggered");

  let skip = page || 0;
  let perPage = 100;
  let postData = [];
  let responseLength = perPage;

  try {
    while (responseLength === perPage) {
      // while result length is equal perPage, then fetch next page
      let path =
        state.auth.APP_HOST + `/catalogue/md?limit=${perPage}&skip=${skip}`;
      const data = await fetchDataHandler({ path, state });
      if (!data) throw new Error("error fetching data form API");
      const result = await data.json();

      responseLength = result.data.length;
      skip++;
      // spread response to postData equal to previous postData + new response
      postData = [...postData, ...result.data];
    }

    return postData;
  } catch (error) {
    // console.log("error", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
  }
};

// SET CONTEXT ---------------------------------------------------
export const setFadAction = ({ dispatch, fad }) => {
  // console.log("setFadAction triggered"); //debug
  dispatch({ type: "SET_FAD_ACTION", payload: fad });
};
