import { connect } from "frontity";
// --------------------------------------------------------------------------------
import { FORM_CONFIG } from "../../config/form";
import ErrorComponent from "./ErrorComponent";
import Caption from "./Caption";

const TextInput = ({
  form,
  name,
  labelClass,
  Label,
  type,
  value,
  onChange,
  MaxLength,
  disabled,
}) => {
  let inputLabel = Label;
  if (name === "bad_interestinfieldquestion" && form?.bad_categorytype) {
    let appName =
      form?.bad_categorytype.split(":")[1] || form?.bad_categorytype;
    inputLabel = inputLabel + " in " + appName;
  }

  return (
    <div style={{ order: FORM_CONFIG?.[name]?.order, position: "relative" }}>
      {inputLabel && <label className={labelClass}>{inputLabel}</label>}
      <ErrorComponent name={name ?? ""} type={type} form={form} />

      {type === "input" && (
        <input
          name={name}
          // if form value is empty use value from props or empty string only once on first render
          value={form?.[name] === undefined ? value || "" : form?.[name]}
          onChange={onChange}
          type="text"
          maxLength={MaxLength}
          placeholder={Label || FORM_CONFIG?.[name]?.Placeholder}
          className="form-control input"
          disabled={disabled}
        />
      )}
      {type === "textarea" && (
        <textarea
          name={name}
          // if form value is empty use value from props or empty string only once on first render
          value={form?.[name] === undefined ? value || "" : form?.[name]}
          onChange={onChange}
          type="text"
          maxLength={MaxLength}
          placeholder={Label || FORM_CONFIG?.[name]?.Placeholder}
          className="form-control input"
          disabled={disabled}
        />
      )}

      <Caption caption={FORM_CONFIG?.[name]?.caption} />
    </div>
  );
};

export default connect(TextInput);
