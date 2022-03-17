export const getWpPagesAction = async () => {
  console.log("getWpPagesAction triggered");

  const URL = `http://3.9.193.188/wp-json/wp/v2/pages`;

  const requestOptions = {
    method: "GET",
  };

  try {
    const data = await fetch(URL, requestOptions);
    const result = await data.json();

    console.log(result);
  } catch (error) {
    console.log("error", error);
  }
};
