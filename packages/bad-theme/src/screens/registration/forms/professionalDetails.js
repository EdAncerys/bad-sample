import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../../../config/imports";
import SearchDropDown from "../../../components/searchDropDown";
import CloseIcon from "@mui/icons-material/Close";
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
      if (data.bad_categorytype) applicationCategory = data.bad_categorytype;
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
    document: "",
    currentGrade: "",
    bad_medicalschool: "",
  });
  const [hospitalData, setHospitalData] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const documentRef = useRef(null);
  const hospitalSearchRef = useRef("");

  // ⏬ populate form data values from applicationData
  useEffect(() => {
    const handleSetData = ({ data, name }) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [`${name}`]: data.value || "",
      }));
    };

    if (!applicationData) return null;
    applicationData.map((data) => {
      if (data.name === "py3_gmcnumber")
        handleSetData({ data, name: "py3_gmcnumber" });
      if (data.name === "py3_otherregulatorybodyreference")
        handleSetData({ data, name: "py3_otherregulatorybodyreference" });
      if (data.name === "py3_ntnno") handleSetData({ data, name: "py3_ntnno" });
      if (data.name === "bad_currentpost")
        handleSetData({ data, name: "bad_currentpost" });
      if (data.name === "bad_proposer1")
        handleSetData({ data, name: "bad_proposer1" });
      if (data.name === "bad_proposer2")
        handleSetData({ data, name: "bad_proposer2" });
      if (data.name === "bad_mrpcqualified")
        handleSetData({ data, name: "bad_mrpcqualified" });
      if (data.name === "bad_medicalschool")
        handleSetData({ data, name: "bad_medicalschool" });
    });
  }, []);

  // HANDLERS --------------------------------------------
  const handleSelectHospital = ({ item }) => {
    setSelectedHospital(item);
    setFormData((prevFormData) => ({
      ...prevFormData,
      py3_hospitalid: item.accountid,
    }));
    setHospitalData(null);
    console.log(item);
  };
  const handleClearHospital = () => {
    setSelectedHospital(null);
    setFormData((prevFormData) => ({
      ...prevFormData,
      py3_hospitalid: "",
    }));
  };

  const handleHospitalLookup = async () => {
    if (hospitalSearchRef.current.value.length < 2) return; // API call after 2 characters

    const hospitalData = await getHospitalsAction({
      state,
      input: hospitalSearchRef.current.value,
    });

    console.log("Hospitals", hospitalData);
    setHospitalData(hospitalData);
  };

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
    console.log(formData); // debug

    // await setUserStoreAction({
    //   state,
    //   dispatch,
    //   applicationData,
    //   isActiveUser,
    //   data: formData,
    // });

    // let slug = `/membership/final-step-thank-you/`;
    // if (category === "810170001") slug = `/membership/step-5-sig-questions/`;
    // if (isActiveUser) setGoToAction({ path: slug, actions });
  };

  const handleDocUploadChange = async () => {
    let document = documentRef.current ? documentRef.current.files[0] : null;

    if (document)
      document = await sendFileToS3Action({
        state,
        dispatch,
        attachments: document,
      });

    setFormData((prevFormData) => ({
      ...prevFormData,
      ["document"]: document,
    }));
    console.log("document", document); // debug
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
            Main Hospital/Place of work
          </label>
          <div style={{ position: "relative" }}>
            {selectedHospital && (
              <div className="form-control input">
                <div className="flex-row">
                  <div
                    style={{
                      position: "relative",
                      width: "fit-content",
                      paddingRight: 15,
                    }}
                  >
                    {selectedHospital.name}
                    <div
                      className="filter-icon"
                      style={{ top: -7 }}
                      onClick={handleClearHospital}
                    >
                      <CloseIcon
                        style={{
                          fill: colors.darkSilver,
                          padding: 0,
                          width: "0.7em",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!selectedHospital && (
              <input
                ref={hospitalSearchRef}
                onChange={handleHospitalLookup}
                type="text"
                className="form-control input"
                placeholder="Main Hospital/Place of work"
              />
            )}
            {hospitalData && (
              <SearchDropDown
                filter={hospitalData}
                mapToName="name"
                onClickHandler={handleSelectHospital}
              />
            )}
          </div>

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
            ref={documentRef}
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
