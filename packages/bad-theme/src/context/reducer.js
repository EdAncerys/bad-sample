export const initialState = {
  isFetching: null,
  isError: null,

  isActiveUser: null,
  jwt: null,

  tweets: null,
  fad: null,
  bjdFeed: null,
  cedFeed: null,
  shdFeed: null,
  filter: null,

  applicationData: null,

  loginModalAction: false,
  createAccountAction: false,
  enquireAction: null,
};

export const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_FETCH_ACTION":
      return { ...state, isFetching: action.payload };
    case "SET_ERROR_ACTION":
      return { ...state, isError: action.payload };
    case "SET_ACTIVE_USER_ACTION":
      return { ...state, isActiveUser: action.payload };
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
    case "SET_BJD_FEED_ACTION":
      return { ...state, bjdFeed: action.payload };
    case "SET_CED_FEED_ACTION":
      return { ...state, cedFeed: action.payload };
    case "SET_SHD_FEED_ACTION":
      return { ...state, shdFeed: action.payload };
    case "SET_FILTER_ACTION":
      return { ...state, filter: action.payload };
    case "SET_APPLICATION_DATA_ACTION":
      return { ...state, applicationData: action.payload };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
