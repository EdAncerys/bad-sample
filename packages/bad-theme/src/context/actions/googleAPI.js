export const googleAutocompleteAction = async ({ state, query }) => {
  // console.log("googleAutocompleteAction triggered");
  // restrict calls if query is less than 2 characters
  if (query.length < 2) return;

  const GOOGLE_API_KEY = state.auth.GOOGLE_API_KEY;
  const URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${GOOGLE_API_KEY}&components=country:UK`;

  // specify headers with CORS policy
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
    },
  };

  try {
    const data = await fetch(URL, requestOptions);
    const result = await data.json();

    if (result.status === "OK") {
      return result.predictions;
    } else {
      return [];
    }
  } catch (error) {
    // console.log("error", error);
  }
};
