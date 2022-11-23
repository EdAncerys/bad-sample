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
  getCatalogueData,
} from "../../context";

const UpdateHospitalDetails = ({ state, actions, libraries }) => {
  const { lg } = muiQuery();
  const dispatch = useAppDispatch();
  const { isActiveUser } = useAppState();

  const marginVertical = state.theme.marginVertical;
  const [isFetching, setIsFetching] = useState(null);
  const [formData, setForm] = useState({
    ["_parentcustomerid_value@OData.Community.Display.V1.FormattedValue"]: "",
    bad_gmcno: "",
    bad_ntnno: "",
    bad_otherregulatorybodyreference: "",
    formus_jobrole: "",
  });

  console.log("⭐️ formData ", formData);

  useEffect(() => {
    if (!isActiveUser) return null;

    let form = {};
    const host = state.auth.WP_HOST;

    (async () => {
      // --------------------------------------------------------------------------------
      // 📌  fetch promises all for all the data
      // --------------------------------------------------------------------------------
      // const res = getCatalogueData({
      //   state,
      //   path: "/catalogue/fields/contact",
      // });
      // const data = await Promise.all([
      //   fetch(
      //     host + "catalogue/fields/contact?field=formus_residencystatus",
      //     requestOptions
      //   ),
      //   fetch(
      //     host + "catalogue/fields/contact?field=formus_rotapattern",
      //     requestOptions
      //   ),
      // ]);
      // const [professionalRegistrationBody, professionalRegistrationStatus] =
      //   await Promise.all(data.map((res) => res.json()));
      // console.log(
      //   "⭐️ promise data",
      //   professionalRegistrationBody,
      //   professionalRegistrationStatus
      // );
      //  update from with fetched data
      // form = {
      //   ...form,
      //   professionalRegistrationBody,
      //   professionalRegistrationStatus,
      // };
    })();

    // --------------------------------------------------------------------------------
    // 📌  UPDATE FORM DATA
    // --------------------------------------------------------------------------------
    setForm((prev) => ({
      ...prev,
      ...isActiveUser,
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
    const bad_gmcno = formData.bad_gmcno;
    const bad_ntnno = formData.bad_ntnno;
    const bad_otherregulatorybodyreference =
      formData.bad_otherregulatorybodyreference;

    const data = Object.assign(
      {}, // add empty object
      { bad_gmcno },
      { bad_ntnno },
      { bad_otherregulatorybodyreference }
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
          </div>

          <div className="flex-form-row">
            <div className="form-row">
              <label>Professional Registration Status</label>
              <input
                name="formus_professionalregistrationstatus"
                value={formData?.formus_professionalregistrationstatus || ""}
                onChange={handleInputChange}
                className="form-control input"
                placeholder="Professional Registration Status"
                disabled
              />
            </div>
            <div className="form-row">
              <label>Residency Status</label>
              <input
                name="formus_residencystatus"
                value={formData?.formus_residencystatus || ""}
                onChange={handleInputChange}
                className="form-control input"
                placeholder="Residency Status"
                disabled
              />
            </div>
          </div>

          <div className="flex-form-row">
            <div className="form-row">
              <label>Qualification Type</label>
              <input
                name="formus_qualificationtype"
                value={formData?.formus_qualificationtype || ""}
                onChange={handleInputChange}
                className="form-control input"
                placeholder="Qualification Type"
                disabled
              />
            </div>
            <div className="form-row">
              <label>Other Specialty Qualification</label>
              <input
                name="formus_otherqualificationtype"
                value={formData?.formus_otherqualificationtype || ""}
                onChange={handleInputChange}
                className="form-control input"
                placeholder="Other Specialty Qualification"
                disabled
              />
            </div>
          </div>

          {/* <div className="flex-form-row">
            <div className="form-row">
              <label>Other main qualification type</label>
              <input
                name="formus_othermainspecialtyqualification"
                value={formData?.formus_othermainspecialtyqualification || ""}
                onChange={handleInputChange}
                className="form-control input"
                placeholder="Other main qualification type"
                disabled
              />
            </div>
            <div className="form-row">
              <label>Other Reason for moving CCST date</label>
              <input
                name="formus_otherreasonformovingccstdate"
                value={formData?.formus_otherreasonformovingccstdate || ""}
                onChange={handleInputChange}
                className="form-control input"
                placeholder="Other Reason for moving CCST date"
                disabled
              />
            </div>
          </div> */}

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

          <div className="flex-form-row">
            <div className="form-row">
              <label>Specialized Dermatology Areas of practice</label>
              <input
                name="formus_specialiseddermatologyareasofpractice"
                value={
                  formData?.formus_specialiseddermatologyareasofpractice || ""
                }
                onChange={handleInputChange}
                className="form-control input"
                placeholder="Specialized Dermatology Areas of practice"
                disabled
              />
            </div>
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
          </div>

          <div className="flex-form-row">
            <div className="form-row">
              <label>Fixed term/temporary reason for employment contract</label>
              <input
                name="formus_fixedtermtemporaryreasonforemploymentcont"
                value={
                  formData?.formus_fixedtermtemporaryreasonforemploymentcont ||
                  ""
                }
                onChange={handleInputChange}
                className="form-control input"
                placeholder="Fixed term/temporary reason for employment contract"
                disabled
              />
            </div>
            <div className="form-row">
              <label>Rota Pattern</label>
              <input
                name="formus_rotapattern"
                value={formData?.formus_rotapattern || ""}
                onChange={handleInputChange}
                className="form-control input"
                placeholder="Rota Pattern"
                disabled
              />
            </div>
          </div>
        </div>

        <ServeActions />
      </div>
    </div>
  );
};

export default connect(UpdateHospitalDetails);
