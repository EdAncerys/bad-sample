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
  });
  console.log("⭐️ FORM ", formData);
  console.log(
    "⭐️ FORM DATA: ",
    formData?.["_formus_clinicalspecialtysofpractice"]
  );
  console.log(
    "⭐️ FORM DATA: ",
    formData?.["dev_multi_select__formus_clinicalspecialtysofpractice"]
  );

  // --------------------------------------------------------------------------------
  //  ⚠️ User application types & Job Roles updates ⚠️
  // --------------------------------------------------------------------------------
  const isBADMember =
    isActiveUser?.bad_selfserviceaccess === state.theme.serviceAccess;
  const isStudentApp =
    formData?.dev_subs?.filter(
      (app) =>
        app?.core_name?.includes("Student") && app?.statecode === "Active"
    )?.length > 0;
  const isOrdinaryApp =
    formData?.dev_subs?.filter(
      (app) =>
        app?.core_name?.includes("Ordinary") && app?.statecode === "Active"
    )?.length > 0;
  const isTraineeApp =
    formData?.dev_subs?.filter(
      (app) =>
        app?.core_name?.includes("Trainee") && app?.statecode === "Active"
    )?.length > 0;
  const isOverseasApp =
    formData?.dev_subs?.filter(
      (app) =>
        app?.core_name?.includes("Overseas") && app?.statecode === "Active"
    )?.length > 0;
  const isAssociateOverseasApp =
    formData?.dev_subs?.filter(
      (app) =>
        app?.core_name?.includes("Associate Overseas") &&
        app?.statecode === "Active"
    )?.length > 0;

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
        const appData = await getApplicationStatus({
          state,
          dispatch,
          contactid: isActiveUser?.contactid,
        });
        dev_subs = appData?.subs?.data || []; // 👉 add subs to form

        // --------------------------------------------------------------------------------
        // 📌  UPDATE FORM DATA
        // --------------------------------------------------------------------------------
        setForm((prev) => ({
          ...prev,
          ...isActiveUser,
          dev_subs,
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
    console.log("⭐️ list ", e.target.classList);

    if (
      e.target.classList.contains("flex-col") ||
      e.target.classList.contains("input") ||
      e.target.classList.contains("flex-form-col") ||
      e.target.classList.contains("form-select") ||
      e.target.classList.contains("blue-btn") ||
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
    const formus_specialiseddermatologyareasofpractice =
      formData?._formus_specialiseddermatologyareasofpractice;

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
      formus_mainspecialtyqualification && {
        formus_mainspecialtyqualification:
          formus_mainspecialtyqualification?.toString(), // 👈  multi picker
      },
      formus_specialiseddermatologyareasofpractice && {
        formus_specialiseddermatologyareasofpractice:
          formus_specialiseddermatologyareasofpractice?.toString(), // 👈  multi picker
      }
    );

    console.log("⭐️ DATA FEED to UPDATE", data);

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
    console.log("⭐️ START BASE", currentValues);
    console.log("⭐️ START value", value);

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

    // Filter out Choices list based on selection/currentValues string. If value includes in currentValues, add Label to currentTitles
    FORM_CONFIG?.formus_clinicalspecialtysofpractice?.Choices?.forEach(
      (item) => {
        const Label = item.Label;
        const value = item.value;
        if (currentValues?.includes(value) && !currentTitles.includes(Label)) {
          currentTitles = currentTitles
            ? currentTitles + "; " + item.Label
            : item.Label;
        }
      }
    );

    setForm((prev) => ({
      ...prev,
      [name]: currentValues,
      ["dev_multi_select_" + name]: currentTitles,
    }));
  };

  const multiSelectDropDownHandler = ({ name, value }) => {
    console.log("🐞 name: ", name);
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
      <ActionPlaceholder isFetching={isFetching} background="transparent" />
      <div
        className="shadow flex-form-col"
        style={{ marginBottom: `${marginVertical}px`, padding: "2em 4em" }}
      >
        <div className="primary-title" style={{ fontSize: 20 }}>
          Workforce Details:
        </div>
        <div className="flex-form-col">
          <div className="flex-form-row">
            <div className="form-row">
              <label>
                Main Hospital / Place of Work / Medical School details
              </label>
              <input
                name="address1_line1"
                value={
                  formData[
                    "_parentcustomerid_value@OData.Community.Display.V1.FormattedValue"
                  ]
                }
                onChange={handleInputChange}
                className="form-control input"
                placeholder="Main Hospital / Place of Work / Medical School details"
                disabled
              />
            </div>
            <div className="form-row">
              {isOverseasApp && (
                <div>
                  <label>Other regulatory body</label>
                  <input
                    name="bad_otherregulatorybodyreference"
                    value={formData.bad_otherregulatorybodyreference}
                    onChange={handleInputChange}
                    className="form-control input"
                    placeholder="Other regulatory body"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex-form-row">
            <div className="form-row">
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
            <div className="form-row">
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
          </div>

          {isBADMember && isStudentApp && (
            <div className="flex-form-row">
              <div className="form-row">
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

              <div className="form-row">
                <label>Qualification Type</label>
                <PickListInput
                  form={formData}
                  name="_formus_qualificationtype"
                  value={formData?._formus_qualificationtype || ""}
                  onChange={handleInputChange}
                  Choices={[...FORM_CONFIG?.formus_qualificationtype?.Choices]}
                  labelClass="form-label"
                />
              </div>
            </div>
          )}

          {isBADMember && !isStudentApp && (
            <div className="flex-form-col">
              <div className="flex-form-row">
                <div className="form-row">
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
                <div className="form-row">
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
              </div>

              {!isAssociateOverseasApp && (
                <div className="flex-form-row">
                  <div className="form-row">
                    <label>Type of Contract</label>
                    <PickListInput
                      form={formData}
                      name="_formus_typeofcontract"
                      value={formData?._formus_typeofcontract || ""}
                      onChange={handleInputChange}
                      Choices={[...FORM_CONFIG?.formus_typeofcontract?.Choices]}
                      labelClass="form-label"
                    />
                  </div>

                  <div className="form-row">
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
                </div>
              )}

              {!isAssociateOverseasApp && (
                <div className="flex-form-row">
                  <div className="form-row">
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

                  <div className="form-row">
                    <label>Type of Practice</label>
                    <PickListInput
                      form={formData}
                      name="_formus_typeofpractice"
                      value={formData?._formus_typeofpractice || ""}
                      onChange={handleInputChange}
                      Choices={[...FORM_CONFIG?.formus_typeofpractice?.Choices]}
                      labelClass="form-label"
                    />
                  </div>
                </div>
              )}

              {isOrdinaryApp && (
                <div className="flex-form-row">
                  <div className="form-row">
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
                  <div className="form-row">
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
                </div>
              )}

              {isTraineeApp && (
                <div className="flex-form-row">
                  <div className="form-row">
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
                  <div className="form-row">
                    <label>Reason for moving CCST date</label>
                    <input
                      name="formus_otherreasonformovingccstdate"
                      value={formData.formus_otherreasonformovingccstdate}
                      onChange={handleInputChange}
                      className="form-control input"
                      placeholder="Reason for moving CCST date"
                    />
                  </div>
                </div>
              )}

              {isTraineeApp && (
                <div className="flex-form-row">
                  <div className="flex-form-row">
                    <div className="form-row">
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
                    <div className="form-row" />
                  </div>
                </div>
              )}

              {!isAssociateOverseasApp && (
                <div className="flex-form-row">
                  <div className="form-row">
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

                  <div className="form-row">
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
                </div>
              )}
            </div>
          )}
        </div>

        <ServeActions />
      </div>
    </div>
  );
};

export default connect(UpdateHospitalDetails);
