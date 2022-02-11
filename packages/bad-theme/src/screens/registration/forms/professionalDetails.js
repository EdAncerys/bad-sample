import { useState, useRef } from "react";
import { connect } from "frontity";

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

const ProfessionalDetails = ({ state, actions, libraries }) => {
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
    py3_gmcnumber: "",
    py3_otherregulatorybodyreference: "",
    py3_ntnno: "",
    bad_currentpost: "",
    py3_hospitalid: "",
    bad_proposer1: "",
    bad_proposer2: "",
    bad_mrpcqualified: "",
    cvDocument: "",
    currentGrade: "",
  });

  const cvRef = useRef(null);

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

    let slug = `/membership/final-step-thank-you/`;
    if (category === "810170001") slug = `/membership/step-5-sig-questions/`;
    if (isActiveUser) setGoToAction({ path: slug, actions });
  };

  const handleDocUploadChange = async () => {
    let document = cvRef.current.files[0];
    let documentUrl = "";
    // if (document)
    //   documentUrl = await sendFileToS3Action({
    //     state,
    //     dispatch,
    //     attachments: document,
    //   });
    console.log("documentUrl", documentUrl); // debug
    console.log(formData); // debug

    // setFormData((prevFormData) => ({
    //   ...prevFormData,
    //   cvDocument: document,
    // }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
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
              path: `/membership/step-3-category-selection/`,
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
          <label className="required form-label">GMC Number</label>
          <input
            name="py3_gmcnumber"
            value={formData.py3_gmcnumber}
            onChange={handleInputChange}
            type="text"
            className="form-control input"
            placeholder="GMC Number"
          />

          <label className="form-label">
            Regulatory Body Registration Number
          </label>
          <input
            name="py3_otherregulatorybodyreference"
            value={formData.py3_otherregulatorybodyreference}
            onChange={handleInputChange}
            type="text"
            className="form-control input"
            placeholder="Regulatory Body Registration Number"
          />

          <label className="form-label">NTN Number</label>
          <input
            name="py3_ntnno"
            value={formData.py3_ntnno}
            onChange={handleInputChange}
            type="text"
            className="form-control input"
            placeholder="NTN Number"
          />

          <label className="required form-label">Current post/job title</label>
          <input
            name="bad_currentpost"
            value={formData.bad_currentpost}
            onChange={handleInputChange}
            type="text"
            className="form-control input"
            placeholder="Current job title"
          />

          <label className="required form-label">
            Main Hospital/Medical School/Place of work
          </label>
          <input
            name="py3_hospitalid"
            value={formData.py3_hospitalid}
            onChange={handleInputChange}
            // onChange={handleHospitalLookup}
            type="text"
            className="form-control input"
            placeholder="Main Hospital/Place of work"
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(2, 1fr)`,
            gap: 20,
            padding: `2em 1em`,
            borderTop: `1px solid ${colors.silverFillTwo}`,
            borderBottom: `1px solid ${colors.silverFillTwo}`,
          }}
        >
          <div>
            <label className="required form-label required">
              Supporting Member 1
            </label>
            <input
              name="bad_proposer1"
              value={formData.bad_proposer1}
              onChange={handleInputChange}
              type="text"
              className="form-control input"
              placeholder="MRCP"
            />
          </div>

          <div>
            <label className="required form-label required">
              Supporting Member 2
            </label>
            <input
              name="bad_proposer2"
              value={formData.bad_proposer2}
              onChange={handleInputChange}
              type="text"
              className="form-control input"
              placeholder="MRCP"
            />
          </div>
        </div>

        <div
          style={{
            padding: `2em 1em`,
            borderTop: `1px solid ${colors.silverFillTwo}`,
            borderBottom: `1px solid ${colors.silverFillTwo}`,
          }}
        >
          <label className="required form-label">MRCP</label>
          <input
            name="bad_mrpcqualified"
            value={formData.bad_mrpcqualified}
            onChange={handleInputChange}
            type="text"
            className="form-control input"
            placeholder="MRCP"
          />

          <label className="required form-label">
            Current Grade <span style={{ color: "red" }}>DERMPATHPRO ONLY</span>
          </label>
          <input
            name="currentGrade"
            value={formData.currentGrade}
            onChange={handleInputChange}
            type="text"
            className="form-control input"
            placeholder="Current Grade"
          />

          <label className="required form-label">Upload Your CV</label>
          <input
            ref={cvRef}
            onChange={handleDocUploadChange}
            type="file"
            className="form-control input"
            placeholder="CV Document"
            accept="*"
          />
        </div>
      </form>
      <ServeActions />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(ProfessionalDetails);
