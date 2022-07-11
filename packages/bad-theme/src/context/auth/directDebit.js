import { fetchDataHandler } from "../index";

export const getDirectDebitAction = async ({ state, dispatch, id }) => {
  // console.log("getDirectDebitAction triggered");

  const path = state.auth.APP_HOST + `/bankaccount/${id}`;

  try {
    const response = await fetchDataHandler({ path, state });
    const data = await response.json();

    if (data.success) {
      setDirectDebitAction({ dispatch, isDirectDebit: data.data });
      return data;
    } else {
      return null;
    }
  } catch (error) {
    // console.log("error", error);
  }
};

export const getInvoiceAction = async ({ state, dispatch, isActiveUser }) => {
  // console.log("getInvoiceAction triggered");

  const { contactid } = isActiveUser;
  if (!contactid) throw new Error("Cannot get receipts. Contactid is missing.");

  const path = state.auth.APP_HOST + `/utils/pdf/sample?contactid=${contactid}`;

  try {
    const response = await fetchDataHandler({ path, state });

    if (response.ok) return response.url;
  } catch (error) {
    // console.log("error", error);
  }
};

export const getProofOfMembershipAction = async ({
  state,
  core_membershipsubscriptionid,
  isActiveUser,
  dispatch,
}) => {
  // console.log("getProofOfMembershipAction triggered");

  const { contactid } = isActiveUser;
  if (!contactid)
    throw new Error("Cannot get membership proof. Contactid is missing.");

  const path =
    state.auth.APP_HOST +
    `/utils/pdf/confirm?contactid=${contactid}&subid=${core_membershipsubscriptionid}`;

  try {
    const response = await fetchDataHandler({ path, state });

    if (response.ok) return response.url;
  } catch (error) {
    // console.log("error", error);
  }
};

export const createDirectDebitAction = async ({ state, id, body }) => {
  // console.log("createDirectDebitAction triggered");

  const path = state.auth.APP_HOST + `/bankaccount/${id}`;

  try {
    const response = await fetchDataHandler({
      path,
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
      state,
    });
    const data = await response.json();

    return data;
  } catch (error) {
    // console.log("error", error);
  }
};

// SET CONTEXT ---------------------------------------------------
export const setDirectDebitAction = ({ dispatch, isDirectDebit }) => {
  // console.log("setDirectDebitAction triggered"); //debug
  dispatch({ type: "SET_DIRECT_DEBIT_ACTION", payload: isDirectDebit });
};
