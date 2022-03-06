export const setGoToAction = async ({ path, actions }) => {
  if (!path || !actions) return null;

  // console.log("setGoToAction triggered", path); // debug

  const END_POINT_ONE = `http://3.9.193.188`;
  const END_POINT_TWO = `https://badadmin.skylarkdev.co`;

  let isExternalLink = true;
  if (path.includes(END_POINT_ONE)) isExternalLink = false;
  if (path.includes(END_POINT_TWO)) isExternalLink = false;

  if (path.includes(`www`) && !path.includes(`http`) && isExternalLink)
    return window.open(`https://` + path, "_blank"); // handle external links without https pre fix
  if (!path.includes(`www`) && !path.includes(`http`) && isExternalLink)
    return actions.router.set(END_POINT_TWO + path); // internal link no pre fix
  if (isExternalLink) return window.open(path, "_blank"); // handle external links

  actions.router.set(path);
};

// SET CONTEXT ---------------------------------------------------
export const setFilterAction = ({ dispatch, filter }) => {
  console.log("setFilterAction triggered"); //debug
  dispatch({ type: "SET_FILTER_ACTION", payload: filter });
};

export const setIDFilterAction = ({ dispatch, filter }) => {
  console.log("setIDFilterAction triggered"); //debug
  dispatch({ type: "SET_ID_FILTER_ACTION", payload: filter });
};

export const setFetchAction = ({ dispatch, isFetching }) => {
  console.log("setFetchAction triggered"); //debug
  dispatch({ type: "SET_FETCH_ACTION", payload: isFetching });
};

export const setErrorAction = ({ dispatch, isError }) => {
  console.log("setErrorAction triggered"); //debug
  dispatch({ type: "SET_ERROR_ACTION", payload: isError });
};

export const setApplicationDataAction = ({ dispatch, applicationData }) => {
  console.log("setApplicationDataAction triggered"); //debug
  dispatch({ type: "SET_APPLICATION_DATA_ACTION", payload: applicationData });
};

export const setCPTBlockAction = ({ dispatch, cptBlockFilter }) => {
  console.log("setCPTBlockAction triggered"); //debug
  dispatch({ type: "SET_CPT_BLOCK_ACTION", payload: cptBlockFilter });
};

export const setEventAnchorAction = ({ dispatch, eventAnchor }) => {
  console.log("setEventAnchorAction triggered"); //debug
  dispatch({ type: "SET_EVENT_ANCHOR_ACTION", payload: eventAnchor });
};

export const setDashboardPathAction = ({ dispatch, dashboardPath }) => {
  console.log("setDashboardPathAction triggered"); //debug
  dispatch({ type: "SET_DASHBOARD_PATH_ACTION", payload: dashboardPath });
};

export const setNotificationAction = ({ dispatch, isVisibleNotification }) => {
  console.log("setNotificationAction triggered"); //debug
  dispatch({
    type: "SET_DEBIT_NOTIFICATION_ACTION",
    payload: isVisibleNotification,
  });
};

export const setDebitHandlerAction = ({ dispatch, directDebitPath }) => {
  console.log("setDebitHandlerAction triggered"); //debug
  dispatch({ type: "SET_DEBIT_HANDLER_ACTION", payload: directDebitPath });
};

export const setPlaceholderAction = ({ dispatch, isPlaceholder }) => {
  console.log("setPlaceholderAction triggered"); //debug
  dispatch({ type: "SET_PLACEHOLDER_ACTION", payload: isPlaceholder });
};
