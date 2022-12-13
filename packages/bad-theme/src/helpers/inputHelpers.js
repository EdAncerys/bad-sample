import { fetchHandler } from "./handler";
import {
  group_810170000,
  group_810170001,
  group_810170002,
  group_810170003,
  group_810170004,
  group_810170005,
  group_810170006,
  group_810170007,
  retiredTypeFilters,
  retiredNoJournalFilters,
  ordinarySASFilters,
  associateFilters,
  juniorFilters,
  traineeFilters,
  studentFilters,
  ordinaryFilters,
  associateOverseasFilters,
} from "../config/form";
// --------------------------------------------------------------------------------

export const getMembershipTypes = async ({ state }) => {
  let pageNo = 1;
  const params = `per_page=10&_fields=id,slug,acf`;
  let url =
    state.auth.WP_HOST + `/wp-json/wp/v2/memberships?${params}&page=${pageNo}`;

  try {
    let data = [];

    // ⬇️ fetch data via wp API page by page
    let response = await fetchHandler({ path: url });
    let totalPages = response?.headers.get("X-WP-TotalPages") ?? 0;

    while (response?.status === 200) {
      let json = await response.json();

      data = [...data, ...json];
      pageNo++;
      url =
        state.auth.WP_HOST +
        `/wp-json/wp/v2/memberships?${params}&page=${pageNo}`;

      // 📌 break out of the loop if no more pages
      if (pageNo > +totalPages) break;
      response = await fetchHandler({ path: url });
    }
    return data;
  } catch (error) {
    console.log("🐞 ", error);
  }
};

export const getUserStoreAction = async ({ state, id }) => {
  try {
    if (!id) {
      throw new Error("Cannot set user store. Contactid is missing.");
    }

    const path = state.auth.APP_HOST + `/applications/current/${id}`;

    const response = await fetchHandler({ path });
    const { data } = await response?.json();

    return data;
  } catch (error) {
    console.log("🐞 ", error);
  }
};

export const loginHandler = async () => {
  try {
    // --------------------------------------------------------------------------------
    // 📌  B2C login auth path endpoint
    // 📌 auth B2c redirect url based on App default url
    // --------------------------------------------------------------------------------
    const b2cRedirect = `&redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/codecollect`;
    let ACTION = "login";

    const url =
      process.env.NEXT_PUBLIC_B2C +
      `${b2cRedirect}&scope=openid&response_type=id_token&prompt=${ACTION}`;

    // 📌 redirect to B2C login page
    window.location.href = "https://" + "www.google.com";
    // window.location.href = process.env.NEXT_PUBLIC_B2C as string;
  } catch (error) {
    console.log("🐞 ", error);
  }
};

export const checkB2CStatus = async ({ state }) => {
  // --------------------------------------------------------------------------------
  // 📌  Check B2C status & validate cookies 🍪
  // --------------------------------------------------------------------------------

  let path = state.auth.APP_HOST + "/utils/cookie";

  try {
    const response = await fetchHandler({ path });
    const json = await response?.json();
    const data = json?.data;
    console.log("🐞 res: ", data);

    return data;
  } catch (error) {
    console.log("🐞 ", error);
  }
};

export const getHospitalsAction = async ({ state, input }) => {
  const path =
    state.auth.APP_HOST + `/catalogue/lookup/hospitals?search=${input}`;

  try {
    const response = await fetchHandler({ path });
    const { data } = await response?.json();

    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const googleAutocomplete = async ({ input }) => {
  // --------------------------------------------------------------------------------
  // 📌  Google Autocomplete
  // --------------------------------------------------------------------------------

  if (!input) return;
  let response = [];
  // add delay for 500ms to prevent google autocomplete from firing too often
  await new Promise((resolve) => setTimeout(resolve, 500));

  const services = new google.maps.places.AutocompleteService();
  const request = {
    input,
    // componentRestrictions: {}, // to limit to country ( country: "uk" }
    fields: ["address_components", "geometry", "name"], // 👉 return all address components including country, state, city, postcode, etc
    strictBounds: false,
  };

  await services.getPlacePredictions(request, (predictions, status) => {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
      return;
    }
    response = predictions;
  });

  return response;
};

export const sendFileToS3Action = async ({ state, attachments }) => {
  const path = state.auth.APP_HOST + `/s3/profile/image`;

  // extract file extension name from attachment
  const fileExtension = attachments.name.split(".").pop();
  const name = attachments.name.split(".").slice(0, -1).join(".");
  const fileName = name + "." + fileExtension;

  const form = new FormData(); // create form object to sent email content & attachments
  form.append("profile", attachments, fileName); // append file to form object

  const requestOptions = {
    method: "PUT",
    body: form,
    credentials: "include",
  };

  try {
    const response = await fetch(path, requestOptions);
    const data = await response.json();
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const getHospitalNameAction = async ({ state, id }) => {
  const path =
    state.auth.APP_HOST +
    `/catalogue/data/accounts(${id})?$select=name,address1_composite,customertypecode,customertypecode`;

  try {
    const response = await fetchHandler({ path });
    const data = await response?.json();

    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const getBADMembershipSubscriptionData = async ({
  state,
  category,
  type,
}) => {
  const year = new Date().getFullYear(); // get current year
  let dateType = category === "SIG" ? ":" + year : "::" + year; // date type for query with prefix of : or ::

  const path =
    state.auth.APP_HOST +
    `/catalogue/lookup/membershiptype?search=${category}:${type}${dateType}`;
  console.log("⭐️ ", path);

  try {
    const response = await fetchHandler({ path });
    const { data } = await response?.json();
    console.log("⭐️ ", data);

    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const jobRoleHandler = ({ name, Label, form }) => {
  if (form?.formus_staffgroupcategory === "") {
    // 📌  if job role is selected, return all job roles
    return true;
  }

  if (
    form?.formus_staffgroupcategory === "810170000" &&
    group_810170000?.filter((item) => item === Label)?.length > 0 // 📌  if allowed job role matches selected job role
  )
    return true;
  if (
    form?.formus_staffgroupcategory === "810170001" &&
    group_810170001?.filter((item) => item === Label)?.length > 0 // 📌  if allowed job role matches selected job role
  )
    return true;
  if (
    form?.formus_staffgroupcategory === "810170002" &&
    group_810170002?.filter((item) => item === Label)?.length > 0 // 📌  if allowed job role matches selected job role
  )
    return true;
  if (
    form?.formus_staffgroupcategory === "810170003" &&
    group_810170003?.filter((item) => item === Label)?.length > 0 // 📌  if allowed job role matches selected job role
  )
    return true;
  if (
    form?.formus_staffgroupcategory === "810170004" &&
    group_810170004?.filter((item) => item === Label)?.length > 0 // 📌  if allowed job role matches selected job role
  )
    return true;
  if (
    form?.formus_staffgroupcategory === "810170005" &&
    group_810170005?.filter((item) => item === Label)?.length > 0 // 📌  if allowed job role matches selected job role
  )
    return true;
  if (
    form?.formus_staffgroupcategory === "810170006" &&
    group_810170006?.filter((item) => item === Label)?.length > 0 // 📌  if allowed job role matches selected job role
  )
    return true;
  if (
    form?.formus_staffgroupcategory === "810170007" &&
    group_810170007?.filter((item) => item === Label)?.length > 0 // 📌  if allowed job role matches selected job role
  )
    return true;

  return false;
};

export const updateDynamicsApplicationAction = async ({
  state,
  contactid,
  application,
}) => {
  try {
    const path = state.auth.APP_HOST + `/applications/current/${contactid}`;

    const response = await fetchHandler({
      path,
      method: "POST",
      body: application,
    });
    const data = await response?.json();

    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const submitUserApplication = async ({
  state,
  contactid,
  application,
  changeAppCategory,
}) => {
  try {
    if (!contactid || !application)
      throw new Error("Error. Missing contactid or application.");

    let msg = "Application been successfully submitted!";
    const type = application?.[0]?.bad_categorytype;
    if (type) msg = `Your ${type} application has been successfully submitted!`;
    if (changeAppCategory) {
      msg = `Application change to ${changeAppCategory?.bad_categorytype} from ${application?.[0]?.bad_categorytype} been successfully submitted!`; // change of category for BAD application error message
    }

    const path = state.auth.APP_HOST + `/applications/new/${contactid}`;

    const response = await fetchHandler({
      path,
      method: "POST",
      body: application, // application data
    });
    const data = await response?.json();

    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const inputShowHandler = ({ form, name }) => {
  let show = true;

  // --------------------------------------------------------------------------------
  // ⚠️ MANUAL INPUT HANDLER & FILTER ⚠️
  // 👇 comment out to disable manual input show/hide logic
  // 👉 place first not to overwrite other logic below
  // --------------------------------------------------------------------------------
  show = manualFilterHandler({ form, name, show });

  if (form?.bad_organisedfor === "810170001") {
    // --------------------------------------------------------------------------------
    // ⚠️ if SIG application hide following input
    // --------------------------------------------------------------------------------
    if (name === "sky_profilepicture") show = false;
  }

  // --------------------------------------------------------------------------------
  // 📌  Handle input show/hide logic for multiple inputs
  // --------------------------------------------------------------------------------
  if (name === "formus_privatepracticeorganisation") {
    if (
      form?.["formus_typeofpractice"] === "810170001" ||
      form?.["formus_typeofpractice"] === undefined
    )
      show = false;
  }

  // --------------------------------------------------------------------------------
  // 📌  Handle conditional input show/hide logic for other qualification input
  // --------------------------------------------------------------------------------
  if (name === "formus_otherqualificationtype") {
    if (form?.["formus_qualificationtype"] !== "810170007") show = false;
  }
  if (name === "formus_othermainspecialtyqualification") {
    if (!form?.["formus_mainspecialtyqualification"]?.includes("810170008"))
      show = false;
  }
  // 👉 trainee application only input
  if (name === "formus_otherreasonformovingccstdate") {
    if (
      form?.["formus_qualificationtype"] !== "810170007" ||
      form?.["bad_categorytype"] !== "Trainee"
    )
      show = false;
  }

  // --------------------------------------------------------------------------------
  // 📌  Hospital input show/hide logic
  // --------------------------------------------------------------------------------
  if (name === "sky_newhospitaltype" || name === "sky_newhospitalname") {
    if (!form?.bad_newhospitaladded) show = false;
  }
  if (name === "py3_hospitalid") {
    if (form?.bad_newhospitaladded) show = false;
  }

  // ...addition to logic here

  return show;
};

export const dataExtractor = ({ application }) => {
  // --------------------------------------------------------------------------------
  // 📌  Extract data from user application blob
  // --------------------------------------------------------------------------------
  let blob = {};
  let virtual = {};

  application?.map((application) => {
    if (application?.info?.AttributeType === "Virtual")
      virtual = {
        ...virtual,
        [application.name]: application?.info?.AttributeType,
      };
    blob = {
      ...blob,
      [application.name]: {
        Label: application?.info?.Label || "Input Lapbel",
        Placeholder: application?.info?.Label || "Input Lapbel",
        AttributeType: application?.info?.AttributeType || "",
        MaxLength: application?.info?.MaxLength || 100,
        Required: application?.info?.Required || "None",
        order: 0,
        hidden: false,
        width: "100%",
        caption: "",
        Handler: undefined,
      },
    };
  });

  console.log("🐞 blob", JSON.stringify(blob));
  console.log("🐞 virtual", JSON.stringify(virtual));
};

export const manualFilterHandler = ({ form, name, show }) => {
  // --------------------------------------------------------------------------------
  // 📌 Manual application input handlers for show/hide based on bad_categorytype selection
  // 👉 apply actions manual name list based on app type
  // --------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------
  // 📌  for form step 2 return show. All input will be shown
  // --------------------------------------------------------------------------------
  if (form?.step === 2) return show;
  let filterOptions = retiredTypeFilters;

  if (form?.bad_categorytype === "Ordinary SAS") {
    filterOptions = ordinarySASFilters;
  }
  if (form?.bad_categorytype === "Associate") {
    filterOptions = associateFilters;
  }
  if (form?.bad_categorytype === "Junior") {
    filterOptions = juniorFilters;
  }
  if (form?.bad_categorytype === "Trainee") {
    filterOptions = traineeFilters;
  }
  if (form?.bad_categorytype === "Student") {
    filterOptions = studentFilters;
  }
  if (form?.bad_categorytype === "Ordinary") {
    filterOptions = ordinaryFilters;
  }
  if (form?.bad_categorytype === "Associate Overseas") {
    filterOptions = associateOverseasFilters;
  }

  if (filterOptions?.includes(name)) {
    show = true;
  } else {
    show = false;
  }

  return show;
};

export const wpInputFilterHandler = ({ form, name, badApp }) => {
  let isValid = true;
  // --------------------------------------------------------------------------------
  // 📌  WP Application input filter
  // --------------------------------------------------------------------------------
  const input_with_prefix = badApp ? "bad_" + name : "sig_" + name; // prefix for bad/sig
  const wpSelected = form?.dev_application_input_filter?.[input_with_prefix]; // input allowed to show in UI

  // 📌 check if wp config have input set to true
  if (typeof wpSelected === "boolean" && !wpSelected) {
    isValid = false;
  }
  // 📌 if wp config dont include input & filter exists then return false
  if (typeof wpSelected === "undefined" && form?.dev_application_input_filter) {
    isValid = false;
  }
  // ⚠️ ignore all WP validations for BAD application
  // if (badApp) isValid = true;

  // ⚠️ for SIG application if user have no application selected hide all inputs
  if (!badApp && !form?.dev_application_input_filter) isValid = false;

  return isValid;
};

export const formValidationHandler = ({
  form,
  application,
  FORM_CONFIG,
  MANUALLY_REQUIRED,
}) => {
  // --------------------------------------------------------------------------------
  // 📌  if form is valid, submit to Dynamics
  // MANUALLY_REQUIRED: array of required fields that are not in FORM_CONFIG
  // --------------------------------------------------------------------------------

  let isValid = true;
  let updatedApplication = application;
  let updatedForm = form;
  let isCategoryType = form?.["bad_categorytype"] !== undefined; // required to select matching application type
  const wpFilter = form?.dev_application_input_filter; // required to select matching application type

  updatedApplication?.map((input, key) => {
    let { name, value, cargo } = input;
    if (name === "core_membershipapplicationid") return; // if name is not defined | core_membership_id, skip
    let required = FORM_CONFIG?.[name]?.Required !== "None"; // check if field is required |  info?.Required !== 'None'
    if (!!MANUALLY_REQUIRED) required = MANUALLY_REQUIRED?.includes(name); // if MANUALLY_REQUIRED array provided check if value is name is in array

    if (form?.[name] !== undefined) {
      value = form?.[name]; // ⚠️ set value to from value/user input

      // --------------------------------------------------------------------------------
      // ⚠️ update application with new value
      // --------------------------------------------------------------------------------
      updatedApplication[key] = { ...input, value };
      // console.log('🐞 inner value', value);
      // console.log('🐞 name: ', name, form?.[name]);
    }

    // --------------------------------------------------------------------------------
    // 📌  From validation
    //  Note: use cargo to trigger condition once
    // --------------------------------------------------------------------------------
    if (!isCategoryType && cargo) {
      // --------------------------------------------------------------------------------
      // 📌  if MANUALLY_REQUIRED do not includes bad_categorytype do not perform check on bad_categorytype
      // --------------------------------------------------------------------------------
      const isSIG = application?.[0]?.bad_organisedfor === "SIG";
      if (!MANUALLY_REQUIRED?.includes("bad_categorytype") && !isSIG) return;

      console.log("🐞 ⭐️⭐️ FAILS CATEGORY: ⭐️⭐️", name, value);
      updatedForm["bad_categorytype"] = undefined;
      updatedForm["error_bad_categorytype"] = true;
      isValid = false;
    }
    if (isCategoryType && cargo) {
      updatedForm["bad_categorytype"] = form?.["bad_categorytype"];
      updatedForm["error_bad_categorytype"] = false;
    }

    // 👉 check that value form?.[name] is not undefined & is not empty string
    const formValueRequired = form?.[name] !== undefined && form?.[name] !== "";

    if (required && !formValueRequired && name) {
      // --------------------------------------------------------------------------------
      // ⚠️ if wpFilter & wpFilter don`t include name, skip validation
      // --------------------------------------------------------------------------------
      const badApp = form?.bad_organisedfor === "810170000"; // check if BAD application
      const nameWithPrefix = badApp ? "bad_" + name : "sig_" + name; // prefix for bad/sig

      if (wpFilter && !wpFilter?.[nameWithPrefix]) return; // ⚠️ dont validate input if inputs that not allowed to show in UI (wpFilter)

      isValid = false; // ⚠️  if required field is empty, set isValid to false
      console.log("🐞 ⭐️⭐️ FAILS ON: ⭐️⭐️", name, value);
      updatedForm["error_" + name] = true;
    }
    if (required && formValueRequired && name) {
      updatedForm["error_" + name] = false;
    }
  });

  return {
    isValid: !!MANUALLY_REQUIRED ? isValid : isValid && isCategoryType,
    updatedApplication,
    updatedForm,
  };
};
