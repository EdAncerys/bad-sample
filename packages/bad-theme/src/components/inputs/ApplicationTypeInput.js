import { connect } from "frontity";
import { Form } from "react-bootstrap";
// --------------------------------------------------------------------------------
import ErrorComponent from "./ErrorComponent";

const ApplicationTypeInput = ({ form, onChange }) => {
  const isBAD = form?.bad_organisedfor === "810170000";
  // if bad_categorytype have ":" return all after ":" otherwise return
  const categoryType =
    form?.bad_categorytype?.split(":")[1] || form?.bad_categorytype;

  return (
    <div
      style={{
        order: -99,
        position: "relative",
        width: "100%",
        marginTop: `1em`,
        paddingTop: `1em`,
        borderTop: `1px solid #E3E7EA`,
      }}
    >
      {!form?.bad_categorytype && (
        <label className="form-label required">
          {form?.bad_organisedfor === "810170000" && "Membership Category"}
          {form?.bad_organisedfor === "810170001" &&
            "Please select the Special Interest Group you would like to apply for:"}
        </label>
      )}
      {form?.bad_categorytype && (
        <label className="form-label">
          {isBAD ? "BAD -" : "SIG -"} {categoryType}
        </label>
      )}
      <ErrorComponent name="bad_categorytype" form={form} />
      <Form.Select
        name="bad_categorytype"
        value={form?.bad_categorytype || ""}
        onChange={onChange}
        className="form-control input"
        style={{ color: form?.bad_categorytype ? "inherit" : "#ced4da" }}
      >
        <option value="" hidden>
          Membership Category
        </option>
        {form?.dev_selected_application_types?.map(({ acf }, key) => {
          const category_types = acf?.category_types;
          // get SIG membership categories name from custom object
          // split string on : and swap first and second value
          // if typeName includes Full replace with empty string
          // change prefix for names with " - ", eg. "Tarainee - Time"
          let typeName = category_types.split(":").reverse().join(" - ");
          // ⚠️ if value include - Full replace with empty string
          typeName = typeName.replace(" - Full", "");
          // ⚠️ replace Associate Trainee with Trainee
          typeName = typeName.replace("Associate Trainee", "Trainee");

          // --------------------------------------------------------------------------------
          // ⚠️ don't show "Retired" applications in UI
          // --------------------------------------------------------------------------------
          if (typeName === "Retired" || typeName === "Retired No Journal")
            return null;

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

export default connect(ApplicationTypeInput);
