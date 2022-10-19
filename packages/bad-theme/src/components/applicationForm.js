import { Form } from "react-bootstrap";
import { FORM_CONFIG, colors } from "../context";
import CloseIcon from "@mui/icons-material/Close";
import SearchDropDown from "../components/searchDropDown";

export const ServeCvInput = ({
  form,
  name,
  documentRef,
  labelClass,
  Label,
  handleDocUploadChange,
}) => {
  return (
    <div style={{ order: FORM_CONFIG?.[name]?.order }}>
      <label className={labelClass}>{Label}</label>
      <div style={{ position: "relative" }}>
        {form.doc_file && (
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
            color: form.doc_file ? "transparent" : "black",
            background: "transparent",
            position: "absolute",
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
};

export const ServeEmailInput = ({
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
    <div style={{ order: FORM_CONFIG?.[name]?.order }}>
      <label className={labelClass}>{Label}</label>
      {type === "input" && (
        <input
          name={name}
          value={form[name] || value || ""}
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
          value={form[name] || value || ""}
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
    <div
      style={{
        order: FORM_CONFIG?.[name]?.order,
        position: "relative",
      }}
    >
      <label className={labelClass}>{Label}</label>
      {form.hospital_name && (
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
              {form.hospital_name}
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
      {!form.hospital_name && (
        <input
          name="hospital_lookup" // hospital name not passed to form submit object
          value={form.hospital_lookup}
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
    <div style={{ order: FORM_CONFIG?.[name]?.order }}>
      <div className="flex" style={{ alignItems: "center", margin: "1em 0" }}>
        <input
          name={name}
          value={name}
          checked={form[name] || value || false}
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
    <div style={{ order: FORM_CONFIG?.[name]?.order }}>
      <label className="form-label required">{Label}</label>
      <Form.Select
        name={name}
        value={form[name] || value || ""}
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
    <div>
      <label className={labelClass}>{Label}</label>
      <input
        name={name}
        value={form[name] || value || ""}
        onChange={handleInputChange}
        type="date"
        maxLength={MaxLength}
        placeholder={Label}
        className="form-control input"
      />
    </div>
  );
};
