import Root from "./screens/index";

import image from "@frontity/html2react/processors/image";
import iframe from "@frontity/html2react/processors/iframe";
import link from "@frontity/html2react/processors/link";
import menuHandler from "./handlers/menu-handler";

const BADTheme = {
  name: "bad-theme",
  roots: {
    theme: Root,
  },
  state: {
    theme: {
      menuUrl: "/menu/primary-menu",
      menu: null,
      filter: null,
      pilFilter: null,
      addressFilter: null,
      activeDropDownRef: "activeDropDownRef",
      childMenuRef: null,
      contentContainer: 1350, // px units
      bannerHeight: 425, // px units
      marginHorizontal: 100, // px units
      marginVertical: 40, // px units
    },
    auth: {
      ENVIRONMENT: process.env.ENVIRONMENT,
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
      SEND_GRID_API: process.env.SEND_GRID_API,
      APP_USERNAME: process.env.APP_USERNAME,
      APP_PASSWORD: process.env.APP_PASSWORD,
      APP_HOST: process.env.APP_HOST,
    },
    autoPrefetch: "hover", // values: no | hover | in-view | all
    context: {},
  },
  actions: {
    theme: {
      beforeCSR: async ({ state, actions }) => {
        console.log("beforeCSR triggered"); // debug
        await Promise.all([
          actions.source.fetch(`/home-page`), // pre fetch home page CONTENT
          actions.source.fetch(`/bad-constitution`), // pre fetch WP menu as a page CONTENT
        ]);

        // pre fetch WP MENU ----------------------------------------------------------------------
        const menu = sessionStorage.getItem("badMenu"); // checking if menu already pre fetched from wp
        if (!menu) {
          try {
            await actions.source.fetch(`${state.theme.menuUrl}`);
            const badMenu = await state.source.data["/menu/primary-menu/"]
              .items;
            sessionStorage.setItem("badMenu", JSON.stringify(badMenu));
          } catch (error) {
            console.log("error: " + error);
          }
        }

        // pre fetch post data
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

        // pre fetch leadership_team data
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

        // pre fetch events data
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

        // pre load fonts from google
        import("webfontloader").then((WebFontLoader) => {
          // console.log("google fonts loaded"); // debug
          WebFontLoader.load({
            google: {
              families: ["Roboto:400,700", "Lato"],
            },
          });
        });
      },
      afterCSR: async ({ state, actions }) => {
        console.log("afterCSR triggered"); // debug
        const menu = sessionStorage.getItem("badMenu"); // checking if menu already pre fetched from wp
        if (menu) state.theme.menu = JSON.parse(menu); // replacing menu stored in sessions with state var
      },
    },
  },
  libraries: {
    html2react: {
      /**
       * Add a processor to `html2react` so it processes the `<img>` tags
       * and internal link inside the content HTML.
       * You can add your own processors too.
       */
      processors: [image, iframe, link],
    },
    source: {
      handlers: [menuHandler],
    },
  },
};

export default BADTheme;
