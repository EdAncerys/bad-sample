import { handleGetCookie, handleSetCookie } from "./cookie";
import { authenticateAppAction, getUserStoreAction } from "../context";

export const authLogViaCookie = async ({ state, initialState }) => {
  const cookie = handleGetCookie({ name: `BAD-WebApp` });

  // ⏬⏬  user validation & auth ⏬⏬
  if (cookie) {
    console.log("API to get user data", cookie);
    const { jwt, contactid } = cookie;

    if (!contactid || !jwt) {
      console.log("Failed to Auth 🍪 data");
      handleSetCookie({ name: state.auth.COOKIE_NAME, deleteCookie: true });
      return null;
    }

    const URL = state.auth.APP_HOST + `/catalogue/data/contacts(${contactid})`;

    const requestOptions = {
      method: "GET",
      headers: { Authorization: "Bearer " + jwt },
    };

    try {
      const userResponse = await fetch(URL, requestOptions);
      const userData = await userResponse.json();

      const userStoreData = await getUserStoreAction({
        state,
        isActiveUser: userData,
      });

      if (userStoreData) {
        initialState.applicationData = userStoreData; // populates user application record
      }

      if (userData) {
        const taken = await authenticateAppAction({ state }); // replace taken with new one
        initialState.isActiveUser = userData; // populates user userResponse
        initialState.jwt = taken; // replace taken with new one
        console.log("initialState", initialState); // debug

        handleSetCookie({
          name: state.auth.COOKIE_NAME,
          value: { jwt: taken, contactid },
        });
      }
    } catch (error) {
      console.log("error", error);
      handleSetCookie({ name: state.auth.COOKIE_NAME, deleteCookie: true });
    }
  }
};

export const getWPMenu = async ({ state, actions }) => {
  const menu = sessionStorage.getItem("badMenu"); // checking if menu already pre fetched from wp
  if (!menu) {
    try {
      await actions.source.fetch(`${state.theme.menuUrl}`);
      const badMenu = await state.source.data["/menu/primary-menu/"].items;
      state.theme.menu = badMenu; // replacing menu stored in sessions with state var
      sessionStorage.setItem("badMenu", JSON.stringify(badMenu));
    } catch (error) {
      console.log("error: " + error);
    }
  } else {
    state.theme.menu = JSON.parse(menu);
  }
};

export const getEventsData = async ({ state, actions }) => {
  await actions.source.fetch(`/events/`); // fetch CPT events
  const events = state.source.get(`/events/`);
  const eventsNextPage = events.next; // check if events have multiple pages
  // fetch events via wp API page by page
  let isThereNextEventPage = eventsNextPage;
  while (isThereNextEventPage) {
    await actions.source.fetch(isThereNextEventPage); // fetch next page
    const nextPage = state.source.get(isThereNextEventPage).next; // check ifNext page & set next page
    isThereNextEventPage = nextPage;
  }
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
  // fetch leadershipTeam via wp API page by page
  let isThereNextLeadershipPage = leadershipTeamNextPage;
  while (isThereNextLeadershipPage) {
    await actions.source.fetch(isThereNextLeadershipPage); // fetch next page
    const nextPage = state.source.get(isThereNextLeadershipPage).next; // check ifNext page & set next page
    isThereNextLeadershipPage = nextPage;
  }
};
