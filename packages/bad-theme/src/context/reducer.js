export const initialState = {
  isFetching: null,
  isError: null,

  isActiveUser: null,
  dynamicsApps: null,
  jwt: null,
  refreshJWT: null,

  isPlaceholder: true,
  isDashboardNotifications: null,

  tweets: null,
  fad: null,
  bjdFeed: null,
  cedFeed: null,
  shdFeed: null,
  isDirectDebit: null,

  cptBlockFilter: "",
  cptBlockTypeFilter: null,

  filter: null,
  idFilter: null,
  eventAnchor: null,
  dashboardPath: "Dashboard",
  directDebitPath: { page: "billing" },
  isVisibleNotification: true,
  ethnicity: null,

  appSearchData: null,
  appSearchPhrase: "",

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
    case "SET_REFRESH_JWT_ACTION":
      return { ...state, refreshJWT: action.payload };
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
    case "SET_APP_SEARCH_DATA_ACTION":
      return { ...state, appSearchData: action.payload };
    case "SET_APP_SEARCH_PHRASE_ACTION":
      return { ...state, appSearchPhrase: action.payload };
    case "SET_APPLICATION_DATA_ACTION":
      return { ...state, applicationData: action.payload };
    case "SET_ID_FILTER_ACTION":
      return { ...state, idFilter: action.payload };
    case "SET_DIRECT_DEBIT_ACTION":
      return { ...state, isDirectDebit: action.payload };
    case "SET_CPT_BLOCK_ACTION":
      return { ...state, cptBlockFilter: action.payload };
    case "SET_CPT_BLOCK_TYPE_ACTION":
      return { ...state, cptBlockTypeFilter: action.payload };
    case "SET_EVENT_ANCHOR_ACTION":
      return { ...state, eventAnchor: action.payload };
    case "SET_APPLICATION_ACTION":
      return { ...state, dynamicsApps: action.payload };
    case "SET_DASHBOARD_PATH_ACTION":
      return { ...state, dashboardPath: action.payload };
    case "SET_DEBIT_NOTIFICATION_ACTION":
      return { ...state, isVisibleNotification: action.payload };
    case "SET_DEBIT_HANDLER_ACTION":
      return { ...state, directDebitPath: action.payload };
    case "SET_PLACEHOLDER_ACTION":
      return { ...state, isPlaceholder: action.payload };
    case "SET_ETHNICITY_ACTION":
      return { ...state, ethnicity: action.payload };
    case "SET_DASHBOARD_NOTIFICATION_ACTION":
      return { ...state, isDashboardNotifications: action.payload };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
