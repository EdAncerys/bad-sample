import { connect } from "frontity";

const FormError = ({ state, actions, libraries, id, title }) => {
  let errorTitle = "Mandatory field";
  if (title) errorTitle = title;

  const idPlaceHolder = new Date().getTime().toString(36);

  // RETURN ---------------------------------------------
  return (
    <div
      id={`form-error-${id || idPlaceHolder}`}
      className="error-notification d-none"
    >
      <span className="required" /> {errorTitle}
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(FormError);
