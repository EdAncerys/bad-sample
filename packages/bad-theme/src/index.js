import Root from "./screens/index";

import image from "@frontity/html2react/processors/image";
import iframe from "@frontity/html2react/processors/iframe";
import link from "@frontity/html2react/processors/link";
import menuHandler from "./components/handlers/menu-handler";

const BADTheme = {
  name: "bad-theme",
  roots: {
    theme: Root,
  },
  state: {
    theme: {
      myVariable: process.env.MY_VARIABLE,
      menuUrl: "/menu/primary-menu",
      bannerHeight: 425, // px units
      mainPadding: 100, // px units
    },
  },
  actions: {
    theme: {
      beforeCSR: async ({ state, actions }) => {
        // console.log("beforeCSR triggered"); // debug
        // await Promise.all([actions.source.fetch("/")]);
        await actions.source.fetch(`${state.theme.menuUrl}`);
      },
      afterCSR: async ({ state, actions }) => {
        //   setInterval(async () => {
        //     console.log("refresh cycle");
        //     // determine if there is an update between frontiy state and wp rest api info
        //     // if true do something
        //   }, 1000);
      },
      setLogin:
        ({ state }) =>
        (value) => {
          state.theme.isLoggedIn = value;
        },
      setTaken:
        ({ state }) =>
        (value) => {
          state.theme.jwt = value;
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
