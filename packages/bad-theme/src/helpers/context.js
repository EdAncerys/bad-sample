export const setLoginAction = ({ state }) => {
  const loginAction = state.context.loginAction;
  state.context.loginAction = !loginAction;
};

export const setCreateAccountAction = ({ state }) => {
  const createAccountAction = state.context.createAccountAction;
  state.context.createAccountAction = !createAccountAction;
};

export const setEnquireAction = ({ state }) => {
  const enquireAction = state.context.enquireAction;
  state.context.enquireAction = !enquireAction;
};

export const setActionFlipper = ({ state }) => {
  setLoginAction({ state });
  setCreateAccountAction({ state });
};
