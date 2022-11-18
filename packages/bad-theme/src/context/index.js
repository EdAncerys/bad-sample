import { fetchDataHandler } from "../helpers/fetchDataHandler";
import { handleSortFilter } from "../helpers/eventSortFilter";
import { hasPermisionLevel } from "../helpers/permitionLevel";
import { setAuthenticationCookieAction } from "../helpers/setAuthenticationCookie";
import { AppProvider, useAppDispatch, useAppState } from "./context";
import { handleSetCookie, handleGetCookie } from "../helpers/cookie";
import { handleUpdateMembershipApplication } from "../helpers/handleUpdateMembershipApplication";
import { googleAutocomplete } from "../helpers/googleAutocomplete";
import { Parcer } from "../helpers/parcer";
// --------------------------------------------------------------------------------
import { useRemoveScript } from "../hooks/useRemoveScript";
import { useScript } from "../hooks/useScript";
// --------------------------------------------------------------------------------
import { getFadPermision } from "../helpers/getFadPermision";
import { dateConverter } from "../helpers/dateConverter";
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
  handleRemoveServerSideCookie,
} from "./auth/actions";
import { sendEmailEnquireAction } from "./auth/sendEnquire";
import { getGenderAction } from "./auth/getGender";
import { getEthnicityAction } from "./auth/getEthnicity";
import { getCountryList } from "./auth/getCountryList";
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
  getMembershipTypes,
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
  getDermGroupsData,
  getReferralsData,
  getReferralsPage,
  getLeadershipData,
  getEventSpecialitys,
  getGuidelinesData,
} from "./actions/wpAPI";
import {
  getBJDFeedAction,
  getCEDFeedAction,
  getSHDFeedAction,
  setBJDFeedAction,
  setCEDFeedAction,
  setSHDFeedAction,
} from "./auth/rssFeed";
import { useIsMounted } from "../helpers/useIsMounted";
import { errorHandler, errorMessage } from "../helpers/errorHandler";
import { anchorScrapper } from "../helpers/contentScrapper";
import { copyToClipboard } from "../helpers/domEvents";
import { postTypeHandler } from "../helpers/postType";
import {
  authCookieActionAfterCSR,
  getWPMenu,
  getSIGGroupeData,
  getLeadershipTeamData,
} from "../helpers";

// --------------------------------------------------------------------------------
// 📌  RETURNS:
// --------------------------------------------------------------------------------
export * from "../helpers/validateMembership";
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
  setBJDFeedAction,
  setCEDFeedAction,
  setSHDFeedAction,
  setApplicationDataAction,
  setUserStoreAction,
  getUserStoreAction,
  getWileyAction,
  setCompleteUserApplicationAction,
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
  getEventsData,
  getEventLocations,
  getEventSpecialtys,
  getNewsData,
  getMediaCategories,
  setMediaCategoriesAction,
  getGuidelinesData,
  getGuidelinesTypes,
  getMembershipTypes,
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
  getDermGroupsData,
  getReferralsData,
  getReferralsPage,
  getLeadershipData,
  getFundingData,
  getEventSpecialitys,
  getEventGrades,
  handleSortFilter,
  fetchDataHandler,
  setAuthenticationCookieAction,
  handleSetCookie,
  handleGetCookie,
  handleUpdateMembershipApplication,
  googleAutocomplete,
  hasPermisionLevel,
  getGenderAction,
  getCountryList,
  handleRemoveServerSideCookie,
  Parcer,
  getFadPermision,
  useRemoveScript,
  useScript,
  dateConverter,
  errorMessage,
};

// --------------------------------------------------------------------------------
// 📌  Default exports:
// --------------------------------------------------------------------------------

export * from "../config/form";
export * from "../config/imports";
