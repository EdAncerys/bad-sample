import { config } from "dotenv";
import { fetch } from "frontity";
import packageClient from "./client";

// Launch dotenv.
config();

export default {
  ...packageClient,
  actions: {
    theme: {
      ...packageClient.actions.theme,
      beforeSSR: async ({ state }) => {
        // console.log("Server side beforeSSR triggered");
        const { API_KEY } = process.env;
        // console.log("API_KEY", API_KEY);
        console.log("API KEY", API_KEY);
        const lol = await fetch(process.env.WP_HOST + "wp-json/wp/v2/events");
        const ferry = await lol.json();
        console.log("FERRY", ferry);
      },
    },
  },
};
