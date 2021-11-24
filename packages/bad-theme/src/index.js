import Root from "./screens/index";

import image from "@frontity/html2react/processors/image";
import iframe from "@frontity/html2react/processors/iframe";
import link from "@frontity/html2react/processors/link";
import menuHandler from "./components/handlers/menu-handler";

import {
  setLoginAction,
  setCreateAccountAction,
  setActionFlipper,
  setEnquireAction,
} from "./helpers/context";

const BADTheme = {
  name: "bad-theme",
  roots: {
    theme: Root,
  },
  state: {
    theme: {
      myVariable: process.env.MY_VARIABLE,
      menuUrl: "/menu/primary-menu",
      menu: null,
      childMenuRef: null,
      bannerHeight: 425, // px units
      marginHorizontal: 100, // px units
      marginVertical: 20, // px units
    },
    context: {
      loginAction: false,
      createAccountAction: false,
      enquireAction: false,
    },
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
      },
      afterCSR: async ({ state, actions }) => {
        console.log("afterCSR triggered"); // debug
        const menu = sessionStorage.getItem("badMenu"); // checking if menu already pre fetched from wp
        if (menu) state.theme.menu = JSON.parse(menu); // replacing menu stored in sessions with state var
      },
    },
    context: {
      setLoginAction: ({ state }) => setLoginAction({ state }),
      setCreateAccountAction: ({ state }) => setCreateAccountAction({ state }),
      setActionFlipper: ({ state }) => setActionFlipper({ state }),
      setEnquireAction: ({ state }) => setEnquireAction({ state }),
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
