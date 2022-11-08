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
} from "../helpers/inputHelpers";
import {
  useAppState,
  useAppDispatch,
  setGoToAction,
  setErrorAction,
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
  console.log("⭐️⭐️🐞 COMPONENT RERENDER ⭐️⭐️", memberships);

  const documentRef = useRef(null);
  const profilePictureRef = useRef(null);
  const hospitalSearchRef = useRef("");
  const address1Line1Ref = useRef("");

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

        console.log("🐞 appBlob", bad_categorytype, bad_organisedfor);

        // --------------------------------------------------------------------------------
        // 📌 find all applications that match the user's category type selections
        // --------------------------------------------------------------------------------
        const types = memberships?.filter((app) => {
          // return all BAD applications type is application is not SIG
          if (application?.[0]?.bad_organisedfor === "BAD") {
            return app?.acf?.bad_or_sig === "bad";
          }

          // get application & strip all white spaces and make lowercase and replace - with ''
          const slug = app?.slug
            ?.toLowerCase()
            ?.replace(/\s/g, "")
            ?.replace(/-/g, "");

          return slug?.includes(bad_categorytype); // return memberships that matches or includes any words in applicationType
        });

        // --------------------------------------------------------------------------------
        // 📌  Update state with blob values for UI render
        // --------------------------------------------------------------------------------
        setForm({
          ...form,
          dev_selected_application_types: types,
          sky_newhospitalname: hospitalName, // set hospital name
          sky_cvurl: documentUrl, // set documentUrl to form
          sky_profilepicture: profilePicture, // set profilePicture to form
          step: application?.[0]?.step || 0,
          bad_categorytype:
            types?.length === 1 ? types?.[0]?.acf?.category_types : undefined, // 📌 set category type to form if only one category type is available for user
          dev_application_input_filter:
            types?.length === 1 ? types?.[0]?.acf : undefined,
          dev_has_hospital_id: hospitalId, // 📌 set hospital id to form to determine if user have hospital id set in dynamics
          ...formDefaults,
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
  }, [isActiveUser]);

  const handleSelectAddress = async ({ item }) => {
    // destructure item object & get country code & city name from terms
    const { terms, title } = item;
    let countryCode = "";
    let cityName = "";

    if (terms) {
      // if terms define address components
      if (terms.length >= 1) countryCode = terms[terms.length - 1].value;
      if (terms.length >= 2) cityName = terms[terms.length - 2].value;
    }
    // overwrite formData to match Dynamics fields
    if (countryCode === "UK")
      countryCode = "United Kingdom of Great Britain and Northern Ireland";

    // update formData with values
    setForm((form) => ({
      ...form,
      py3_address1ine1: title,
      py3_addresscountry: countryCode,
      py3_addresstowncity: cityName,
    }));
  };

  const handleClearHospital = () => {
    hospitalSearchRef.current = ""; // clear search input
    onChange({ target: { name: "sky_newhospitalname", value: "" } });
  };

  const handleClearAddress = () => {
    address1Line1Ref.current = ""; // clear search input
    setForm((form) => ({
      ...form,
      py3_address1ine1: "",
      dev_address_data: "",
    }));
  };

  const multiSelectHandler = ({ title, value, name }) => {
    let currrntValues = form?.[name] || "";
    let currentTitles = form?.["dev_multi_select_" + name] || "";

    if (!currrntValues.includes(value)) {
      // 👉 if value is already selected, add to it by comma seperated
      const newValue = currrntValues?.length > 0 ? "," + value : value; // if string have no values add value, othervise comma seperated
      const newTitle = currentTitles?.length > 0 ? ", " + title : title; // if string have no values add value, othervise comma seperated
      currrntValues = currrntValues + newValue;
      currentTitles = currentTitles + newTitle;
    } else {
      // 👉 if value is already selected, remove it
      const hasValue = currrntValues?.includes("," + value); // check if value is comma seperated
      currrntValues = hasValue
        ? currrntValues?.replace("," + value, "")
        : currrntValues?.replace(value, "");

      const hasTitle = currentTitles?.includes(", " + title); // check if value is comma seperated
      currentTitles = hasTitle
        ? currentTitles?.replace(", " + title, "")
        : currentTitles?.replace(title, "");
    }

    setForm((form) => ({
      ...form,
      [name]: currrntValues,
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
    // 📌  Handle input change for all inputs
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
        setGoToAction({ state, path: `/dashboard/`, actions }); // go to dashboard
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

    if (hasError || isSIG || (!isSIG && form.step === 0)) {
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

  const nextHandler = async () => {
    // --------------------------------------------------------------------------------
    // 📌 Form validation handler
    // --------------------------------------------------------------------------------
    let MANUALLY_REQUIRED = [];
    if (form?.step === 1) MANUALLY_REQUIRED = ["bad_categorytype"];
    if (form?.step === 2)
      MANUALLY_REQUIRED = [
        "py3_title",
        "py3_firstname",
        "py3_gender",
        "py3_dateofbirth",
        "py3_email",
        "py3_mobilephone",
        "py3_address1ine1",
        "py3_addressline2",
        "py3_addresscountystate",
        "py3_addresszippostalcode",
        "py3_addresscountry",
      ];
    if (form?.step === 3)
      MANUALLY_REQUIRED = [
        "formus_staffgroupcategory",
        "formus_jobrole",
        "py3_hospitalid",
        "formus_professionalregistrationbody",
        "formus_professionalregistrationstatus",
        "formus_residencystatus",
        "formus_qualificationtype",
        "formus_mainspecialtyqualification", // 👈 multi picker
        "formus_clinicalspecialtysofpractice", // 👈 multi picker
        "formus_specialiseddermatologyareasofpractice", // 👈 multi picker
        "formus_typeofcontract",
        "formus_fixedtermtemporaryreasonforemploymentcont",
        "formus_typeofcontract",
        "formus_rotapattern",
        "formus_typeofpractice",
        "formus_privatepracticeorganisation",
        "formus_reasonformovingccstdate",
        form?.bad_newhospitaladded ? "sky_newhospitalname" : "", // if new hospital added, add new hospital name to required fields
        form?.bad_newhospitaladded ? "sky_newhospitaltype" : "", // if new hospital added, add new hospital name to required fields
      ];
    if (form?.step === 4)
      MANUALLY_REQUIRED = [
        "bad_proposer1",
        "bad_preferredmailingaddress",
        "sky_cvurl",
        "bad_memberdirectory",
        "py3_constitutionagreement",
        "bad_readpolicydocument",
      ];
    const { isValid, updatedApplication, updatedForm } = formValidationHandler({
      form,
      application,
      FORM_CONFIG,
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

    // setGoToAction({
    //   state,
    //   path,
    //   actions,
    // });
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

  return (
    <div className="applications-container">
      {fetching && (
        <div className="fetch-icon">
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
                  Category Selected: {application?.[0]?.bad_categorytype}
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
                          Main Hospital / Place of Work / Medical School details
                        </li>
                        <li>GMC / IMC number (except students)</li>
                        <li>Current Post</li>
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
              {stepThree && (
                <div className="form-img-input-wrapper">
                  <ProfileInput
                    form={form}
                    name="sky_profilepicture"
                    profilePictureRef={profilePictureRef}
                    labelClass="form-label"
                    Label={FORM_CONFIG?.["sky_profilepicture"]?.Label}
                    handleDocUploadChange={handleDocUploadChange}
                  />
                </div>
              )}

              {!stepOne && (
                <div
                  className={
                    form?.step === 2
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
                <div className="blue-btn" onClick={nextHandler}>
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
