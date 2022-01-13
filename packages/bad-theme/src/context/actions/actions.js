export const setGoToAction = async ({ path, actions }) => {
  if (!path || !actions) return null;

  let isExternalLink = true;
  if (path.includes(`http://3.9.193.188`)) isExternalLink = false;
  if (path.includes(`https://badadmin.skylarkdev.co`)) isExternalLink = false;

  if (path.includes(`www`) && !path.includes(`http`) && isExternalLink)
    return window.open(`https://` + path, "_blank"); // handle external links without pre fix

  if (isExternalLink) return window.open(path, "_blank"); // handle external links
  actions.router.set(path);
};

export const eventFilterAction = async ({ dispatch, filter }) => {
  console.log("eventFilterAction triggered");
  if (!filter) return setEventFilterAction({ dispatch, filter: null });
  setEventFilterAction({ dispatch, filter });
};

// SET CONTEXT ---------------------------------------------------
export const setEventFilterAction = ({ dispatch, filter }) => {
  console.log("setEventFilterAction triggered"); //debug
  dispatch({ type: "SET_EVENT_FILTER", payload: filter });
};

export const setFetchAction = ({ dispatch, isFetching }) => {
  console.log("setFetchAction triggered"); //debug
  dispatch({ type: "SET_FETCH_ACTION", payload: isFetching });
};

export const setErrorAction = ({ dispatch, isError }) => {
  console.log("setErrorAction triggered"); //debug
  dispatch({ type: "SET_ERROR_ACTION", payload: isError });
};
