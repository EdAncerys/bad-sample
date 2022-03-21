import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../../../config/imports";
import SearchDropDown from "../../../components/searchDropDown";
import CloseIcon from "@mui/icons-material/Close";
import FormError from "../../../components/formError";
import { Form } from "react-bootstrap";
import ActionPlaceholder from "../../../components/actionPlaceholder";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setUserStoreAction,
  sendFileToS3Action,
  getHospitalsAction,
  setGoToAction,
  errorHandler,
  validateMembershipFormAction,
  setCompleteUserApplicationAction,
  useIsMounted,
  getHospitalNameAction,
} from "../../../context";

const ProfessionalDetails = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const isMounted = useIsMounted();
  const dispatch = useAppDispatch();
  const { applicationData, isActiveUser, dynamicsApps } = useAppState();

  const [category, setCategory] = useState(() => {
    if (!applicationData) return "";

    let applicationCategory = "";
    applicationData.map((data) => {
      if (data.bad_organisedfor) applicationCategory = data.bad_organisedfor; // validate application category type
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
    sky_cvurl: "",
    py3_currentgrade: "",
    sky_newhospitalname: "",
    bad_newhospitaladded: "",
    bad_expectedyearofqualification: "",
    py3_constitutionagreement: "",
    bad_readpolicydocument: "",
    sky_newhospitaltype: "",
    bad_memberdirectory: "",
  });
  const [inputValidator, setInputValidator] = useState({
    py3_gmcnumber: true,
    py3_otherregulatorybodyreference: true,
    py3_ntnno: true,
    bad_currentpost: true,
    py3_hospitalid: true,
    bad_proposer1: true,
    bad_proposer2: true,
    bad_mrpcqualified: true,
    sky_cvurl: true,
    py3_currentgrade: true,
    sky_newhospitalname: true,
    bad_newhospitaladded: true,
    bad_expectedyearofqualification: true,
    py3_constitutionagreement: true,
    bad_readpolicydocument: true,
    sky_newhospitaltype: true,
    bad_memberdirectory: true,
  });

  const [hospitalData, setHospitalData] = useState(null);
  const [canChangeHospital, setCanChangeHospital] = useState(true); // allow user to change hospital is no BAD applications are found
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [applicationType, setType] = useState("");
  const [isFetching, setFetching] = useState(false);

  const documentRef = useRef(null);
  const hospitalSearchRef = useRef("");
  const useEffectRef = useRef(false);
  const isHospitalValue = formData.py3_hospitalid;

  useEffect(async () => {
    const handleSetFormData = ({ data, name }) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [`${name}`]: data.value || "",
      }));
    };

    // ⏬ populate form data values from applicationData
    if (!applicationData) return null;

    if (dynamicsApps) {
      const subsData = dynamicsApps.subs.data; // get subs/approved apps data form dynamic apps
      // check if user have application under BAD as approved status
      const isApprovedBAD =
        subsData.filter((item) => item.bad_organisedfor === "BAD").length > 0;
      // if user have application pending under reviewed status redirect to application list
      if (isApprovedBAD) {
        console.log("🤖 user have BAD application approved");
        setCanChangeHospital(false);
      }
    }

    // hospital id initial value
    let hospitalId = null;

    applicationData.map((data) => {
      if (data.name === "py3_gmcnumber")
        handleSetFormData({ data, name: "py3_gmcnumber" });
      if (data.name === "py3_otherregulatorybodyreference")
        handleSetFormData({ data, name: "py3_otherregulatorybodyreference" });
      if (data.name === "py3_ntnno")
        handleSetFormData({ data, name: "py3_ntnno" });
      if (data.name === "bad_currentpost")
        handleSetFormData({ data, name: "bad_currentpost" });
      if (data.name === "bad_proposer1")
        handleSetFormData({ data, name: "bad_proposer1" });
      if (data.name === "bad_proposer2")
        handleSetFormData({ data, name: "bad_proposer2" });
      if (data.name === "bad_mrpcqualified")
        handleSetFormData({ data, name: "bad_mrpcqualified" });
      if (data.name === "sky_newhospitalname")
        handleSetFormData({ data, name: "sky_newhospitalname" });
      if (data.name === "bad_expectedyearofqualification")
        handleSetFormData({ data, name: "bad_expectedyearofqualification" });
      if (data.name === "py3_hospitalid") {
        // get hospital id from application data
        if (data.value) hospitalId = data.value;
        handleSetFormData({ data, name: "py3_hospitalid" });
      }
      // get hospital name from API

      if (data.bad_categorytype) setType(data.bad_categorytype); // validate BAD application category type
      if (data._bad_sigid_value) setType(data._bad_sigid_value); // validate SIG application category type
    });

    if (hospitalId) {
      try {
        // get hospital data via API & populate form
        const hospitalData = await getHospitalNameAction({
          state,
          id: hospitalId,
        });
        if (hospitalData) {
          setSelectedHospital(hospitalData.name);
        }
      } catch (error) {
        console.log("🤖 error", error);
      }
    }

    // ⏬ validate inputs
    await validateMembershipFormAction({
      state,
      actions,
      setData: setInputValidator,
      applicationData,
    });

    if (isMounted.current) useEffectRef.current = !useEffectRef.current;
  }, []);

  // HANDLERS --------------------------------------------
  const handleSelectHospital = ({ item }) => {
    setSelectedHospital(item.title);
    setHospitalData(null); // clear hospital data for dropdown
    console.log("selected hospital", item); // debug

    // guard if user have BAD apps approved dont allow hospital lookup
    if (!canChangeHospital) return;
    setFormData((prevFormData) => ({
      ...prevFormData,
      py3_hospitalid: item.link,
    }));
  };

  const handleClearHospital = () => {
    setSelectedHospital(null);
    setFormData((prevFormData) => ({
      ...prevFormData,
      py3_hospitalid: "",
    }));
  };

  const handleHospitalLookup = async () => {
    const input = hospitalSearchRef.current.value;
    // if (input.length < 2) return; // API call after 2 characters

    let hospitalData = await getHospitalsAction({
      state,
      input,
    });
    // refactor hospital data to match dropdown format
    hospitalData = hospitalData.map((hospital) => {
      return {
        title: hospital.name,
        link: hospital.accountid,
      };
    });

    if (hospitalData.length > 0) setHospitalData(hospitalData);
    if (!hospitalData.length || !input) setHospitalData(null);

    // console.log("Hospitals", hospitalData); // debug
  };

  const handleSaveExit = async () => {
    await setUserStoreAction({
      state,
      actions,
      dispatch,
      applicationData,
      isActiveUser,
      data: formData,
    });

    if (isActiveUser) setGoToAction({ path: `/membership/`, actions });
  };

  const isFormValidated = ({ required }) => {
    if (!required && !required.length) return null;
    let isValid = true;

    required.map((input) => {
      if (!formData[input] && inputValidator[input]) {
        errorHandler({ id: `form-error-${input}` });
        isValid = false;
      }
    });

    return isValid;
  };

  const handleNext = async () => {
    // check if new hospital value been added
    const isNewHospital = formData.bad_newhospitaladded;
    // check if isAssociateType to apply mandatory fields
    const isAssociateType = applicationType.includes("Associate");

    const isValid = isFormValidated({
      required: [
        "py3_gmcnumber",
        "py3_otherregulatorybodyreference",
        "py3_ntnno",
        "bad_currentpost",
        isNewHospital ? "sky_newhospitaltype" : null,
        !isNewHospital ? "py3_hospitalid" : null,
        isAssociateType ? "bad_proposer1" : null,
        isAssociateType ? "bad_proposer2" : null,
        "py3_constitutionagreement",
        "bad_readpolicydocument",
      ],
    });

    if (!isValid) return null;
    // console.log(formData); // debug

    try {
      setFetching(true);
      const store = await setUserStoreAction({
        state,
        actions,
        dispatch,
        applicationData,
        isActiveUser,
        dynamicsApps,
        membershipApplication: { stepFour: true }, // set stepOne to complete
        data: formData,
      });
      if (!store.success) throw new Error("Failed to update application");

      // set complete application if app = BAD
      const appsResponse = await setCompleteUserApplicationAction({
        state,
        dispatch,
        isActiveUser,
        applicationData,
      });
      if (!appsResponse) throw new Error("Failed to create application"); // throw error if store is not successful

      let slug = `/membership/thank-you/`;
      if (category === "SIG") slug = `/membership/sig-questions/`;
      if (isActiveUser) setGoToAction({ path: slug, actions });
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

  const handleDocUploadChange = async (e) => {
    let sky_cvurl = e.target.files[0];
    console.log("e", e); // debug

    if (sky_cvurl)
      sky_cvurl = await sendFileToS3Action({
        state,
        dispatch,
        attachments: sky_cvurl,
      });
    console.log("sky_cvurl", sky_cvurl); // debug

    setFormData((prevFormData) => ({
      ...prevFormData,
      ["sky_cvurl"]: sky_cvurl,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));

    // if checked value for hospital not found clear curet hospital input
    if (name === "bad_newhospitaladded" && !value) handleClearHospital();
  };

  const isFormFooter =
    inputValidator.bad_mrpcqualified ||
    inputValidator.py3_currentgrade ||
    inputValidator.py3_constitutionagreement ||
    inputValidator.bad_readpolicydocument ||
    inputValidator.sky_cvurl;

  const isAgreementForm =
    inputValidator.py3_constitutionagreement ||
    inputValidator.bad_readpolicydocument ||
    inputValidator.bad_memberdirectory;

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    let label = "Next";
    if (category === "BAD") label = "Submit Application";

    return (
      <div
        className="flex"
        style={{ justifyContent: "flex-end", padding: `2em 1em 0 1em` }}
      >
        <div
          className="transparent-btn"
          onClick={() =>
            setGoToAction({
              path: `/membership/step-3-personal-information/`,
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
          {label}
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <ActionPlaceholder isFetching={isFetching} background="transparent" />
      <div
        className="primary-title"
        style={{
          fontSize: 20,
          paddingTop: `1em`,
          marginTop: `1em`,
          borderTop: `1px solid ${colors.silverFillTwo}`,
        }}
      >
        Category Selected: <span>{applicationType}</span>
      </div>
      <form>
        <div style={{ padding: `2em 1em` }}>
          {inputValidator.py3_gmcnumber && (
            <div>
              <label className="required form-label">
                {applicationType === "Associate Overseas"
                  ? "GMC number or International equivalent"
                  : "GMC number"}
              </label>
              <input
                name="py3_gmcnumber"
                value={formData.py3_gmcnumber}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="GMC Number"
              />
              <FormError id="py3_gmcnumber" />
            </div>
          )}

          {inputValidator.py3_otherregulatorybodyreference && (
            <div>
              <label className="required form-label">
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
              <FormError id="py3_otherregulatorybodyreference" />
            </div>
          )}

          {inputValidator.py3_ntnno && (
            <div>
              <label className="required form-label">NTN Number</label>
              <input
                name="py3_ntnno"
                value={formData.py3_ntnno}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="NTN Number"
              />
              <FormError id="py3_ntnno" />
            </div>
          )}

          {inputValidator.bad_currentpost && (
            <div>
              <label className="required form-label">
                Current post/job title
              </label>
              <input
                name="bad_currentpost"
                value={formData.bad_currentpost}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="Current job title"
              />
              <FormError id="bad_currentpost" />
            </div>
          )}

          {inputValidator.py3_hospitalid && (
            <div>
              <label className="form-label">
                Main Place of Work / Medical School
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
                        {selectedHospital}

                        {canChangeHospital && (
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
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {!selectedHospital && (
                  <div>
                    <input
                      ref={hospitalSearchRef}
                      onChange={handleHospitalLookup}
                      type="text"
                      className="form-control input"
                      placeholder="Main Hospital/Place of work"
                    />
                    <FormError id="py3_hospitalid" />
                  </div>
                )}
                <SearchDropDown
                  filter={hospitalData}
                  onClickHandler={handleSelectHospital}
                />
              </div>
            </div>
          )}

          {!isHospitalValue && (
            <div className="flex-col">
              <label className="form-label">
                Hospital / Medical School not listed
              </label>
              <input
                name="bad_newhospitaladded"
                checked={formData.bad_newhospitaladded}
                onChange={handleInputChange}
                type="checkbox"
                className="form-check-input check-box"
              />
            </div>
          )}

          {formData.bad_newhospitaladded && (
            <div>
              <label className="required form-label">Select Type</label>
              <Form.Select
                name="sky_newhospitaltype"
                value={formData.sky_newhospitaltype}
                onChange={handleInputChange}
                className="input"
              >
                <option value="" hidden>
                  Hospital / Medical School
                </option>
                <option value="Hospital">Hospital</option>
                <option value="Medical School">Medical School</option>
              </Form.Select>
              <FormError id="sky_newhospitaltype" />
            </div>
          )}

          {formData.bad_newhospitaladded && inputValidator.sky_newhospitalname && (
            <div>
              <label className="form-label">New Hospital Name</label>
              <input
                name="sky_newhospitalname"
                value={formData.sky_newhospitalname}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="New Hospital Name"
              />
              <FormError id="sky_newhospitalname" />
            </div>
          )}

          {inputValidator.bad_expectedyearofqualification && (
            <div>
              <label className="form-label">
                Expected Year of Qualification
              </label>
              <input
                name="bad_expectedyearofqualification"
                value={formData.bad_expectedyearofqualification}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="Expected Year of Qualification"
              />
              <FormError id="bad_currentpost" />
            </div>
          )}
        </div>

        {inputValidator.bad_proposer1 && (
          <div
            style={{
              padding: `1em 1em 2em 1em`,
              borderTop: `1px solid ${colors.silverFillTwo}`,
              borderBottom: `1px solid ${colors.silverFillTwo}`,
            }}
          >
            <label className="form-label">
              Proposers must be BSDS Ordinary members
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(2, 1fr)`,
                gap: 20,
              }}
            >
              {inputValidator.bad_proposer1 && (
                <div>
                  <label
                    className={`${
                      applicationType.includes("Associate")
                        ? "required form-label"
                        : "form-label"
                    }`}
                  >
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
                  <FormError id="bad_proposer1" />
                </div>
              )}

              {inputValidator.bad_proposer2 && (
                <div>
                  <label
                    className={`${
                      applicationType.includes("Associate")
                        ? "required form-label"
                        : "form-label"
                    }`}
                  >
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
                  <FormError id="bad_proposer2" />
                </div>
              )}
            </div>
          </div>
        )}

        {isFormFooter && (
          <div
            style={{
              padding: `2em 1em`,
              borderTop: `1px solid ${colors.silverFillTwo}`,
              borderBottom: `1px solid ${colors.silverFillTwo}`,
            }}
          >
            {inputValidator.bad_mrpcqualified && (
              <div className="flex-col">
                <label className="form-label">MRCP Qualified</label>
                <input
                  name="bad_mrpcqualified"
                  checked={formData.bad_mrpcqualified}
                  onChange={handleInputChange}
                  type="checkbox"
                  className="form-check-input check-box"
                />
              </div>
            )}

            {inputValidator.py3_currentgrade && (
              <div>
                <label className="form-label">Current Grade</label>
                <input
                  name="py3_currentgrade"
                  value={formData.py3_currentgrade}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control input"
                  placeholder="Current Grade"
                />
              </div>
            )}

            {inputValidator.sky_cvurl && (
              <div>
                <label className="form-label">Upload Your CV</label>
                <input
                  ref={documentRef}
                  onChange={handleDocUploadChange}
                  type="file"
                  className="form-control input"
                  placeholder="CV Document"
                  accept=".pdf,.doc,.docx"
                />
              </div>
            )}

            {isAgreementForm && (
              <div
                style={{
                  alignItems: "center",
                  marginTop: `2em`,
                  paddingTop: "1em",
                  borderTop: `1px solid ${colors.silverFillTwo}`,
                }}
              >
                {inputValidator.bad_memberdirectory && (
                  <div>
                    <div
                      className="flex"
                      style={{ alignItems: "center", margin: `1em 0` }}
                    >
                      <div style={{ display: "grid" }}>
                        <input
                          name="bad_memberdirectory"
                          checked={formData.bad_memberdirectory}
                          onChange={handleInputChange}
                          type="checkbox"
                          className="form-check-input check-box"
                        />
                      </div>
                      <div
                        className="tulip-pop"
                        citations="A member only service to search for the contact email of fellow BAD members"
                        style={{ color: "inherit" }}
                      >
                        Include in Members directory
                      </div>
                    </div>
                    <FormError id="bad_memberdirectory" />
                  </div>
                )}

                {inputValidator.py3_constitutionagreement && (
                  <div>
                    <div
                      className="flex"
                      style={{ alignItems: "center", margin: `1em 0` }}
                    >
                      <div style={{ display: "grid" }}>
                        <input
                          name="py3_constitutionagreement"
                          checked={formData.py3_constitutionagreement}
                          onChange={handleInputChange}
                          type="checkbox"
                          className="form-check-input check-box"
                        />
                      </div>
                      <div>
                        <label className="form-check-label flex-row">
                          <div>I agree to the </div>
                          <div
                            className="caps-btn required"
                            style={{ paddingTop: 6, marginLeft: 10 }}
                          >
                            BAD Constitution
                          </div>
                        </label>
                      </div>
                    </div>
                    <FormError id="py3_constitutionagreement" />
                  </div>
                )}
                {inputValidator.bad_readpolicydocument && (
                  <div>
                    <div
                      className="flex"
                      style={{ alignItems: "center", margin: `1em 0` }}
                    >
                      <div>
                        <input
                          name="bad_readpolicydocument"
                          checked={formData.bad_readpolicydocument}
                          onChange={handleInputChange}
                          type="checkbox"
                          className="form-check-input check-box"
                        />
                      </div>
                      <div>
                        <label className="form-check-label flex-row">
                          <div>
                            <div
                              className="caps-btn required"
                              style={{
                                paddingTop: 6,
                                marginRight: 10,
                                whiteSpace: "nowrap",
                                float: "left",
                              }}
                              onClick={() =>
                                setGoToAction({
                                  path: `/privacy-policy/`,
                                  actions,
                                })
                              }
                            >
                              I agree - Privacy Notice
                            </div>
                            <span>
                              I agree - Privacy Notice* - justo donec enim diam
                              vulputate ut pharetra sit. Purus semper eget duis
                              at tellus at. Sed adipiscing diam.
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                    <FormError id="bad_readpolicydocument" />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </form>
      <ServeActions />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(ProfessionalDetails);
