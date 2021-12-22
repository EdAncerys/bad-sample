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
      ENVIRONMENT: process.env.ENVIRONMENT,
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
      menuUrl: "/menu/primary-menu",
      menu: null,
      activeDropDownRef: "activeDropDownRef",
      childMenuRef: null,
      contentContainer: 1350, // px units
      bannerHeight: 425, // px units
      marginHorizontal: 100, // px units
      marginVertical: 40, // px units
    },
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
        const { totalPages, page, next } = postData; // check if postData have multiple pages
        // fetch postData via wp API page by page
        let isThereNextPage = next;
        while (isThereNextPage) {
          await actions.source.fetch(isThereNextPage); // fetch next page
          const nextPage = state.source.get(isThereNextPage).next; // check ifNext page & set next page
          isThereNextPage = nextPage;
        }

        // pre load fonts from google
        import("webfontloader").then((WebFontLoader) => {
          console.log("fonts", WebFontLoader);

          WebFontLoader.load({
            google: {
              families: ["Roboto:700", "Lato"],
            },
          });
        });
      },
      afterCSR: async ({ state, actions }) => {
        console.log("afterCSR triggered"); // debug
        const menu = sessionStorage.getItem("badMenu"); // checking if menu already pre fetched from wp
        if (menu) state.theme.menu = JSON.parse(menu); // replacing menu stored in sessions with state var
      },
      setActiveDropDownRef: ({ state }) => setActiveDropDownRef({ state }),
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
