import { connect } from "frontity";
import { FORM_CONFIG } from "../../config/form";

const ErrorComponent = ({ form, name, type }) => {
  // --------------------------------------------------------------------------------
  // 📌  Error helper
  // --------------------------------------------------------------------------------
  // determine if the field has an error
  const hasError = form?.["error_" + name];
  if (!hasError) return null; // dev mode

  const Info = () => {
    // --------------------------------------------------------------------------------
    // 📌  Additional content info for error message
    // --------------------------------------------------------------------------------
    return (
      <div
        className="flex"
        style={{
          color: "red",
          fontSize: 12,
          position: "absolute",
          top: 10,
          right: 0,
        }}
      >
        <div>{name}</div>
        <div style={{ margin: "0 5px", color: "blue", fontWeight: "bold" }}>
          {FORM_CONFIG?.[name]?.order}
        </div>
        {type && <div style={{ margin: "0 5px", color: "green" }}>{type}</div>}
      </div>
    );
  };

  return (
    <div>
      {/* <Info /> */}
      <div
        className="flex required"
        style={{
          color: "red",
          fontSize: 12,
          position: "absolute",
          bottom: -24,
          right: 0,
        }}
      >
        <div>Required</div>
      </div>
    </div>
  );
};

export default connect(ErrorComponent);
