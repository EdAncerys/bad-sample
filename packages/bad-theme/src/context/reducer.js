export const initialState = {
  isLoading: false,
  setLogin: false,
};

export const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_LOGIN":
      return { ...state, setLogin: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
