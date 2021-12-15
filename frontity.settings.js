import { config } from "dotenv";
// Launch dot-env.
config();

const settings = {
  name: "bad-org",
  state: {
    frontity: {
      url: "https://skylarkcreative.co.uk/",
      title: "British Association of Dermatologists (BAD)",
      description: "British Association of Dermatologists (BAD) WebApp",
    },
    env: {
      MY_VARIABLE: process.env.MY_VARIABLE,
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    },
  },
  packages: [
    {
      name: "bad-theme",
      state: {
        theme: {
          featured: {
            showOnList: false,
            showOnPost: false,
          },
        },
      },
    },
    {
      name: "@frontity/wp-source",
      state: {
        source: {
          url: "https://badadmin.skylarkdev.co/", // production url
          // api: "https://app-5efddb43c1ac181508283e93.closte.com/wp-json", // frontity example api
          params: {
            per_page: 50, // limit per page fetch request
          },
          postTypes: [
            {
              type: "pils",
              endpoint: "pils",
              archive: "/pils",
            },
            {
              type: "events",
              endpoint: "events",
              archive: "/events",
            },
            {
              type: "guidelines_standards",
              endpoint: "guidelines_standards",
              archive: "/guidelines_standards",
            },
            {
              type: "venues",
              endpoint: "venues",
              archive: "/venues",
            },
            {
              type: "education_training",
              endpoint: "education_training",
              archive: "/education_training",
            },
          ],
          taxonomies: [
            {
              taxonomy: "event_type", // taxonomy slug
              endpoint: "events", // REST API endpoint
              postTypeEndpoint: "events", // endpoint from which posts from this taxonomy are fetched
            },
          ],
        },
      },
    },
    "@frontity/tiny-router",
    "@frontity/html2react",
  ],
};

export default settings;
