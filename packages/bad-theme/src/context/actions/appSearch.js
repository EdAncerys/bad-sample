export const appSearchAction = async ({ state, query }) => {
  console.log("appSearchAction triggered");

  let pageNo = 1;
  let perPage = 20;
  let postData = [];
  let responseLength = perPage;

  const requestOptions = {
    method: "GET",
  };

  try {
    // fetch data while condition matches
    while (responseLength === perPage && pageNo < 5) {
      // while result length is equal perPage, then fetch next page
      let URL = `${state.auth.WP_HOST}/wp-json/relevanssi/v1/search?keyword=${query}&per_page=${perPage}&page=${pageNo}`;
      const data = await fetch(URL, requestOptions);
      if (!data.ok) throw new Error("error fetching data form API");
      const result = await data.json();
      // ⬇️ if data contains no result & msg break out of the loop ⬇️
      if (result.message === "Nothing found") {
        pageNo = 99;
        break;
      }

      responseLength = result.length;
      pageNo++;
      // spread response to postData equal to previous postData + new response
      postData = [...postData, ...result];
    }

    return postData;
  } catch (error) {
    console.log("error", error);
  }
};
