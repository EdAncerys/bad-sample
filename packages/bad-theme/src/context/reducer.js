export const initialState = {
  isFetching: null,
  isError: null,
  jwt: null,
  user: null,
  tweets: null,
  fad: null,

  loginModalAction: false,
  createAccountAction: false,
  enquireAction: false,
};

export const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_FETCH_ACTION":
      return { ...state, isFetching: action.payload };
    case "SET_ERROR_ACTION":
      return { ...state, isError: action.payload };
    case "SET_USER_ACTION":
      return { ...state, user: action.payload };
    case "SET_LOGIN_MODAL_ACTION":
      return { ...state, loginModalAction: action.payload };
    case "SET_CREATE_ACCOUNT_ACTION":
      return { ...state, createAccountAction: action.payload };
    case "SET_ENQUIRE_ACTION":
      return { ...state, enquireAction: action.payload };
    case "SET_JWT_ACTION":
      return { ...state, jwt: action.payload };
    case "SET_TWEETS_ACTION":
      return { ...state, tweets: action.payload };
    case "SET_FAD_ACTION":
      return { ...state, fad: action.payload };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
