// SET CONTEXT ---------------------------------------------------
export const setLoginAction = async ({ dispatch, user }) => {
  console.log("setLoginAction triggered"); //debug
  dispatch({ type: "SET_LOGIN", payload: user });
};

export const setLoadingAction = async ({ dispatch, isLoading }) => {
  console.log("setLoadingAction triggered"); //debug
  dispatch({ type: "SET_LOADING", payload: isLoading });
};
