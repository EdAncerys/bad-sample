import { authenticateAppAction, fetchDataHandler } from "../index";

export const getHospitalsAction = async ({ state, input, dispatch }) => {
  // console.log("getHospitalsAction triggered");

  const path =
    state.auth.APP_HOST + `/catalogue/lookup/hospitals?search=${input}`;

  try {
    const data = await fetchDataHandler({ path, state });

    const result = await data.json();

    if (result.success) {
      return result.data;
    }
  } catch (error) {
    // console.log("error", error);
  }
};

export const getHospitalNameAction = async ({ state, id, dispatch }) => {
  // console.log("getHospitalsAction triggered");

  const path =
    state.auth.APP_HOST +
    `/catalogue/data/accounts(${id})?$select=name,address1_composite,customertypecode,customertypecode`;

  try {
    const data = await fetchDataHandler({ path, state });
    const result = await data.json();

    if (result) {
      return result;
    }
  } catch (error) {
    // console.log("error", error);
  }
};
