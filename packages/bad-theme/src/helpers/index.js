import { getUserDataByContactId, fetchDataHandler } from "../context";

const fetchCompleteHandler = ({ initialState }) => {
  // console.log("⬇️ user pre-fetch completed");
  initialState.isPlaceholder = false;
};

export const authCookieActionAfterCSR = async ({ state, dispatch }) => {
  console.log("🐞 authCookieActionAfterCSR triggered"); // debug
  let path = state.auth.APP_HOST + "/utils/cookie";

  try {
    const response = await fetchDataHandler({ path, state });

    if (response.ok) {
      // 📌 handle user data from Dynamics prefetch
      let data = await response.json();
      // console.log("🐞 RESPONSE data", data);
      const { level, contactid } = data.data;
      if (level !== "auth") return null; // if cookie is not auth level, don't proceed

      await getUserDataByContactId({
        state,
        dispatch,
        contactid,
      });
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const getWPMenu = async ({ state, actions }) => {
  const menu = sessionStorage.getItem("badMenu"); // checking if menu already pre fetched from wp

  if (!menu) {
    try {
      // pre-fetch wp menu
      await actions.source.fetch(`${state.theme.menuUrl}`);
      const badMenu = await state.source.data["/menu/primary-menu/"].items;
      sessionStorage.setItem("badMenu", JSON.stringify(badMenu)); // saving menu to session storage
      state.theme.menu = badMenu; // replacing menu stored in sessions with state var
    } catch (error) {
      // console.log("error: " + error);
    }
  } else {
    const badMenu = JSON.parse(menu);
    state.theme.menu = badMenu;
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
