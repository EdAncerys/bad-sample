import { fetchDataHandler } from "../index";

export const appSearchAction = async ({ state, query }) => {
  // console.log("appSearchAction triggered");
  let pageNo = 1;
  let perPage = 25;

  try {
    // ⬇️ fetch data while condition matches
    // let path =
    //   state.auth.WP_HOST +
    //   `/wp-json/relevanssi/v1/search?keyword=${query}&per_page=${perPage}&page=${pageNo}&_fields=id,title,link,type,content&orderby=title&order=ASC`;

    let path =
      state.auth.WP_HOST +
      `/wp-json/relevanssi/v1/search?keyword=${query}&per_page=${perPage}&page=${pageNo}&_fields=id,title,link,type,content`;

    const data = await fetchDataHandler({ path, state });
    console.log("🐞 ", data);
    if (!data.ok) throw new Error("error fetching data form API");
    const result = await data.json();
    console.log("🐞 serachResult ", result);
    // ⬇️ if data contains no result & msg break out of the loop ⬇️

    return result;
  } catch (error) {
    // console.log("error", error);
  }
};
