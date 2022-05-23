import { fetchDataHandler } from "../index";

export const getGenderAction = async ({ state, dispatch }) => {
  // console.log("getEthnicityAction triggered");

  try {
    const path =
      state.auth.APP_HOST + `/catalogue/fields/contact?field=gendercode`;

    const data = await fetchDataHandler({ path, state });

    if (!data) throw new Error("error fetching data form API");
    let result = await data.json();

    if (result.length > 0) {
      result = result[0].Choices; // get picklist data
    } else {
      result = null; // reset ethnicity result data
    }

    setGenderAction({ dispatch, genderList: result });
  } catch (error) {
    // console.log("error", error);
  }
};

// SET CONTEXT ---------------------------------------------------
export const setGenderAction = ({ dispatch, genderList }) => {
  // console.log("setEthnicityAction triggered"); //debug
  dispatch({ type: "SET_GENDER_ACTION", payload: genderList });
};
