import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";

import { colors } from "../../../config/imports";
import FormError from "../../../components/formError";
import ActionPlaceholder from "../../../components/actionPlaceholder";
import SearchDropDown from "../../../components/searchDropDown";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
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
  googleAutocomplete,
  getGenderAction,
  getDermGroupsData,
  setErrorAction,
  copyToClipboard,
  Parcer,
} from "../../../context";
import Loading from "../../../components/loading";

const SIGApplication = ({ state, actions, libraries }) => {
  const dispatch = useAppDispatch();
  const { applicationData, isActiveUser, dynamicsApps, genderList } =
    useAppState();

  const [formData, setFormData] = useState({
    core_membershipsubscriptionplanid: "",
    bad_categorytype: "",

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
    py3_addresszippostalcode: "",
    py3_addresscountystate: "",
    py3_addresscountry: "",
    py3_gmcnumber: "",
    bad_currentpost: "",
    py3_hospitalid: "",
    sky_newhospitalname: "",
    bad_proposer1: "",
    bad_proposer2: "",
    py3_ntnno: "",
    sky_cvurl: "",
    sig_readpolicydocument_url_email: "",
    py3_currentgrade: "",
    bad_qualifications: "",
    bad_isbadmember: "",
    py3_whatukbasedroleareyou: "",
    py3_speciality: "",
    bad_interestinfieldquestion: "",
    bad_otherjointclinics: "",
    bad_mainareaofinterest: "",
    py3_insertnhsnetemailaddress: "",
    bad_psychodermatologycategory: "",
    // --------------------------------------------------------------------------------
    _bad_newhospitaladded: false,
    _bad_readpolicydocument: false,
    _bad_hasmedicallicence: false,
    _bad_includeinthebssciiemaildiscussionforum: false,
  });
  const [inputValidator, setInputValidator] = useState({
    sig_bad_categorytype: true, // 📌 validation condition for bad_categorytype with sig_ prefix

    sig_py3_title: true,
    sig_py3_firstname: true,
    sig_py3_lastname: true,
    sig_py3_gender: true,
    sig_py3_dateofbirth: true,
    sig_py3_email: true,
    sig_py3_mobilephone: true,
    sig_py3_address1ine1: true,
    sig_py3_addressline2: true,
    sig_py3_addresstowncity: true,
    sig_py3_addresszippostalcode: true,
    sig_py3_addresscountystate: true,
    sig_py3_addresscountry: true,
    sig_py3_gmcnumber: true,
    sig_bad_currentpost: true,
    sig_py3_hospitalid: true,
    sig_bad_newhospitaladded: true,
    sig_sky_newhospitalname: true,
    sig_bad_proposer1: true,
    sig_bad_proposer2: true,
    sig_py3_ntnno: true,
    sig_sky_cvurl: true,
    sig_bad_readpolicydocument: true,
    sig_readpolicydocument_url_email: true,
    sig_py3_currentgrade: true,
    sig_bad_qualifications: true,
    sig_bad_hasmedicallicence: true,
    sig_bad_isbadmember: true,
    sig_py3_whatukbasedroleareyou: true,
    sig_py3_speciality: true,
    sig_bad_interestinfieldquestion: true,
    sig_bad_otherjointclinics: true,
    sig_bad_mainareaofinterest: true,
    sig_bad_includeinthebssciiemaildiscussionforum: true,
    sig_py3_insertnhsnetemailaddress: true,
    sig_bad_psychodermatologycategory: false, // this is a special case for the sig application forms as new field is added that do not update wp resspones via api
  });
  const [isEmail, setIsEmail] = useState(false);
  const [applicationType, setType] = useState("Special Interest Group");
  const [readPolicyDoc, setReadPolicyDoc] = useState("");
  const [contactEmail, setEmail] = useState("");
  const [isFetching, setFetching] = useState(false);
  const [membershipData, setMembershipData] = useState(false);
  const [isJobEditable, setJobEditable] = useState(true);

  const [hospitalData, setHospitalData] = useState(null);
  const [canChangeHospital, setCanChangeHospital] = useState(true); // allow user to change hospital is no BAD applications are found
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [dermList, setDermList] = useState(null);
  const isHospitalValue = formData.py3_hospitalid;
  const hospitalSearchRef = useRef("");
  const documentRef = useRef(null);

  const [addressData, setAddressData] = useState(null);
  const [isFetchingAddress, setIsFetchingAddress] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const address1Line1Ref = useRef("");
  const dermGroupRef = useRef([]);
  const ctaHeight = 40;

  let selectedApplicationType = formData.bad_categorytype;
  // select after text after :
  if (selectedApplicationType && selectedApplicationType.includes(":")) {
    selectedApplicationType = selectedApplicationType.split(":")[1];
  }

  // ⏬ populate form data values from applicationData
  useEffect(async () => {
    // app type name & hospital id initial values
    let applicationType = null;
    let hospitalId = null;
    let membershipData = state.source.memberships;

    // 📌 prefetch derm group data for mails and policy links
    const dermGroups = await getDermGroupsData({ state, postsPerPage: 100 });
    if (dermGroups) dermGroupRef.current = dermGroups;

    // 📌 get gender list from Dynamics
    if (!genderList) await getGenderAction({ state, dispatch });

    if (!membershipData) {
      await getMembershipDataAction({ state, actions });
      membershipData = state.source.memberships;
    }
    if (!membershipData) return null; // if no membership data is found, return null

    membershipData = Object.values(membershipData);
    console.log("🐞 membershipData", membershipData);

    const handleSetFormData = ({ data, name }) => {
      let value = data.value;

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
        // console.log("🤖 user have BAD application approved");
        setCanChangeHospital(false);
      }
    }

    if (!applicationData) return null;

    // pre-fill application input fields with data from applicationData
    applicationData.map((data) => {
      // ⬇️  map sigApp fields against applicationData & set formData with field name & value
      if (data.name === "sky_cvurl") return; // cv url field is not required
      handleSetFormData({ data, name: data.name });

      // if bad_currentpost is null then set value from user profile data
      if (!data.bad_currentpost && isActiveUser) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [`bad_currentpost`]: isActiveUser.jobtitle,
          dev_editable_job: !!isActiveUser.jobtitle,
        }));
        // set job title to disabled status
        setJobEditable(false);
      }

      // set hospital id if exists
      if (data.name === "py3_hospitalid") {
        if (data.value) hospitalId = data.value;
      }
      // 📌 set Psychodermatology Category picklist values
      if (data.name === "bad_psychodermatologycategory") {
        let pickList = null;
        if (data.info) pickList = data.info.Choices;
        if (pickList) setDermList(pickList);
      }
      // 📌 set app type name
      if (data.bad_categorytype) {
        applicationType = data.bad_categorytype; // set application type for logic below
        // 📌 set application type name
        let type = data.bad_categorytype;
        if (type === "*") type = "Special Interest Group";
        setType(type); // validate SIG application category type
      }
    });
    // populate bad_isbadmember field form user blob based on selfservice data field value
    let isBadMember =
      isActiveUser.bad_selfserviceaccess === state.theme.serviceAccess;
    setFormData((prev) => ({
      ...prev,
      [`bad_isbadmember`]: isBadMember,
    }));

    // apply app additional logic after mapping apps data
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
    let apps = [];
    membershipData.map((item) => {
      // push app name to apps array
      apps.push(item.acf.category_types);
    });

    if (membershipData) {
      // filter memberships data & return memberships that includes applicationType
      membershipData = membershipData.filter((item) => {
        // get application & stip all white spaces
        let application = item.acf.category_types
          .toLowerCase()
          .replace(/\s/g, "");
        // if application exist split : & select second part of the string
        // if (typeof application === "string" && application.includes(":"))
        //   application = application.split(":")[1];
        let selectedApplication = applicationType
          .toLowerCase()
          .replace(/\s/g, "");
        // if applicationType is * then return all memberships that are SIG
        if (applicationType === "*") {
          return item.acf.bad_or_sig === "sig";
        }

        // return memberships that matches or includes any words in applicationType
        return application.includes(selectedApplication);
      });

      // sort membershipData alphabetically
      membershipData = membershipData.sort((a, b) => {
        if (a.acf.category_types < b.acf.category_types) return -1;
        if (a.acf.category_types > b.acf.category_types) return 1;
        return 0;
      });
    }
    // check if application category have only one application
    let isSingleApp = false;
    let appType = "";
    if (membershipData) isSingleApp = membershipData.length === 1;
    // if application category have only one application set formData to that application
    if (isSingleApp) {
      appType = membershipData[0].acf.category_types;
      setFormData((prevFormData) => ({
        ...prevFormData,
        bad_categorytype: appType,
      }));
    }
    // 📌 update policy link agains app data
    handlePolicyLinkUpdate({
      membershipData,
      value: appType,
    });

    // ⏬  validate inputs for single application only
    validateMembershipFormAction({
      state,
      setData: setInputValidator,
      applicationData,
    });

    setMembershipData(membershipData); // 📌 set membership data picklist
  }, [state.source.memberships]);

  // HANDLERS --------------------------------------------
  const mailToClient = (e) => {
    copyToClipboard(e);

    // set user notification if email client is not available & copy to clipboard
    const emailValue = e.target.innerText;

    // open email client if available in new tab
    if (emailValue && emailValue.includes("@")) {
      const email = emailValue.replace(/\s/g, "");
      const emailLink = `mailto:${email}`;
      window.open(emailLink, "_blank");
    }

    // document.location = "mailto:" + emailValue; // open default email client
  };

  useEffect(() => {
    // add event listener to email-client button
    const emailClient = document.getElementById("email-client");
    if (emailClient) {
      emailClient.addEventListener("click", (e) => {
        mailToClient(e);
      });
    }
  }, []);

  const handleSelectHospital = ({ item }) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      py3_hospitalid: item.link,
    }));

    setSelectedHospital(item.title);
    setHospitalData(null); // clear hospital data for dropdown
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
  };

  const isFormValidated = ({ required }) => {
    if (!required && !required.length) return null;
    let isValid = true;

    required.map((input) => {
      let inputValue = input;
      // 📌 add bad_ if input dont have it
      if (!inputValue.includes("sig_")) inputValue = `sig_${input}`;

      if (!formData[input] && inputValidator[inputValue]) {
        errorHandler({ id: `form-error-${input}`, time: 5000 });
        isValid = false;
        console.log("🐞 FAILED AUTH", input, formData[input]); // failed input validation debugger
      }
    });

    return isValid;
  };

  const handlePolicyLinkUpdate = ({ membershipData, value }) => {
    // filter memberships data & return memberships that includes applicationType
    const filteredMembershipData = membershipData.filter(
      (item) => item.acf.category_types === value
    );

    let policyLink = "";
    let contactEmail = "";
    // if have membership app data update policy field with link to policy
    if (filteredMembershipData.length)
      policyLink =
        filteredMembershipData[0].acf.sig_readpolicydocument_url_email;

    // reset name for SIG application
    let applicationName = value;
    // if application have : then split it to get name
    if (applicationName.includes(":"))
      applicationName = applicationName.split(":")[1];

    // filter dermGroupRefs data & return memberships that includes applicationName
    const filteredDermGroupRefs = dermGroupRef.current.filter((item) =>
      item.title.rendered.includes(applicationName)
    );
    if (filteredDermGroupRefs.length)
      contactEmail = filteredDermGroupRefs[0].acf.email;

    setType(applicationName);
    // set selected policy link & contact email
    setReadPolicyDoc(policyLink);
    setEmail(contactEmail);
  };

  const handleMemTypeChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (membershipData) {
      // update policy link agains app data
      handlePolicyLinkUpdate({ membershipData, value });

      // ⏬ validate inputs
      validateMembershipFormAction({
        state,
        actions,
        setData: setInputValidator,
        applicationData,
        membershipTypeChange: value,
      });
    }
  };

  const handleSubmitApp = async () => {
    // check if new hospital value been added
    const isNewHospital = formData._bad_newhospitaladded;
    let sigAppliaction = {
      core_membershipsubscriptionplanid: formData.py3_membershipid,
      bad_categorytype: formData.bad_categorytype, // py3_categorytype
      py3_title: formData.py3_title,
      py3_firstname: formData.py3_firstname,
      py3_lastname: formData.py3_lastname,
      py3_gender: formData.py3_gender,
      py3_dateofbirth: formData.py3_dateofbirth,
      py3_email: formData.py3_email,
      py3_mobilephone: formData.py3_mobilephone,
      py3_address1ine1: formData.py3_address1ine1,
      py3_addressline2: formData.py3_addressline2,
      py3_addresstowncity: formData.py3_addresstowncity,
      py3_addresszippostalcode: formData.py3_addresszippostalcode,
      py3_addresscountystate: formData.py3_addresscountystate,
      py3_addresscountry: formData.py3_addresscountry,
      py3_gmcnumber: formData.py3_gmcnumber,
      bad_currentpost: formData.py3_currentpost,
      py3_hospitalid: formData.py3_hospitalid,
      sky_newhospitalname: formData.sky_newhospitalname, // new hospital name if added
      bad_proposer1: formData.bad_proposer1,
      bad_proposer2: formData.bad_proposer2,
      py3_ntnno: formData.py3_ntnno,
      sky_cvurl: formData.sky_cvurl,
      sig_readpolicydocument_url_email:
        formData.sig_readpolicydocument_url_email,
      py3_currentgrade: formData.py3_currentgrade,
      bad_qualifications: formData.bad_qualifications,
      bad_isbadmember: formData.py3_isbadmember,
      py3_whatukbasedroleareyou: formData.py3_whatukbasedroleareyou,
      py3_speciality: formData.py3_speciality,
      bad_interestinfieldquestion: formData.bad_interestinfieldquestion,
      bad_otherjointclinics: formData.py3_otherjointclinics,
      bad_mainareaofinterest: formData.py3_mainareaofinterest,
      py3_insertnhsnetemailaddress: formData.py3_insertnhsnetemailaddress,
      bad_psychodermatologycategory: formData.py3_psychodermatologycategory,
      // --------------------------------------------------------------------------------
      bad_newhospitaladded: isNewHospital, // new hospital added flag
      bad_readpolicydocument: formData._bad_readpolicydocument,
      bad_hasmedicallicence: formData._bad_hasmedicallicence,
      bad_includeinthebssciiemaildiscussionforum:
        formData._bad_includeinthebssciiemaildiscussionforum,
    };

    // default py3_address1ine1 to ref if value not set by user
    let isAddressInput = false;
    if (!formData.py3_address1ine1 && address1Line1Ref.current.value.length) {
      isAddressInput = true;
      formData.py3_address1ine1 = address1Line1Ref.current.value;
    }
    const isValid = isFormValidated({
      required: [
        "bad_organisedfor",
        "bad_categorytype",

        "py3_gmcnumber",
        "bad_currentpost",
        isNewHospital ? "sky_newhospitaltype" : "",
        !isNewHospital ? "py3_hospitalid" : "",

        "py3_title",
        "py3_firstname",
        "py3_lastname",
        "py3_gender",
        "py3_email",
        "py3_mobilephone",
        isAddressInput ? "" : "py3_address1ine1",
        "py3_addresstowncity",
        "py3_addresszippostalcode",
        "py3_addresscountry",
        "py3_ntnno",
        inputValidator.sig_bad_psychodermatologycategory && !!dermList
          ? "bad_psychodermatologycategory"
          : "",
        inputValidator.sig_bad_readpolicydocument && !!readPolicyDoc
          ? "_bad_readpolicydocument"
          : "",
        "sky_cvurl",
        formData.bad_categorytype ===
        "Associate:British Society for Medical Dermatology"
          ? "bad_otherjointclinics"
          : "",
        formData.bad_categorytype ===
        "Full:British Society for Medical Dermatology"
          ? "bad_otherjointclinics"
          : "",
        formData.bad_categorytype === "Full:British Hair and Nails Society"
          ? "py3_speciality"
          : "",
        formData.bad_categorytype === "Full:British Hair and Nails Society"
          ? "py3_whatukbasedroleareyou"
          : "",
      ],
    });

    if (!isValid) {
      // ⬇️ display error msg if form is not valid inputs | missing inputs
      setErrorAction({
        dispatch,
        isError: {
          message: `Please fill all mandatory fields`,
          image: "Error",
        },
      });

      return null;
    }
    // --------------------------------------------------------------------------------
    // 📌  Validate if new hospital added (sky_newhospitalname)
    // ⚠️ Prevent serverside failuer to sumit application if new hospital name not provided!
    // if sky_newhospitalname is empty then set hard set bad_newhospitaladded to false
    // --------------------------------------------------------------------------------
    if (isNewHospital && !formData.sky_newhospitalname) {
      sigAppliaction.bad_newhospitaladded = false;
    }

    try {
      setFetching(true);
      state.theme.isNotificationDisable = true; // disable freeze notification for active user if exists on redirect to dashboard

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

      let slug = `/dashboard/`;
      setGoToAction({ state, path: slug, actions }); // redirect to dashboard after successful submission
    } catch (error) {
      // console.log(error);
      setErrorAction({
        dispatch,
        isError: {
          message: `Failed to submit ${applicationType} application. Please try again.`,
          image: "Error",
        },
      });
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // handle BAD member question
    if (name === "bad_isbadmember") {
      let isBadMember = value === "true" ? true : false;
      return setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: isBadMember,
      }));
    }

    // if input value py3_insertnhsnetemailaddress in wp set to show proceed
    if (
      name === "_bad_includeinthebssciiemaildiscussionforum" &&
      checked &&
      inputValidator.sig_py3_insertnhsnetemailaddress
    ) {
      setIsEmail(true);
    }
    if (name === "_bad_includeinthebssciiemaildiscussionforum" && !checked) {
      setIsEmail(false);
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddressLookup = async () => {
    const input = address1Line1Ref.current.value;
    // update input value before async task
    setSearchInput(input);

    try {
      setIsFetchingAddress(true);
      const data = await googleAutocomplete({ input });

      // check for data returned form API
      if (data.length > 0) {
        // covert data to address format
        const dropDownFoprmat = [];
        data.map((item) => {
          dropDownFoprmat.push({ title: item.description, terms: item.terms });
        });

        setAddressData(dropDownFoprmat);
      } else {
        setAddressData(null);
      }
    } catch (error) {
      // console.log("error", error);
    } finally {
      setIsFetchingAddress(false);
    }
  };

  const handleSelectAddress = async ({ item }) => {
    // destructure item object & get coutry code & city name from terms
    const { terms, title } = item;
    let countryCode = "";
    let cityName = "";

    if (terms) {
      // if terms define address components
      if (terms.length >= 1) countryCode = terms[terms.length - 1].value;
      if (terms.length >= 2) cityName = terms[terms.length - 2].value;
    }
    // overwrite formData to match Dynamics fields
    if (countryCode === "UK")
      countryCode = "United Kingdom of Great Britain and Northern Ireland";

    // update formData with values
    setFormData((prevFormData) => ({
      ...prevFormData,
      py3_address1ine1: title,
      py3_addresscountry: countryCode,
      py3_addresstowncity: cityName,
    }));
  };

  const handleClearAction = () => {
    // clear search input value
    setFormData((prevFormData) => ({
      ...prevFormData,
      py3_address1ine1: "",
    }));
    setSearchInput("");
    setAddressData(null);
  };

  // SERVERS ---------------------------------------------
  const ServeIcon = () => {
    const searchIcon = <SearchIcon />;
    const closeIcon = <CloseIcon />;
    const icon = searchInput ? closeIcon : searchIcon;

    if (isFetchingAddress)
      return (
        <CircularProgress color="inherit" style={{ width: 25, height: 25 }} />
      );

    return <div onClick={handleClearAction}>{icon}</div>;
  };

  const ServeActions = () => {
    return (
      <div
        className="flex"
        style={{
          justifyContent: "flex-end",
          padding: `2em 1em 0 1em`,
        }}
      >
        <div
          className="transparent-btn"
          style={{ marginRight: "1em" }}
          onClick={() => setGoToAction({ state, path: `/dashboard/`, actions })}
        >
          Back
        </div>

        <div className="blue-btn" onClick={handleSubmitApp}>
          Submit Application
        </div>
      </div>
    );
  };

  const ServeSIGMembershipCategory = () => {
    if (!membershipData) return null;

    return (
      <div>
        <label className="bold required" style={{ padding: "0.5em 0" }}>
          Please select the Special Interest Group you would like to apply for:
        </label>
        <Form.Select
          name="bad_categorytype"
          value={formData.bad_categorytype}
          onChange={handleMemTypeChange}
          className="input"
        >
          <option value="" hidden>
            Membership Category
          </option>
          {membershipData.map((item, key) => {
            const { bad_or_sig, category_types } = item.acf;
            // get SIG membership categories name from custom object
            // split string on : and swap first and second value
            // if typeName includes Full replace with empty string
            // change prefix for names with " - ", eg. "Tarainee - Time"
            let typeName = category_types.split(":").reverse().join(" - ");
            // if value include - Full replace with empty string
            typeName = typeName.replace(" - Full", "");

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

  const ErorrMessage = ({ show }) => {
    if (!show) return null;

    return (
      <div className="error-notification error-msg">
        <span className="required">Mandatory field</span>
      </div>
    );
  };

  // --------------------------------------------------------------------------------
  // 📌  Error placeholder
  // --------------------------------------------------------------------------------

  // show loading indicator while no membershipData is fetched or if membershipData is fetched but is empty
  if (!membershipData)
    return (
      <div>
        <Loading padding="5vh 0 0" />
      </div>
    );

  let appTitle = null;
  if (applicationData) appTitle = applicationData[0].bad_categorytype;

  return (
    <div style={{ position: "relative" }}>
      <ActionPlaceholder
        isFetching={isFetching}
        background="transparent"
        alignSelf="self-end"
        padding="0 0 45% 0"
      />

      <div
        className="primary-title"
        style={{
          fontSize: 20,
          paddingBottom: `1em`,
        }}
      >
        <span>Category Selected: {appTitle || applicationType}</span>
      </div>

      <div>
        <span className="required" />
        Mandatory fields
      </div>

      <form>
        <div
          style={{
            padding: `1em`,
            margin: `1em 0`,
            borderTop: `1px solid ${colors.silverFillTwo}`,
          }}
        >
          <ServeSIGMembershipCategory />

          {inputValidator.sig_bad_psychodermatologycategory && dermList && (
            <div className="flex-col">
              <label className="required form-label">
                Membership Category Type
              </label>
              <Form.Select
                name="bad_psychodermatologycategory"
                value={formData.bad_psychodermatologycategory}
                onChange={handleInputChange}
                className="input"
              >
                <option value="" hidden>
                  Membership Category Type
                </option>
                {dermList.map(({ value, Label }, key) => {
                  return (
                    <option key={key} value={value}>
                      {Label}
                    </option>
                  );
                })}
              </Form.Select>
              <ErorrMessage show={true} />
            </div>
          )}

          {inputValidator.sig_py3_title && (
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
                <option value="Mrs">Mrs</option>
                <option value="Miss">Miss</option>
                <option value="Ms">Ms</option>
                <option value="Professor">Professor</option>
              </Form.Select>
              <FormError id="py3_title" />
            </div>
          )}

          {inputValidator.sig_py3_firstname && (
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

          {inputValidator.sig_py3_lastname && (
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

          {inputValidator.sig_py3_gender && genderList && (
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

          {inputValidator.sig_py3_dateofbirth && (
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

          {inputValidator.sig_py3_email && (
            <div>
              <label className="form-label required">Email</label>
              <input
                name="py3_email"
                value={formData.py3_email}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="Email"
                disabled
              />
            </div>
          )}

          {inputValidator.sig_py3_mobilephone && (
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

          {inputValidator.sig_py3_address1ine1 && (
            <div>
              <label className="required form-label">Home Address</label>
              <div style={{ position: "relative" }}>
                {!formData.py3_address1ine1 && (
                  <div style={{ position: "relative", width: "100%" }}>
                    <div
                      className="flex"
                      style={{
                        flex: 1,
                        height: ctaHeight,
                        position: "relative",
                        margin: "auto 0",
                      }}
                    >
                      <input
                        ref={address1Line1Ref}
                        name="search-input"
                        value={searchInput}
                        onChange={handleAddressLookup}
                        type="text"
                        className="form-control input"
                        placeholder="Address Line 1"
                      />
                      <div
                        className="input-group-text toggle-icon-color"
                        style={{
                          position: "absolute",
                          right: 0,
                          height: ctaHeight,
                          border: "none",
                          background: "transparent",
                          alignItems: "center",
                          color: colors.darkSilver,
                          cursor: "pointer",
                        }}
                      >
                        <ServeIcon />
                      </div>
                    </div>
                    <SearchDropDown
                      filter={addressData}
                      onClickHandler={handleSelectAddress}
                      height={230}
                    />
                  </div>
                )}
                {formData.py3_address1ine1 && (
                  <div className="form-control input">
                    <div className="flex-row">
                      <div
                        style={{
                          position: "relative",
                          width: "fit-content",
                          paddingRight: 15,
                        }}
                      >
                        {formData.py3_address1ine1}
                        <div
                          className="filter-icon"
                          style={{ top: -7 }}
                          onClick={handleClearAction}
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
              </div>
              <FormError id="py3_address1ine1" />
            </div>
          )}

          {inputValidator.sig_py3_addressline2 && (
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

          {inputValidator.sig_py3_addresstowncity && (
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

          {inputValidator.sig_py3_addresszippostalcode && (
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

          {inputValidator.sig_py3_addresscountystate && (
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

          {inputValidator.sig_py3_addresscountry && (
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

          {inputValidator.sig_bad_currentpost && (
            <div>
              <label className="required form-label">
                Post / Job Title details
              </label>
              <input
                name="bad_currentpost"
                value={formData.bad_currentpost}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="Current job title"
                // 📌 disable if bad_currentpost is true
                disabled={formData.dev_editable_job} // 📌 disable if bad_currentpost is in Dynamics
              />
              <div style={{ padding: "0.5em 0" }}>
                If you would like to change your job title please use the form
                on your dashboard.
              </div>
              <FormError id="bad_currentpost" />
            </div>
          )}

          {inputValidator.sig_py3_ntnno && (
            <div>
              <div className="flex-col">
                <label className="required form-label">
                  NTN Number (if NTN is not applicable, please state current
                  trainee route)
                </label>
              </div>
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

          {inputValidator.sig_py3_hospitalid && (
            <div>
              <label className="form-label required">
                Main Hospital / Place of Work / Medical School details
              </label>
              <div style={{ position: "relative" }}>
                {selectedHospital && (
                  <div
                    className="form-control input"
                    style={{
                      backgroundColor: canChangeHospital
                        ? "transparent"
                        : colors.disabled,
                    }}
                  >
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
                      placeholder="Main Hospital / Place of Work / Medical School details"
                    />
                    <FormError id="py3_hospitalid" />
                  </div>
                )}
                <SearchDropDown
                  filter={hospitalData}
                  onClickHandler={handleSelectHospital}
                  height={230}
                />
              </div>
              <div style={{ padding: "0.5em 0" }}>
                If you would like to change your Medical school / Place of work
                please use the form on your dashboard.
              </div>
            </div>
          )}

          {!isHospitalValue && (
            <div className="flex-col">
              <label className="form-label">
                Hospital / Medical School not listed
              </label>
              <input
                name="_bad_newhospitaladded"
                checked={formData._bad_newhospitaladded}
                onChange={handleInputChange}
                type="checkbox"
                className="form-check-input check-box"
              />
            </div>
          )}

          {formData._bad_newhospitaladded && (
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

          {formData._bad_newhospitaladded &&
            inputValidator.sig_sky_newhospitalname && (
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

          {inputValidator.sig_sky_cvurl && (
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

          {inputValidator.sig_bad_proposer1 && (
            <div>
              <label className="form-label">Supporting Member 1</label>
              <input
                name="bad_proposer1"
                value={formData.bad_proposer1}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="Name"
              />
              <FormError id="sky_cvurl" />
            </div>
          )}

          {inputValidator.sig_bad_proposer2 && (
            <div>
              <label className="form-label">Supporting Member 2</label>
              <input
                name="bad_proposer2"
                value={formData.bad_proposer2}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="Name"
              />
            </div>
          )}

          {/* SIG Questions -------------------------------------------- */}

          {inputValidator.sig_bad_isbadmember && (
            <div className="flex-col">
              <label className="form-label">Are you BAD member?</label>
              <Form.Select
                name="bad_isbadmember"
                value={formData.bad_isbadmember}
                onChange={handleInputChange}
                className="input"
              >
                <option value="" hidden>
                  Yes, No
                </option>
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </Form.Select>
            </div>
          )}

          {inputValidator.sig_bad_interestinfieldquestion && (
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
                placeholder={`Describe your interest in ${
                  selectedApplicationType || "Special Interest Group"
                }`}
              ></textarea>
            </div>
          )}

          {inputValidator.sig_bad_qualifications && (
            <div>
              <label className="form-label">Qualifications</label>
              <input
                name="bad_qualifications"
                value={formData.bad_qualifications}
                onChange={handleInputChange}
                type="text"
                className="form-control input"
                placeholder="Qualifications"
              />
            </div>
          )}

          {inputValidator.sig_py3_gmcnumber && (
            <div>
              <label className="required form-label">GMC / IMC number</label>
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

          {inputValidator.sig_py3_currentgrade && (
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

          {inputValidator.sig_bad_hasmedicallicence && (
            <div className="flex-col">
              <label className="form-label">
                License to practice medicine (Y/N)
              </label>
              <input
                name="_bad_hasmedicallicence"
                checked={formData._bad_hasmedicallicence}
                onChange={handleInputChange}
                type="checkbox"
                className="form-check-input check-box"
              />
            </div>
          )}

          {inputValidator.sig_py3_whatukbasedroleareyou && (
            <div style={{ paddingTop: "0.5em" }}>
              <label style={styles.subTitle} className="required form-label">
                UK / Overseas role
              </label>
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
              <FormError id="py3_whatukbasedroleareyou" />
            </div>
          )}

          {inputValidator.sig_py3_speciality && (
            <div>
              <label style={styles.subTitle} className="required form-label">
                Specialist Interest
              </label>
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
              <FormError id="py3_speciality" />
            </div>
          )}

          {inputValidator.sig_bad_otherjointclinics && (
            <div>
              <label className="form-label required">
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

          {inputValidator.sig_bad_mainareaofinterest && (
            <div>
              <label style={styles.subTitle} className="form-label">
                Main area of interest
              </label>
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

          {inputValidator.sig_bad_includeinthebssciiemaildiscussionforum && (
            <div className="flex-col" style={{ paddingTop: "0.5em" }}>
              <div className="flex">
                <div style={{ display: "grid", alignItems: "center" }}>
                  <input
                    name="_bad_includeinthebssciiemaildiscussionforum"
                    checked={
                      formData._bad_includeinthebssciiemaildiscussionforum
                    }
                    onChange={handleInputChange}
                    type="checkbox"
                    className="form-check-input check-box"
                  />
                </div>
                <label className="form-label">
                  Do you want to be included in the BSSCII discussion forum? If
                  yes, please tick and add your NHS address below
                </label>
              </div>

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

          {inputValidator.sig_bad_readpolicydocument &&
            !readPolicyDoc &&
            formData?.bad_categorytype && (
              <div>
                <div style={{ paddingTop: "0.5em" }}>
                  <Parcer
                    libraries={libraries}
                    html={`If you would like to find out more about the ${applicationType} privacy policy please contact <span class="title-link-animation" name="${contactEmail}" id="email-client">${contactEmail}</span>`}
                  />
                </div>
              </div>
            )}

          {inputValidator.sig_bad_readpolicydocument && !!readPolicyDoc && (
            <div>
              <div
                className="flex"
                style={{ alignItems: "center", paddingTop: "0.5em" }}
              >
                <div style={{ display: "grid" }}>
                  <input
                    name="_bad_readpolicydocument"
                    checked={formData._bad_readpolicydocument}
                    onChange={handleInputChange}
                    type="checkbox"
                    className="form-check-input check-box"
                  />
                </div>
                <div>
                  <label className="form-check-label">
                    <span className="required" /> Please confirm you have read
                    the {` ${applicationType} `}
                    <span
                      className="caps-btn-no-underline"
                      style={{
                        margin: "0 0.5em",
                        paddingTop: 4,
                      }}
                      onClick={() =>
                        setGoToAction({ state, path: readPolicyDoc, actions })
                      }
                    >
                      Privacy Policy
                    </span>
                  </label>
                  <FormError id="_bad_readpolicydocument" />
                </div>
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
