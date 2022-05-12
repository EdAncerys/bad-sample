import { handleSortFilter } from "../helpers/eventSortFilter";
import { AppProvider, useAppDispatch, useAppState } from "./context";
import {
  setGoToAction,
  setLinkWrapperAction,
  setFilterAction,
  setAppSearchDataAction,
  setAppSearchPhraseAction,
  setFetchAction,
  setErrorAction,
  setApplicationDataAction,
  setIdFilterAction,
  setNesMediaIdFilterAction,
  setCPTBlockAction,
  setCPTBlockTypeAction,
  setEventAnchorAction,
  setDashboardNotificationsAction,
  setDashboardPathAction,
  setNotificationAction,
  setDebitHandlerAction,
  setPlaceholderAction,
  setRedirectAction,
} from "./actions/actions";
import { muiQuery } from "./mediaQueryContext";
import {
  setLoginModalAction,
  setCreateAccountModalAction,
  setEnquireAction,
} from "./actions/navigation";
import { getPILsDataAction, getGuidelinesDataAction } from "./actions/getCPT";
import { appSearchAction } from "./actions/appSearch";
import { googleAutocompleteAction } from "./actions/googleAPI";
import {
  loginAction,
  logoutAction,
  authenticateAppAction,
  getUserAction,
  getUserDataByContactId,
  getUserDataByEmail,
  getUserDataFromDynamics,
  seRefreshJWTAction,
} from "./auth/actions";
import { sendEmailEnquireAction } from "./auth/sendEnquire";
import { getEthnicityAction } from "./auth/getEthnicity";
import {
  getMembershipDataAction,
  handleApplyForMembershipAction,
  validateMembershipFormAction,
  handleValidateMembershipChangeAction,
} from "./actions/memberships";
import { getWpPagesAction } from "./actions/getWpPages";
import { getTweetsAction } from "./auth/getTweets";
import {
  getFadAction,
  setFadAction,
  getAllFadAction,
  getFADSearchAction,
} from "./auth/getFAD";
import { updateProfileAction } from "./auth/updateProfile";
import {
  updateAddressAction,
  updateEthnicityAction,
} from "./auth/updateUserDetails";
import { sendFileToS3Action } from "./auth/saveFileToS3";
import { getBADMembershipSubscriptionData } from "./auth/getBADMembershipSubscriptionData";
import { getApplicationStatus } from "./auth/getApplicationStatus";
import {
  getDirectDebitAction,
  createDirectDebitAction,
  getInvoiceAction,
  getProofOfMembershipAction,
} from "./auth/directDebit";
import {
  setUserStoreAction,
  getUserStoreAction,
  setCompleteUserApplicationAction,
  getUserApplicationAction,
  deleteApplicationAction,
} from "./auth/userStore";
import { getWileyAction } from "./auth/getWiley";
import { getTestUserAccountsAction } from "./auth/getTestUserAccounts";
import { getHospitalsAction, getHospitalNameAction } from "./auth/getHospitals";
import {
  getEventsData,
  getEventGrades,
  getEventLocations,
  getEventSpecialtys,
  getNewsData,
  getMediaCategories,
  setMediaCategoriesAction,
  getGuidelinesTypes,
  getVenuesData,
  getVideosData,
  getFundingData,
  getFundingTypes,
  getMembershipData,
  getLeadershipGrades,
  getLeadershipPositions,
  getSIGData,
  getCPTData,
  getCPTTaxonomy,
  getElectionsData,
  getLeadershipData,
  getEventSpecialitys,
  getGuidelinesData,
} from "./actions/wpAPI";
import {
  getBJDFeedAction,
  getCEDFeedAction,
  getSHDFeedAction,
} from "./auth/rssFeed";
import { useIsMounted } from "../helpers/useIsMounted";
import { errorHandler } from "../helpers/errorHandler";
import { anchorScrapper } from "../helpers/contentScrapper";
import { copyToClipboard } from "../helpers/domEvents";
import { postTypeHandler } from "../helpers/postType";
import {
  authCookieActionAfterCSR,
  getWPMenu,
  getSIGGroupeData,
  getLeadershipTeamData,
} from "../helpers";

export {
  AppProvider,
  useAppDispatch,
  useAppState,
  muiQuery,
  setGoToAction,
  setLinkWrapperAction,
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
  getAllFadAction,
  getFADSearchAction,
  setFadAction,
  getUserAction,
  getUserDataByContactId,
  getUserDataByEmail,
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
  setIdFilterAction,
  setNesMediaIdFilterAction,
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
  setCPTBlockTypeAction,
  setEventAnchorAction,
  setDashboardNotificationsAction,
  getApplicationStatus,
  updateEthnicityAction,
  getHospitalNameAction,
  setDashboardPathAction,
  setNotificationAction,
  setDebitHandlerAction,
  copyToClipboard,
  authCookieActionAfterCSR,
  setPlaceholderAction,
  setRedirectAction,
  getWPMenu,
  getUserApplicationAction,
  getSIGGroupeData,
  deleteApplicationAction,
  getUserDataFromDynamics,
  getInvoiceAction,
  getProofOfMembershipAction,
  handleValidateMembershipChangeAction,
  getPILsDataAction,
  getGuidelinesDataAction,
  appSearchAction,
  getLeadershipTeamData,
  setAppSearchDataAction,
  setAppSearchPhraseAction,
  postTypeHandler,
  getEthnicityAction,
  googleAutocompleteAction,
  seRefreshJWTAction,
  getEventsData,
  getEventLocations,
  getEventSpecialtys,
  getNewsData,
  getMediaCategories,
  setMediaCategoriesAction,
  getGuidelinesData,
  getGuidelinesTypes,
  getVenuesData,
  getVideosData,
  getFundingTypes,
  getMembershipData,
  getLeadershipGrades,
  getLeadershipPositions,
  getSIGData,
  getCPTData,
  getCPTTaxonomy,
  getElectionsData,
  getLeadershipData,
  getFundingData,
  getEventSpecialitys,
  getEventGrades,
  handleSortFilter,
};
