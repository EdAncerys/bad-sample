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
  genericFilters,
} from "../config/form";
// --------------------------------------------------------------------------------

export const getMembershipTypes = async ({ state }) => {
  let pageNo = 1;
  const params = `per_page=10&_fields=id,slug,acf`;
  let url =
    state.auth.WP_HOST + `wp-json/wp/v2/memberships?${params}&page=${pageNo}`;

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
        `wp-json/wp/v2/memberships?${params}&page=${pageNo}`;

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
  // --------------------------------------------------------------------------------
  // ⚠️ All applications will be for 2022
  // --------------------------------------------------------------------------------
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
  if (!form?.formus_staffgroupcategory) {
    // 📌  if no job role is selected, return all job roles
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

export const conditionalShowHandler = ({ form, name, badApp }) => {
  let show = true;

  // --------------------------------------------------------------------------------
  // ⚠️ MANUAL INPUT HANDLER & FILTER for BAD apps only ⚠️
  // 👇 comment out to disable manual input show/hide logic
  // 👉 place first not to overwrite other logic below
  // --------------------------------------------------------------------------------
  if (badApp) show = manualFilterHandler({ form, name, show });

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
      form?.["formus_typeofpractice"] &&
      form?.["formus_typeofpractice"] === "810170001"
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
  let filterOptions = genericFilters; // 👈 ⚠️ default filter options

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

export const wpAppFilterHandler = ({ form, name, badApp }) => {
  // --------------------------------------------------------------------------------
  // 📌  WP Application input filter
  // --------------------------------------------------------------------------------
  let isShow = true;
  // ⚠️ ignore all WP validations for BAD application
  // if (badApp) return true;

  const input_with_prefix = badApp ? "bad_" + name : "sig_" + name; // prefix for bad/sig 👉 badApp ? "bad_" + name : "sig_" + name
  let wpFilters = form?.dev_application_input_filter; // wp config
  if (Array.isArray(wpFilters)) wpFilters = wpFilters[0]; // ⚠️ if wpFilters is array provided the return first element

  // 📌 check if wpFilter object have input_with_prefix property & its boolean then return value
  if (typeof wpFilters?.[input_with_prefix] === "string") {
    isShow = wpFilters?.[input_with_prefix] !== "Hide";
  } else {
    isShow = false; // ⚠️ don't show input in all other cases
  }

  // --------------------------------------------------------------------------------
  // 📌 Handle conditional input show/hide logic for other qualification input
  // ⚠️ WP input show/hide logic handling
  // --------------------------------------------------------------------------------
  const mainSpecQ =
    form?.dev_application_input_filter?.main_specialty_qualification_handler;
  if (mainSpecQ) {
    mainSpecQ?.map((filter) => {
      const showInputName = filter?.show_input; // 👈 input name to show
      const isSleeted =
        typeof form?.["formus_mainspecialtyqualification"] === "string" &&
        form?.["formus_mainspecialtyqualification"]?.includes(
          filter?.multi_select_value
        ); // 👈 multi select value to check

      if (isSleeted && showInputName === name) isShow = true; // 👈 show input if multi select value is selected
    });
  }

  const clinicalSpecPr =
    form?.dev_application_input_filter?.clinicalspecialtysofpractice_handler;
  if (clinicalSpecPr) {
    clinicalSpecPr?.map((filter) => {
      const showInputName = filter?.show_input; // 👈 input name to show
      const isSleeted =
        typeof form?.["formus_clinicalspecialtysofpractice"] === "string" &&
        form?.["formus_clinicalspecialtysofpractice"]?.includes(
          filter?.multi_select_value
        ); // 👈 multi select value to check

      if (isSleeted && showInputName === name) isShow = true; // 👈 show input if multi select value is selected
    });
  }

  const specialDermPr =
    form?.dev_application_input_filter
      ?.specialiseddermatologyareasofpractice_handler;
  if (specialDermPr) {
    specialDermPr?.map((filter) => {
      const showInputName = filter?.show_input; // 👈 input name to show
      const isSleeted =
        typeof form?.["formus_specialiseddermatologyareasofpractice"] ===
          "string" &&
        form?.["formus_specialiseddermatologyareasofpractice"]?.includes(
          filter?.multi_select_value
        ); // 👈 multi select value to check

      if (isSleeted && showInputName === name) isShow = true; // 👈 show input if multi select value is selected
    });
  }

  // --------------------------------------------------------------------------------
  // ⚠️ WP config overwrite for Qualification input
  // --------------------------------------------------------------------------------
  if (name === "formus_otherqualificationtype") {
    if (form?.formus_qualificationtype === "810170007") isShow = true;
  }

  return isShow;
};

export const requiredFieldHandler = ({ form }) => {
  // --------------------------------------------------------------------------------
  // 📌  Required field handler & config
  // ⚠️ applying filters based on bad_categorytype type
  // --------------------------------------------------------------------------------

  const step = form?.step;
  let requiredFields = [];

  if (form?.bad_categorytype === "Junior") {
    if (step === 3)
      requiredFields = [
        "formus_staffgroupcategory",
        "formus_jobrole",
        "py3_hospitalid",
        "formus_professionalregistrationbody",
        "formus_professionalregistrationstatus",
        "formus_clinicalspecialtysofpractice", // 👈 multi picker
        "formus_typeofcontract",
      ];
    if (step === 4)
      requiredFields = [
        "py3_gmcnumber",
        "bad_currentpost",
        "bad_proposer1",
        "bad_proposer2",
      ];
  }
  if (form?.bad_categorytype === "Trainee") {
    if (step === 3)
      requiredFields = [
        "formus_staffgroupcategory",
        "formus_jobrole",
        "py3_hospitalid",
        "formus_professionalregistrationbody",
        "formus_professionalregistrationstatus",
        "formus_clinicalspecialtysofpractice", // 👈 multi picker
        "formus_typeofcontract",
      ];
    if (step === 4)
      requiredFields = [
        "py3_gmcnumber",
        "py3_ntnno",
        "bad_proposer1",
        "bad_proposer2",
      ];
  }
  if (form?.bad_categorytype === "Student") {
    if (step === 3)
      requiredFields = ["formus_staffgroupcategory", "formus_jobrole"];
    if (step === 4) requiredFields = ["bad_currentpost", "bad_proposer1"];
  }
  if (
    form?.bad_categorytype === "Ordinary" ||
    form?.bad_categorytype === "Ordinary SAS"
  ) {
    if (step === 3)
      requiredFields = [
        "formus_staffgroupcategory",
        "formus_jobrole",
        "py3_hospitalid",
        "formus_professionalregistrationbody",
        "formus_professionalregistrationstatus",
        "formus_clinicalspecialtysofpractice", // 👈 multi picker
        "formus_typeofcontract",
        "formus_mainspecialtyqualification",
      ];
    if (step === 4)
      requiredFields = [
        "py3_gmcnumber",
        "bad_currentpost",
        "bad_proposer1",
        "bad_proposer2",
      ];
  }
  if (
    form?.bad_categorytype === "Associate Overseas" ||
    form?.bad_categorytype === "Associate"
  ) {
    if (step === 3)
      requiredFields = [
        "formus_staffgroupcategory",
        "formus_jobrole",
        "py3_hospitalid",
        "formus_professionalregistrationbody",
        "formus_professionalregistrationstatus",
        "formus_clinicalspecialtysofpractice", // 👈 multi picker
        "formus_typeofcontract",
      ];
    if (step === 4)
      requiredFields = [
        "py3_gmcnumber",
        "bad_currentpost",
        "bad_proposer1",
        "bad_proposer2",
      ];
  }

  return requiredFields;
};

export const formValidationHandler = ({
  form,
  application,
  FORM_CONFIG,
  isSIG,
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
  console.log("⭐️ MANUAL_HANDLER", MANUALLY_REQUIRED);

  updatedApplication?.map((input, key) => {
    let { name, value, cargo } = input;
    const input_with_prefix = isSIG ? "sig_" + name : "bad_" + name; // prefix for bad/sig 👉 badApp ? "bad_" + name : "sig_" + name
    if (name === "core_membershipapplicationid") return; // if name is not defined | core_membership_id, skip
    let required = wpFilter?.[input_with_prefix] === "Show & Required"; // FORM_CONFIG?.[name]?.Required !== "None"; // check if field is required |  info?.Required !== 'None'
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
    // ⚠️ From validation
    // 📌 Note: use cargo to trigger condition once
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

    // --------------------------------------------------------------------------------
    // 📌  Error message cleaning
    // --------------------------------------------------------------------------------
    if (isCategoryType && cargo) {
      updatedForm["bad_categorytype"] = form?.["bad_categorytype"];
      updatedForm["error_bad_categorytype"] = false;
    }

    // 👉 check that value form?.[name] is not undefined & is not empty string
    const isValidInput = form?.[name] !== undefined && form?.[name] !== "";

    if (required && !isValidInput && name) {
      // --------------------------------------------------------------------------------
      // ⚠️ if wpFilter & wpFilter don`t include name, skip validation
      // --------------------------------------------------------------------------------
      const badApp = form?.bad_organisedfor === "810170000"; // check if BAD application
      const nameWithPrefix = badApp ? "bad_" + name : "sig_" + name; // prefix for bad/sig

      // --------------------------------------------------------------------------------
      // 📌  SIGs only
      // --------------------------------------------------------------------------------
      if (!badApp && wpFilter && !wpFilter?.[nameWithPrefix]) return; // ⚠️ do not validate input if inputs that not allowed to show in UI (wpFilter)

      isValid = false; // ⚠️  if required field is empty, set isValid to false
      console.log("🐞 ⭐️⭐️ FAILS ON: ⭐️⭐️", name, value);
      updatedForm["error_" + name] = true;
    }

    // --------------------------------------------------------------------------------
    // 📌  Error message cleaning
    // --------------------------------------------------------------------------------
    if (required && isValidInput && name) {
      updatedForm["error_" + name] = false;
    }
  });

  return {
    isValid: !!MANUALLY_REQUIRED ? isValid : isValid && isCategoryType,
    updatedApplication,
    updatedForm,
  };
};
