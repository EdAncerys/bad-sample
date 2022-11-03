import { connect } from "frontity";
import { Form } from "react-bootstrap";
// --------------------------------------------------------------------------------
import { FORM_CONFIG } from "../../config/form";
import ErrorComponent from "./ErrorComponent";

const PickListInput = ({ form, name, Label, value, onChange, Choices }) => {
  return (
    <div style={{ order: FORM_CONFIG?.[name]?.order, position: "relative" }}>
      <label className="form-label required">{Label}</label>
      <ErrorComponent name={name ?? ""} form={form} />

      <Form.Select
        name={name}
        // if form value is empty use value from props or empty string only once on first render
        value={form?.[name] === undefined ? value || "" : form?.[name]}
        onChange={onChange}
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

export default connect(PickListInput);
