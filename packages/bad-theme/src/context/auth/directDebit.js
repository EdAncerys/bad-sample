import { authenticateAppAction } from "../index";

export const getDirectDebitAction = async ({ state, id }) => {
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

    console.log("getDirectDebitAction data", data); // debug

    return data.data;
  } catch (error) {
    console.log("error", error);
  }
};

export const createDirectDebitAction = async ({ state, id, data }) => {
  console.log("createDirectDebitAction triggered");

  const URL = state.auth.APP_HOST + `/bankaccount/${id}`;
  const jwt = await authenticateAppAction({ state });

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
    const data = await data.json();

    console.log("createDirectDebitAction data", data); // debug

    if (response.success) return data.data;
    return null;
  } catch (error) {
    console.log("error", error);
  }
};
