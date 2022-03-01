import { authenticateAppAction } from "../index";

export const getHospitalsAction = async ({ state, input }) => {
  console.log("getHospitalsAction triggered");

  const URL =
    state.auth.APP_HOST + `/catalogue/lookup/hospitals?search=${input}`;
  const jwt = await authenticateAppAction({ state });

  const requestOptions = {
    method: "GET",
    headers: { Authorization: `Bearer ${jwt}` },
  };

  try {
    const data = await fetch(URL, requestOptions);
    const result = await data.json();

    if (result.success) {
      return result.data;
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const getHospitalNameAction = async ({ state, id }) => {
  console.log("getHospitalsAction triggered");

  const URL =
    state.auth.APP_HOST +
    `/catalogue/data/accounts(${id})?$select=name,address1_composite,customertypecode,customertypecode`;
  const jwt = await authenticateAppAction({ state });

  const requestOptions = {
    method: "GET",
    headers: { Authorization: `Bearer ${jwt}` },
  };

  try {
    const data = await fetch(URL, requestOptions);
    const result = await data.json();

    if (result) {
      console.log("Hospital Data ", result);
      return result;
    }
  } catch (error) {
    console.log("error", error);
  }
};
