export const initialState = {
  isLoading: false,
  jwt: null,
  user: null,

  loginModalAction: false,
  createAccountAction: false,
  enquireAction: true,
};

export const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_LOGIN_ACTION":
      return { ...state, user: action.payload };
    case "SET_LOGIN_MODAL_ACTION":
      return { ...state, loginModalAction: action.payload };
    case "SET_CREATE_ACCOUNT_ACTION":
      return { ...state, createAccountAction: action.payload };
    case "SET_ENQUIRE_ACTION":
      return { ...state, enquireAction: action.payload };
    case "SET_JWT_ACTION":
      return { ...state, jwt: action.payload };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
