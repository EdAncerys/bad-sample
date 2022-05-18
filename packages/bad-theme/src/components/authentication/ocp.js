import { useState, useEffect } from "react";
import { connect } from "frontity";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState } from "../../context";

const OCP = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  let scope = "admin"; // test var
  let inScope = ["admin", "sage"].includes(scope);

  if (!inScope) {
    return (
      <div className="row">
        <div className="col-md-3 offset-md-5">
          <h1 className="text-center">Disabled</h1>
          <p className="text-center">
            This page is currently disabled (your user may not have permission
            to view)
          </p>
        </div>
      </div>
    );
  }
  // doi/10.1111/bjd.21021
  return (
    <div className="row shadow">
      <div className="col-md-10 offset-md-1">
        <div className="row">
          <h2>OCP Page</h2>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(OCP);
