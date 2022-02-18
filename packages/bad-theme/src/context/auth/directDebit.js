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

  console.log("data", data);
  console.log("core_name", data.core_name);
  console.log("core_accountnumber", data.core_accountnumber);
  console.log("core_sortcode", data.core_sortcode);

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bad_transactiontype: "0S",
      core_name: data.core_name,
      core_accountnumber: data.core_accountnumber,
      core_sortcode: data.core_sortcode,
    }),
  };

  try {
    const response = await fetch(URL, requestOptions);
    const data = await response.json();

    console.log("createDirectDebitAction data", data); // debug

    return data;
  } catch (error) {
    console.log("error", error);
  }
};
