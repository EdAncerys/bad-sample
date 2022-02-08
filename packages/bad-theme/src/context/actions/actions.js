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

export const setUserIDReplacementAction = ({ dispatch, idReplacement }) => {
  console.log("setApplicationDataAction triggered"); //debug
  dispatch({ type: "SET_ID_REPLACEMENT_ACTION", payload: idReplacement });
};
