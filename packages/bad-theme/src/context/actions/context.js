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

export const setIsLoggedInAction = ({ state }) => {
  const isLoggedIn = state.context.isLoggedIn;
  const loginAction = state.context.loginAction;

  state.context.loginAction = !loginAction;
  state.context.isLoggedIn = !isLoggedIn;
};

export const setActiveDropDownRef = ({ state, actions }) => {
  // if (!actions) state.theme.activeDropDownRef = null;
  // if (actions) state.theme.activeDropDownRef = actions;
  state.theme.activeDropDownRef = null;
  // console.log("activeDropDownRef", actions); // debug
};
