import { Form } from "react-bootstrap";
import Image from "@frontity/components/image";
// --------------------------------------------------------------------------------
import { FORM_CONFIG, colors } from "../context";
import CloseIcon from "@mui/icons-material/Close";
import SearchDropDown from "../components/searchDropDown";
import Avatar from "../img/svg/profile.svg";

// --------------------------------------------------------------------------------
// 📌  Form Input components & helpers
// --------------------------------------------------------------------------------

const ServeDevInfo = ({ name, type }) => {
  if (false) return null; // dev mode

  return (
    <div
      className="flex"
      style={{
        color: "red",
        fontSize: 12,
        position: "absolute",
        bottom: -20,
        right: 0,
      }}
    >
      <div>{name}</div>
      {type && <div style={{ margin: "0 5px", color: "green" }}>{type}</div>}
    </div>
  );
};

export const dataExtractor = ({ appBlob }) => {
  // --------------------------------------------------------------------------------
  // 📌  Extract data from user application blob
  // --------------------------------------------------------------------------------
  let blob = {};

  appBlob?.map((appBlob) => {
    blob = {
      ...blob,
      [appBlob.name]: {
        Label: appBlob?.info?.Label || "Input Lapbel",
        AttributeType: appBlob?.info?.AttributeType || "",
        MaxLength: appBlob?.info?.MaxLength || 100,
        Required: appBlob?.info?.Required || "None",
        order: 0,
      },
    };
    // console.log("🐞 ", appBlob);
  });

  console.log("🐞 blob", JSON.stringify(blob));
};

export const ServeApplicationTypeInput = ({
  form,
  appTypes,
  handleInputChange,
}) => {
  return (
    <div style={{ order: 0 }}>
      <label className="form-label required">
        Please select the Special Interest Group you would like to apply for:
      </label>
      <Form.Select
        name="bad_categorytype"
        value={form?.bad_categorytype || ""}
        onChange={handleInputChange}
        className="form-control input"
      >
        <option value="" hidden>
          Membership Category
        </option>
        {appTypes?.map(({ acf }, key) => {
          const category_types = acf?.category_types;
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
    </div>
  );
};

export const ServePictureInput = ({
  form,
  name,
  profilePictureRef, // reference to file url for input
  labelClass,
  Label,
  handleDocUploadChange,
}) => {
  console.log("🐞 documentRef value", profilePictureRef?.current?.file);

  return (
    <div style={{ order: FORM_CONFIG?.[name]?.order, position: "relative" }}>
      <label className={labelClass}>{Label}</label>
      <ServeDevInfo name={name ?? ""} />

      <div
        style={{
          width: 260,
          height: 260,
          borderRadius: "50%",
          overflow: "hidden",
          // add border if image set by user
          border: form?.sky_profilepicture
            ? `1px solid ${colors.silver}`
            : "none",
        }}
      >
        <Image
          src={form?.sky_profilepicture || Avatar}
          alt="Profile Avatar"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      <label className={labelClass}>{Label}</label>
      <div style={{ position: "relative", height: 40 }}>
        {!form?.dev_new_doc && (
          <label
            style={{
              position: "absolute",
              left: 120,
              height: 40,
              display: "flex",
              alignItems: "center",
              zIndex: 1,
            }}
            className="caps-btn-no-underline"
          >
            Profile picture exists in database
          </label>
        )}

        <input
          ref={profilePictureRef}
          name={name}
          onChange={handleDocUploadChange}
          type="file"
          className="form-control input"
          placeholder="Profile Photo"
          accept="image/png, image/jpeg"
          style={{
            color: form?.dev_new_doc ? "black" : "transparent",
            background: "transparent",
            position: "absolute",
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
};

export const ServeCvInput = ({
  form,
  name,
  documentRef, // reference to file url for input
  labelClass,
  Label,
  handleDocUploadChange,
}) => {
  return (
    <div style={{ order: FORM_CONFIG?.[name]?.order, position: "relative" }}>
      <label className={labelClass}>{Label}</label>
      <ServeDevInfo name={name ?? ""} />
      <div style={{ position: "relative", height: 40 }}>
        {!form?.dev_new_cv && (
          <label
            style={{
              position: "absolute",
              left: 120,
              height: 40,
              display: "flex",
              alignItems: "center",
              zIndex: 1,
            }}
            className="caps-btn-no-underline"
          >
            CV exists in database
          </label>
        )}
        <input
          ref={documentRef}
          onChange={handleDocUploadChange}
          name={name}
          type="file"
          className="form-control input"
          accept=".pdf,.doc,.docx"
          style={{
            color: form?.dev_new_cv ? "black" : "transparent",
            background: "transparent",
            position: "absolute",
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
};

export const ServeTextInput = ({
  form,
  name,
  labelClass,
  Label,
  type,
  value,
  handleInputChange,
  MaxLength,
  disabled,
}) => {
  return (
    <div style={{ order: FORM_CONFIG?.[name]?.order, position: "relative" }}>
      <label className={labelClass}>{Label}</label>
      <ServeDevInfo name={name ?? ""} type={type} />

      {type === "input" && (
        <input
          name={name}
          // if form value is empty use value from props or empty string only once on first render
          value={form?.[name] === undefined ? value || "" : form?.[name]}
          onChange={handleInputChange}
          type="text"
          maxLength={MaxLength}
          placeholder={Label}
          className="form-control input"
          disabled={disabled}
        />
      )}
      {type === "textarea" && (
        <textarea
          name={name}
          // if form value is empty use value from props or empty string only once on first render
          value={form?.[name] === undefined ? value || "" : form?.[name]}
          onChange={handleInputChange}
          type="text"
          maxLength={MaxLength}
          placeholder={Label}
          className="form-control input"
          disabled={disabled}
        />
      )}

      {FORM_CONFIG?.[name]?.caption && (
        <div style={{ margin: "0.5em 0" }}>{FORM_CONFIG?.[name]?.caption}</div>
      )}
    </div>
  );
};

export const ServeHospitalLookUplInput = ({
  form,
  name,
  labelClass,
  Label,
  disabled,
  handleInputChange,
  hospitalData,
  handleSelectHospital,
  MaxLength,
  handleClearHospital,
}) => {
  return (
    <div style={{ order: FORM_CONFIG?.[name]?.order, position: "relative" }}>
      <label className={labelClass}>{Label}</label>
      <ServeDevInfo name={name ?? ""} />

      {form?.sky_newhospitalname && (
        <div
          className="form-control input"
          style={{
            backgroundColor: !disabled ? "transparent" : colors.disabled,
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
              {form?.sky_newhospitalname}
              {!disabled && (
                <div
                  className="filter-icon"
                  style={{ top: -5 }}
                  onClick={handleClearHospital}
                >
                  <CloseIcon
                    style={{
                      fill: colors.darkSilver,
                      padding: 0,
                      width: 15,
                      height: 15,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {!form?.sky_newhospitalname && (
        <input
          name="dev_hospital_name" // hospital name not passed to form submit object
          value={form?.dev_hospital_name}
          onChange={handleInputChange}
          type="text"
          maxLength={MaxLength}
          placeholder={Label}
          className="form-control input"
          disabled={disabled}
        />
      )}
      {hospitalData && (
        <SearchDropDown
          filter={hospitalData}
          onClickHandler={handleSelectHospital}
          height={230}
        />
      )}
    </div>
  );
};

export const ServeCheckboxInput = ({
  form,
  name,
  labelClass,
  Label,
  value,
  handleInputChange,
  Handler,
}) => {
  return (
    <div style={{ order: FORM_CONFIG?.[name]?.order, position: "relative" }}>
      <ServeDevInfo name={name ?? ""} />

      <div className="flex" style={{ alignItems: "center", margin: "1em 0" }}>
        <input
          name={name}
          value={name}
          // if form value is empty use value from props or empty string only once on first render
          checked={form?.[name] === undefined ? value || false : form?.[name]}
          onChange={handleInputChange}
          type="checkbox"
          className="form-check-input check-box"
        />
        <div onClick={Handler} style={{ display: "flex" }}>
          <label
            className={labelClass}
            style={{ cursor: Handler ? "pointer" : "default" }}
          >
            {Label}
          </label>
        </div>
      </div>
    </div>
  );
};

export const ServePicklistInput = ({
  form,
  name,
  Label,
  value,
  handleInputChange,
  Choices,
}) => {
  return (
    <div style={{ order: FORM_CONFIG?.[name]?.order, position: "relative" }}>
      <label className="form-label required">{Label}</label>
      <ServeDevInfo name={name ?? ""} />

      <Form.Select
        name={name}
        // if form value is empty use value from props or empty string only once on first render
        value={form?.[name] === undefined ? value || "" : form?.[name]}
        onChange={handleInputChange}
        className="input"
      >
        <option value="" hidden>
          {Label}
        </option>
        {Choices.map(({ value, Label }, key) => {
          return (
            <option key={key} value={value}>
              {Label}
            </option>
          );
        })}
      </Form.Select>
    </div>
  );
};

export const ServeDateTimeInput = ({
  form,
  name,
  Label,
  value,
  labelClass,
  handleInputChange,
  MaxLength,
}) => {
  return (
    <div style={{ order: FORM_CONFIG?.[name]?.order, position: "relative" }}>
      <label className={labelClass}>{Label}</label>
      <ServeDevInfo name={name ?? ""} />

      <input
        name={name}
        // if form value is empty use value from props or empty string only once on first render
        value={form?.[name] === undefined ? value || "" : form?.[name]}
        onChange={handleInputChange}
        type="date"
        maxLength={MaxLength}
        placeholder={Label}
        className="form-control input"
      />
    </div>
  );
};
