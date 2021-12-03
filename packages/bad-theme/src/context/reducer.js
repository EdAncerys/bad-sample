export const initialState = {
  isLoading: false,
  jwt: null,
  user: null,
};

export const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_LOGIN":
      return { ...state, user: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
