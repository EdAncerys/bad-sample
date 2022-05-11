import BADTheme from "../../client";
// import state APP_URL from client state with process.env.APP_URL

export const setGoToAction = async ({
  state,
  path,
  actions,
  downloadFile,
  newWindow,
}) => {
  // console.log("setGoToAction triggered", path, downloadFile); // debug
  if (!path && !downloadFile) return null;

  let urlPath = path;
  const pathOne = `http://3.9.193.188`;
  const pathTwo = `https://badadmin.skylarkdev.co`;
  const pathThree = `https://cdn.bad.org.uk`;
  const wpHost = state.auth.WP_HOST;
  const appUrl = state.auth.APP_URL;
  console.log("urlPath", urlPath);
  if (downloadFile) {
    // ⬇️  download file ⬇️
    const { file } = downloadFile;
    window.open(file.url, "_blank");
  }

  // ⬇️ handle redirect rules
  let isExternalLink = true;
  if (path && path.includes(pathOne)) isExternalLink = false;
  if (path && path.includes(pathTwo)) isExternalLink = false;
  // if (path && path.includes(pathThree)) isExternalLink = false;
  if (path && path.includes(wpHost)) isExternalLink = false;
  if (path && path.includes(appUrl)) isExternalLink = false;
  if (newWindow) isExternalLink = true;

  if (urlPath && urlPath.includes(wpHost))
    urlPath = urlPath.replace(wpHost, "/");

  // redirects passed to router without https prefix
  if (
    urlPath &&
    urlPath.includes(`www`) &&
    !urlPath.includes(`http`) &&
    isExternalLink
  )
    return window.open(`https://` + urlPath, "_blank"); // handle external links without https pre fix
  // if (urlPath && urlPath.includes("cdn"))
  //   return window.location.replace("https://" + urlPath);

  // 📌 handle internal link redirects with prefixes
  if (
    urlPath &&
    !urlPath.includes(`www`) &&
    !urlPath.includes(`http`) &&
    isExternalLink
  )
    return actions.router.set(pathTwo + urlPath); // internal link no pre fix
  if (isExternalLink) return window.open(urlPath, "_blank"); // handle external links

  // 📌 handle internal link redirects
  actions.router.set(urlPath);
};

export const setLinkWrapperAction = ({ path }) => {
  if (!path) return "#;"; // by default anchor tag will not be clickable
  // if (!path) return "javascript:void(0)"; // by default anchor tag will not be clickable
  let newPath = path;
  // if path includes pathOne || pathTwo strip path and set newPath
  if (path.includes(pathOne)) newPath = path.replace(pathOne, "");
  if (path.includes(pathTwo)) newPath = path.replace(pathTwo, "");
  return newPath;
};

// SET CONTEXT ---------------------------------------------------
export const setFilterAction = ({ dispatch, filter }) => {
  // console.log("setFilterAction triggered"); //debug
  dispatch({ type: "SET_FILTER_ACTION", payload: filter });
};

export const setAppSearchDataAction = ({ dispatch, appSearchData }) => {
  // console.log("setFilterAction triggered"); //debug
  dispatch({ type: "SET_APP_SEARCH_DATA_ACTION", payload: appSearchData });
};

export const setAppSearchPhraseAction = ({ dispatch, appSearchPhrase }) => {
  // console.log("setFilterAction triggered"); //debug
  dispatch({ type: "SET_APP_SEARCH_PHRASE_ACTION", payload: appSearchPhrase });
};

export const setIdFilterAction = ({ dispatch, idFilter }) => {
  // console.log("setIdFilterAction triggered"); //debug
  dispatch({ type: "SET_ID_FILTER_ACTION", payload: idFilter });
};

export const setNesMediaIdFilterAction = ({
  dispatch,
  newsMediaCategoryId,
}) => {
  // console.log("setNesMediaIdFilterAction triggered"); //debug
  dispatch({
    type: "SET__NEWS_MEDIA_ID_FILTER_ACTION",
    payload: newsMediaCategoryId,
  });
};

export const setFetchAction = ({ dispatch, isFetching }) => {
  // console.log("setFetchAction triggered"); //debug
  dispatch({ type: "SET_FETCH_ACTION", payload: isFetching });
};

export const setErrorAction = ({ dispatch, isError }) => {
  // console.log("setErrorAction triggered"); //debug
  dispatch({ type: "SET_ERROR_ACTION", payload: isError });
};

export const setApplicationDataAction = ({ dispatch, applicationData }) => {
  // console.log("setApplicationDataAction triggered"); //debug
  dispatch({ type: "SET_APPLICATION_DATA_ACTION", payload: applicationData });
};

export const setCPTBlockAction = ({ dispatch, cptBlockFilter }) => {
  // console.log("setCPTBlockAction triggered"); //debug
  dispatch({ type: "SET_CPT_BLOCK_ACTION", payload: cptBlockFilter });
};

export const setCPTBlockTypeAction = ({ dispatch, cptBlockTypeFilter }) => {
  // console.log("setCPTBlockAction triggered"); //debug
  dispatch({ type: "SET_CPT_BLOCK_TYPE_ACTION", payload: cptBlockTypeFilter });
};

export const setEventAnchorAction = ({ dispatch, eventAnchor }) => {
  // console.log("setEventAnchorAction triggered"); //debug
  dispatch({ type: "SET_EVENT_ANCHOR_ACTION", payload: eventAnchor });
};

export const setDashboardPathAction = ({ dispatch, dashboardPath }) => {
  // console.log("setDashboardPathAction triggered"); //debug
  dispatch({ type: "SET_DASHBOARD_PATH_ACTION", payload: dashboardPath });
};

export const setDashboardNotificationsAction = ({
  dispatch,
  isDashboardNotifications,
}) => {
  // console.log("setDashboardNotificationsAction triggered"); //debug
  dispatch({
    type: "SET_DASHBOARD_NOTIFICATION_ACTION",
    payload: isDashboardNotifications,
  });
};

export const setNotificationAction = ({ dispatch, isVisibleNotification }) => {
  // console.log("setNotificationAction triggered"); //debug
  dispatch({
    type: "SET_DEBIT_NOTIFICATION_ACTION",
    payload: isVisibleNotification,
  });
};

export const setDebitHandlerAction = ({ dispatch, directDebitPath }) => {
  // console.log("setDebitHandlerAction triggered"); //debug
  dispatch({ type: "SET_DEBIT_HANDLER_ACTION", payload: directDebitPath });
};

export const setPlaceholderAction = ({ dispatch, isPlaceholder }) => {
  // console.log("setPlaceholderAction triggered"); //debug
  dispatch({ type: "SET_PLACEHOLDER_ACTION", payload: isPlaceholder });
};

export const setRedirectAction = ({ dispatch, redirects }) => {
  console.log("setRedirectAction triggered"); //debug
  dispatch({ type: "SET_REDIRECT_ACTION", payload: redirects });
};
