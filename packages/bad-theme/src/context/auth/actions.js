// SET CONTEXT ---------------------------------------------------

export const setLoadingAction = async ({ dispatch, isLoading }) => {
  console.log("setLoadingAction triggered"); //debug
  dispatch({ type: "SET_LOADING", payload: isLoading });
};
