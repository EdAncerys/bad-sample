export const setLoginAction = ({ state }) => {
  const loginAction = state.context.loginAction;
  state.context.loginAction = !loginAction;
};
