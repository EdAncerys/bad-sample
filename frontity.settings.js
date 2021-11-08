const settings = {
  name: "bad-org",
  state: {
    frontity: {
      url: "https://skylarkcreative.co.uk/",
      title: "British Association of Dermatologists (BAD)",
      description:
        "Frontity WEb App for professional membership body for dermatologists in the UK and abroad",
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
          url: "http://localhost:8888/bad/",
        },
        postTypes: [
          {
            type: "CUSTOM",
            endpoint: "CUSTOM",
            archive: "CUSTOM",
          },
        ],
      },
    },
    "@frontity/tiny-router",
    "@frontity/html2react",
  ],
};

export default settings;
