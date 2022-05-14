import { fetchDataHandler } from "../index";

export const getApplicationStatus = async ({ state, dispatch, contactid }) => {
  // console.log("getApplicationStatus triggered");

  // if contactid is not provided then throw error
  if (!contactid) throw new Error("contactid is required");

  const path = state.auth.APP_HOST + `/applications/billing/` + contactid;

  try {
    const response = await fetchDataHandler({ path, state });
    const data = await response.json();

    if (data.apps.success) {
      setApplicationStatusAction({ dispatch, dynamicsApps: data });
      // console.log("🚀 Dynamic Apps Data", data); // debug

      return data; // return data
    }
  } catch (error) {
    // console.log("error", error);
  }
};

// SET CONTEXT ---------------------------------------------------
export const setApplicationStatusAction = ({ dispatch, dynamicsApps }) => {
  // console.log("setApplicationStatusAction triggered"); //debug
  dispatch({ type: "SET_APPLICATION_ACTION", payload: dynamicsApps });
};
