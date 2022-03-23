import { authenticateAppAction, setFetchAction } from "../index";

export const getFadAction = async ({ state, dispatch }) => {
  console.log("getFadAction triggered");

  let skip = 0;
  let perPage = 20;
  let postData = [];
  let responseLength = perPage;

  try {
    const jwt = await authenticateAppAction({ state });
    if (!jwt) throw new Error("error authenticating app");

    const requestOptions = {
      method: "GET",
      headers: { Authorization: `Bearer ${jwt}` },
    };

    // const URL = state.auth.APP_HOST + `/catalogue/fad?limit=${perPage}&skip=${skip}`;
    // setFetchAction({ dispatch, isFetching: true });
    // const data = await fetch(URL, requestOptions);
    // const result = await data.json();

    while (responseLength === perPage) {
      // while result length is equal perPage, then fetch next page
      let URL =
        state.auth.APP_HOST + `/catalogue/fad?limit=${perPage}&skip=${skip}`;
      const data = await fetch(URL, requestOptions);
      if (!data) throw new Error("error fetching data form API");
      const result = await data.json();

      console.log("length", postData.length);
      console.log("result", result);

      responseLength = result.length;
      skip++;
      // spread response to postData equal to previous postData + new response
      postData = [...postData, ...result.data];
    }

    // if (result.success) {
    //   const fad = result.data;
    //   console.log("⏬ FED data successfully fetched ⏬");
    //   // console.log(fad);

    //   return fad;
    // }
  } catch (error) {
    console.log("error", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
  }
};

// SET CONTEXT ---------------------------------------------------
export const setFadAction = ({ dispatch, fad }) => {
  console.log("setFadAction triggered"); //debug
  dispatch({ type: "SET_FAD_ACTION", payload: fad });
};
