export const initialState = {
  isLoading: false,
  jwt: null,
  user: null,
  filter: null,
};

export const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_LOGIN":
      return { ...state, user: action.payload };
    case "SET_SEARCH_FILTERS":
      return { ...state, filter: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
