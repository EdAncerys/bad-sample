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
  getUserAction,
  getUserDataByContactId,
} from "./auth/actions";
import { sendEmailEnquireAction } from "./auth/sendEnquire";
import { getTweetsAction } from "./auth/getTweets";
import { getFadAction } from "./auth/getFAD";
import { updateProfileAction } from "./auth/updateProfile";
import { updateAddressAction } from "./auth/updateAddress";
import { sendFileToS3Action } from "./auth/saveFileToS3";
import { getRSSFeedAction } from "./auth/getRSSFeed";

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
  getUserAction,
  getUserDataByContactId,
  updateProfileAction,
  updateAddressAction,
  sendFileToS3Action,
  getRSSFeedAction,
};
