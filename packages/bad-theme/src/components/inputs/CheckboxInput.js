import { connect } from "frontity";
// --------------------------------------------------------------------------------
import { FORM_CONFIG } from "../../config/form";
import ErrorComponent from "./ErrorComponent";
import Caption from "./Caption";

const CheckboxInput = ({
  state,
  form,
  name,
  labelClass,
  Label,
  value,
  onChange,
  Handler, // 📌 handler for custom logic
  Link, // 📌 link to redirect page
}) => {
  let inputLabel = Label;
  if (name === "bad_readpolicydocument" && form?.bad_categorytype) {
    let appName =
      form?.bad_categorytype.split(":")[1] || form?.bad_categorytype;
    // ⚠️ overwrite all policies with BAD policy name
    appName = "BAD`S";

    // ⚠️ DermpathPRO policy name overwrite
    if (form?.bad_categorytype === "Full:DermpathPRO Trainee") {
      appName = "DermpathPRO";
    }

    inputLabel =
      "Please confirm you have read the " + appName + " policy document";
  }

  // --------------------------------------------------------------------------------
  // 📌  if user have dev_has_hospital_id set to true & nodnt render bad_newhospitaladded
  // --------------------------------------------------------------------------------
  if (name === "bad_newhospitaladded" && form?.dev_has_hospital_id) {
    return null;
  }

  const onLinkHandler = () => {
    let url = state.auth.APP_URL + Link;
    // ⚠️ if link includes http use link
    if (Link?.includes("http")) url = Link;
    Handler?.();
    if (Link) window.open(url, "_blank"); // open privacy policy in new window
  };

  return (
    <div style={{ order: FORM_CONFIG?.[name]?.order, position: "relative" }}>
      <ErrorComponent name={name ?? ""} form={form} />

      <div
        className="flex"
        style={{ alignItems: "center", height: 40, marginTop: "10px" }}
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
        <div onClick={onLinkHandler} style={{ display: "flex" }}>
          <label
            className={labelClass}
            style={{
              cursor: Handler || Link ? "pointer" : "default",
              marginTop: 3,
            }}
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
