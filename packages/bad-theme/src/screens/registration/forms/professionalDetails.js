import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../../../config/imports";
import SearchDropDown from "../../../components/searchDropDown";
import CloseIcon from "@mui/icons-material/Close";
import FormError from "../../../components/formError";
import { Form } from "react-bootstrap";
import ActionPlaceholder from "../../../components/actionPlaceholder";
// DATA HELPERS -----------------------------------------------------------
import { prefMailingOption } from "../../../config/data";

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
  setErrorAction,
  muiQuery,
} from "../../../context";

const ProfessionalDetails = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const { lg } = muiQuery();
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
    sky_cvurl: "",
    py3_currentgrade: "",
    sky_newhospitalname: "",
    bad_newhospitaladded: "",
    bad_expectedyearofqualification: "",
    py3_constitutionagreement: "",
    bad_readpolicydocument: "",
    sky_newhospitaltype: "",
    bad_memberdirectory: "",
    bad_preferredmailingaddress: "",
  });
  const [inputValidator, setInputValidator] = useState({
    bad_py3_gmcnumber: true,
    bad_py3_otherregulatorybodyreference: true,
    bad_py3_ntnno: true,
    bad_bad_currentpost: true,
    bad_py3_hospitalid: true,
    bad_proposer1: false, // 📌 remove by default
    bad_proposer2: false, // 📌 remove by default
    bad_sky_cvurl: true,
    bad_py3_currentgrade: true,
    bad_sky_newhospitalname: true,
    bad_newhospitaladded: true,
    bad_expectedyearofqualification: true,
    bad_py3_constitutionagreement: true,
    bad_readpolicydocument: true,
    bad_sky_newhospitaltype: true,
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
        // console.log("🤖 user have BAD application approved");
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
      if (data.name === "sky_newhospitalname")
        handleSetFormData({ data, name: "sky_newhospitalname" });
      if (data.name === "bad_expectedyearofqualification")
        handleSetFormData({ data, name: "bad_expectedyearofqualification" });
      if (data.name === "bad_preferredmailingaddress")
        handleSetFormData({ data, name: "bad_preferredmailingaddress" });
      if (data.name === "py3_hospitalid") {
        // get hospital id from application data
        if (data.value) hospitalId = data.value;
        handleSetFormData({ data, name: "py3_hospitalid" });
      }
      // if bad_currentpost is null then set value from user profile data
      if (!data.bad_currentpost) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [`bad_currentpost`]: isActiveUser.jobtitle,
        }));
      }

      if (data.bad_categorytype) setType(data.bad_categorytype); // validate BAD application category type
      if (data._bad_sigid_value) setType(data._bad_sigid_value); // validate SIG application category type
    });

    if (hospitalId) {
      try {
        // get hospital data via API & populate form
        const hospitalData = await getHospitalNameAction({
          state,
          dispatch,
          id: hospitalId,
        });
        if (hospitalData) {
          setSelectedHospital(hospitalData.name);
        }
      } catch (error) {
        // console.log("🤖 error", error);
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
      dispatch,
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

    if (isActiveUser) setGoToAction({ state, path: `/dashboard/`, actions });
  };

  const isFormValidated = ({ required }) => {
    if (!required && !required.length) return null;
    let isValid = true;

    required.map((input) => {
      let inputValue = input;
      // 📌 add bad_ if input dont have it
      if (!inputValue.includes("bad_")) inputValue = `bad_${input}`;

      if (!formData[input] && inputValidator[inputValue]) {
        errorHandler({ id: `form-error-${input}` });
        isValid = false;
      }
    });

    return isValid;
  };

  const handleNext = async () => {
    // check if new hospital value been added
    const isNewHospital = formData.bad_newhospitaladded;
    // 📌 check if isAssociateType to apply mandatory fields
    // const isAssociateType = applicationType.includes("Associate");

    const isValid = isFormValidated({
      required: [
        "py3_gmcnumber",
        "py3_otherregulatorybodyreference",
        "py3_ntnno",
        "bad_currentpost",
        isNewHospital ? "sky_newhospitaltype" : "", // required if new hospital name added
        isNewHospital ? "sky_newhospitalname" : "", // required if new hospital name added
        !isNewHospital ? "py3_hospitalid" : "",
        "bad_proposer1",
        "bad_proposer2",
        "py3_constitutionagreement",
        "bad_readpolicydocument",
        "sky_cvurl",
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
      if (isActiveUser && appsResponse)
        setGoToAction({ state, path: slug, actions });
    } catch (error) {
      // console.log(error);

      setErrorAction({
        dispatch,
        isError: {
          message: `Failed to create ${applicationType} application. Please try again.`,
          image: "Error",
        },
      });
    } finally {
      setFetching(false);
    }
  };

  const policyHandler = ({ isConstitution }) => {
    // open privacy policy in new window
    let url = state.auth.APP_URL + "/privacy-policy/";
    if (isConstitution)
      url = state.auth.APP_URL + "/about-the-bad/bad-constitution/";
    window.open(
      url,
      "_blank"
      // "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400"
    );
  };

  const handleDocUploadChange = async (e) => {
    let sky_cvurl = e.target.files[0];

    try {
      setFetching(true);
      // upload file to storage
      if (sky_cvurl)
        sky_cvurl = await sendFileToS3Action({
          state,
          dispatch,
          attachments: sky_cvurl,
        });

      setFormData((prevFormData) => ({
        ...prevFormData,
        ["sky_cvurl"]: sky_cvurl,
      }));

      // console.log("🐞 ", sky_cvurl); // debug
    } catch (error) {
      // console.log("🤖 error", error);
    } finally {
      setFetching(false);
    }
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
    inputValidator.bad_py3_currentgrade ||
    inputValidator.bad_py3_constitutionagreement ||
    inputValidator.bad_readpolicydocument ||
    inputValidator.bad_sky_cvurl;

  const isAgreementForm =
    inputValidator.bad_py3_constitutionagreement ||
    inputValidator.bad_readpolicydocument ||
    inputValidator.bad_memberdirectory;

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    let label = "Next";
    if (category === "BAD") label = "Submit Application";

    return (
      <div
        className={!lg ? "flex" : "flex-col"}
        style={{ justifyContent: "flex-end", padding: `2em 1em 0 1em` }}
      >
        <div
          className="transparent-btn"
          onClick={() =>
            setGoToAction({
              state,
              path: `/membership/step-3-personal-information/`,
              actions,
            })
          }
        >
          Back
        </div>
        <div
          className="transparent-btn"
          style={{ margin: !lg ? `0 1em` : "1em 0" }}
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
          {inputValidator.bad_py3_gmcnumber && (
            <div>
              <label className="required form-label">
                {applicationType === "Associate Overseas"
                  ? "GMC / IMC Number or International equivalent"
                  : "GMC / IMC Number"}
              </label>
              <input
                name="py3_gmcnumber"
                value={formData.py3_gmcnumber}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="GMC / IMC number"
              />
              <FormError id="py3_gmcnumber" />
            </div>
          )}

          {inputValidator.bad_py3_otherregulatorybodyreference && (
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

          {inputValidator.bad_py3_ntnno && (
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
                Current Post/Job title field (If retired please enter retired)
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

          {inputValidator.bad_py3_hospitalid && (
            <div>
              <label className="form-label required">
                Main Hospital / Medical School / Place of Work details
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
                      placeholder="Main Hospital / Medical School / Place of Work"
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
                Main Hospital / Medical School / Place of Work not listed
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
                  Main Hospital / Medical School / Place of Work
                </option>
                <option value="Hospital">Main Hospital</option>
                <option value="Medical School">Medical School</option>
              </Form.Select>
              <FormError id="sky_newhospitaltype" />
            </div>
          )}

          {formData.bad_newhospitaladded &&
            inputValidator.bad_sky_newhospitalname && (
              <div>
                <label className="form-label">
                  Main Hospital / Medical School / Place of Work
                </label>
                <input
                  name="sky_newhospitalname"
                  value={formData.sky_newhospitalname}
                  onChange={handleInputChange}
                  type="text"
                  className="form-control input"
                  placeholder="Main Hospital / Medical School / Place of Work"
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
              Proposers must be BAD Ordinary or Honorary Working members
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: !lg ? `repeat(2, 1fr)` : "1fr",
                gap: 20,
              }}
            >
              {inputValidator.bad_proposer1 && (
                <div>
                  <label className="required form-label">Proposer 1</label>
                  <input
                    name="bad_proposer1"
                    value={formData.bad_proposer1}
                    onChange={handleInputChange}
                    type="text"
                    className="form-control input"
                    placeholder="Name"
                  />
                  <FormError id="bad_proposer1" />
                </div>
              )}

              {inputValidator.bad_proposer2 && (
                <div>
                  <label className="required form-label">Proposer 2</label>
                  <input
                    name="bad_proposer2"
                    value={formData.bad_proposer2}
                    onChange={handleInputChange}
                    type="text"
                    className="form-control input"
                    placeholder="Name"
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
            {inputValidator.bad_py3_currentgrade && (
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

            <div>
              <label>Preferred mailing option</label>
              <Form.Select
                name="bad_preferredmailingaddress"
                value={formData.bad_preferredmailingaddress}
                onChange={handleInputChange}
                className="input"
              >
                <option value="" hidden>
                  Preferred mailing option
                </option>
                {prefMailingOption.map((item, key) => {
                  return (
                    <option key={key} value={item.value}>
                      {item.Label}
                    </option>
                  );
                })}
              </Form.Select>
            </div>

            {inputValidator.bad_sky_cvurl && (
              <div>
                <label className="form-label required">Upload Your CV</label>
                <input
                  ref={documentRef}
                  onChange={handleDocUploadChange}
                  type="file"
                  className="form-control input"
                  placeholder="CV Document"
                  accept=".pdf,.doc,.docx"
                />
                <FormError id="sky_cvurl" />
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
                        Include my details in the BAD Members' Directory
                      </div>
                    </div>
                    <FormError id="bad_memberdirectory" />
                  </div>
                )}

                {inputValidator.bad_py3_constitutionagreement && (
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
                          <div>I have read and agreed to abide by the </div>
                          <div
                            className="caps-btn required"
                            style={{ paddingTop: 6, marginLeft: 10 }}
                            onClick={() =>
                              policyHandler({ isConstitution: true })
                            }
                          >
                            BAD CONSTITUTION
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
                      <div style={{ display: "grid" }}>
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
                          <div className="flex">
                            <span>I agree to the</span>
                            <div
                              className="caps-btn required"
                              style={{
                                paddingTop: 6,
                                marginLeft: 10,
                                whiteSpace: "nowrap",
                              }}
                              onClick={() =>
                                policyHandler({ isPrivacyPolicy: true })
                              }
                            >
                              BAD'S PRIVACY NOTICE
                            </div>
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
