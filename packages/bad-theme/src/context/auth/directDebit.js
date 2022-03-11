import { authenticateAppAction } from "../index";

export const getDirectDebitAction = async ({ state, dispatch, id }) => {
  console.log("getDirectDebitAction triggered");

  const URL = state.auth.APP_HOST + `/bankaccount/${id}`;
  const jwt = await authenticateAppAction({ state });

  const requestOptions = {
    method: "GET",
    headers: { Authorization: `Bearer ${jwt}` },
  };

  try {
    const response = await fetch(URL, requestOptions);
    const data = await response.json();
    // console.log("getDirectDebitAction data", data); // debug

    if (data.success)
      setDirectDebitAction({ dispatch, isDirectDebit: data.data });
  } catch (error) {
    console.log("error", error);
  }
};

export const createDirectDebitAction = async ({ state, id, data }) => {
  console.log("createDirectDebitAction triggered");

  const URL = state.auth.APP_HOST + `/bankaccount/${id}`;
  const jwt = await authenticateAppAction({ state });

  // console.log("data", data); // debug

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(URL, requestOptions);
    const data = await response.json();
    // console.log("createDirectDebitAction data", data); // debug

    return data;
  } catch (error) {
    console.log("error", error);
  }
};

// SET CONTEXT ---------------------------------------------------
export const setDirectDebitAction = ({ dispatch, isDirectDebit }) => {
  console.log("setDirectDebitAction triggered"); //debug
  dispatch({ type: "SET_DIRECT_DEBIT_ACTION", payload: isDirectDebit });
};
