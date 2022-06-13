export const googleAutocomplete = async ({ input }) => {
  // --------------------------------------------------------------------------------
  // 📌  Google Autocomplete
  // --------------------------------------------------------------------------------

  console.log(input);

  if (!input) return;
  let response = [];
  // add delay for 500ms to prevent google autocomplete from firing too often
  await new Promise((resolve) => setTimeout(resolve, 500));

  const services = new google.maps.places.AutocompleteService();
  const request = {
    input,
    componentRestrictions: { country: "uk" },
    fields: ["address_components", "geometry", "icon", "name"],
    strictBounds: false,
  };

  await services.getPlacePredictions(request, (predictions, status) => {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
      console.log(status);
      return;
    }
    response = predictions;
  });

  console.log(response);
  return response;
};
