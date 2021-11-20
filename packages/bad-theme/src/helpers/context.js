export const setLoginAction = ({ state }) => {
  const loginAction = state.context.loginAction;
  state.context.loginAction = !loginAction;
};

export const setCreateAccountAction = ({ state }) => {
  const createAccountAction = state.context.createAccountAction;
  state.context.createAccountAction = !createAccountAction;
};

export const setActionFlipper = ({ state }) => {
  setLoginAction({ state });
  setCreateAccountAction({ state });
};
