import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";

import { colors } from "../../../config/imports";
import FormError from "../../../components/formError";
import ActionPlaceholder from "../../../components/actionPlaceholder";
import CloseIcon from "@mui/icons-material/Close";
import SearchDropDown from "../../../components/searchDropDown";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setUserStoreAction,
  setGoToAction,
  errorHandler,
  validateMembershipFormAction,
  setCompleteUserApplicationAction,
  getMembershipDataAction,
  getHospitalNameAction,
  getHospitalsAction,
  getBADMembershipSubscriptionData,
  sendFileToS3Action,
} from "../../../context";

const SIGApplication = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { applicationData, isActiveUser, dynamicsApps } = useAppState();

  const [formData, setFormData] = useState({
    core_membershipsubscriptionplanid: "",

    py3_title: "",
    py3_firstname: "",
    py3_lastname: "",
    py3_gender: "",
    py3_dateofbirth: "",
    py3_email: "",
    py3_mobilephone: "",
    py3_address1ine1: "",
    py3_addressline2: "",
    py3_addresstowncity: "",
    py3_addresscountystate: "",
    py3_addresszippostalcode: "",
    py3_addresscountry: "",
    sky_profilepicture: "",

    py3_gmcnumber: "",
    bad_currentpost: "",
    py3_hospitalid: "",
    bad_proposer1: "",
    bad_proposer2: "",
    bad_mrpcqualified: "",
    sky_cvurl: "",
    py3_currentgrade: "",
    sky_newhospitalname: "",
    bad_newhospitaladded: "",
    py3_constitutionagreement: "",
    bad_readpolicydocument: "",
    sky_newhospitaltype: "",

    bad_categorytype: "",
    bad_qualifications: "",
    bad_hasmedicallicence: "",
    bad_isbadmember: "",
    bad_interestinfieldquestion: "",
    py3_whatukbasedroleareyou: "",
    py3_speciality: "",
    bad_otherjointclinics: "",
    bad_mainareaofinterest: "",
    bad_includeinthebssciiemaildiscussionforum: "",
    py3_insertnhsnetemailaddress: "",
  });
  const [inputValidator, setInputValidator] = useState({
    bad_categorytype: true,

    py3_title: true,
    py3_firstname: true,
    py3_lastname: true,
    py3_gender: true,
    py3_email: true,
    py3_mobilephone: true,
    py3_address1ine1: true,
    py3_addressline2: true,
    py3_addresstowncity: true,
    py3_addresscountystate: true,
    py3_addresszippostalcode: true,
    py3_addresscountry: true,
    sky_profilepicture: true,
    py3_dateofbirth: true,

    py3_gmcnumber: true,
    bad_currentpost: true,
    py3_hospitalid: true,
    bad_proposer1: true,
    bad_proposer2: true,
    bad_mrpcqualified: true,
    sky_cvurl: true,
    py3_currentgrade: true,
    sky_newhospitalname: true,
    bad_newhospitaladded: true,
    py3_constitutionagreement: true,
    bad_readpolicydocument: true,
    sky_newhospitaltype: true,

    bad_qualifications: true,
    bad_hasmedicallicence: true,
    bad_isbadmember: true,
    bad_interestinfieldquestion: true,
    py3_whatukbasedroleareyou: true,
    py3_speciality: true,
    bad_otherjointclinics: true,
    bad_mainareaofinterest: true,
    bad_includeinthebssciiemaildiscussionforum: true,
    py3_insertnhsnetemailaddress: true,
  });
  const [isEmail, setIsEmail] = useState(false);
  const [applicationType, setType] = useState("SIG Application");
  const [isFetching, setFetching] = useState(false);
  const [membershipData, setMembershipData] = useState(false);
  const [genderList, setGenderList] = useState([]);

  const [hospitalData, setHospitalData] = useState(null);
  const [canChangeHospital, setCanChangeHospital] = useState(true); // allow user to change hospital is no BAD applications are found
  const [selectedHospital, setSelectedHospital] = useState(null);
  const isHospitalValue = formData.py3_hospitalid;
  const hospitalSearchRef = useRef("");
  const documentRef = useRef(null);

  // ⏬ populate form data values from applicationData
  useEffect(async () => {
    await getMembershipDataAction({ state, actions });
    let membershipData = null;

    if (state.source.memberships)
      membershipData = Object.values(state.source.memberships);
    setMembershipData(membershipData);

    const handleSetFormData = ({ data, name }) => {
      let value = data.value;
      // validate gender input field if name is py3_gender & value = 1 replace with ''
      if (name === "py3_gender" && value === 1) value = "";

      setFormData((prevFormData) => ({
        ...prevFormData,
        [`${name}`]: value || "",
      }));
    };

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

    if (!applicationData) return null;
    applicationData.map((data) => {
      // personal information step
      if (data.name === "py3_title")
        handleSetFormData({ data, name: "py3_title" });
      if (data.name === "py3_firstname")
        handleSetFormData({ data, name: "py3_firstname" });
      if (data.name === "py3_lastname")
        handleSetFormData({ data, name: "py3_lastname" });
      if (data.name === "py3_gender") {
        handleSetFormData({ data, name: "py3_gender" });
        setGenderList(data.info.Choices);
      }
      if (data.name === "py3_email")
        handleSetFormData({ data, name: "py3_email" });
      if (data.name === "py3_mobilephone")
        handleSetFormData({ data, name: "py3_mobilephone" });
      if (data.name === "py3_address1ine1")
        handleSetFormData({ data, name: "py3_address1ine1" });
      if (data.name === "py3_addressline2")
        handleSetFormData({ data, name: "py3_addressline2" });
      if (data.name === "py3_addresstowncity")
        handleSetFormData({ data, name: "py3_addresstowncity" });
      if (data.name === "py3_addresscountystate")
        handleSetFormData({ data, name: "py3_addresscountystate" });
      if (data.name === "py3_addresszippostalcode")
        handleSetFormData({ data, name: "py3_addresszippostalcode" });
      if (data.name === "py3_addresscountry")
        handleSetFormData({ data, name: "py3_addresscountry" });
      if (data.name === "py3_dateofbirth")
        handleSetFormData({ data, name: "py3_dateofbirth" });

      // professional information step
      if (data.name === "py3_gmcnumber")
        handleSetFormData({ data, name: "py3_gmcnumber" });
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
      if (data.name === "py3_hospitalid") {
        // get hospital id from application data
        if (data.value) hospitalId = data.value;
        handleSetFormData({ data, name: "py3_hospitalid" });
      }

      if (data.bad_categorytype) setType(data.bad_categorytype); // validate SIG application category type
      // populate form data with application category:type
      // leave empty for SIG application category for user to select from the list
      // if (data.bad_categorytype)
      //   setFormData((prevFormData) => ({
      //     ...prevFormData,
      //     bad_categorytype: data.bad_categorytype + ":" + data._bad_sigid_value,
      //   }));

      // SIG membership information step
      if (data.name === "bad_qualifications")
        handleSetFormData({ data, name: "bad_qualifications" });
      if (data.name === "bad_hasmedicallicence")
        handleSetFormData({ data, name: "bad_hasmedicallicence" });
      if (data.name === "bad_isbadmember")
        handleSetFormData({ data, name: "bad_isbadmember" });
      if (data.name === "bad_interestinfieldquestion")
        handleSetFormData({ data, name: "bad_interestinfieldquestion" });
      if (data.name === "py3_whatukbasedroleareyou")
        handleSetFormData({ data, name: "py3_whatukbasedroleareyou" });
      if (data.name === "py3_speciality")
        handleSetFormData({ data, name: "py3_speciality" });
      if (data.name === "bad_otherjointclinics")
        handleSetFormData({ data, name: "bad_otherjointclinics" });
      if (data.name === "bad_mainareaofinterest")
        handleSetFormData({ data, name: "bad_mainareaofinterest" });
      if (data.name === "bad_includeinthebssciiemaildiscussionforum")
        handleSetFormData({
          data,
          name: "bad_includeinthebssciiemaildiscussionforum",
        });
      if (data.name === "py3_insertnhsnetemailaddress")
        handleSetFormData({ data, name: "py3_insertnhsnetemailaddress" });

      if (data.bad_categorytype) setType(data.bad_categorytype);
      if (data._bad_sigid_value) setType(data._bad_sigid_value);
    });

    if (hospitalId) {
      // get hospital data via API & populate form
      const hospitalData = await getHospitalNameAction({
        state,
        id: hospitalId,
      });
      if (hospitalData) {
        setSelectedHospital(hospitalData.name);
      }
    }

    // ⏬ validate inputs
    validateMembershipFormAction({
      state,
      actions,
      setData: setInputValidator,
      applicationData,
    });
  }, []);

  // HANDLERS --------------------------------------------
  const handleSelectHospital = ({ item }) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      py3_hospitalid: item.link,
    }));

    setSelectedHospital(item.title);
    setHospitalData(null); // clear hospital data for dropdown
    console.log("selected hospital", item); // debug
  };

  const handleClearHospital = () => {
    setSelectedHospital(null);
    setFormData((prevFormData) => ({
      ...prevFormData,
      py3_hospitalid: "",
    }));
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "bad_organisedfor") {
      // handle new id prefetch
      console.log("handle new id prefetch");
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNext = async () => {
    // check if new hospital value been added
    const isNewHospital = formData.bad_newhospitaladded;
    let sigAppliaction = formData;

    const isValid = isFormValidated({
      required: [
        "bad_organisedfor",
        "bad_categorytype",

        "py3_gmcnumber",
        "bad_currentpost",
        isNewHospital ? "sky_newhospitaltype" : null,
        !isNewHospital ? "py3_hospitalid" : null,

        "py3_title",
        "py3_firstname",
        "py3_lastname",
        "py3_gender",
        "py3_email",
        "py3_mobilephone",
        "py3_address1ine1",
        "py3_addresstowncity",
        "py3_addresszippostalcode",
        "py3_addresscountry",
      ],
    });

    if (!isValid) return null;
    console.log("formData", formData); // debug

    try {
      setFetching(true);
      // ⏬ get appropriate membership ID
      const membershipData = await getBADMembershipSubscriptionData({
        state,
        category: "SIG",
        type: formData.bad_categorytype,
      });
      // if membershipData aupdate application id & procced to next step
      if (!membershipData) {
        // reset membershipData for dropdown to trigger an Error
        setFormData((prevFormData) => ({
          ...prevFormData,
          bad_categorytype: "",
        }));
        throw new Error("Failed to get membership data");
      } else {
        // update application object with feched membership id
        sigAppliaction.core_membershipsubscriptionplanid =
          membershipData.core_membershipsubscriptionplanid;
      }
      console.log("sigAppliaction", sigAppliaction); // debug

      const store = await setUserStoreAction({
        state,
        actions,
        dispatch,
        applicationData,
        isActiveUser,
        dynamicsApps,
        membershipApplication: { sigApp: true }, // set stepOne to complete
        data: sigAppliaction,
      });

      if (!store.success)
        throw new Error("Failed to update application record"); // throw error if store is not successful

      // complete application & submit to Dynamics
      const appsResponse = await setCompleteUserApplicationAction({
        state,
        dispatch,
        isActiveUser,
        applicationData,
      });
      if (!appsResponse) throw new Error("Failed to create application"); // throw error if store is not successful

      let slug = `/membership/thank-you/`;
      if (isActiveUser) setGoToAction({ path: slug, actions });
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // if input value py3_insertnhsnetemailaddress in wp set to show proceed
    if (
      name === "bad_includeinthebssciiemaildiscussionforum" &&
      checked &&
      inputValidator.py3_insertnhsnetemailaddress
    ) {
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
              path: `/membership/step-2-category-selection/`,
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
          Submit Application
        </div>
      </div>
    );
  };

  const ServeSIGMembershipCategory = () => {
    if (!membershipData) return null;
    // filter aplication data to match membership groupse data
    const membershipDataFiltered = membershipData.filter((membership) => {
      // membership.core_membershipgroupid === formData.bad_categorytype
      let appTitle = membership.acf.category_types
        .replace(/Full:/g, "")
        .replace(/:/g, " - ");

      let isPartOfGroupe = appTitle.includes(applicationType);

      return isPartOfGroupe;
    });

    console.log("membershipDataFiltered", membershipDataFiltered); // debug')

    return (
      <div>
        <label className="bold required" style={{ padding: "0.5em 0" }}>
          Membership Category
        </label>
        <Form.Select
          name="bad_categorytype"
          value={formData.bad_categorytype}
          onChange={handleChange}
          className="input"
        >
          <option value="" hidden>
            Membership Category
          </option>
          {membershipData.map((item, key) => {
            const { bad_or_sig, category_types } = item.acf;
            if (bad_or_sig !== "sig") return null;
            // get SIG membership categories name from custom object
            // if typeName includes Full replace with empty string
            // change prefix for names with " - ", eg. "Tarainee - Time"
            let typeName = category_types
              .replace(/Full:/g, "")
              .replace(/:/g, " - ");
            // if applicationType name dont include category_types return null
            if (!typeName.includes(applicationType)) return null;

            return (
              <option key={key} value={category_types}>
                {typeName}
              </option>
            );
          })}
        </Form.Select>
        <FormError id="bad_categorytype" />
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
          <ServeSIGMembershipCategory />

          {inputValidator.py3_title && (
            <div>
              <label className="required form-label">Title</label>
              <Form.Select
                name="py3_title"
                value={formData.py3_title}
                onChange={handleInputChange}
                className="input"
              >
                <option value="" hidden>
                  Professor, Dr, Mr, Miss, Ms
                </option>
                <option value="Dr">Dr</option>
                <option value="Mr">Mr</option>
                <option value="Miss">Miss</option>
                <option value="Ms">Ms</option>
                <option value="Professor">Professor</option>
              </Form.Select>
              <FormError id="py3_title" />
            </div>
          )}

          {inputValidator.py3_firstname && (
            <div>
              <label className="form-label required">First Name</label>
              <input
                name="py3_firstname"
                value={formData.py3_firstname}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="First Name"
              />
              <FormError id="py3_firstname" />
            </div>
          )}

          {inputValidator.py3_lastname && (
            <div>
              <label className="form-label required">Last Name</label>
              <input
                name="py3_lastname"
                value={formData.py3_lastname}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="Last Name"
              />
              <FormError id="py3_lastname" />
            </div>
          )}

          {inputValidator.py3_gender && (
            <div>
              <label className="required form-label">Gender</label>
              <Form.Select
                name="py3_gender"
                value={formData.py3_gender}
                onChange={handleInputChange}
                className="input"
              >
                <option value="" hidden>
                  Male, Female, Transgender, Prefer Not To Answer
                </option>
                {genderList.map((item, key) => {
                  return (
                    <option key={key} value={item.value}>
                      {item.Label}
                    </option>
                  );
                })}
              </Form.Select>
              <FormError id="py3_gender" />
            </div>
          )}

          {inputValidator.py3_dateofbirth && (
            <div>
              <label className="form-label">Date of Birth</label>
              <input
                name="py3_dateofbirth"
                value={formData.py3_dateofbirth}
                onChange={handleInputChange}
                type="date"
                className="form-control input"
                placeholder="Date of Birth"
              />
            </div>
          )}

          {inputValidator.py3_email && (
            <div>
              <label className="form-label required">Email</label>
              <input
                name="py3_email"
                value={formData.py3_email}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="Email"
              />
            </div>
          )}

          {inputValidator.py3_mobilephone && (
            <div>
              <label className="form-label required">Mobile Number</label>
              <input
                name="py3_mobilephone"
                value={formData.py3_mobilephone}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="Mobile Number"
              />
              <FormError id="py3_mobilephone" />
            </div>
          )}

          {inputValidator.py3_address1ine1 && (
            <div>
              <label className="required form-label">Home Address</label>
              <input
                name="py3_address1ine1"
                value={formData.py3_address1ine1}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="Address Line 1"
              />
              <FormError id="py3_address1ine1" />
            </div>
          )}

          {inputValidator.py3_addressline2 && (
            <input
              name="py3_addressline2"
              value={formData.py3_addressline2}
              onChange={handleInputChange}
              type="text"
              className="form-control input"
              placeholder="Address Line 2"
              style={{ margin: "0.5em 0" }}
            />
          )}

          {inputValidator.py3_addresstowncity && (
            <div>
              <input
                name="py3_addresstowncity"
                value={formData.py3_addresstowncity}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="City"
                style={{ margin: "0.5em 0" }}
              />
              <FormError id="py3_addresstowncity" />
            </div>
          )}

          {inputValidator.py3_addresscountystate && (
            <div>
              <input
                name="py3_addresscountystate"
                value={formData.py3_addresscountystate}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="County/State"
                style={{ margin: "0.5em 0" }}
              />
              <FormError id="py3_addresscountystate" />
            </div>
          )}

          {inputValidator.py3_addresszippostalcode && (
            <div>
              <input
                name="py3_addresszippostalcode"
                value={formData.py3_addresszippostalcode}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="Postcode/Zip"
                style={{ margin: "0.5em 0" }}
              />
              <FormError id="py3_addresszippostalcode" />
            </div>
          )}

          {inputValidator.py3_addresscountry && (
            <div>
              <input
                name="py3_addresscountry"
                value={formData.py3_addresscountry}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="Country"
                style={{ margin: "0.5em 0" }}
              />
              <FormError id="py3_addresscountry" />
            </div>
          )}

          {/* Profesonal Information Questions ------------------------- */}

          {inputValidator.bad_proposer1 && (
            <div>
              <label className="form-label">Supporting Member 1</label>
              <input
                name="bad_proposer1"
                value={formData.bad_proposer1}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="MRCP"
              />
            </div>
          )}

          {inputValidator.bad_proposer2 && (
            <div>
              <label className="form-label">Supporting Member 2</label>
              <input
                name="bad_proposer2"
                value={formData.bad_proposer2}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="MRCP"
              />
            </div>
          )}

          {inputValidator.py3_gmcnumber && (
            <div>
              <label className="required form-label">GMC Number</label>
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
                  mapToName="name"
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

          {/* SIG Questions -------------------------------------------- */}

          {inputValidator.py3_currentgrade && (
            <div>
              <label className="form-label">Current Grade</label>
              <input
                name="py3_currentgrade"
                value={formData.py3_currentgrade}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="MRCP"
              />
            </div>
          )}

          {inputValidator.bad_qualifications && (
            <div>
              <label className="required form-label">Qualification</label>
              <input
                name="bad_qualifications"
                value={formData.bad_qualifications}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="Qualification"
              />
              <FormError id="bad_qualifications" />
            </div>
          )}

          {inputValidator.bad_hasmedicallicence && (
            <div className="flex-col">
              <label className="form-label">
                License to practice medicine (Y/N)
              </label>
              <input
                name="bad_hasmedicallicence"
                checked={formData.bad_hasmedicallicence}
                onChange={handleInputChange}
                type="checkbox"
                className="form-check-input check-box"
              />
            </div>
          )}

          {inputValidator.bad_isbadmember && (
            <div className="flex-col">
              <label className="form-label">Are you BAD member (Y/N)</label>
              <input
                name="bad_isbadmember"
                checked={formData.bad_isbadmember}
                onChange={handleInputChange}
                type="checkbox"
                className="form-check-input check-box"
              />
            </div>
          )}

          {inputValidator.bad_interestinfieldquestion && (
            <div>
              <label className="form-label">
                Describe your interest in {applicationType}
              </label>
              <textarea
                name="bad_interestinfieldquestion"
                value={formData.bad_interestinfieldquestion}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder={`Describe your interest in (SIG name)`}
              ></textarea>
            </div>
          )}

          {inputValidator.py3_whatukbasedroleareyou && (
            <div>
              <label style={styles.subTitle}>UK/Overseas role</label>
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
            </div>
          )}

          {inputValidator.py3_speciality && (
            <div>
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
                <option value="Both">Both</option>
              </Form.Select>
            </div>
          )}

          {inputValidator.bad_otherjointclinics && (
            <div>
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
            </div>
          )}

          {inputValidator.bad_mainareaofinterest && (
            <div>
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
            </div>
          )}

          {inputValidator.bad_includeinthebssciiemaildiscussionforum && (
            <div className="flex-col">
              <label className="form-label">
                Do you want to be part of the BSSCII discussion form?
              </label>
              <input
                name="bad_includeinthebssciiemaildiscussionforum"
                checked={formData.bad_includeinthebssciiemaildiscussionforum}
                onChange={handleInputChange}
                type="checkbox"
                className="form-check-input check-box"
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
          )}

          {inputValidator.bad_readpolicydocument && (
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
                    >
                      I agree - Privacy Notice
                    </div>
                    <span>
                      I agree - Privacy Notice* - justo donec enim diam
                      vulputate ut pharetra sit. Purus semper eget duis at
                      tellus at. Sed adipiscing diam.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>
      </form>
      <ServeActions />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(SIGApplication);
