import { useContext, createContext, useReducer } from 'react';
import { initialState, AppReducer } from './reducer';

const AppStateContext = createContext();
const AppDispatchContext = createContext();

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within a AppProvider');
  }
  return context;
}

export function useAppDispatch() {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within a AppProvider');
  }
  return context;
}

export const AppProvider = ({ children }) => {
  const [user, dispatch] = useReducer(AppReducer, initialState);

  return (
    <AppStateContext.Provider value={user}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};
