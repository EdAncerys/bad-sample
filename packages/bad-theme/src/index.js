import Root from "./screens/index";

import image from "@frontity/html2react/processors/image";
import iframe from "@frontity/html2react/processors/iframe";
import link from "@frontity/html2react/processors/link";
import menuHandler from "./components/handlers/menu-handler";

import { setLoginAction } from "./helpers/context";

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
      bannerHeight: 425, // px units
      marginHorizontal: 100, // px units
      marginVertical: 20, // px units
    },
    context: {
      loginAction: false,
    },
  },
  actions: {
    theme: {
      beforeCSR: async ({ state, actions }) => {
        console.log("beforeCSR triggered"); // debug
        // await Promise.all([actions.source.fetch("/")]);

        const menu = sessionStorage.getItem("badMenu"); // checking if menu already pre fetched from wp
        if (!menu) {
          await actions.source.fetch(`${state.theme.menuUrl}`);
          const badMenu = await state.source.data["/menu/primary-menu/"].items;

          sessionStorage.setItem("badMenu", JSON.stringify(badMenu));
        }
        if (menu) state.theme.menu = JSON.parse(menu);
      },
      afterCSR: async ({ state, actions }) => {
        //   setInterval(async () => {
        //     console.log("refresh cycle");
        //     // determine if there is an update between frontiy state and wp rest api info
        //     // if true do something
        //   }, 1000);
      },
    },
    context: {
      setLoginAction: ({ state }) => setLoginAction({ state }),
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
