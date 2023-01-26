import { useState, useEffect } from "react";
import { connect } from "frontity";
import ActionPlaceholder from "../actionPlaceholder";

// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  updateProfileAction,
  setEnquireAction,
  setErrorAction,
  muiQuery,
  getApplicationStatus,
} from "../../context";
import PickListInput from "../inputs/PickListInput";
import MultiCheckboxInput from "../inputs/MultiCheckboxInput";
import {
  FORM_CONFIG,
  group_810170000,
  group_810170001,
  group_810170002,
  group_810170003,
  group_810170004,
  group_810170005,
  group_810170006,
  group_810170007,
} from "../../config/form";
import { getMembershipTypes } from "../../helpers/inputHelpers";
import { applicationTypeHandler } from "../../helpers/workforceHelpers";

const UpdateHospitalDetails = ({ state, actions, libraries }) => {
  const { lg } = muiQuery();
  const dispatch = useAppDispatch();
  const { isActiveUser, dynamicsApps } = useAppState();

  const marginVertical = state.theme.marginVertical;
  const [isFetching, setIsFetching] = useState(null);
  const [formData, setForm] = useState({
    ["_parentcustomerid_value@OData.Community.Display.V1.FormattedValue"]: "",
    bad_gmcno: "",
    bad_ntnno: "",
    bad_otherregulatorybodyreference: "",
    formus_jobrole: "",
    type: "", // 👈  user type of application. Determines which form to show
    isBADMember: false,
  });
  console.log("⭐️ FORM ", formData);
  console.log("⭐️ type ", formData?.type);
  console.log("⭐️ isBADMember ", formData?.isBADMember);

  // --------------------------------------------------------------------------------
  // 📌  Additional show field conditional logic
  // --------------------------------------------------------------------------------
  let isPrivatePractice =
    formData?._formus_typeofpractice &&
    formData?._formus_typeofpractice?.toString() !== "810170001";
  let isOtherSpecialtyQ =
    formData?._formus_mainspecialtyqualification?.includes("810170008"); // 👈 multiselect string
  let isOtherCCSTDates =
    formData?._formus_reasonformovingccstdate?.toString() === "810170005";
  let isOtherQType =
    formData?._formus_qualificationtype?.toString() === "810170007";

  // --------------------------------------------------------------------------------
  // ⚠️ TESTING OVERWRITES
  // --------------------------------------------------------------------------------
  const ServerDevTesting = () => {
    if (state.auth.ENVIRONMENT !== "DEV") return null;

    return (
      <div>
        <h3>ServerDevTesting</h3>
        <select
          name="apps"
          value={formData?.type || ""}
          onChange={typeChangeHandler}
        >
          <option value="Student">Student</option>
          <option value="Ordinary">Ordinary</option>
          <option value="Honorary">Honorary</option>
          <option value="Trainee">Trainee</option>
          <option value="Overseas">Overseas</option>
          <option value="Associate Overseas">Associate Overseas</option>
          <option value="Junior">Junior</option>
          <option value="Associate">Associate</option>
          <option value="">Blank</option>
        </select>
        <select
          name="bad"
          value={formData?.isBADMember ? "true" : "false"}
          onChange={badChangeHandler}
        >
          <option value="true">isBADMember</option>
          <option value="false">not BAD Member</option>
        </select>
      </div>
    );
  };

  const typeChangeHandler = (e) => {
    const { value } = e.target;
    setForm({ ...formData, type: value });
  };
  const badChangeHandler = (e) => {
    const { value } = e.target;
    setForm({ ...formData, isBADMember: value === "true" ? true : false });
  };

  // --------------------------------------------------------------------------------
  // 📌  Apply job filters on groupe cat changes
  // --------------------------------------------------------------------------------
  let _JOBS = FORM_CONFIG?.formus_jobrole?.Choices;

  if (formData?._formus_staffgroupcategory?.toString() === "810170007") {
    // filter out all _JOBS & include only those that are in group_810170007 array
    _JOBS = _JOBS?.filter((job) => group_810170007.includes(job?.Label));
  }
  if (formData?._formus_staffgroupcategory?.toString() === "810170006") {
    _JOBS = _JOBS?.filter((job) => group_810170006.includes(job?.Label));
  }
  if (formData?._formus_staffgroupcategory?.toString() === "810170005") {
    _JOBS = _JOBS?.filter((job) => group_810170005.includes(job?.Label));
  }
  if (formData?._formus_staffgroupcategory?.toString() === "810170004") {
    _JOBS = _JOBS?.filter((job) => group_810170004.includes(job?.Label));
  }
  if (formData?._formus_staffgroupcategory?.toString() === "810170003") {
    _JOBS = _JOBS?.filter((job) => group_810170003.includes(job?.Label));
  }
  if (formData?._formus_staffgroupcategory?.toString() === "810170002") {
    _JOBS = _JOBS?.filter((job) => group_810170002.includes(job?.Label));
  }
  if (formData?._formus_staffgroupcategory?.toString() === "810170001") {
    _JOBS = _JOBS?.filter((job) => group_810170001.includes(job?.Label));
  }
  if (formData?._formus_staffgroupcategory?.toString() === "810170000") {
    _JOBS = _JOBS?.filter((job) => group_810170000.includes(job?.Label));
  }
  console.log("⭐️ _JOBS", _JOBS);

  useEffect(() => {
    if (!isActiveUser) return null;

    (async () => {
      try {
        // --------------------------------------------------------------------------------
        // 📌  fetch promises all for all the data
        // --------------------------------------------------------------------------------
        let dev_subs = [];
        let type = "";

        const appData = await getApplicationStatus({
          state,
          dispatch,
          contactid: isActiveUser?.contactid,
        });
        dev_subs = appData?.subs?.data || []; // 👉 add subs to form

        // --------------------------------------------------------------------------------
        // 📌  Find user application type to determine which form to show
        // --------------------------------------------------------------------------------
        type = applicationTypeHandler({ subs: dev_subs });

        // --------------------------------------------------------------------------------
        // 📌  Get Application list & config from wp
        // --------------------------------------------------------------------------------
        let membership = await getMembershipTypes({ state });
        let activeMembership = dev_subs?.filter(
          (m) =>
            m?.acf?.statecode === "Active" && // 👉 active membership only
            m?.acf?.bad_organisedfor === "BAD" && // 👉 BAD membership only
            m?.core_endon?.includes(new Date().getFullYear().toString()) // 👉 current year only
        );
        let membershipType = activeMembership?.[0]?.acf?.bad_categorytype;
        console.log("⭐️ FOUND ", activeMembership);
        membershipType = "Honorary Working";
        if (membershipType)
          membership = membership?.filter(
            (m) => m?.acf?.category_types === membershipType
          );
        console.log("⭐️ filtered membershipType ", membership);

        // --------------------------------------------------------------------------------
        // 📌  UPDATE FORM DATA
        // --------------------------------------------------------------------------------
        setForm((prev) => ({
          ...prev,
          ...isActiveUser,
          dev_subs,
          type,
          appFilters: membership?.[0]?.acf,
          isBADMember:
            isActiveUser?.bad_selfserviceaccess === state.theme.serviceAccess,
        }));
      } catch (error) {
        console.log("error", error);
      }
    })();

    // --------------------------------------------------------------------------------
    // 📌  Apply onClickEvenHandler to DOM elements
    // --------------------------------------------------------------------------------
    const body = document.querySelector("body");
    body.addEventListener("click", onClickEvenHandler);
  }, [isActiveUser]);

  // HELPERS ----------------------------------------------------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    console.log("⭐️ name & value", name, value);

    // 👉 if Stuff category is changed, reset job roles
    if (name === "_formus_staffgroupcategory") {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
        _formus_jobrole: "",
      }));

      return;
    }

    setForm((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onClickEvenHandler = (e) => {
    // --------------------------------------------------------------------------------
    // 📌  Multi select dropdown cleaner
    // 📌  onClick event listener. Close all formus multiselect fields if DOM element clicked
    // --------------------------------------------------------------------------------
    // console.log("⭐️ list ", e.target.classList);

    if (
      e.target.classList.contains("flex-col") ||
      e.target.classList.contains("input") ||
      e.target.classList.contains("flex-form-col") ||
      e.target.classList.contains("form-select") ||
      e.target.classList.contains("blue-btn") ||
      e.target.classList.contains("form-row-50") ||
      e.target.classList.contains("form-control")
    ) {
      setForm((prev) => ({
        ...prev,
        ["dev_selected_" + "_formus_specialiseddermatologyareasofpractice"]:
          undefined,
        ["dev_selected_" + "_formus_mainspecialtyqualification"]: undefined,
        ["dev_selected_" + "_formus_clinicalspecialtysofpractice"]: undefined,
      }));
    }
  };

  const handleContactForm = async () => {
    setEnquireAction({
      dispatch,
      enquireAction: {
        contact_public_email: "membership@bad.org.uk",
        // contact_public_phone_number: "+1 (123) 456-7890",
        form_title: "Edit Professional Details",
        form_body: `Please use the form below to update us to changes to your professional details. To update your place of work, start typing to select from a list of options. If your place of work is not on the list, type Not Listed and use the message box at the bottom of the form instead`,
        job_title: true,
        message: true,
        recipients: [{ email: "membership@bad.org.uk" }],
        isHospitalChange: true,
        emailTemplate: "BADEnquiryFormAuthChangeOfHospital", // change of hospital template

        // default email subject & template name
        emailSubject:
          "Change of Professional Details Request. Main Hospital / Place of Work / Medical School details",
      },
    });
  };

  const handleProfileUpdate = async () => {
    setIsFetching(true);
    // const address1_line1 = formData.address1_line1;
    const bad_gmcno = formData?.bad_gmcno;
    const bad_ntnno = formData?.bad_ntnno;
    const bad_otherregulatorybodyreference =
      formData?.bad_otherregulatorybodyreference;
    const formus_rotapattern = formData?._formus_rotapattern;
    const formus_residencystatus = formData?._formus_residencystatus;
    const formus_staffgroupcategory = formData?._formus_staffgroupcategory;
    const formus_jobrole = formData?._formus_jobrole;
    const formus_qualificationtype = formData?._formus_qualificationtype;
    const formus_professionalregistrationbody =
      formData?._formus_professionalregistrationbody;
    const formus_professionalregistrationstatus =
      formData?._formus_professionalregistrationstatus;
    const formus_typeofcontract = formData?._formus_typeofcontract;
    const formus_clinicalspecialtysofpractice =
      formData?._formus_clinicalspecialtysofpractice;
    const formus_fixedtermtemporaryreasonforemploymentcont =
      formData?._formus_fixedtermtemporaryreasonforemploymentcont;
    const formus_typeofpractice = formData?._formus_typeofpractice;
    const formus_mainspecialtyqualification =
      formData?._formus_mainspecialtyqualification;
    const formus_privatepracticeorganisation =
      formData?._formus_privatepracticeorganisation;
    const formus_specialiseddermatologyareasofpractice =
      formData?._formus_specialiseddermatologyareasofpractice;
    const formus_reasonformovingccstdate =
      formData?._formus_reasonformovingccstdate;

    const data = Object.assign(
      {}, // add empty object

      // --------------------------------------------------------------------------------
      // 📌  Only add valid values. If undefined-skip & all tostring
      // --------------------------------------------------------------------------------
      bad_gmcno && { bad_gmcno: bad_gmcno?.toString() },
      bad_ntnno && { bad_ntnno: bad_ntnno?.toString() },
      {
        bad_otherregulatorybodyreference:
          bad_otherregulatorybodyreference?.toString(),
      },
      formus_rotapattern && {
        formus_rotapattern: formus_rotapattern?.toString(),
      },
      formus_residencystatus && {
        formus_residencystatus: formus_residencystatus?.toString(),
      },
      formus_staffgroupcategory && {
        formus_staffgroupcategory: formus_staffgroupcategory?.toString(),
      },
      formus_jobrole && { formus_jobrole: formus_jobrole?.toString() },
      formus_qualificationtype && {
        formus_qualificationtype: formus_qualificationtype?.toString(),
      },
      formus_professionalregistrationbody && {
        formus_professionalregistrationbody:
          formus_professionalregistrationbody?.toString(),
      },
      formus_professionalregistrationstatus && {
        formus_professionalregistrationstatus:
          formus_professionalregistrationstatus?.toString(),
      },
      formus_typeofcontract && {
        formus_typeofcontract: formus_typeofcontract?.toString(),
      },
      formus_clinicalspecialtysofpractice && {
        formus_clinicalspecialtysofpractice:
          formus_clinicalspecialtysofpractice?.toString(), // 👈  multi picker
      },
      formus_fixedtermtemporaryreasonforemploymentcont && {
        formus_fixedtermtemporaryreasonforemploymentcont:
          formus_fixedtermtemporaryreasonforemploymentcont?.toString(),
      },
      formus_typeofpractice && {
        formus_typeofpractice: formus_typeofpractice?.toString(),
      },
      formus_privatepracticeorganisation && {
        formus_privatepracticeorganisation:
          formus_privatepracticeorganisation?.toString(),
      },
      formus_mainspecialtyqualification && {
        formus_mainspecialtyqualification:
          formus_mainspecialtyqualification?.toString(), // 👈  multi picker
      },
      formus_specialiseddermatologyareasofpractice && {
        formus_specialiseddermatologyareasofpractice:
          formus_specialiseddermatologyareasofpractice?.toString(), // 👈  multi picker
      },
      formus_reasonformovingccstdate && {
        formus_reasonformovingccstdate:
          formus_reasonformovingccstdate?.toString(), // 👈  multi picker
      },
      formData?.formus_othermainspecialtyqualification && {
        formus_othermainspecialtyqualification:
          formData?.formus_othermainspecialtyqualification?.toString(), // 👈  multi picker
      },
      formData?.formus_otherreasonformovingccstdate && {
        formus_otherreasonformovingccstdate:
          formData?.formus_otherreasonformovingccstdate?.toString(), // 👈  multi picker
      },
      formData?.formus_otherqualificationtype && {
        formus_otherqualificationtype:
          formData?.formus_otherqualificationtype?.toString(), // 👈  multi picker
      }
    );
    // console.log("⭐️ DATA FEED to UPDATE", data);

    try {
      const response = await updateProfileAction({
        state,
        dispatch,
        data,
        isActiveUser,
      });
      if (!response) throw new Error("Error updating profile");
      // display error message
      setErrorAction({
        dispatch,
        isError: { message: `Professional information updated successfully` },
      });
    } catch (error) {
      console.log("error", error);
      setErrorAction({
        dispatch,
        isError: {
          message: `Failed to update professional information. Please try again.`,
          image: "Error",
        },
      });
    } finally {
      setIsFetching(false);
    }
  };

  const multiSelectHandler = ({ title, value, name }) => {
    let currentValues = formData?.[name] || "";
    let currentTitles = "";

    if (!currentValues?.includes(value)) {
      // 👉 if value is already selected, add to it by comma separated
      currentValues = currentValues ? currentValues + "," + value : "" + value; // if string have no values add value, otherwise comma seperated
    } else {
      // 👉 remove value from string
      // if starts with value, remove it
      if (currentValues?.startsWith(value)) {
        currentValues = currentValues?.replace(value + ",", "");

        // --------------------------------------------------------------------------------
        // 📌  Value ir required to be passed in to Dynamics
        // 📌  If string have only that value ignore/don't remove
        // --------------------------------------------------------------------------------
      } else {
        currentValues = currentValues?.replace("," + value, "");
      }
    }

    // ⚠️ strip first character from name
    let adjustedName = name?.substring(1);

    // Filter out Choices list based on selection/currentValues string. If value includes in currentValues, add Label to currentTitles
    FORM_CONFIG?.[adjustedName]?.Choices?.forEach((item) => {
      const Label = item.Label;
      const value = item.value;
      if (currentValues?.includes(value) && !currentTitles.includes(Label)) {
        currentTitles = currentTitles
          ? currentTitles + "; " + item.Label
          : item.Label;
      }
    });

    setForm((prev) => ({
      ...prev,
      [name]: currentValues,
      ["dev_multi_select_" + name]: currentTitles,
    }));
  };

  const multiSelectDropDownHandler = ({ name, value }) => {
    let handler = {
      ["dev_selected_" + name]: !formData?.["dev_selected_" + name],
    };
    // 📌 conditional dropdown closing based on selection
    if (name === "_formus_mainspecialtyqualification") {
      handler = {
        ...handler,
        ["dev_selected_" + "_formus_clinicalspecialtysofpractice"]: undefined,
        ["dev_selected_" + "_formus_specialiseddermatologyareasofpractice"]:
          undefined,
      };
    }

    if (name === "_formus_clinicalspecialtysofpractice") {
      handler = {
        ...handler,
        ["dev_selected_" + "_formus_mainspecialtyqualification"]: undefined,
        ["dev_selected_" + "_formus_specialiseddermatologyareasofpractice"]:
          undefined,
      };
    }

    if (name === "_formus_specialiseddermatologyareasofpractice") {
      handler = {
        ...handler,
        ["dev_selected_" + "_formus_mainspecialtyqualification"]: undefined,
        ["dev_selected_" + "_formus_clinicalspecialtysofpractice"]: undefined,
      };
    }

    // 👉 formus_mainspecialtyqualification
    setForm((prev) => ({
      ...prev,
      ...handler,
    }));
  };

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    return (
      <div
        className="flex"
        style={{
          justifyContent: !lg ? "flex-end" : "center",
          padding: `2em 0 0`,
          width: "100%",
        }}
      >
        <div
          className="blue-btn"
          style={{ marginRight: "1em" }}
          onClick={handleContactForm}
        >
          Request To Edit
        </div>
        <div className="blue-btn" onClick={handleProfileUpdate}>
          Save
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <ServerDevTesting />

      <ActionPlaceholder isFetching={isFetching} background="transparent" />
      <div
        className="shadow flex-form-col flex-wrap"
        style={{ marginBottom: `${marginVertical}px`, padding: "2em 4em" }}
      >
        <div className="primary-title" style={{ fontSize: 20, widht: "100%" }}>
          Workforce Details:
        </div>
        <div className="workforce-container">
          {/* 👉 APPLICABLE TO ALL APPS APART FROM 👉 STUDENT */}
          {formData?.type !== "Student" && (
            <>
              {formData?.appFilters?.bad_py3_hospitalid !== "Hide" && (
                <div className="form-row-50">
                  <label>
                    Main Hospital / Place of Work / Medical School details
                  </label>
                  <input
                    name="bad_py3_hospitalid"
                    value={isActiveUser?.["_parentcustomerid_value"] || ""}
                    onChange={handleInputChange}
                    className="form-control input"
                    placeholder="Main Hospital / Place of Work / Medical School details"
                    disabled
                  />
                </div>
              )}
              {formData?.appFilters?.bad_formus_qualificationtype !==
                "Hide" && (
                <div className="form-row-50">
                  <label>Qualification Type</label>
                  <PickListInput
                    form={formData}
                    name="_formus_qualificationtype"
                    value={formData?._formus_qualificationtype || ""}
                    onChange={handleInputChange}
                    Choices={[
                      ...FORM_CONFIG?.formus_qualificationtype?.Choices,
                    ]}
                    labelClass="form-label"
                  />
                </div>
              )}
            </>
          )}

          {/* 👉 APPLICABLE TO STUDENT APPS ONLY */}
          {formData?.isBADMember && formData?.type === "Student" && (
            <>
              {formData?.appFilters?.bad_formus_residencystatus !== "Hide" && (
                <div className="form-row-50">
                  <label>Residency Status</label>
                  <PickListInput
                    form={formData}
                    name="_formus_residencystatus"
                    value={formData?._formus_residencystatus || ""}
                    onChange={handleInputChange}
                    Choices={[...FORM_CONFIG?.formus_residencystatus?.Choices]}
                    labelClass="form-label"
                  />
                </div>
              )}

              {formData?.appFilters?.bad_formus_qualificationtype !==
                "Hide" && (
                <div className="form-row-50">
                  <label>Qualification Type</label>
                  <PickListInput
                    form={formData}
                    name="_formus_qualificationtype"
                    value={formData?._formus_qualificationtype || ""}
                    onChange={handleInputChange}
                    Choices={[
                      ...FORM_CONFIG?.formus_qualificationtype?.Choices,
                    ]}
                    labelClass="form-label"
                  />
                </div>
              )}
            </>
          )}

          {formData?.isBADMember && isOtherQType && (
            <>
              <div className="form-row-50">
                <label>Qualification Type Other</label>
                <input
                  name="formus_otherqualificationtype"
                  type="text"
                  value={formData?.formus_otherqualificationtype || ""}
                  onChange={handleInputChange}
                  className="form-control input"
                  placeholder="Qualification Type Other"
                />
              </div>
              <div className="form-row-50" />
            </>
          )}

          {/* 👉 APPLICABLE TO ALL APPS */}
          {formData?.appFilters?.bad_formus_staffgroupcategory !== "Hide" && (
            <div className="form-row-50">
              <label>Staff Group Category</label>
              <PickListInput
                form={formData}
                name="_formus_staffgroupcategory"
                value={formData?._formus_staffgroupcategory || ""}
                onChange={handleInputChange}
                Choices={[...FORM_CONFIG?.formus_staffgroupcategory?.Choices]}
                labelClass="form-label"
              />
            </div>
          )}
          {formData?.appFilters?.bad_formus_jobrole !== "Hide" && (
            <div className="form-row-50">
              <label>Job Role</label>
              <PickListInput
                form={formData}
                name="_formus_jobrole"
                value={formData?._formus_jobrole || ""}
                onChange={handleInputChange}
                Choices={[..._JOBS]}
                labelClass="form-label"
                dashboardWidget="Job Role"
              />
            </div>
          )}

          {formData?.isBADMember && formData?.type !== "Student" && (
            <>
              {formData?.appFilters?.bad_formus_professionalregistrationbody !==
                "Hide" && (
                <div className="form-row-50">
                  <label>Professional Registration Body</label>
                  <PickListInput
                    form={formData}
                    name="_formus_professionalregistrationbody"
                    value={formData?._formus_professionalregistrationbody || ""}
                    onChange={handleInputChange}
                    Choices={[
                      ...FORM_CONFIG?.formus_professionalregistrationbody
                        ?.Choices,
                    ]}
                    labelClass="form-label"
                  />
                </div>
              )}
              {formData?.appFilters
                ?.bad_formus_professionalregistrationstatus !== "Hide" && (
                <div className="form-row-50">
                  <label>Professional Registration Status</label>
                  <PickListInput
                    form={formData}
                    name="_formus_professionalregistrationstatus"
                    value={
                      formData?._formus_professionalregistrationstatus || ""
                    }
                    onChange={handleInputChange}
                    Choices={[
                      ...FORM_CONFIG?.formus_professionalregistrationstatus
                        ?.Choices,
                    ]}
                    labelClass="form-label"
                  />
                </div>
              )}

              {formData?.type !== "Associate Overseas" && (
                <>
                  {formData?.appFilters?.bad_formus_typeofcontract !==
                    "Hide" && (
                    <div className="form-row-50">
                      <label>Type of Contract</label>
                      <PickListInput
                        form={formData}
                        name="_formus_typeofcontract"
                        value={formData?._formus_typeofcontract || ""}
                        onChange={handleInputChange}
                        Choices={[
                          ...FORM_CONFIG?.formus_typeofcontract?.Choices,
                        ]}
                        labelClass="form-label"
                      />
                    </div>
                  )}

                  {formData?.appFilters
                    ?.bad_formus_clinicalspecialtysofpractice !== "Hide" && (
                    <div className="form-row-50">
                      <label>Clinical Specialty(s) of practice</label>
                      <MultiCheckboxInput
                        form={formData}
                        name="_formus_clinicalspecialtysofpractice"
                        labelClass="form-label"
                        Choices={[
                          ...FORM_CONFIG?.formus_clinicalspecialtysofpractice
                            ?.Choices,
                        ]}
                        multiSelectHandler={multiSelectHandler}
                        multiSelectDropDownHandler={multiSelectDropDownHandler}
                        dashboardWidget="formus_clinicalspecialtysofpractice"
                      />
                    </div>
                  )}
                </>
              )}

              {formData?.type !== "Associate Overseas" && (
                <>
                  {formData?.appFilters
                    ?.bad_formus_fixedtermtemporaryreasonforemploymentcont !==
                    "Hide" && (
                    <div className="form-row-50">
                      <label>
                        Fixed term/temporary reason for employment contract
                      </label>
                      <PickListInput
                        form={formData}
                        name="_formus_fixedtermtemporaryreasonforemploymentcont"
                        value={
                          formData?._formus_fixedtermtemporaryreasonforemploymentcont ||
                          ""
                        }
                        onChange={handleInputChange}
                        Choices={[
                          ...FORM_CONFIG
                            ?.formus_fixedtermtemporaryreasonforemploymentcont
                            ?.Choices,
                        ]}
                        labelClass="form-label"
                      />
                    </div>
                  )}

                  {formData?.appFilters?.bad_formus_typeofpractice !==
                    "Hide" && (
                    <div className="form-row-50">
                      <label>Type of Practice</label>
                      <PickListInput
                        form={formData}
                        name="_formus_typeofpractice"
                        value={formData?._formus_typeofpractice || ""}
                        onChange={handleInputChange}
                        Choices={[
                          ...FORM_CONFIG?.formus_typeofpractice?.Choices,
                        ]}
                        labelClass="form-label"
                      />
                    </div>
                  )}
                </>
              )}

              {formData?.type !== "Associate Overseas" && isPrivatePractice && (
                <div className="form-row-50">
                  <label>Private Practice Organisation</label>
                  <PickListInput
                    form={formData}
                    name="_formus_privatepracticeorganisation"
                    value={formData?._formus_privatepracticeorganisation || ""}
                    onChange={handleInputChange}
                    Choices={[
                      ...FORM_CONFIG?.formus_privatepracticeorganisation
                        ?.Choices,
                    ]}
                    labelClass="form-label"
                  />
                </div>
              )}

              {formData?.type === "Ordinary" && (
                <>
                  {formData?.appFilters
                    ?.bad_formus_mainspecialtyqualification !== "Hide" && (
                    <div className="form-row-50">
                      <label>Main Specialty Qualification</label>
                      <MultiCheckboxInput
                        form={formData}
                        name="_formus_mainspecialtyqualification"
                        labelClass="form-label"
                        Choices={[
                          ...FORM_CONFIG?.formus_mainspecialtyqualification
                            ?.Choices,
                        ]}
                        multiSelectHandler={multiSelectHandler}
                        multiSelectDropDownHandler={multiSelectDropDownHandler}
                        dashboardWidget="formus_mainspecialtyqualification"
                      />
                    </div>
                  )}
                  {formData?.appFilters
                    ?.bad_formus_specialiseddermatologyareasofpractice !==
                    "Hide" && (
                    <div className="form-row-50">
                      <label>Specialized Dermatology Areas of practice</label>
                      <MultiCheckboxInput
                        form={formData}
                        name="_formus_specialiseddermatologyareasofpractice"
                        labelClass="form-label"
                        Choices={[
                          ...FORM_CONFIG
                            ?.formus_specialiseddermatologyareasofpractice
                            ?.Choices,
                        ]}
                        multiSelectHandler={multiSelectHandler}
                        multiSelectDropDownHandler={multiSelectDropDownHandler}
                        dashboardWidget="formus_specialiseddermatologyareasofpractice"
                      />
                    </div>
                  )}
                </>
              )}

              {formData?.type === "Ordinary" && isOtherSpecialtyQ && (
                <div className="form-row-50">
                  <label>Main Specialty Qualification Other</label>
                  <input
                    name="formus_othermainspecialtyqualification"
                    type="text"
                    value={
                      formData?.formus_othermainspecialtyqualification || ""
                    }
                    onChange={handleInputChange}
                    className="form-control input"
                    placeholder="Main Specialty Qualification Other"
                  />
                </div>
              )}

              {formData?.type === "Trainee" && (
                <>
                  {formData?.appFilters?.bad_py3_ntnno !== "Hide" && (
                    <div className="form-row-50">
                      <label>NTN Number</label>
                      <input
                        name="bad_ntnno"
                        type="text"
                        value={formData?.bad_ntnno || ""}
                        onChange={handleInputChange}
                        className="form-control input"
                        placeholder="NTN Number"
                      />
                    </div>
                  )}
                  {formData?.appFilters?.bad_formus_reasonformovingccstdate !==
                    "Hide" && (
                    <div className="form-row-50">
                      <label>Reason for moving CCST date</label>
                      <PickListInput
                        form={formData}
                        name="_formus_reasonformovingccstdate"
                        value={formData?._formus_reasonformovingccstdate || ""}
                        onChange={handleInputChange}
                        Choices={[
                          ...FORM_CONFIG?.formus_reasonformovingccstdate
                            ?.Choices,
                        ]}
                        labelClass="form-label"
                      />
                    </div>
                  )}
                </>
              )}

              {formData?.type === "Trainee" && isOtherCCSTDates && (
                <>
                  <div className="form-row-50">
                    <label>Reason for Moving CSST Date Other</label>
                    <input
                      name="formus_otherreasonformovingccstdate"
                      type="text"
                      value={
                        formData?.formus_otherreasonformovingccstdate || ""
                      }
                      onChange={handleInputChange}
                      className="form-control input"
                      placeholder="Reason for Moving CSST Date Other"
                    />
                  </div>
                  <div className="form-row-50" />
                </>
              )}

              {formData?.type !== "Associate Overseas" && (
                <>
                  {formData?.appFilters?.bad_formus_residencystatus !==
                    "Hide" && (
                    <div className="form-row-50">
                      <label>Residency Status</label>
                      <PickListInput
                        form={formData}
                        name="_formus_residencystatus"
                        value={formData?._formus_residencystatus || ""}
                        onChange={handleInputChange}
                        Choices={[
                          ...FORM_CONFIG?.formus_residencystatus?.Choices,
                        ]}
                        labelClass="form-label"
                      />
                    </div>
                  )}

                  {formData?.appFilters?.bad_formus_rotapattern !== "Hide" && (
                    <div className="form-row-50">
                      <label>Rota Pattern</label>
                      <PickListInput
                        form={formData}
                        name="_formus_rotapattern"
                        value={formData?._formus_rotapattern || ""}
                        onChange={handleInputChange}
                        Choices={[...FORM_CONFIG?.formus_rotapattern?.Choices]}
                        labelClass="form-label"
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        <ServeActions />
      </div>
    </div>
  );
};

export default connect(UpdateHospitalDetails);
