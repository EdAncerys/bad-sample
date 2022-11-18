import { connect } from "frontity";
// --------------------------------------------------------------------------------
import { FORM_CONFIG } from "../../config/form";
import ErrorComponent from "./ErrorComponent";

const CvInput = ({
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
      <ErrorComponent name={name ?? ""} form={form} />
      <div style={{ position: "relative", height: 40, overflow: "hidden" }}>
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
          {form?.dev_new_cv ?? "CV exists in database"}
        </label>
        <input
          ref={documentRef}
          onChange={handleDocUploadChange}
          name={name}
          type="file"
          className="form-control input"
          accept=".pdf,.doc,.docx"
          style={{
            color: "transparent",
            background: "transparent",
            position: "absolute",
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
};

export default connect(CvInput);
