import { fetchDataHandler } from "../index";

export const getWpPagesAction = async ({ state }) => {
  // console.log("getWpPagesAction triggered");

  const path = `http://3.9.193.188/wp-json/wp/v2/pages`;

  try {
    const data = await fetchDataHandler({ path, state });
    const result = await data.json();
  } catch (error) {
    // console.log("error", error);
  }
};
