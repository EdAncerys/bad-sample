// SET CONTEXT ---------------------------------------------------
export const setLoginAction = async ({ dispatch, setLogin }) => {
  console.log("setLoadingAction triggered"); //debug
  dispatch({ type: "SET_LOGIN", payload: setLogin });
};

export const setLoadingAction = async ({ dispatch, isLoading }) => {
  console.log("setLoadingAction triggered"); //debug
  dispatch({ type: "SET_LOADING", payload: isLoading });
};
