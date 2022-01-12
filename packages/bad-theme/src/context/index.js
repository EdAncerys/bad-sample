import { AppProvider, useAppDispatch, useAppState } from "./context";
import {
  setGoToAction,
  eventFilterAction,
  setFetchAction,
  setErrorAction,
} from "./actions/actions";
import { muiQuery } from "./mediaQueryContext";
import {
  setLoginModalAction,
  setCreateAccountModalAction,
  setEnquireAction,
} from "./actions/navigation";
import {
  loginAction,
  logoutAction,
  setUserAction,
  authenticateAppAction,
} from "./auth/actions";
import { sendEmailEnquireAction } from "./auth/sendEnquire";
import { getTweetsAction } from "./auth/getTweets";

export {
  AppProvider,
  useAppDispatch,
  useAppState,
  muiQuery,
  setGoToAction,
  setLoginModalAction,
  setCreateAccountModalAction,
  setEnquireAction,
  setUserAction,
  loginAction,
  logoutAction,
  eventFilterAction,
  sendEmailEnquireAction,
  authenticateAppAction,
  setFetchAction,
  setErrorAction,
  getTweetsAction,
};
