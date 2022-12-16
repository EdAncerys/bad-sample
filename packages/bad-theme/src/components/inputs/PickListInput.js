import { connect } from "frontity";
import { Form } from "react-bootstrap";
// --------------------------------------------------------------------------------
import { FORM_CONFIG } from "../../config/form";
import ErrorComponent from "./ErrorComponent";
import { jobRoleHandler } from "../../helpers/inputHelpers";

const PickListInput = ({
  form,
  name,
  Label,
  value,
  onChange,
  Choices,
  labelClass,
  // 👉 dashboard widget
  dashboardWidget,
}) => {
  // --------------------------------------------------------------------------------
  // 📌  Extend Choises with custom options
  // --------------------------------------------------------------------------------

  if (name === "formus_staffgroupcategory" || name === "formus_jobrole") {
    console.log("⭐️ Choices ", Choices);
  }
  // ⚠️ css bug fix for formus_staffgroupcategory pick list
  let cssOverrides;
  if (name === "formus_staffgroupcategory") {
    cssOverrides = form?.[name];
  }

  return (
    <div style={{ order: FORM_CONFIG?.[name]?.order, position: "relative" }}>
      {Label && <label className={labelClass}>{Label}</label>}
      <ErrorComponent name={name ?? ""} form={form} />

      <Form.Select
        name={name}
        // if form value is empty use value from props or empty string only once on first render
        value={form?.[name] === undefined ? value || "" : form?.[name]}
        onChange={onChange}
        className="input"
        style={{ color: value || cssOverrides ? "inherit" : "#ced4da" }}
      >
        <option value="" hidden className="select-option-hidden">
          {Label || dashboardWidget || "Select"}
        </option>
        {Choices?.map(({ value, Label }, key) => {
          // --------------------------------------------------------------------------------
          // 📌  formus_jobrole picklist filtering handler
          // --------------------------------------------------------------------------------
          if (
            name === "formus_jobrole" &&
            !jobRoleHandler({ form, name, Label })
          ) {
            return null;
          }

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

export default connect(PickListInput);
