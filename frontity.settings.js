import { config } from "dotenv";
// Launch dot-env.
config();

const settings = {
  name: "bad-org",
  state: {
    frontity: {
      url: "https://skylarkcreative.co.uk/",
      title: "British Association of Dermatologists (BAD)",
      description:
        "Frontity WEb App for professional membership body for dermatologists in the UK and abroad",
    },
    env: {
      myVariable: process.env.MY_VARIABLE,
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
        },
        postTypes: [
          {
            type: "pils",
            endpoint: "pils",
            archive: "/pils",
          },
        ],
        taxonomies: [
          {
            taxonomy: "pils",
            endpoint: "pils",
            postTypeEndpoint: "pils",
          },
        ],
      },
    },
    "@frontity/tiny-router",
    "@frontity/html2react",
  ],
};

export default settings;
