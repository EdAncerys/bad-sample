import { useState, useEffect, useRef } from "react";
import connect from "@frontity/connect";
// --------------------------------------------------------------------------------
import Form from "../components/form";
import Loading from "../components/loading";
import ProfileInput from "../components/inputs/ProfileInput";
import { FORM_CONFIG } from "../config/form";
import ApplicationSidePanel from "../components/ApplicationSidePanel";
import {
  getMembershipTypes,
  getUserStoreAction,
  getHospitalsAction,
  googleAutocomplete,
  sendFileToS3Action,
  getHospitalNameAction,
  getBADMembershipSubscriptionData,
  updateDynamicsApplicationAction,
  submitUserApplication,
  formValidationHandler,
  requiredFieldHandler,
} from "../helpers/inputHelpers";
import {
  useAppState,
  useAppDispatch,
  setGoToAction,
  setErrorAction,
  setApplicationDataAction,
} from "../context";

const Applications = ({ state, actions }) => {
  // --------------------------------------------------------------------------------
  // 📌  BAD applications page.
  // --------------------------------------------------------------------------------

  const dispatch = useAppDispatch();
  const { isActiveUser } = useAppState();

  const [fetching, setFetching] = useState(false);
  const [form, setForm] = useState({
    dev_py3_address1line1: "", // 📌  Address Line 1 default form field value
    step: 0,
  });
  const [application, setApplication] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const isSIG = application?.[0]?.bad_organisedfor === "SIG";
  const hasError = form?.dev_selected_application_types?.length === 0;
  const documentRef = useRef(null);
  const profilePictureRef = useRef(null);
  const hospitalSearchRef = useRef("");
  const address1Line1Ref = useRef("");
  console.log(
    "⭐️ filters ",
    form?.dev_application_input_filter?.main_specialty_qualification_handler
  );
  console.log("⭐️ QT ", form?.["formus_qualificationtype"]);

  useEffect(() => {
    if (!isActiveUser) return; // return if no user data is available

    (async () => {
      try {
        setFetching(true);
        // --------------------------------------------------------------------------------
        // 📌  Default form values
        // --------------------------------------------------------------------------------
        let memberships;
        let application;
        let hospitalId = "";
        let hospitalName = "";
        let documentUrl = "";
        let profilePicture = "";
        let formDefaults = {};
        let wpFilters;
        let readPolicy;

        // --------------------------------------------------------------------------------
        // 📌 fetch application data from server if no application data in context
        // --------------------------------------------------------------------------------
        if (!memberships) {
          memberships = await getMembershipTypes({ state });
          // TODO update context
        }
        if (!application) {
          const id = isActiveUser?.contactid || "";
          application = await getUserStoreAction({ state, id });
          // if application is not typeof array then set it to empty array
          if (!Array.isArray(application)) {
            application = [application]; // 👈 set application to empty array
          }
          // TODO update context
        }

        // --------------------------------------------------------------------------------
        // 📌  Check if user have hospital id set in Dynamics. If not, set hospitalId to null
        //  Check for Doc URL in Dynamics. If not, set documentUrl to null
        // --------------------------------------------------------------------------------
        application?.map((input, key) => {
          if (input?.name === "py3_hospitalid" && input.value) {
            hospitalId = input.value;
          }
          if (input?.name === "sky_cvurl" && input.value) {
            documentUrl = input.value;
          }
          if (input?.name === "sky_profilepicture" && input.value) {
            profilePicture = input?.value;
          }

          if (input?.name && input?.value) {
            // --------------------------------------------------------------------------------
            // ⚠️ update application with new value
            // --------------------------------------------------------------------------------
            formDefaults[input.name] = input.value;
          }
        });

        if (hospitalId) {
          // --------------------------------------------------------------------------------
          // 📌  If hospitalId is set in dynamic fetch it hospital name to show in UI.
          // --------------------------------------------------------------------------------
          const hospitalData = await getHospitalNameAction({
            state,
            dispatch,
            id: hospitalId,
          });
          if (hospitalData) hospitalName = hospitalData.name;
        }

        const bad_categorytype = application?.[0]?.bad_categorytype
          ?.toLowerCase()
          ?.replace(/\s/g, "");
        const bad_organisedfor = application?.[0]?.bad_organisedfor;
        const _bad_sigid_value = application?.[0]?._bad_sigid_value;

        console.log("🐞 appBlob", bad_categorytype, bad_organisedfor);

        // --------------------------------------------------------------------------------
        // 📌 find all applications that match the user's category type selections
        // --------------------------------------------------------------------------------
        const types = memberships?.filter((app) => {
          // --------------------------------------------------------------------------------
          // 📌  BAD applications mapping to application list from WP
          // return all BAD applications type is application is not SIG
          // --------------------------------------------------------------------------------
          if (application?.[0]?.bad_organisedfor === "BAD") {
            return app?.acf?.bad_or_sig === "bad";
          }

          // --------------------------------------------------------------------------------
          // 📌  SIG applications mapping to application list from WP
          // --------------------------------------------------------------------------------
          const categoryType = app?.acf?.category_types;

          return categoryType?.includes(_bad_sigid_value); // return memberships that matches or includes any words in applicationType
        });

        // --------------------------------------------------------------------------------
        // 📌  Apply cat selected to BAD applications only
        // --------------------------------------------------------------------------------
        let appCatType = application?.[0]?.bad_categorytype;
        if (appCatType && bad_organisedfor === "BAD") {
          memberships?.filter((app) => {
            const acf = app?.acf;
            if (acf?.category_types === appCatType) wpFilters = acf; // return memberships that matches or includes any words in applicationType
          });
        }
        // --------------------------------------------------------------------------------
        // 📌  Apply cat selected to SIG applications only
        // --------------------------------------------------------------------------------
        if (types?.length === 1 && bad_organisedfor === "SIG") {
          wpFilters = types?.[0]?.acf; // 👉 if only one application type is found, set wpFilters to that application type
          appCatType = types?.[0]?.acf?.category_types;
          readPolicy = types?.[0]?.acf?.sig_readpolicydocument_url_email;
        }

        // --------------------------------------------------------------------------------
        // 📌  Update state with blob values for UI render
        // --------------------------------------------------------------------------------
        setForm({
          ...form,
          bad_categorytype: appCatType, // 📌 set category type to form if only one category type is available for user
          dev_application_input_filter: wpFilters, // 📌 set category type to form if only one category type is available for user
          dev_selected_application_types: types,
          dev_read_policy: readPolicy,
          sky_newhospitalname: hospitalName, // set hospital name
          dev_has_hospital_id: hospitalId, // 📌 set hospital id to form to determine if user have hospital id set in dynamics
          sky_cvurl: documentUrl, // set documentUrl to form
          sky_profilepicture: profilePicture, // set profilePicture to form
          step: application?.[0]?.step || 0,
          ...formDefaults,
          // --------------------------------------------------------------------------------
          // ⚠️ override default values with values from application
          // --------------------------------------------------------------------------------
          formus_staffgroupcategory:
            isActiveUser?._formus_staffgroupcategory?.toString(),
          formus_jobrole: isActiveUser?._formus_jobrole?.toString(),
          formus_mainspecialtyqualification: undefined, // 📌  remove default value from form
          formus_clinicalspecialtysofpractice: undefined, // 📌  remove default value from form
          formus_specialiseddermatologyareasofpractice: undefined, // 📌  remove default value from form
        });
        setApplication(application); // ⚠️ update application with new application fields
        setMemberships(memberships);
        console.log("🐞 memberships", memberships);
        console.log("🐞 application", application);
      } catch (error) {
        console.log("🐞 error", error);
      } finally {
        setFetching(false);
      }
    })();

    // --------------------------------------------------------------------------------
    // 📌  Apply onClickEvenHandler to DOM elements
    // --------------------------------------------------------------------------------
    const body = document.querySelector("body");
    body.addEventListener("click", onClickEvenHandler);
  }, [isActiveUser]);

  const onClickEvenHandler = (e) => {
    // --------------------------------------------------------------------------------
    // 📌  Multi select dropdown cleaner
    // 📌  onClick event listener. Close all formus multiselect fields if DOM element clicked
    // --------------------------------------------------------------------------------
    console.log("⭐️ list ", e.target.classList);

    if (
      e.target.classList.contains("applications-side-panel") ||
      e.target.classList.contains("flex-col") ||
      e.target.classList.contains("form-label") ||
      e.target.classList.contains("input")
    ) {
      setForm((prev) => ({
        ...prev,
        ["dev_selected_" + "formus_specialiseddermatologyareasofpractice"]:
          undefined,
        ["dev_selected_" + "formus_mainspecialtyqualification"]: undefined,
        ["dev_selected_" + "formus_clinicalspecialtysofpractice"]: undefined,
      }));
    }
  };

  const handleSelectAddress = async ({ item }) => {
    // destructure item object & get country code & city name from link
    const { link, title } = item;
    let address = title;
    let countryCode = "";
    let cityName = "";
    // if title consist of more than one comma, split it and get the forst item as address
    if (title?.split(",").length > 1) {
      address = title?.split(",")[0];
    }

    if (link) {
      // if link object opassed in define destructure address object
      if (link.length >= 1) countryCode = link?.[link.length - 1]?.value;
      if (link.length >= 2) cityName = link?.[link.length - 2]?.value;
    }
    // overwrite formData to match Dynamics fields
    if (countryCode === "UK")
      countryCode = "United Kingdom of Great Britain and Northern Ireland";

    console.log("⭐️ object", address, countryCode, cityName);
    // update formData with values
    setForm((form) => ({
      ...form,
      py3_address1ine1: address,
      py3_addresscountry: countryCode,
      py3_addresscountystate: cityName,
    }));
  };

  const handleClearHospital = () => {
    hospitalSearchRef.current = ""; // clear search input
    onChange({ target: { name: "sky_newhospitalname", value: "" } });
  };

  const handleClearAddress = () => {
    // --------------------------------------------------------------------------------
    // 📌  Clear address fields
    // --------------------------------------------------------------------------------
    address1Line1Ref.current = ""; // clear search input
    setForm((form) => ({
      ...form,
      py3_address1ine1: "",
      py3_addressline2: "",
      py3_addresscountystate: "",
      py3_addresscountry: "",
      py3_addresspostalcode: "",
      py3_addresszippostalcode: "",
      dev_address_data: "",
    }));
  };

  const multiSelectHandler = ({ title, value, name }) => {
    let currentValues = form?.[name] || "";
    let currentTitles = form?.["dev_multi_select_" + name] || "";

    if (!currentValues.includes(value)) {
      // 👉 if value is already selected, add to it by comma separated
      const newValue = currentValues?.length > 0 ? "," + value : value; // if string have no values add value, othervise comma seperated
      const newTitle = currentTitles?.length > 0 ? ", " + title : title; // if string have no values add value, othervise comma seperated
      currentValues = currentValues + newValue;
      currentTitles = currentTitles + newTitle;
    } else {
      // 👉 if value is already selected, remove it
      const hasValue = currentValues?.includes("," + value); // check if value is comma separated
      currentValues = hasValue
        ? currentValues?.replace("," + value, "")
        : currentValues?.replace(value, "");

      const hasTitle = currentTitles?.includes(", " + title); // check if value is comma separated
      currentTitles = hasTitle
        ? currentTitles?.replace(", " + title, "")
        : currentTitles?.replace(title, "");
    }

    setForm((form) => ({
      ...form,
      [name]: currentValues,
      ["dev_multi_select_" + name]: currentTitles,
    }));
  };

  const handleDocUploadChange = async ({ target }) => {
    const { name, files } = target;
    const doc = files[0];
    const fileName = doc.name; // name of the file attachment
    if (!doc) return;

    try {
      setFetching(true);

      // upload file to S3 bucket and get url
      let url = await sendFileToS3Action({
        state,
        dispatch,
        attachments: doc,
      });

      let dev_name = name === "sky_cvurl" ? "dev_new_cv" : "dev_new_doc";
      setForm({ ...form, [name]: url, [dev_name]: fileName });
    } catch (error) {
      console.log("🤖 error", error);
    } finally {
      setFetching(false);
    }
  };

  const handleHospitalLookup = async () => {
    // --------------------------------------------------------------------------------
    // 📌  Handle hospital lookup
    // --------------------------------------------------------------------------------
    const input = hospitalSearchRef.current.value;

    // if input is empty, return & clear dev_hospital_data
    if (!input) {
      setForm((form) => ({
        ...form,
        dev_hospital_data: "",
      }));
      return;
    }

    try {
      let hospitalData = await getHospitalsAction({
        state,
        input,
      });
      // refactor hospital data to match dropdown format
      hospitalData = hospitalData.map((hospital) => {
        return {
          title: hospital?.name,
          link: hospital?.accountid,
        };
      });
      onChange({
        target: { name: "dev_hospital_data", value: hospitalData },
      });
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleAddressLookup = async () => {
    // --------------------------------------------------------------------------------
    // 📌  Handle address lookup
    // --------------------------------------------------------------------------------

    const input = address1Line1Ref.current.value;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // add delay to allow async to finish before running
      let addressData = await googleAutocomplete({
        input,
      });
      // refactor address data to match dropdown format
      addressData = addressData?.map((address) => {
        return {
          title: address?.description,
          link: address?.terms,
        };
      });
      onChange({
        target: { name: "dev_address_data", value: addressData },
      });
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const onChange = ({ target }) => {
    // --------------------------------------------------------------------------------
    // ⭐️  Handle input change for all inputs ⭐️
    // --------------------------------------------------------------------------------
    const { name, value, type, checked } = target;
    console.log("🐞 name: ", name, value);

    // --------------------------------------------------------------------------------
    // 📌  if filed bad_categorytype is changed, add to state application from fields from WP
    // --------------------------------------------------------------------------------
    if (name === "bad_categorytype") {
      let dev_application_input_filter;

      memberships?.filter((app) => {
        const acf = app?.acf;
        if (acf?.category_types === value) dev_application_input_filter = acf; // return memberships that matches or includes any words in applicationType
      });
      setForm({
        ...form,
        [name]: type === "checkbox" ? checked : value,
        dev_application_input_filter: dev_application_input_filter,
        dev_read_policy: memberships?.[0]?.acf.sig_readpolicydocument_url_email,
      });
      return;
    }

    if (name === "formus_staffgroupcategory") {
      // 👉 validate if formus_jobrole is included in staff group cat list
      let filters = "group_" + form?.formus_staffgroupcategory;

      setForm({
        ...form,
        [name]: type === "checkbox" ? checked : value,
        formus_staffgroupcategory: value,
        formus_jobrole: "", // 👉 clear job role if staff group is changed. This input have condisional rendering
      });
      return;
    }

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSelectHospital = ({ item }) => {
    console.log("🐞 item", item);
    setForm((form) => ({
      ...form,
      dev_hospital_lookup: "",
      dev_hospital_data: null,
      sky_newhospitalname: item?.title,
      py3_hospitalid: item?.link,
    }));
  };

  const formSubmitHandler = async () => {
    // --------------------------------------------------------------------------------
    // 📌  Handle form submit
    // --------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------
    // 📌 Form validation handler
    // --------------------------------------------------------------------------------
    let { isValid, updatedApplication, updatedForm } = formValidationHandler({
      form,
      application,
      FORM_CONFIG,
      isSIG,
      MANUALLY_REQUIRED: isSIG ? undefined : [], // if SIG, don't manually require any fields
    });

    try {
      setFetching(true);

      if (!isValid) {
        console.log("🐞 ⭐️⭐️ ERROR MODAL ⭐️⭐️");
        setForm((form) => ({ ...form, ...updatedForm })); // ⚠️ update formData with new application fields
        setApplication(application); // ⚠️ update application with new application fields

        setErrorAction({
          dispatch,
          isError: {
            message: `Please fill all mandatory fields`,
            image: "Error",
          },
        });
        return; // 👉 if form is not valid, return
      }

      // --------------------------------------------------------------------------------
      // 📌  Proceed to from submission
      // --------------------------------------------------------------------------------
      // 👉 get appropriate membership ID
      const data = await getBADMembershipSubscriptionData({
        state,
        category: form?.bad_organisedfor === "810170001" ? "SIG" : "BAD", // SIG or BAD
        type: form?.bad_categorytype,
      });

      updatedApplication?.map((input, key) => {
        let { name, value, info } = input;
        if (name === "core_membershipsubscriptionplanid") {
          updatedApplication[key] = {
            ...input,
            value: data?.[0]?.core_membershipsubscriptionplanid, // set core_membership_id to updatedApplication
          };
        }
      });

      await saveApplicationRecord({ updatedApplication, submit: true }); // 👉 save application record & disable fetch state
      const submitRes = await submitUserApplication({
        state,
        contactid: isActiveUser?.contactid || "",
        application: updatedApplication,
      });

      console.log("🐞 submitRes: ", submitRes);
      if (!submitRes?.success) {
        console.log("🐞 ⭐️⭐️ ERROR MODAL ⭐️⭐️");

        setErrorAction({
          dispatch,
          isError: {
            message: `Failed to submit application. Please try again.`,
            image: "Error",
          },
        });
        return; // 👉 if form is not valid, return
      }
      if (submitRes?.success) {
        // ⚠️ redirect to success page & notify user
        let msg = form?.dev_application_input_filter?.category_types;
        // if msg includes : split and take first word
        if (msg?.includes(":")) msg = msg?.split(":")[1];
        if (msg) msg = `Application submitted successfully for ` + msg;

        setErrorAction({
          dispatch,
          isError: {
            message: msg || `Application submitted successfully`,
          },
        });
        setApplicationDataAction({ dispatch, applicationData: null }); // 👉 update context
        let path = `/dashboard/`;
        if (form?.bad_organisedfor === "810170000")
          path = "/membership/thank-you/"; // if application is bad redirect to bad ethnicity page

        setGoToAction({ state, path, actions }); // go to dashboard
      }
    } catch (error) {
      console.log("🐞 error: ", error);
    } finally {
      setForm((form) => ({ ...form, ...updatedForm })); // ⚠️ update formData with new application fields
      setApplication(application); // ⚠️ update application with new application fields
      setFetching(false);
    }
  };

  // --------------------------------------------------------------------------------
  const goBackHandler = () => {
    console.log("goBackHandler");

    if (hasError || isSIG || (!isSIG && form?.step === 0)) {
      setGoToAction({ state, path: `/dashboard/`, actions }); // go to dashboard
      return;
    }

    onChange({
      target: { name: "step", value: form?.step - 1 },
    });
  };

  const saveApplicationRecord = async ({
    updatedApplication,
    saveAndExit = false,
    submit,
  }) => {
    try {
      if (!submit) setFetching(true);

      updatedApplication = updatedApplication || application; // ⚠️ set updatedApplication to application if not provided
      updatedApplication[0].step = form?.step; // ⚠️ set step to form step

      updatedApplication?.map((input, key) => {
        let { name, value } = input;

        if (form?.[name] !== undefined) {
          value = form?.[name]; // ⚠️ set value to from value

          // --------------------------------------------------------------------------------
          // ⚠️ update application with new value
          // --------------------------------------------------------------------------------
          updatedApplication[key] = { ...input, value };
        }
      });

      const response = await updateDynamicsApplicationAction({
        state,
        contactid: isActiveUser?.contactid || "",
        application: updatedApplication,
      });
      console.log("🐞 Update application record response: ", response);

      if (response?.success && saveAndExit) {
        setGoToAction({ state, path: `/dashboard/`, actions }); // go to dashboard
        return response;
      }
    } catch (error) {
      console.log("🐞 error: ", error);
    } finally {
      if (!submit) setFetching(false);
    }
  };

  const multiSelectDropDownHandler = ({ name, value }) => {
    console.log("🐞 name: ", name);
    let handler = { ["dev_selected_" + name]: !form?.["dev_selected_" + name] };
    // 📌 conditional dropdown closing based on selection
    if (name === "formus_mainspecialtyqualification") {
      handler = {
        ...handler,
        ["dev_selected_" + "formus_clinicalspecialtysofpractice"]: undefined,
        ["dev_selected_" + "formus_specialiseddermatologyareasofpractice"]:
          undefined,
      };
    }

    if (name === "formus_clinicalspecialtysofpractice") {
      handler = {
        ...handler,
        ["dev_selected_" + "formus_mainspecialtyqualification"]: undefined,
        ["dev_selected_" + "formus_specialiseddermatologyareasofpractice"]:
          undefined,
      };
    }

    if (name === "formus_specialiseddermatologyareasofpractice") {
      handler = {
        ...handler,
        ["dev_selected_" + "formus_mainspecialtyqualification"]: undefined,
        ["dev_selected_" + "formus_clinicalspecialtysofpractice"]: undefined,
      };
    }

    // --------------------------------------------------------------------------------
    // 📌  onClick listener. Close all formus multiselect fields if DOM element clicked
    // --------------------------------------------------------------------------------
    if (name === "close_formus_multiselect") {
      handler = {
        ...handler,
        ["dev_selected_" + "formus_specialiseddermatologyareasofpractice"]:
          undefined,
        ["dev_selected_" + "formus_mainspecialtyqualification"]: undefined,
        ["dev_selected_" + "formus_clinicalspecialtysofpractice"]: undefined,
      };
    }

    // 👉 formus_mainspecialtyqualification
    setForm((form) => ({
      ...form,
      ...handler,
    }));
  };

  const nextHandler = async () => {
    // --------------------------------------------------------------------------------
    // 📌 Form validation handler
    // --------------------------------------------------------------------------------
    let MANUALLY_REQUIRED = [];
    if (form?.step === 1) MANUALLY_REQUIRED = ["bad_categorytype"];
    if (form?.step === 2)
      MANUALLY_REQUIRED = [
        form?.dev_application_input_filter?.bad_py3_title === "Show & Required"
          ? "py3_title"
          : "",
        form?.dev_application_input_filter?.bad_py3_firstname ===
        "Show & Required"
          ? "py3_firstname"
          : "",
        form?.dev_application_input_filter?.bad_py3_gender === "Show & Required"
          ? "py3_gender"
          : "",
        form?.dev_application_input_filter?.bad_py3_dateofbirth ===
        "Show & Required"
          ? "py3_dateofbirth"
          : "",
        form?.dev_application_input_filter?.bad_py3_email === "Show & Required"
          ? "py3_email"
          : "",
        form?.dev_application_input_filter?.bad_py3_mobilephone ===
        "Show & Required"
          ? "py3_mobilephone"
          : "",
        form?.dev_application_input_filter?.bad_py3_address1ine1 ===
        "Show & Required"
          ? "py3_address1ine1"
          : "",
        form?.dev_application_input_filter?.bad_py3_addressline2 ===
        "Show & Required"
          ? "py3_addressline2"
          : "",
        // "py3_addressline2", // 👉 not mandatory
        // "py3_addresscountystate", // 👉 not mandatory
        form?.dev_application_input_filter?.bad_py3_addresscountystate ===
        "Show & Required"
          ? "py3_addresscountystate"
          : "",
        form?.dev_application_input_filter?.bad_py3_addresszippostalcode ===
        "Show & Required"
          ? "py3_addresszippostalcode"
          : "",
        form?.dev_application_input_filter?.bad_py3_addresscountry ===
        "Show & Required"
          ? "py3_addresscountry"
          : "",
      ];
    if (form?.step === 3)
      MANUALLY_REQUIRED = [
        form?.dev_application_input_filter?.bad_formus_staffgroupcategory ===
        "Show & Required"
          ? "formus_staffgroupcategory"
          : "",
        form?.dev_application_input_filter?.bad_formus_jobrole ===
        "Show & Required"
          ? "formus_jobrole"
          : "",
        form?.dev_application_input_filter?.bad_py3_hospitalid ===
        "Show & Required"
          ? "py3_hospitalid"
          : "",
        form?.dev_application_input_filter
          ?.bad_formus_professionalregistrationbody === "Show & Required"
          ? "formus_professionalregistrationbody"
          : "",
        form?.dev_application_input_filter
          ?.bad_formus_professionalregistrationstatus === "Show & Required"
          ? "formus_professionalregistrationstatus"
          : "",
        form?.dev_application_input_filter?.bad_formus_residencystatus ===
        "Show & Required"
          ? "formus_residencystatus"
          : "",
        form?.dev_application_input_filter?.bad_formus_qualificationtype ===
        "Show & Required"
          ? "formus_qualificationtype"
          : "",
        // 👇 conditional fields
        form?.dev_application_input_filter
          ?.bad_formus_otherqualificationtype === "Show & Required"
          ? "formus_otherqualificationtype"
          : "",
        form?.dev_application_input_filter
          ?.bad_formus_otherreasonformovingccstdate === "Show & Required"
          ? "formus_otherreasonformovingccstdate"
          : "",
        form?.dev_application_input_filter
          ?.bad_formus_mainspecialtyqualification === "Show & Required"
          ? "formus_mainspecialtyqualification"
          : "",
        // 👆 conditional fields

        form?.["formus_qualificationtype"] === "810170007" &&
        form?.dev_application_input_filter
          ?.bad_formus_mainspecialtyqualification === "Show & Required"
          ? "formus_mainspecialtyqualification"
          : "",
        form?.dev_application_input_filter
          ?.bad_formus_clinicalspecialtysofpractice === "Show & Required"
          ? "formus_clinicalspecialtysofpractice"
          : "", // 👈 multi picker

        form?.dev_application_input_filter
          ?.bad_formus_specialiseddermatologyareasofpractice ===
        "Show & Required"
          ? "formus_specialiseddermatologyareasofpractice"
          : "", // 👈 multi picker
        form?.dev_application_input_filter?.bad_formus_typeofcontract ===
        "Show & Required"
          ? "formus_typeofcontract"
          : "",
        form?.dev_application_input_filter
          ?.bad_formus_fixedtermtemporaryreasonforemploymentcont ===
        "Show & Required"
          ? "formus_fixedtermtemporaryreasonforemploymentcont"
          : "",
        form?.dev_application_input_filter?.bad_formus_rotapattern ===
        "Show & Required"
          ? "formus_rotapattern"
          : "",
        form?.dev_application_input_filter?.bad_formus_typeofpractice ===
        "Show & Required"
          ? "formus_typeofpractice"
          : "",
        form?.dev_application_input_filter
          ?.bad_formus_privatepracticeorganisation === "Show & Required"
          ? "formus_privatepracticeorganisation"
          : "",
        form?.dev_application_input_filter
          ?.bad_formus_reasonformovingccstdate === "Show & Required"
          ? "formus_reasonformovingccstdate"
          : "",
        form?.bad_newhospitaladded ? "sky_newhospitalname" : "", // if new hospital added, add new hospital name to required fields
        form?.bad_newhospitaladded ? "sky_newhospitaltype" : "", // if new hospital added, add new hospital name to required fields
        form?.["formus_typeofpractice"] !== "810170001" &&
        form?.dev_application_input_filter
          ?.bad_formus_privatepracticeorganisation === "Show & Required"
          ? "formus_privatepracticeorganisation"
          : "", // if new hospital added, add new hospital name to required fields
      ];
    if (form?.step === 4)
      MANUALLY_REQUIRED = [
        form?.dev_application_input_filter?.bad_py3_gmcnumber ===
        "Show & Required"
          ? "py3_gmcnumber"
          : "",
        form?.dev_application_input_filter?.bad_bad_currentpost ===
        "Show & Required"
          ? "bad_currentpost"
          : "",
        form?.dev_application_input_filter?.bad_bad_proposer1 ===
        "Show & Required"
          ? "bad_proposer1"
          : "",
        form?.dev_application_input_filter?.bad_bad_proposer2 ===
        "Show & Required"
          ? "bad_proposer2"
          : "",
        form?.dev_application_input_filter?.bad_py3_currentgrade ===
        "Show & Required"
          ? "py3_currentgrade"
          : "",
        form?.dev_application_input_filter?.bad_py3_ntnno === "Show & Required"
          ? "py3_ntnno"
          : "",
        form?.dev_application_input_filter?.bad_bad_preferredmailingaddress ===
        "Show & Required"
          ? "bad_preferredmailingaddress"
          : "",
        form?.dev_application_input_filter?.bad_sky_cvurl === "Show & Required"
          ? "sky_cvurl"
          : "",

        form?.dev_application_input_filter?.bad_bad_memberdirectory ===
        "Show & Required"
          ? "bad_memberdirectory"
          : "",
        form?.dev_application_input_filter?.bad_py3_constitutionagreement ===
        "Show & Required"
          ? "py3_constitutionagreement"
          : "",
        form?.dev_application_input_filter?.bad_bad_readpolicydocument ===
        "Show & Required"
          ? "bad_readpolicydocument"
          : "",
      ];
    const { isValid, updatedApplication, updatedForm } = formValidationHandler({
      form,
      application,
      FORM_CONFIG,
      isSIG,
      MANUALLY_REQUIRED: isSIG ? undefined : MANUALLY_REQUIRED,
    });

    if (!isValid) {
      console.log("🐞 ⭐️⭐️ ERROR MODAL ⭐️⭐️");
      setForm((form) => ({ ...form, ...updatedForm })); // ⚠️ update formData with new application fields
      setApplication(application); // ⚠️ update application with new application fields

      setErrorAction({
        dispatch,
        isError: {
          message: `Please fill all mandatory fields`,
          image: "Error",
        },
      });
      return; // 👉 if form is not valid, return
    }

    try {
      setFetching(true);
      if (isSIG || form?.step === 4) {
        // --------------------------------------------------------------------------------
        // 📌  if SIG, submit form and redirect
        // --------------------------------------------------------------------------------
        await formSubmitHandler();
        return;
      }

      // --------------------------------------------------------------------------------
      // 📌  Application step process
      // --------------------------------------------------------------------------------
      onChange({
        target: { name: "step", value: form?.step + 1 },
      });
      await saveApplicationRecord({ updatedApplication }); // save application record before moving to next step
    } catch (error) {
      console.log("🐞 error: ", error);
    } finally {
      setFetching(false);
    }
  };

  const redirectHandler = async () => {
    let path = "/membership/categories-of-membership/";
    if (form?.step === 1) path = "/membership/";
    console.log("🐞 ", path);

    setGoToAction({
      state,
      path,
      actions,
    });
  };

  // --------------------------------------------------------------------------------
  // 📌  Screen render logic
  // --------------------------------------------------------------------------------
  const badApp = form?.bad_organisedfor === "810170000";
  const stepOne = form?.step === 0 && badApp;
  const stepTwo = form?.step === 1 && badApp;
  const stepThree = form?.step === 2 && badApp;
  const stepFour = form?.step === 3 && badApp;
  const stepFive = form?.step === 4 && badApp;
  const isProfilePic =
    form?.dev_application_input_filter?.bad_sky_profilepicture !== "Hide";

  const ServeNoApplicationData = () => {
    return (
      <div className="flex-col application-form-wrapper">
        <div className="flex required">
          Error. No application found. Please create new application and try
          again!
        </div>
        <div className="application-actions">
          <div className="transparent-btn" onClick={goBackHandler}>
            Back
          </div>
        </div>
      </div>
    );
  };

  if (application?.length === 0)
    return (
      <div style={{ padding: "50px 0" }}>
        <Loading />
      </div>
    );

  let sigAppName = form?.bad_categorytype;
  if (sigAppName?.includes(":")) {
    sigAppName = sigAppName.split(":")[1]; // 👉 if sig name includes : , split & select second part
  }
  // if no sig name replace with SIG
  sigAppName = sigAppName ? sigAppName : "SIG";

  return (
    <div className="applications-container">
      {fetching && (
        <div
          className="fetch-icon"
          style={{ marginTop: isSIG ? "30%" : undefined }}
        >
          <Loading />
        </div>
      )}

      <div className="flex">
        <ApplicationSidePanel
          step={form?.step}
          form={form}
          application={application}
          onChange={onChange}
          badApp={badApp}
        />
        {hasError && <ServeNoApplicationData />}

        {!hasError && (
          <div className="flex-col application-form-wrapper">
            {!badApp && (
              <div className="flex-col">
                <div
                  className="primary-title application-panel-title"
                  style={{ borderBottom: "none" }}
                >
                  Category Selected: {sigAppName}
                </div>
                <div className="required" style={{ paddingTop: `0.5em` }}>
                  Mandatory fields
                </div>
              </div>
            )}

            {badApp && (
              <div className="flex-col">
                <div className="primary-title application-panel-title">
                  {stepOne && "The Process"}
                  {stepTwo && "Category Selection"}
                  {stepThree && "Personal Information"}
                  {stepFour && "Professional Details"}
                </div>
                <div style={{ paddingTop: `0.75em` }}>
                  {stepOne &&
                    "Please follow the below steps to complete your application. All of the information required to submit your application is listed below."}
                  {stepTwo &&
                    "Please confirm your category selection. Or if you are unsure of the category you should be applying for please view the membership category descriptions for further clarification."}
                </div>
                <div style={{ paddingTop: `0.75em` }}>
                  {stepOne &&
                    "Once your membership application has been completed, it will be reviewed by the BAD’s membership team and then presented to the BAD Executive committee for approval at the quarterly Executive Meeting. You will receive an email on completion of your application with the date of the next meeting. Shortly following the meeting you will be contacted with the outcome of the application. Successful applicants will then be prompted to make payment to activate their membership."}
                </div>
                <div
                  className="caps-btn"
                  onClick={redirectHandler}
                  style={{ paddingTop: `1em` }}
                >
                  {stepOne && "BAD membership categories"}
                  {stepTwo && "Membership categories"}
                </div>
                {stepOne && (
                  <div>
                    <div
                      className="primary-title application-panel-title"
                      style={{
                        marginTop: `1em`,
                        paddingTop: `1em`,
                        borderTop: `1px solid #E3E7EA`,
                        borderBottom: "none",
                      }}
                    >
                      You Will Need:
                    </div>
                    <div>
                      <ul>
                        <li>CV </li>
                        <li>
                          Information about your current working circumstances
                        </li>
                        <li>
                          Proposers (two proposers are needed for all
                          applications, with the exception of medical students
                          who only require one)
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex form-outer-wrapper">
              {stepThree && isProfilePic && (
                <div className="form-img-input-wrapper">
                  <ProfileInput
                    form={form}
                    name="sky_profilepicture"
                    profilePictureRef={profilePictureRef}
                    labelClass={
                      form?.dev_application_input_filter
                        ?.bad_sky_profilepicture === "Show & Required"
                        ? "form-label required"
                        : "form-label"
                    }
                    Label={FORM_CONFIG?.["sky_profilepicture"]?.Label}
                    handleDocUploadChange={handleDocUploadChange}
                  />
                </div>
              )}

              {!stepOne && (
                <div
                  className={
                    form?.step === 2 && isProfilePic
                      ? "form-contenmt-wrapper-narrow"
                      : "form-contenmt-wrapper"
                  }
                >
                  <Form
                    form={form}
                    application={application}
                    onChange={onChange}
                    handleDocUploadChange={handleDocUploadChange}
                    handleHospitalLookup={handleHospitalLookup}
                    handleSelectHospital={handleSelectHospital}
                    handleClearHospital={handleClearHospital}
                    handleAddressLookup={handleAddressLookup}
                    handleClearAddress={handleClearAddress}
                    handleSelectAddress={handleSelectAddress}
                    multiSelectHandler={multiSelectHandler}
                    multiSelectDropDownHandler={multiSelectDropDownHandler}
                    // --------------------------------------------------------------------------------
                    documentRef={documentRef}
                    profilePictureRef={profilePictureRef}
                    hospitalSearchRef={hospitalSearchRef}
                    address1Line1Ref={address1Line1Ref}
                    // --------------------------------------------------------------------------------
                    badApp={badApp}
                    stepOne={stepOne}
                    stepTwo={stepTwo}
                    stepThree={stepThree}
                    stepFour={stepFour}
                    stepFive={stepFive}
                  />
                </div>
              )}
            </div>

            <div style={{ padding: `0.5em 0 2em 0` }}>
              {stepTwo &&
                "Our ordinary category is for practising dermatologists, working in the UK, on the Specialist Register of the General Medical Council, or Ireland, on the Specialist Register of The Irish Medical Council, whose work is substantially devoted to dermatological practice or research, or SAS doctors who have been fully committed to secondary care dermatology for a period of four years."}
            </div>

            {!fetching && (
              <div className="application-actions">
                <div className="transparent-btn" onClick={goBackHandler}>
                  Back
                </div>
                <div
                  className="transparent-btn"
                  onClick={() => saveApplicationRecord({ saveAndExit: true })}
                >
                  Save & Exit
                </div>
                <div
                  className="blue-btn"
                  onClick={nextHandler}
                  // 👇 testing purposes attribute
                  data-type={
                    isSIG || form?.step === 4 ? "submit-application" : "next"
                  }
                >
                  {(isSIG || form?.step === 4) && "Submit Application"}
                  {!isSIG && form?.step !== 4 && "Next"}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default connect(Applications);
