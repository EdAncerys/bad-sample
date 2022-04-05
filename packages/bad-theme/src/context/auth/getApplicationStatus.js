import { authenticateAppAction, setFetchAction } from "../index";

export const getApplicationStatus = async ({
  state,
  dispatch,
  contactid,
  refreshJWT,
}) => {
  console.log("getApplicationStatus triggered");

  // if contactid is not provided then throw error
  if (!contactid) throw new Error("contactid is required");

  const URL = state.auth.APP_HOST + `/applications/billing/` + contactid;
  const jwt = await authenticateAppAction({ state, dispatch, refreshJWT });

  const requestOptions = {
    method: "GET",
    headers: { Authorization: `Bearer ${jwt}` },
  };

  try {
    const response = await fetch(URL, requestOptions);
    const data = await response.json();

    if (data.apps.success) {
      setApplicationStatusAction({ dispatch, dynamicsApps: data });
      console.log("🚀 Dynamic Apps Data", data); // debug

      return data; // return data
    }
  } catch (error) {
    console.log("error", error);
  }
};

// SET CONTEXT ---------------------------------------------------
export const setApplicationStatusAction = ({ dispatch, dynamicsApps }) => {
  console.log("setApplicationStatusAction triggered"); //debug
  dispatch({ type: "SET_APPLICATION_ACTION", payload: dynamicsApps });
};
