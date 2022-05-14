import { handleGetCookie, handleSetCookie } from "./cookie";
import {
  authenticateAppAction,
  getUserStoreAction,
  getUserDataByContactId,
  fetchDataHandler,
} from "../context";

const fetchCompleteHandler = ({ initialState }) => {
  // console.log("⬇️ user pre-fetch completed");
  initialState.isPlaceholder = false;
};

export const authCookieActionBeforeCSR = async ({
  state,
  initialState,
  dispatch,
}) => {
  const cookie = handleGetCookie({ name: state.auth.COOKIE_NAME });

  // ⏬⏬  user validation & auth ⏬⏬
  if (cookie) {
    let { jwt, contactid } = cookie;

    if (!contactid || !jwt) {
      // console.log("Failed to Auth 🍪 data");
      handleSetCookie({ name: state.auth.COOKIE_NAME, deleteCookie: true });
      return null;
    }

    if (state.auth.ENVIRONMENT === "DEVELOPMENT") {
      // dev env testing on refresh overwrites cookie value
      // contactid = "cc9a332a-3672-ec11-8943-000d3a43c136"; // andy
      // contactid = "969ba377-a398-ec11-b400-000d3aaedef5"; // emilia
      // contactid = "a167c3ee-ba93-e711-80f5-3863bb351f50", // membership
    }

    const catalogueURL =
      state.auth.APP_HOST + `/catalogue/data/contacts(${contactid})`;
    const dynamicAppsURL =
      state.auth.APP_HOST + `/applications/billing/` + contactid;

    try {
      const userResponse = await fetchDataHandler({
        path: catalogueURL,
        state,
      }); // fetch user data
      const appsResponse = await fetchDataHandler({
        path: dynamicAppsURL,
        state,
      }); // fetch dynamic application data

      if (!userResponse.ok)
        throw new Error(`${userResponse.statusText} ${userResponse.status}`); // fetch user data from Dynamics
      const userData = await userResponse.json();

      if (!appsResponse.ok)
        throw new Error(`${appsResponse.statusText} ${appsResponse.status}`); // fetch user data from Dynamics
      const appsData = await appsResponse.json();

      const userStoreData = await getUserStoreAction({
        state,
        dispatch,
        isActiveUser: userData,
      });

      if (userStoreData) {
        initialState.applicationData = userStoreData; // populates user application record
      }

      if (userData && appsData) {
        const taken = await authenticateAppAction({
          state,
          dispatch,
        }); // replace taken with new one
        initialState.isActiveUser = userData; // populates user userResponse
        initialState.dynamicsApps = appsData;
        initialState.jwt = taken; // replace taken with new one

        handleSetCookie({
          name: state.auth.COOKIE_NAME,
          value: { jwt: taken, contactid },
        });
      }
    } catch (error) {
      // console.log("error", error);
      handleSetCookie({ name: state.auth.COOKIE_NAME, deleteCookie: true });
    } finally {
      fetchCompleteHandler({ initialState });
    }
  } else {
    fetchCompleteHandler({ initialState });
  }
};

export const authCookieActionAfterCSR = async ({ state, dispatch }) => {
  const cookie = handleGetCookie({ name: state.auth.COOKIE_NAME });

  // ⏬⏬  user validation & auth ⏬⏬
  if (cookie) {
    // console.log("🍪 found", cookie);
    let { jwt, contactid } = cookie;

    if (!contactid || !jwt) {
      // console.log("Failed to Auth 🍪 data");
      handleSetCookie({ name: state.auth.COOKIE_NAME, deleteCookie: true });
      return null;
    }

    try {
      const userData = await getUserDataByContactId({
        state,
        dispatch,
        jwt,
        contactid,
      });
      if (!userData) throw new Error("Error getting userData.");

      // console.log("⬇️ userData successfully pre-fetched", userData); // debug
    } catch (error) {
      // console.log("error", error);
      handleSetCookie({ name: state.auth.COOKIE_NAME, deleteCookie: true });
    }
  }
};

export const getWPMenu = async ({ state, actions }) => {
  const menu = sessionStorage.getItem("badMenu"); // checking if menu already pre fetched from wp
  // pre-fetch custom post types for menus (for wp menu)
  await actions.source.fetch(`/menu_features`);

  if (!menu) {
    try {
      // pre-fetch wp menu
      await actions.source.fetch(`${state.theme.menuUrl}`);
      const badMenu = await state.source.data["/menu/primary-menu/"].items;
      state.theme.menu = badMenu; // replacing menu stored in sessions with state var
      sessionStorage.setItem("badMenu", JSON.stringify(badMenu));
    } catch (error) {
      // console.log("error: " + error);
    }
  } else {
    state.theme.menu = JSON.parse(menu);
  }
};

export const getEventsData = async ({ state, actions }) => {
  await actions.source.fetch(`/events/`); // fetch CPT events
  let events = state.source.get(`/events/`);
  const eventsNextPage = events.next; // check if events have multiple pages
  // fetch events via wp API page by page
  let isThereNextEventPage = eventsNextPage;
  while (isThereNextEventPage) {
    await actions.source.fetch(isThereNextEventPage); // fetch next page
    const nextPage = state.source.get(isThereNextEventPage).next; // check ifNext page & set next page
    isThereNextEventPage = nextPage;
    events = state.source.events;
  }

  return events;
};

export const getPostData = async ({ state, actions }) => {
  await actions.source.fetch(`/posts/`); // fetch CPT postData
  const postData = state.source.get(`/posts/`);
  const postDataNextPage = postData.next; // check if postData have multiple pages
  // fetch postData via wp API page by page
  let isThereNextPostPage = postDataNextPage;
  while (isThereNextPostPage) {
    await actions.source.fetch(isThereNextPostPage); // fetch next page
    const nextPage = state.source.get(isThereNextPostPage).next; // check ifNext page & set next page
    isThereNextPostPage = nextPage;
  }
};

export const getLeadershipTeamData = async ({ state, actions }) => {
  await actions.source.fetch(`/leadership_team/`); // fetch CPT leadershipTeam
  const leadershipTeam = state.source.get(`/leadership_team/`);
  const leadershipTeamNextPage = leadershipTeam.next; // check if leadershipTeam have multiple pages
  let iteration = 0;
  let data = null;
  let dataLength = 0;
  if (data) dataLength = Object.values(data).length;

  // fetch leadershipTeam via wp API page by page
  let isThereNextLeadershipPage = leadershipTeamNextPage;
  while (isThereNextLeadershipPage) {
    // await for 500 ms to avoid wp api rate limit
    await actions.source.fetch(isThereNextLeadershipPage); // fetch next page
    const nextPage = state.source.get(isThereNextLeadershipPage).next; // check ifNext page & set next page
    isThereNextLeadershipPage = nextPage;
    data = state.source.leadership_team;
  }
  // if data is null loop with delay for 500 ms to avoid wp api rate limit
  while (dataLength < 25 && iteration < 10) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    data = state.source.leadership_team;
    iteration++;
  }

  return data;
};

export const getSIGGroupeData = async ({ state, actions }) => {
  await actions.source.fetch(`/sig_group/`); // fetch CPT leadershipTeam
  const leadershipTeam = state.source.get(`/sig_group/`);
  const leadershipTeamNextPage = leadershipTeam.next; // check if leadershipTeam have multiple pages
  // fetch leadershipTeam via wp API page by page
  let isThereNextLeadershipPage = leadershipTeamNextPage;
  while (isThereNextLeadershipPage) {
    await actions.source.fetch(isThereNextLeadershipPage); // fetch next page
    const nextPage = state.source.get(isThereNextLeadershipPage).next; // check ifNext page & set next page
    isThereNextLeadershipPage = nextPage;
  }
};
