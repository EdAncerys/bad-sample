import Root from "./screens/index";

import image from "@frontity/html2react/processors/image";
import iframe from "@frontity/html2react/processors/iframe";
import link from "@frontity/html2react/processors/link";
import menuHandler from "./handlers/menu-handler";

import {
  authLogViaCookie,
  getWPMenu,
  getEventsData,
  getPostData,
  getLeadershipTeamData,
} from "./helpers";
// CONTEXT ----------------------------------------------------------------
import { initialState } from "../src/context/reducer";
import { getMembershipDataAction } from "../src/context";
import { handleSetCookie } from "./helpers/cookie";

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
      BASE_URL: process.env.BASE_URL,
      DYNAMICS_BRIDGE: process.env.DYNAMICS_BRIDGE,
      IFRAME_URL: process.env.IFRAME_URL,
      HOST_URL: process.env.HOST_URL,
      APP_URL: process.env.APP_URL,
      COOKIE_NAME: "BAD-WebApp",
    },
    autoPrefetch: "hover", // values: no | hover | in-view | all
    context: {
      transId: null,
    },
  },
  actions: {
    theme: {
      beforeCSR: async ({ state, actions }) => {
        console.log("beforeCSR triggered"); // debug
        await Promise.all([
          actions.source.fetch(`/home-page`), // pre fetch home page CONTENT
          actions.source.fetch(`/menu_features`), // pre fetch menu featured CPT
        ]);

        // pre fetch WP MENU --------------------------------------------------------------
        await getWPMenu({ state, actions });

        // pre fetch post data
        await getPostData({ state, actions });
        // pre fetch leadership_team data
        await getLeadershipTeamData({ state, actions });
        // pre fetch events data
        await getEventsData({ state, actions });

        // handle auth login auth via cookies
        await authLogViaCookie({ state, initialState });

        // ⬇️ handle set cookie fro video guide block to do silent login
        // https://www.skinhealthinfo.org.uk/support-resources/video-guides/
        handleSetCookie({
          name: "vuid",
          value: "pl2063596275.1804324093",
          domain: ".vimeo.com",
        });

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

        // pre fetch membership data
        await getMembershipDataAction({ state, actions });
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
