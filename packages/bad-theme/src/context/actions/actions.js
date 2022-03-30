import BADTheme from "../../client";

const pathOne = `http://3.9.193.188`;
const pathTwo = `https://badadmin.skylarkdev.co`;
const pathThee = `https://bad.skylarkdev.digital`;
const pathFour = `https://bad-internal-testing.vercel.app/`; // APP HOST url endpoint
// import state APP_URL from client state with process.env.APP_URL

export const setGoToAction = async ({ path, actions, downloadFile }) => {
  if (!path && !downloadFile) return null;
  // console.log("setGoToAction triggered", path, downloadFile); // debug
  console.log("🤖", process.env.WP_HOST);

  if (downloadFile) {
    // ⬇️  download file ⬇️
    const { file } = downloadFile;
    window.open(file.url, "_blank");
  }
  let isExternalLink = true;
  if (path && path.includes(pathOne)) isExternalLink = false;
  if (path && path.includes(pathTwo)) isExternalLink = false;
  if (path && path.includes(pathThee)) isExternalLink = false;
  if (path && path.includes(pathFour)) isExternalLink = false;

  if (path && path.includes(`www`) && !path.includes(`http`) && isExternalLink)
    return window.open(`https://` + path, "_blank"); // handle external links without https pre fix
  if (path && !path.includes(`www`) && !path.includes(`http`) && isExternalLink)
    return actions.router.set(pathTwo + path); // internal link no pre fix
  if (isExternalLink) return window.open(path, "_blank"); // handle external links

  actions.router.set(path);
};

export const setLinkWrapperAction = ({ path }) => {
  if (!path) return "#;"; // by default anchor tag will not be clickable
  // if (!path) return "javascript:void(0)"; // by default anchor tag will not be clickable
  let newPath = path;
  // if path includes pathOne || pathTwo strip path and set newPath
  if (path.includes(pathOne)) newPath = path.replace(pathOne, "");
  if (path.includes(pathTwo)) newPath = path.replace(pathTwo, "");
  console.log("newPath", newPath); // debug
  return newPath;
};

// SET CONTEXT ---------------------------------------------------
export const setFilterAction = ({ dispatch, filter }) => {
  console.log("setFilterAction triggered"); //debug
  dispatch({ type: "SET_FILTER_ACTION", payload: filter });
};

export const setAppSearchDataAction = ({ dispatch, appSearchData }) => {
  console.log("setFilterAction triggered"); //debug
  dispatch({ type: "SET_APP_SEARCH_DATA_ACTION", payload: appSearchData });
};

export const setAppSearchPhraseAction = ({ dispatch, appSearchPhrase }) => {
  console.log("setFilterAction triggered"); //debug
  dispatch({ type: "SET_APP_SEARCH_PHRASE_ACTION", payload: appSearchPhrase });
};

export const setIDFilterAction = ({ dispatch, idFilter }) => {
  console.log("setIDFilterAction triggered"); //debug
  dispatch({ type: "SET_ID_FILTER_ACTION", payload: idFilter });
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
