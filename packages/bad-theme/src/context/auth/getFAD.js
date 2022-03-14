import {
  authenticateAppAction,
  setFetchAction,
  getUserDataFromDynamics,
} from "../index";

export const getFadAction = async ({ state, dispatch }) => {
  console.log("getFadAction triggered");

  setFetchAction({ dispatch, isFetching: true });
  const URL = state.auth.APP_HOST + `/catalogue/fad`;
  const jwt = await authenticateAppAction({ state });

  const requestOptions = {
    method: "GET",
    headers: { Authorization: `Bearer ${jwt}` },
  };

  try {
    const data = await fetch(URL, requestOptions);
    const result = await data.json();

    if (result.success) {
      console.log("⏬ FED data successfully fetched ⏬");
      const fad = result.data;
      // // map through fad data and fetch user data from dynamics and update fad data with user data
      // const fads = fad.map(async (fad) => {
      //   const userData = await getUserDataFromDynamics({
      //     state,
      //     dispatch,
      //     jwt,
      //     contactid: fad.contactid,
      //   });
      //   if (!userData) throw new Error("Error getting userData.");

      //   const fadData = { ...fad, ...userData };
      //   // console.log("fadData", fadData); // debug

      //   return fadData;
      // });
      // // await fads data
      // const fadData = await Promise.all(fads);
      // // console.log("fadData", fadData); // debug

      return fad;
    }
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
