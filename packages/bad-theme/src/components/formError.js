import { useState, useEffect } from "react";
import { connect } from "frontity";

const FormError = ({ state, actions, libraries, id, title }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

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
