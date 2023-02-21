import React, { useEffect, useState, useRef } from "react";
import { connect } from "frontity";

import BlockBuilder from "../components/builder/blockBuilder";
import {
  ServeCvInput,
  ServeTextInput,
  ServeHospitalLookUplInput,
  ServeCheckboxInput,
  ServePicklistInput,
  ServeDateTimeInput,
  ServeApplicationTypeInput,
  ServePictureInput,
  ServeAddressLookkUplInput,
} from "../components/applicationForm";
// --------------------------------------------------------------------------------
import {
  Parcer,
  useAppState,
  useAppDispatch,
  getUserStoreAction,
  FORM_CONFIG,
  getHospitalsAction,
  getHospitalNameAction,
  sendFileToS3Action,
  googleAutocomplete,
} from "../context";
import { getMembershipTypes } from "../helpers/inputHelpers";
// --------------------------------------------------------------------------------
import { Form } from "react-bootstrap";
import ActionPlaceholder from "../components/actionPlaceholder";

const BlocksPage = ({ state, libraries }) => {
  const data = state.source.get(state.router.link);
  const page = state.source[data.type][data.id];
  const wpBlocks = page.acf.blocks;
  // console.log("page data: ", page); // debug

  const { applicationData, isActiveUser } = useAppState();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({});
  const [appBlob, setAppBlob] = useState(null);
  const [appTypes, setAppTypes] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isFetching, setFetching] = useState(false);
  const documentRef = useRef(null);
  const profilePictureRef = useRef(null);
  const hospitalSearchRef = useRef("");
  const address1Line1Ref = useRef("");

  // --------------------------------------------------------------------------------
  // 📌 if env is dev, show the blocks.
  // --------------------------------------------------------------------------------
  if (state.auth.ENVIRONMENT !== "DEV") return null;
  let title = [];

  useEffect(() => {
    if (!isActiveUser) return null; // async user data fetch from Dynamics. If no user break

    // async fetch handler
    (async () => {
      try {
        const wpAppStore = await getMembershipTypes({ state });
        const userApp = await getUserStoreAction({ state, isActiveUser });
        let hospitalId = "";
        let hospitalName = "";
        let documentUrl = "";
        let profilePicture = "";

        // --------------------------------------------------------------------------------
        // 📌  Check if user have hospital id set in Dynamics. If not, set hospitalId to null
        //  Check for Doc URL in Dynamics. If not, set documentUrl to null
        // --------------------------------------------------------------------------------
        userApp.map((item) => {
          if (item.name === "py3_hospitalid" && item.value) {
            hospitalId = item.value;
          }
          if (item.name === "sky_cvurl" && item.value) {
            documentUrl = item.value;
          }
          if (item.name === "sky_profilepicture" && item.value) {
            profilePicture = item.value;
          }
        });

        if (hospitalId) {
          // --------------------------------------------------------------------------------
          // 📌  If hospitalId is set in dynamic fetch it hospital name to show in UI.
          // --------------------------------------------------------------------------------
          const hospitalData = await getHospitalNameAction({
            state,
            dispatch,
            id: hospitalId,
          });
          if (hospitalData) hospitalName = hospitalData.name;
        }

        const bad_categorytype = userApp?.[0]?.bad_categorytype
          ?.toLowerCase()
          ?.replace(/\s/g, "");
        const bad_organisedfor = userApp?.[0]?.bad_organisedfor;

        // --------------------------------------------------------------------------------
        // 📌 find all applications that match the user's category type selections
        // --------------------------------------------------------------------------------
        const appTypes = wpAppStore.filter((appBlob) => {
          // get application & strip all white spaces and make lowercase and replace - with ''
          const application = appBlob?.slug
            ?.toLowerCase()
            ?.replace(/\s/g, "")
            ?.replace(/-/g, "");

          return application?.includes(bad_categorytype); // return memberships that matches or includes any words in applicationType
        });

        // --------------------------------------------------------------------------------
        // 📌  Update state with blob values for UI render
        // --------------------------------------------------------------------------------
        setAppBlob(userApp);
        setAppTypes(appTypes);
        setForm({
          ...form,
          sky_newhospitalname: hospitalName, // set hospital name
          sky_cvurl: documentUrl, // set documentUrl to form
          sky_profilepicture: profilePicture, // set profilePicture to form
        });
      } catch (error) {
        // console.log("error: ", error);
      }
    })();
  }, [isActiveUser]);

  // --------------------------------------------------------------------------------
  const handleInputChange = async ({ target }) => {
    // --------------------------------------------------------------------------------
    // 📌  Handle input change for all inputs
    // --------------------------------------------------------------------------------
    const { name, value, type, checked } = target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSelectHospital = ({ item }) => {
    setForm((form) => ({
      ...form,
      dev_hospital_lookup: "",
      dev_hospital_data: null,
      sky_newhospitalname: item?.title,
      py3_hospitalid: item?.link,
    }));
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
    setForm((form) => ({
      ...form,
      py3_address1ine1: title,
      py3_addresscountry: countryCode,
      py3_addresstowncity: cityName,
    }));
  };

  const handleClearHospital = () => {
    hospitalSearchRef.current.value = ""; // clear search input
    handleInputChange({ target: { name: "sky_newhospitalname", value: "" } });
  };

  const handleClearAddress = () => {
    address1Line1Ref.current.value = ""; // clear search input
    handleInputChange({ target: { name: "py3_address1ine1", value: "" } });
  };

  const handleDocUploadChange = async (e) => {
    const { name, files } = e.target;
    let doc = files[0];
    if (!doc) return;

    try {
      setFetching(true);

      // upload file to S3 bucket and get url
      let url = await sendFileToS3Action({
        state,
        dispatch,
        attachments: doc,
      });

      let dev_name = name === "sky_cvurl" ? "dev_new_cv" : "dev_new_doc";
      setForm({ ...form, [name]: url, [dev_name]: true });
    } catch (error) {
      // console.log("🤖 error", error);
    } finally {
      setFetching(false);
    }
  };

  const handleHospitalLookup = async () => {
    // --------------------------------------------------------------------------------
    // 📌  Handle hospital lookup
    // --------------------------------------------------------------------------------
    const input = hospitalSearchRef.current.value;

    try {
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
      handleInputChange({
        target: { name: "dev_hospital_data", value: hospitalData },
      });
    } catch (error) {
      // console.log("error: ", error);
    }
  };

  const handleAddressLookup = async () => {
    // --------------------------------------------------------------------------------
    // 📌  Handle address lookup
    // --------------------------------------------------------------------------------
    const input = address1Line1Ref.current.value;

    try {
      const data = await googleAutocomplete({ input });

      // check for data returned form API
      if (data.length > 0) {
        // covert data to address format
        const formatedData = [];
        data.map((item) => {
          formatedData.push({ title: item.description, terms: item.terms });
        });

        handleInputChange({
          target: { name: "dev_address_data", value: formatedData },
        });
      } else {
        setAddressData(null);
      }
    } catch (error) {
      // console.log("error", error);
    } finally {
      setIsFetchingAddress(false);
    }
  };

  const FomShowButton = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: 16,
          background: "black",
          color: "white",
          borderRadius: 16,
          cursor: "pointer",
        }}
        onClick={() => {
          console.log("form: ", form);
        }}
      >
        Log Form
      </div>
    );
  };

  return (
    <div>
      <div className="flex-col" style={{ alignItems: "center" }}>
        <div className="flex primary-title">BLOCK BUILDER 😈</div>
        <div className="flex">
          <Parcer libraries={libraries} html={title} />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 600,
          margin: "0 auto",
          position: "relative",
          paddingBottom: 32,
        }}
      >
        <FomShowButton />
        {/* <ActionPlaceholder isFetching={true} background="pink" /> */}

        <ServeApplicationTypeInput
          form={form}
          appTypes={appTypes}
          handleInputChange={handleInputChange}
        />

        {appBlob?.map(({ info, name, value, Label, cargo }, key) => {
          // ⚠️ types handles the input type
          // String & Boolean & Picklist & DateTime & Memo
          // *Lookup (has variables)

          if (cargo) return null; // skip cargo blob
          // if (name !== "sky_cvurl") return null; // testing

          Label = FORM_CONFIG?.[name]?.Label || Label || info?.Label;
          const AttributeType =
            info?.AttributeType || FORM_CONFIG?.[name]?.AttributeType;
          const MaxLength = info?.MaxLength || FORM_CONFIG?.[name]?.MaxLength;
          const Required = info?.Required || FORM_CONFIG?.[name]?.Required;
          const Choices = info?.Choices || FORM_CONFIG?.[name]?.Choices || [];
          const Handler = FORM_CONFIG?.[name]?.Handler || null;

          const labelClass =
            Required === "None" ? "form-label" : "form-label required";

          if (name === "sky_cvurl") {
            return (
              <div key={key} style={{ order: FORM_CONFIG?.[name]?.order }}>
                <ServeCvInput
                  form={form}
                  name={name}
                  labelClass={labelClass}
                  documentRef={documentRef}
                  Label={Label}
                  handleDocUploadChange={handleDocUploadChange}
                />
              </div>
            );
          }

          if (name === "sky_profilepicture") {
            return (
              <div key={key} style={{ order: FORM_CONFIG?.[name]?.order }}>
                <ServePictureInput
                  form={form}
                  name={name}
                  profilePictureRef={profilePictureRef}
                  labelClass={labelClass}
                  Label={Label}
                  handleDocUploadChange={handleDocUploadChange}
                />
              </div>
            );
          }

          if (name === "py3_hospitalid") {
            // --------------------------------------------------------------------------------
            // 📌  Hospital lookup input with dropdown
            // py3_hospitalid to fall back in id soredd in dynamics
            // --------------------------------------------------------------------------------
            let disabled = false;
            if (value) disabled = true; // disable hospital input if user has hospital

            return (
              <div key={key} style={{ order: FORM_CONFIG?.[name]?.order }}>
                <ServeHospitalLookUplInput
                  form={form}
                  name={name}
                  labelClass={labelClass}
                  Label={Label}
                  disabled={disabled}
                  handleHospitalLookup={handleHospitalLookup}
                  MaxLength={MaxLength}
                  handleSelectHospital={handleSelectHospital}
                  handleClearHospital={handleClearHospital}
                  hospitalSearchRef={hospitalSearchRef}
                />
              </div>
            );
          }

          if (name === "py3_address1ine1") {
            // --------------------------------------------------------------------------------
            // 📌  Address lookup input with dropdown
            // --------------------------------------------------------------------------------

            return (
              <div key={key} style={{ order: FORM_CONFIG?.[name]?.order }}>
                <ServeAddressLookkUplInput
                  form={form}
                  name={name}
                  labelClass={labelClass}
                  Label={Label}
                  handleAddressLookup={handleAddressLookup}
                  MaxLength={MaxLength}
                  handleSelectAddress={handleSelectAddress}
                  handleClearAddress={handleClearAddress}
                  address1Line1Ref={address1Line1Ref}
                />
              </div>
            );
          }

          // --------------------------------------------------------------------------------
          // 📌  General inoput mapping
          // --------------------------------------------------------------------------------

          if (AttributeType === "String" || AttributeType === "Memo") {
            // TODO: py3_speciality to change to Picklist
            let disabled = false;
            if (name === "py3_email" && value) disabled = true; // disable email input if user has email
            if (name === "bad_currentpost" && value) disabled = true; // disable current post input if user has current post

            let type = "input";
            if (AttributeType === "Memo") type = "textarea";

            return (
              <div key={key} style={{ order: FORM_CONFIG?.[name]?.order }}>
                <ServeTextInput
                  form={form}
                  name={name}
                  labelClass={labelClass}
                  Label={Label}
                  type={type}
                  disabled={disabled}
                  value={value}
                  handleInputChange={handleInputChange}
                  MaxLength={MaxLength}
                />
              </div>
            );
          }

          if (AttributeType === "DateTime") {
            return (
              <div key={key} style={{ order: FORM_CONFIG?.[name]?.order }}>
                <ServeDateTimeInput
                  form={form}
                  name={name}
                  Label={Label}
                  value={value}
                  labelClass={labelClass}
                  handleInputChange={handleInputChange}
                  MaxLength={MaxLength}
                />
              </div>
            );
          }

          if (AttributeType === "Boolean") {
            const labelClass = "caps-btn-no-underline";

            return (
              <div key={key} style={{ order: FORM_CONFIG?.[name]?.order }}>
                <ServeCheckboxInput
                  form={form}
                  name={name}
                  labelClass={labelClass}
                  Label={Label}
                  value={value}
                  handleInputChange={handleInputChange}
                  Handler={Handler}
                />
              </div>
            );
          }

          if (AttributeType === "Picklist") {
            return (
              <div key={key} style={{ order: FORM_CONFIG?.[name]?.order }}>
                <ServePicklistInput
                  form={form}
                  name={name}
                  Label={Label}
                  value={value}
                  handleInputChange={handleInputChange}
                  Choices={Choices}
                />
              </div>
            );
          }

          // --------------------------------------------------------------------------------
          // 📌  Return null if no match
          // --------------------------------------------------------------------------------
          return null;
        })}
      </div>

      <BlockBuilder blocks={wpBlocks} block={{ facebook_link: "" }} />
    </div>
  );
};

export default connect(BlocksPage);
