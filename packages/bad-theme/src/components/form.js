import connect from "@frontity/connect";
import {
  FORM_CONFIG,
  BAD_STEP_ONE_FORM_CONFIG,
  BAD_STEP_TWO_FORM_CONFIG,
  BAD_STEP_THREE_FORM_CONFIG,
  BAD_STEP_FOUR_FORM_CONFIG,
  BAD_STEP_FIVE_FORM_CONFIG,
} from "../config/form";
import {
  inputShowHandler,
  sigAppWPFilterHandler,
  dataExtractor,
} from "../helpers/inputHelpers";

import CvInput from "./inputs/CvInput";
import ApplicationTypeInput from "./inputs/ApplicationTypeInput";
import ProfileInput from "./inputs/ProfileInput";
import HospitalLookUplInput from "./inputs/HospitalLookUplInput";
import AddressLookUplInput from "./inputs/AddressLookUplInput";
import TextInput from "./inputs/TextInput";
import DateTimeInput from "./inputs/DateTimeInput";
import CheckboxInput from "./inputs/CheckboxInput";
import PickListInput from "./inputs/PickListInput";
import MultiCheckboxInput from "./inputs/MultiCheckboxInput";

const Form = ({
  form,
  application,
  onChange,
  documentRef,
  handleDocUploadChange,
  handleHospitalLookup,
  handleSelectHospital,
  handleClearHospital,
  handleAddressLookup,
  handleClearAddress,
  handleSelectAddress,
  multiSelectHandler,
  multiSelectDropDownHandler,
  // --------------------------------------------------------------------------------
  profilePictureRef,
  hospitalSearchRef,
  address1Line1Ref,
  // --------------------------------------------------------------------------------
  badApp,
  stepOne,
  stepTwo,
  stepThree,
  stepFour,
  stepFive,
}) => {
  // --------------------------------------------------------------------------------
  // 📌  Form Component
  // --------------------------------------------------------------------------------
  const hasCatSelections = (badApp && stepTwo) || !badApp;
  // --------------------------------------------------------------------------------
  // 🚫  Don't render until we have the application data
  // --------------------------------------------------------------------------------
  if (application?.length <= 1) return null;
  // dataExtractor({ application }); // 🚫  Don't render until we have the application data
  // get length of the object FORM_CONFIG
  console.log("⭐️ FORM_CONFIG LENGTH ⭐️", Object.keys(FORM_CONFIG).length);

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          margin: "0 auto",
          paddingBottom: 32,
          flexWrap: "wrap",
        }}
      >
        {hasCatSelections && (
          <ApplicationTypeInput form={form} onChange={onChange} />
        )}

        {application?.map(({ info, name, value, Label, cargo }, key) => {
          // --------------------------------------------------------------------------------
          // 📌  FORM_CONFIG - Configuration for form inputs & filtering
          // --------------------------------------------------------------------------------
          if (FORM_CONFIG?.[name]?.hidden) return null; // if hidden return null

          // --------------------------------------------------------------------------------
          // 📌  WP input validation based on client config
          // 👇 uncomment bellows to apply filtering
          // --------------------------------------------------------------------------------
          if (!sigAppWPFilterHandler({ form, name, badApp })) return null; // if input is not in filter return null
          if (!inputShowHandler({ form, name, badApp })) return null; // additional filter logic for inputs

          // --------------------------------------------------------------------------------
          // 📌  Form BAD application screen input config. Apply all allowed input types below
          // --------------------------------------------------------------------------------
          if (stepTwo && BAD_STEP_TWO_FORM_CONFIG?.[name] === undefined) {
            return null; // don't render any fields on step 2 that are not in the config
          }
          if (stepThree && BAD_STEP_THREE_FORM_CONFIG?.[name] === undefined) {
            return null;
          }
          if (stepFour && BAD_STEP_FOUR_FORM_CONFIG?.[name] === undefined) {
            return null;
          }
          if (stepFive && BAD_STEP_FIVE_FORM_CONFIG?.[name] === undefined) {
            return null;
          }

          // ⚠️ types handles the input type
          // String & Boolean & Pick list & DateTime & Memo
          // *Lookup (has variables)

          if (cargo) return null; // skip cargo blob

          Label = FORM_CONFIG?.[name]?.Label; // get label from config
          const AttributeType =
            info?.AttributeType || FORM_CONFIG?.[name]?.AttributeType;
          const MaxLength = info?.MaxLength || FORM_CONFIG?.[name]?.MaxLength;
          const Required = FORM_CONFIG?.[name]?.Required; // 👉 get required from config
          const Choices = info?.Choices || FORM_CONFIG?.[name]?.Choices || [];
          const Handler = FORM_CONFIG?.[name]?.Handler || null;
          const Link =
            form?.dev_selected_application_types?.[0]
              ?.sig_readpolicydocument_url_email ||
            FORM_CONFIG?.[name]?.Link ||
            null;

          const labelClass =
            Required === "None" ? "form-label" : "form-label required";

          if (name === "sky_cvurl") {
            return (
              <div
                key={key}
                style={{
                  order: FORM_CONFIG?.[name]?.order,
                  width: FORM_CONFIG?.[name]?.width || "100%",
                }}
              >
                <CvInput
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
              <div
                key={key}
                style={{
                  order: FORM_CONFIG?.[name]?.order,
                  width: FORM_CONFIG?.[name]?.width || "100%",
                }}
              >
                <ProfileInput
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
            // py3_hospitalid to fall back in id stored in dynamics
            // --------------------------------------------------------------------------------
            let disabled = false;
            if (value) disabled = true; // disable hospital input if user has hospital

            return (
              <div
                key={key}
                style={{
                  order: FORM_CONFIG?.[name]?.order,
                  width: FORM_CONFIG?.[name]?.width || "100%",
                }}
              >
                <HospitalLookUplInput
                  form={form}
                  name={name}
                  onChange={onChange}
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
              <div
                key={key}
                style={{
                  order: FORM_CONFIG?.[name]?.order,
                  width: FORM_CONFIG?.[name]?.width || "100%",
                }}
              >
                <AddressLookUplInput
                  form={form}
                  name={name}
                  labelClass={labelClass}
                  Label={Label}
                  onChange={handleAddressLookup}
                  MaxLength={MaxLength}
                  handleSelectAddress={handleSelectAddress}
                  handleClearAddress={handleClearAddress}
                  address1Line1Ref={address1Line1Ref}
                />
              </div>
            );
          }

          // --------------------------------------------------------------------------------
          // 📌  General input mapping
          // --------------------------------------------------------------------------------

          if (AttributeType === "String" || AttributeType === "Memo") {
            // TODO: py3_speciality to change to Picklist
            let disabled = false;
            if (name === "py3_email" && value) disabled = true; // disable email input if user has email
            if (name === "bad_currentpost" && value) disabled = true; // disable current post input if user has current post

            let type = "input";
            if (AttributeType === "Memo") type = "textarea";

            return (
              <div
                key={key}
                style={{
                  order: FORM_CONFIG?.[name]?.order,
                  width: FORM_CONFIG?.[name]?.width || "100%",
                }}
              >
                <TextInput
                  form={form}
                  name={name}
                  labelClass={labelClass}
                  Label={Label}
                  type={type}
                  disabled={disabled}
                  value={value}
                  onChange={onChange}
                  MaxLength={MaxLength}
                />
              </div>
            );
          }

          if (AttributeType === "DateTime") {
            return (
              <div
                key={key}
                style={{
                  order: FORM_CONFIG?.[name]?.order,
                  width: FORM_CONFIG?.[name]?.width || "100%",
                }}
              >
                <DateTimeInput
                  form={form}
                  name={name}
                  Label={Label}
                  value={value}
                  labelClass={labelClass}
                  onChange={onChange}
                  MaxLength={MaxLength}
                />
              </div>
            );
          }

          if (
            AttributeType === "Boolean" ||
            name === "bad_readpolicydocument" ||
            name === "bad_memberdirectory"
          ) {
            return (
              <div
                key={key}
                style={{
                  order: FORM_CONFIG?.[name]?.order,
                  width: FORM_CONFIG?.[name]?.width || "100%",
                }}
              >
                <CheckboxInput
                  form={form}
                  name={name}
                  labelClass={labelClass + " caps-btn-no-underline"} // 👉 add caps-btn-no-underline to checkbox label
                  Label={Label}
                  value={value}
                  onChange={onChange}
                  Handler={Handler}
                  Link={Link}
                />
              </div>
            );
          }

          if (
            AttributeType === "Picklist" ||
            name === "bad_preferredmailingaddress"
          ) {
            return (
              <div
                key={key}
                style={{
                  order: FORM_CONFIG?.[name]?.order,
                  width: FORM_CONFIG?.[name]?.width || "100%",
                }}
              >
                <PickListInput
                  form={form}
                  name={name}
                  Label={Label}
                  value={value}
                  onChange={onChange}
                  Choices={Choices}
                  labelClass={labelClass}
                />
              </div>
            );
          }

          if (AttributeType === "Virtual") {
            return (
              <div
                key={key}
                style={{
                  order: FORM_CONFIG?.[name]?.order,
                  width: FORM_CONFIG?.[name]?.width || "100%",
                }}
              >
                <MultiCheckboxInput
                  form={form}
                  name={name}
                  Label={Label}
                  value={value}
                  onChange={onChange}
                  labelClass={labelClass}
                  Choices={Choices}
                  multiSelectHandler={multiSelectHandler}
                  multiSelectDropDownHandler={multiSelectDropDownHandler}
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
    </div>
  );
};

export default connect(Form);
