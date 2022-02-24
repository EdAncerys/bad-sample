import { AppProvider, useAppDispatch, useAppState } from "./context";
import {
  setGoToAction,
  setFilterAction,
  setFetchAction,
  setErrorAction,
  setApplicationDataAction,
  setIDFilterAction,
  setCPTBlockAction,
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
import {
  getMembershipDataAction,
  handleApplyForMembershipAction,
  validateMembershipFormAction,
} from "./actions/memberships";
import { getWpPagesAction } from "./actions/getWpPages";
import { getTweetsAction } from "./auth/getTweets";
import { getFadAction } from "./auth/getFAD";
import { updateProfileAction } from "./auth/updateProfile";
import { updateAddressAction } from "./auth/updateAddress";
import { sendFileToS3Action } from "./auth/saveFileToS3";
import { getBADMembershipSubscriptionData } from "./auth/getBADMembershipSubscriptionData";
import {
  getDirectDebitAction,
  createDirectDebitAction,
} from "./auth/directDebit";
import {
  setUserStoreAction,
  getUserStoreAction,
  setCompleteUserApplicationAction,
} from "./auth/userStore";
import { getWileyAction } from "./auth/getWiley";
import { getTestUserAccountsAction } from "./auth/getTestUserAccounts";
import { getHospitalsAction } from "./auth/getHospitals";
import {
  getBJDFeedAction,
  getCEDFeedAction,
  getSHDFeedAction,
} from "./auth/rssFeed";
import { useIsMounted } from "../helpers/useIsMounted";
import { errorHandler } from "../helpers/errorHandler";
import { anchorScrapper } from "../helpers/contentScrapper";

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
  setFilterAction,
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
  getBJDFeedAction,
  getCEDFeedAction,
  getSHDFeedAction,
  setApplicationDataAction,
  setUserStoreAction,
  getUserStoreAction,
  getWileyAction,
  setCompleteUserApplicationAction,
  getTestUserAccountsAction,
  setIDFilterAction,
  getHospitalsAction,
  getBADMembershipSubscriptionData,
  getMembershipDataAction,
  handleApplyForMembershipAction,
  validateMembershipFormAction,
  useIsMounted,
  errorHandler,
  getDirectDebitAction,
  createDirectDebitAction,
  anchorScrapper,
  getWpPagesAction,
  setCPTBlockAction,
};
