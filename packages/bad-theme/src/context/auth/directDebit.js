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

export const getInvoiceAction = async ({ state, isActiveUser }) => {
  console.log("getInvoiceAction triggered");

  const { contactid } = isActiveUser;
  if (!contactid) throw new Error("Cannot get receipts. Contactid is missing.");

  const jwt = await authenticateAppAction({ state });
  const URL =
    state.auth.APP_HOST +
    `/utils/pdf/sample?contactid=${contactid}&token=${jwt}`;

  const requestOptions = {
    method: "GET",
    headers: { Authorization: `Bearer ${jwt}` },
  };

  try {
    const response = await fetch(URL, requestOptions);
    console.log("⬇️ invoice data ⬇️ "); // debug
    console.log(response.url); // debug

    if (response.ok) return response.url;
  } catch (error) {
    console.log("error", error);
  }
};

export const getProofOfMembershipAction = async ({
  state,
  core_membershipsubscriptionid,
  isActiveUser,
}) => {
  console.log("getProofOfMembershipAction triggered");

  const { contactid } = isActiveUser;
  if (!contactid)
    throw new Error("Cannot get membership proof. Contactid is missing.");

  const jwt = await authenticateAppAction({ state });
  const URL =
    state.auth.APP_HOST +
    `/utils/pdf/confirm?contactid=${contactid}&subid=${core_membershipsubscriptionid}&token=${jwt}`;

  const requestOptions = {
    method: "GET",
    headers: { Authorization: `Bearer ${jwt}` },
  };

  try {
    const response = await fetch(URL, requestOptions);
    console.log("⬇️ membership data ⬇️ "); // debug
    console.log(response.url); // debug

    if (response.ok) return response.url;
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
