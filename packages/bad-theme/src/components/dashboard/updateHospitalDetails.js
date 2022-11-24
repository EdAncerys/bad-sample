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

  // --------------------------------------------------------------------------------
  // 📌  User application types
  // --------------------------------------------------------------------------------
  const isBADMember =
    formData?.dev_subs?.filter((app) => app?.bad_organisedfor?.includes("BAD"))
      ?.length > 0;
  const isStudentApp =
    formData?.dev_subs?.filter((app) => app?.core_name?.includes("Student"))
      ?.length > 0;
  const isOrdinaryApp =
    formData?.dev_subs?.filter((app) => app?.core_name?.includes("Ordinary"))
      ?.length > 0;

  console.log("⭐️ formData", formData);

  useEffect(() => {
    if (!isActiveUser) return null;

    let form = {};

    (async () => {
      try {
        // --------------------------------------------------------------------------------
        // 📌  fetch promises all for all the data
        // --------------------------------------------------------------------------------

        const appData = await getApplicationStatus({
          state,
          dispatch,
          contactid: isActiveUser?.contactid,
        });
        form.dev_subs = appData?.subs; // 👉 add subs to form
      } catch (error) {
        console.log("error", error);
      }
    })();

    // --------------------------------------------------------------------------------
    // 📌  UPDATE FORM DATA
    // --------------------------------------------------------------------------------
    setForm((prev) => ({
      ...prev,
      ...isActiveUser,
      ...form,
    }));
  }, [isActiveUser]);

  // HELPERS ----------------------------------------------------------------
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
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

    const data = Object.assign(
      {}, // add empty object
      { bad_gmcno },
      { bad_ntnno },
      { bad_otherregulatorybodyreference },
      { formus_rotapattern },
      { formus_residencystatus }
    );

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
      // console.log("error", error);
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
              <label>GMC / IMC Number</label>
              <input
                name="bad_gmcno"
                value={formData?.bad_gmcno || ""}
                onChange={handleInputChange}
                className="form-control input"
                placeholder="GMC / IMC Number"
              />
            </div>
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
          </div>

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
              <label>Other regulatory body</label>
              <input
                name="bad_otherregulatorybodyreference"
                value={formData.bad_otherregulatorybodyreference}
                onChange={handleInputChange}
                className="form-control input"
                placeholder="Other regulatory body"
              />
            </div>
          </div>

          <div className="flex-form-row">
            <div className="form-row">
              <label>Staff Group Category</label>
              <input
                name="formus_staffgroupcategory"
                value={formData?.formus_staffgroupcategory || ""}
                onChange={handleInputChange}
                className="form-control input"
                placeholder="Staff Group Category"
                disabled
              />
            </div>
            <div className="form-row">
              <label>Job Title</label>
              <input
                name="formus_jobrole"
                value={formData?.formus_jobrole || ""}
                onChange={handleInputChange}
                className="form-control input"
                placeholder="Job Title"
                disabled
              />
            </div>
          </div>

          {isBADMember && !isStudentApp && (
            <div className="flex-form-col">
              <div className="flex-form-row">
                <div className="form-row">
                  <label>Professional Registration Body</label>
                  <input
                    name="formus_professionalregistrationbody"
                    value={formData?.formus_professionalregistrationbody || ""}
                    onChange={handleInputChange}
                    className="form-control input"
                    placeholder="Professional Registration Body"
                    disabled
                  />
                </div>
                <div className="form-row">
                  <label>Professional Registration Status</label>
                  <input
                    name="formus_professionalregistrationstatus"
                    value={
                      formData?.formus_professionalregistrationstatus || ""
                    }
                    onChange={handleInputChange}
                    className="form-control input"
                    placeholder="Professional Registration Status"
                    disabled
                  />
                </div>
              </div>

              <div className="flex-form-row">
                <div className="form-row">
                  <label>Type of Contract</label>
                  <input
                    name="formus_typeofcontract"
                    value={formData?.formus_typeofcontract || ""}
                    onChange={handleInputChange}
                    className="form-control input"
                    placeholder="Type of Contract"
                    disabled
                  />
                </div>

                <div className="form-row">
                  <label>Clinical Specialty(s) of practice</label>
                  <input
                    name="formus_clinicalspecialtysofpractice"
                    value={formData?.formus_clinicalspecialtysofpractice || ""}
                    onChange={handleInputChange}
                    className="form-control input"
                    placeholder="Clinical Specialty(s) of practice"
                    disabled
                  />
                </div>
              </div>

              {isOrdinaryApp && (
                <div className="flex-form-row">
                  <div className="form-row">
                    <label>Main Specialty Qualification</label>
                    <input
                      name="formus_mainspecialtyqualification"
                      value={formData?.formus_mainspecialtyqualification || ""}
                      onChange={handleInputChange}
                      className="form-control input"
                      placeholder="Main Specialty Qualification"
                      disabled
                    />
                  </div>
                  <div className="form-row">
                    <label>Specialized Dermatology Areas of practice</label>
                    <input
                      name="formus_specialiseddermatologyareasofpractice"
                      value={
                        formData?.formus_specialiseddermatologyareasofpractice ||
                        ""
                      }
                      onChange={handleInputChange}
                      className="form-control input"
                      placeholder="Specialized Dermatology Areas of practice"
                      disabled
                    />
                  </div>
                </div>
              )}

              <div className="flex-form-row">
                <div className="form-row">
                  <label>Residency Status</label>
                  <PickListInput
                    form={formData}
                    name="_formus_residencystatus"
                    value={formData?._formus_residencystatus || ""}
                    onChange={handleInputChange}
                    Choices={[
                      {
                        value: 810170000,
                        Label: "Permanent",
                      },
                      {
                        value: 810170001,
                        Label: "Temporary",
                      },
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
                    Choices={[
                      {
                        value: 810170000,
                        Label: "On Call",
                      },
                      {
                        value: 810170002,
                        Label: "Trainee On Call",
                      },
                      {
                        value: 810170001,
                        Label: "Ward Rounds",
                      },
                    ]}
                    labelClass="form-label"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <ServeActions />
      </div>
    </div>
  );
};

export default connect(UpdateHospitalDetails);
