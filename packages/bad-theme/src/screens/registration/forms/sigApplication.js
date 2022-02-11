import { useState, useEffect } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";

import { colors } from "../../../config/imports";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setUserStoreAction,
  sendFileToS3Action,
  getHospitalsAction,
  setGoToAction,
} from "../../../context";

const SIGApplication = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { applicationData, isActiveUser } = useAppState();

  const [category, setCategory] = useState(() => {
    if (!applicationData) return "";
    let applicationCategory = "";
    applicationData.map((data) => {
      if (data.name === "bad_organisedfor") applicationCategory = data.value;
    });

    return applicationCategory;
  });

  const [formData, setFormData] = useState({
    bad_qualifications: "",
    bad_hasmedicallicence: true,
    bad_isbadmember: "",
    bad_interestinfieldquestion: "",
    py3_whatukbasedroleareyou: "",
    py3_speciality: "",
    bad_otherjointclinics: "",
    bad_mainareaofinterest: "",
    bad_includeinthebssciiemaildiscussionforum: "",
    py3_insertnhsnetemailaddress: "",
  });
  const [isEmail, setIsEmail] = useState(false);

  // ⏬ populate form data values from applicationData
  useEffect(() => {
    const handleSetData = ({ data, name }) => {
      if (name === "bad_isbadmember") console.log(data.value);
      setFormData((prevFormData) => ({
        ...prevFormData,
        [`${name}`]: data.value || "",
      }));
    };

    if (!applicationData) return null;
    applicationData.map((data) => {
      if (data.name === "bad_qualifications")
        handleSetData({ data, name: "bad_qualifications" });
      if (data.name === "bad_hasmedicallicence")
        handleSetData({ data, name: "bad_hasmedicallicence" });
      if (data.name === "bad_isbadmember")
        handleSetData({ data, name: "bad_isbadmember" });
      if (data.name === "bad_interestinfieldquestion")
        handleSetData({ data, name: "bad_interestinfieldquestion" });
      if (data.name === "py3_whatukbasedroleareyou")
        handleSetData({ data, name: "py3_whatukbasedroleareyou" });
      if (data.name === "py3_speciality")
        handleSetData({ data, name: "py3_speciality" });
      if (data.name === "bad_otherjointclinics")
        handleSetData({ data, name: "bad_otherjointclinics" });
      if (data.name === "bad_mainareaofinterest")
        handleSetData({ data, name: "bad_mainareaofinterest" });
      if (data.name === "bad_includeinthebssciiemaildiscussionforum")
        handleSetData({
          data,
          name: "bad_includeinthebssciiemaildiscussionforum",
        });
      if (data.name === "py3_insertnhsnetemailaddress")
        handleSetData({ data, name: "py3_insertnhsnetemailaddress" });
    });
  }, []);

  // HANDLERS --------------------------------------------
  const handleSaveExit = async () => {
    await setUserStoreAction({
      state,
      dispatch,
      applicationData,
      isActiveUser,
      data: formData,
    });

    if (isActiveUser) setGoToAction({ path: `/membership/`, actions });
  };

  const handleNext = async () => {
    await setUserStoreAction({
      state,
      dispatch,
      applicationData,
      isActiveUser,
      data: formData,
    });

    // let slug = `/membership/final-step-thank-you/`;
    // if (isActiveUser) setGoToAction({ path: slug, actions });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "bad_includeinthebssciiemaildiscussionforum" && checked) {
      setIsEmail(true);
    }
    if (name === "bad_includeinthebssciiemaildiscussionforum" && !checked) {
      setIsEmail(false);
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    return (
      <div
        className="flex"
        style={{ justifyContent: "flex-end", padding: `2em 1em 0 1em` }}
      >
        <div
          className="transparent-btn"
          onClick={() =>
            setGoToAction({
              path: `/membership/step-4-professional-details/`,
              actions,
            })
          }
        >
          Back
        </div>
        <div
          className="transparent-btn"
          style={{ margin: `0 1em` }}
          onClick={handleSaveExit}
        >
          Save & Exit
        </div>
        <div className="blue-btn" onClick={handleNext}>
          Next
        </div>
      </div>
    );
  };

  return (
    <div>
      <form>
        <div style={{ padding: `2em 1em` }}>
          <label className="required form-label">Qualification</label>
          <input
            name="bad_qualifications"
            value={formData.bad_qualifications}
            onChange={handleInputChange}
            type="text"
            className="form-control input"
            placeholder="Qualification"
          />

          <div className="flex-col">
            <label className="form-label">
              License to practice medicine (Y/N)
            </label>
            <input
              name="bad_hasmedicallicence"
              checked={formData.bad_hasmedicallicence}
              onChange={handleInputChange}
              type="checkbox"
              className="form-check-input"
              style={styles.checkBox}
            />
          </div>

          <div className="flex-col">
            <label className="form-label">Are you BAD member (Y/N)</label>
            <input
              name="bad_isbadmember"
              checked={formData.bad_isbadmember}
              onChange={handleInputChange}
              type="checkbox"
              className="form-check-input"
              style={styles.checkBox}
            />
          </div>

          <label className="form-label">
            Describe your interest in (SIG name)
          </label>
          <textarea
            name="bad_interestinfieldquestion"
            value={formData.bad_interestinfieldquestion}
            onChange={handleInputChange}
            type="text"
            className="form-control input"
            placeholder={`Describe your interest in (SIG name)`}
          ></textarea>

          <label style={styles.subTitle}>I identify myself as</label>
          <Form.Select
            name="py3_whatukbasedroleareyou"
            value={formData.py3_whatukbasedroleareyou}
            onChange={handleInputChange}
            className="input"
          >
            <option value="" hidden>
              Are you
            </option>
            <option value="UK based Trainee">UK based Trainee</option>
            <option value="UK based SAS Doctor">UK based SAS Doctor</option>
            <option value="UK based Consultant">UK based Consultant</option>
            <option value="Working outside the UK">
              Working outside the UK
            </option>
          </Form.Select>

          <label style={styles.subTitle}>Specialist Interest</label>
          <Form.Select
            name="py3_speciality"
            value={formData.py3_speciality}
            onChange={handleInputChange}
            className="input"
          >
            <option value="" hidden>
              Specialist Interest
            </option>
            <option value="Hair">Hair</option>
            <option value="Nails">Nails</option>
            <option value="UK based Consultant">UK based Consultant</option>
            <option value="Both">Both</option>
          </Form.Select>

          <label className="form-label">
            Do you do joint clinics with any other specialties?
          </label>
          <input
            name="bad_otherjointclinics"
            value={formData.bad_otherjointclinics}
            onChange={handleInputChange}
            type="text"
            className="form-control input"
            placeholder="Do you do joint clinics with any other specialties?"
          />

          <label style={styles.subTitle}>Main area of interest</label>
          <Form.Select
            name="bad_mainareaofinterest"
            value={formData.bad_mainareaofinterest}
            onChange={handleInputChange}
            className="input"
          >
            <option value="" hidden>
              Main area of interest
            </option>
            <option value="HIV">HIV</option>
            <option value="biologics">Biologics</option>
            <option value="Solid Organ Transplatation">
              Solid Organ Transplatation
            </option>
            <option value="Haemtone oncology">Haemtone Oncology</option>
            <option value="Both">Both</option>
            <option value="Other Immunosuppresed Groups">
              Other Immunosuppresed Groups
            </option>
          </Form.Select>

          <div className="flex-col">
            <label className="form-label">
              Do you want to be part of the BSSCII discussion form?
            </label>
            <input
              name="bad_includeinthebssciiemaildiscussionforum"
              checked={formData.bad_includeinthebssciiemaildiscussionforum}
              onChange={handleInputChange}
              type="checkbox"
              className="form-check-input"
              style={styles.checkBox}
            />

            {isEmail && (
              <div>
                <label style={styles.subTitle}>Email Address</label>
                <input
                  name="py3_insertnhsnetemailaddress"
                  value={formData.py3_insertnhsnetemailaddress}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control input"
                  placeholder="Email Address"
                />
              </div>
            )}
          </div>
        </div>
      </form>
      <ServeActions />
    </div>
  );
};

const styles = {
  checkBox: {
    borderRadius: "50%",
    width: 20,
    height: 20,
    margin: `0 10px 0 0`,
  },
};

export default connect(SIGApplication);
