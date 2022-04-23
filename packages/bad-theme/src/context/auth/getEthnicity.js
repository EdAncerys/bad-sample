import { authenticateAppAction } from "../index";

export const getEthnicityAction = async ({ state, dispatch, refreshJWT }) => {
  // console.log("getEthnicityAction triggered");

  try {
    const jwt = await authenticateAppAction({ state, dispatch, refreshJWT });
    if (!jwt) throw new Error("error authenticating app");

    const URL =
      state.auth.APP_HOST + `/catalogue/fields/contact?field=py3_ethnicity`;
    const requestOptions = {
      method: "GET",
      headers: { Authorization: `Bearer ${jwt}` },
    };

    const data = await fetch(URL, requestOptions);
    if (!data) throw new Error("error fetching data form API");
    let result = await data.json();

    if (result.length > 0) {
      result = result[0].Choices; // get picklist data
    } else {
      result = null; // reset ethnicity result data
    }

    setEthnicityAction({ dispatch, ethnicity: result });
  } catch (error) {
    // console.log("error", error);
  }
};

// SET CONTEXT ---------------------------------------------------
export const setEthnicityAction = ({ dispatch, ethnicity }) => {
  // console.log("setEthnicityAction triggered"); //debug
  dispatch({ type: "SET_ETHNICITY_ACTION", payload: ethnicity });
};
