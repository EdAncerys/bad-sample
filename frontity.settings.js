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
          url: "http://3.9.193.188/",
        },
        postTypes: [
          {
            type: "guidelines_standards",
            endpoint: "guidelines-standards",
            archive: "guidelines-standards",
          },
          {
            type: "research_journals",
            endpoint: "research-journals",
            archive: "research-journals",
          },
          {
            type: "education-training",
            endpoint: "education-training",
            archive: "education-training",
          },
        ],
        taxonomies: [
          {
            taxonomy: "record",
            endpoint: "record",
            postTypeEndpoint: "record",
          },
        ],
      },
    },
    "@frontity/tiny-router",
    "@frontity/html2react",
  ],
};

export default settings;
