export const appSearchAction = async ({ state, query }) => {
  console.log("appSearchAction triggered");

  let pageNo = 1;
  let perPage = 20;
  let postData = [];
  let responseLength = perPage;

  if (!query || query.length < 2) return; // restrict API call if less then 2 characters
  // await new Promise((resolve) => setTimeout(resolve, 500)); // set delay on API call

  const requestOptions = {
    method: "GET",
  };

  try {
    // fetch data while condition matches
    while (responseLength === perPage && pageNo < 5) {
      // while result length is equal perPage, then fetch next page
      let URL = `${state.auth.WP_HOST}/wp-json/relevanssi/v1/search?keyword=${query}&per_page=${perPage}&page=${pageNo}`;
      const data = await fetch(URL, requestOptions);
      if (!data) throw new Error("error fetching data form API");
      const result = await data.json();
      // if result is empty then break
      if (result.message === "Nothing found") break;
      console.log("postData", postData);
      console.log("result", result);

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
