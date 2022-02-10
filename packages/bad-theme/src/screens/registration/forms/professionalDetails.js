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
} from "../../../context";

const ProfessionalDetails = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { applicationData, isActiveUser } = useAppState();

  const [formData, setFormData] = useState({
    py3_gmcnumber: "",
    registrationNumber: "",
    py3_ntnno: "",
    bad_currentpost: "",
    py3_hospitalid: "",
    bad_medicalschool: "",
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
    });
    if (isActiveUser) setGoToAction({ path: `/membership/`, actions });
  };

  const handleNext = async () => {
    console.log(formData);

    // await setUserStoreAction({
    //   state,
    //   dispatch,
    //   applicationData,
    //   isActiveUser,
    //   data: formData,
    // });

    // let slug = `/membership/final-step-thank-you/`;
    // if (type === "810170001") slug = `/membership/step-5-sig-questions/`;
    // if (isActiveUser) setGoToAction({ path: slug, actions });
  };

  const handleDocUploadChange = async () => {
    let document = cvRef.current ? cvRef.current.files[0] : null;
    if (document)
      document = await sendFileToS3Action({
        state,
        dispatch,
        attachments: document,
      });
    console.log("document", document); // debug

    // setFormData((prevFormData) => ({
    //   ...prevFormData,
    //   cvDocument: document,
    // }));
  };

  const handleInputChange = (e) => {
    console.log(formData);

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
            name="registrationNumber"
            value={formData.registrationNumber}
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
            Main Hospital/Place of work
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

          <label className="required form-label">Medical School</label>
          <input
            name="bad_medicalschool"
            value={formData.bad_medicalschool}
            onChange={handleInputChange}
            type="text"
            className="form-control input"
            placeholder="Medical School"
          />
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

          <label className="required form-label">Upload Your CV</label>
          <input
            ref={cvRef}
            onChange={handleDocUploadChange}
            type="file"
            className="form-control input"
            placeholder="CV Document"
            accept="*"
          />

          <label className="form-label">Current Grade</label>
          <input
            name="currentGrade"
            value={formData.currentGrade}
            onChange={handleInputChange}
            type="text"
            className="form-control input"
            placeholder="Curent Grade"
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
