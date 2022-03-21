export const appSearchAction = async ({ query }) => {
  console.log("appSearchAction triggered");
  console.log("query", query);

  if (!query || query.length < 2) return; // restrict API call if less then 2 characters
  await new Promise((resolve) => setTimeout(resolve, 500)); // set delay on API call

  const URL = `http://3.9.193.188/wp-json/relevanssi/v1/search?keyword=${query}`;

  const requestOptions = {
    method: "GET",
  };

  try {
    const data = await fetch(URL, requestOptions);
    if (!data) throw new Error("No data returned");
    const result = await data.json();

    return result;
  } catch (error) {
    console.log("error", error);
  }
};
