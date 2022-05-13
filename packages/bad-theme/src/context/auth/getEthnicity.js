import { fetchDataHandler } from "../index";

export const getEthnicityAction = async ({ state, dispatch, refreshJWT }) => {
  // console.log("getEthnicityAction triggered");

  try {
    const path =
      state.auth.APP_HOST + `/catalogue/fields/contact?field=py3_ethnicity`;

    const data = await fetchDataHandler({ path, state });

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
