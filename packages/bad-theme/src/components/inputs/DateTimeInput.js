import { connect } from "frontity";
// --------------------------------------------------------------------------------
import { FORM_CONFIG } from "../../config/form";
import ErrorComponent from "./ErrorComponent";

const DateTimeInput = ({
  form,
  name,
  Label,
  value,
  labelClass,
  onChange,
  MaxLength,
}) => {
  return (
    <div style={{ order: FORM_CONFIG?.[name]?.order, position: "relative" }}>
      <label className={labelClass}>{Label}</label>
      <ErrorComponent name={name ?? ""} form={form} />

      <input
        name={name}
        // if form value is empty use value from props or empty string only once on first render
        value={form?.[name] === undefined ? value || "" : form?.[name]}
        onChange={onChange}
        type="date"
        maxLength={MaxLength}
        placeholder={Label}
        className="form-control input"
      />
    </div>
  );
};

export default connect(DateTimeInput);
