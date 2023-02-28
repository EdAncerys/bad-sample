export const googleAutocomplete = async ({ input }) => {
  // --------------------------------------------------------------------------------
  // 📌  Google Autocomplete
  // --------------------------------------------------------------------------------

  try {
    if (!input) return;
    let response = [];
    // add delay for 500ms to prevent google autocomplete from firing too often
    await new Promise((resolve) => setTimeout(resolve, 500));

    const services = new google.maps.places.AutocompleteService();
    const request = {
      input,
      componentRestrictions: {}, // limit to country ( country: "uk" }
      fields: ["address_components", "geometry", "icon", "name"],
      strictBounds: false,
    };

    await services.getPlacePredictions(request, (predictions, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
      }
      response = predictions;
    });

    return response;
  } catch (error) {
    // console.log('⭐️ ', error);
  }
};

// --------------------------------------------------------------------------------
// 📌  API KEY (public access ) 💩
// --------------------------------------------------------------------------------
const API_KEY = "CX19-MC83-CZ14-XN98";
const LOQATE_URL = `https://services.addressy.com/Capture/Interactive/Find/v1.10/json3.ws?key=${API_KEY}`;

export const loqateContainerBlob = async ({ Id = "", input = "" }) => {
  try {
    let url = `${LOQATE_URL}&text=${encodeURIComponent(
      input
    )}&Container=${encodeURIComponent(Id)}`;

    if (Id.length === 0) throw new Error("No id found."); // Throw an error if theres no Id provided

    let response = await fetch(url);
    let data = await response.json();

    return {
      success: true,
      message: `Address lookup successful.`,
      data: data?.Items,
    };
  } catch (error) {
    // console.log('⭐️ ', error);

    return { success: false, message: "No results found.", data: {} };
  }
};

export const loqateAddressLookupService = async ({ input = "" }) => {
  try {
    let addresses = [];
    let url = `${LOQATE_URL}&text=${encodeURIComponent(input)}`;

    // if no input throw an error
    if (input.length === 0) throw new Error("Please enter search address.");

    // delay search lookup to prevent multiple requests
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let response = await fetch(url);
    let data = await response.json();

    // --------------------------------------------------------------------------------
    // 📌  Preselect most relevant address for user | First item returned
    // --------------------------------------------------------------------------------
    const addressBlob = data?.Items?.[0];
    const Id = addressBlob?.Id;
    const type = addressBlob?.Type;
    addresses = data?.Items;

    if (type !== "Address") {
      // --------------------------------------------------------------------------------
      // 📌  Additional lookup key params
      // --------------------------------------------------------------------------------
      response = await loqateContainerBlob({ Id, input });
      addresses = response?.data;
    }

    return {
      success: true,
      message: `Address lookup successful. Length ${data?.Items?.length}`,
      data: addresses,
    };
  } catch (error) {
    // console.log('⭐️ ', error);

    return { success: false, message: "No results found." };
  }
};

export const loqateAddressBlob = async ({ Id = "" }) => {
  try {
    let url = `https://services.addressy.com/Capture/Interactive/Retrieve/v1.00/json3.ws?key=${API_KEY}&Id=${encodeURIComponent(
      Id
    )}`;

    if (Id.length === 0) throw new Error("No id found."); // Throw an error if theres no Id provided

    let response = await fetch(url);
    let data = await response.json();

    return {
      success: true,
      message: `Address lookup successful.`,
      data: data?.Items?.[0],
    };
  } catch (error) {
    // console.log('⭐️ ', error);

    return { success: false, message: "No results found.", data: {} };
  }
};
