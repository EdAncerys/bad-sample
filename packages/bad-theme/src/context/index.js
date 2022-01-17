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
  authenticateAppAction,
  getUserAction
} from "./auth/actions";
import { sendEmailEnquireAction } from "./auth/sendEnquire";
import { getTweetsAction } from "./auth/getTweets";
import { getFadAction } from "./auth/getFAD";

export {
  AppProvider,
  useAppDispatch,
  useAppState,
  muiQuery,
  setGoToAction,
  setLoginModalAction,
  setCreateAccountModalAction,
  setEnquireAction,
  loginAction,
  logoutAction,
  eventFilterAction,
  sendEmailEnquireAction,
  authenticateAppAction,
  setFetchAction,
  setErrorAction,
  getTweetsAction,
  getFadAction,
  getUserAction
};
