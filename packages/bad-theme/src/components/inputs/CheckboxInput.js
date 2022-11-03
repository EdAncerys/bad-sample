import { connect } from "frontity";
// --------------------------------------------------------------------------------
import { FORM_CONFIG } from "../../config/form";
import ErrorComponent from "./ErrorComponent";
import Caption from "./Caption";

const CheckboxInput = ({
  form,
  name,
  labelClass,
  Label,
  value,
  onChange,
  Handler,
}) => {
  let inputLabel = Label;
  if (name === "bad_readpolicydocument" && form?.bad_categorytype) {
    let appName =
      form?.bad_categorytype.split(":")[1] || form?.bad_categorytype;
    inputLabel =
      "Please confirm you have read the " + appName + " policy document";
  }

  return (
    <div style={{ order: FORM_CONFIG?.[name]?.order, position: "relative" }}>
      <ErrorComponent name={name ?? ""} form={form} />

      <div
        className="flex"
        style={{ alignItems: "center", height: 40, margin: "10px 0" }}
      >
        <div>
          <div className="flex">
            <input
              name={name}
              value={name}
              // if form value is empty use value from props or empty string only once on first render
              checked={
                form?.[name] === undefined ? value || false : form?.[name]
              }
              onChange={onChange}
              type="checkbox"
              className="form-check-input check-box"
            />
          </div>
        </div>
        <div onClick={Handler} style={{ display: "flex" }}>
          <label
            className={labelClass}
            style={{ cursor: Handler ? "pointer" : "default", marginTop: 3 }}
          >
            {inputLabel}
          </label>
        </div>
      </div>

      <Caption caption={FORM_CONFIG?.[name]?.caption} />
    </div>
  );
};

export default connect(CheckboxInput);
