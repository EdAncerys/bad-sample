import { fetchDataHandler } from "../index";

export const getCountryList = async ({ state, dispatch }) => {
  // console.log("getEthnicityAction triggered");

  try {
    const path = state.auth.APP_HOST + `/catalogue/data/core_countries`;

    const data = await fetchDataHandler({ path, state });

    if (!data) throw new Error("error fetching data form API");
    let result = await data.json();

    if (result && result.value.length > 0) {
      result = result.value; // get picklist data
    } else {
      result = null; // reset ethnicity result data
    }

    setCountryListAction({ dispatch, countryList: result });
  } catch (error) {
    // console.log("error", error);
  }
};

// SET CONTEXT ---------------------------------------------------
export const setCountryListAction = ({ dispatch, countryList }) => {
  // console.log("setEthnicityAction triggered"); //debug
  dispatch({ type: "SET_COUNTRY_LIST_ACTION", payload: countryList });
};
