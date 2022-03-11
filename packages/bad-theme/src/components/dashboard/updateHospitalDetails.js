import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
// CONTEXT ----------------------------------------------------------------
import { useAppState } from "../../context";

const UpdateHospitalDetails = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const { isActiveUser } = useAppState();

  const marginVertical = state.theme.marginVertical;

  // HELPERS ----------------------------------------------------------------
  const handleHospitalUpdate = () => {
    const hospitalName = document.querySelector("#hospitalName").value;
    const jobTitle = document.querySelector("#jobTitle").value;

    const updateHospital = {
      hospitalName,
      jobTitle,
    };
    console.log("updateHospital", updateHospital);
  };

  // SERVERS ---------------------------------------------
  const ServeForm = () => {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `1fr 1fr`,
          gap: 20,
          padding: `1em 0 0`,
        }}
      >
        <div className="form-group" style={{ display: "grid", gap: 10 }}>
          <label>Hospital Name</label>
          <input
            id="hospitalName"
            type="text"
            className="form-control"
            placeholder="Hospital Name"
            defaultValue={isActiveUser.bad_mainhosptialweb}
            style={styles.input}
            readOnly
          />
        </div>

        <div className="form-group" style={{ display: "grid", gap: 10 }}>
          <label>Job Title</label>
          <input
            id="jobTitle"
            type="text"
            className="form-control"
            placeholder="Job Title"
            defaultValue={isActiveUser.jobtitle}
            style={styles.input}
            readOnly
          />
        </div>
      </div>
    );
  };

  const ServeActions = () => {
    return (
      <div
        className="flex"
        style={{ justifyContent: "flex-end", padding: `2em 0 0` }}
      >
        <div type="submit" className="blue-btn" onClick={handleHospitalUpdate}>
          Request To Edit
        </div>
      </div>
    );
  };

  return (
    <div
      className="shadow"
      style={{ padding: `2em 4em`, marginBottom: `${marginVertical}px` }}
    >
      <div className="primary-title" style={{ fontSize: 20 }}>
        Professional Information:
      </div>
      <ServeForm />
      <ServeActions />
    </div>
  );
};

const styles = {
  input: {
    borderRadius: 10,
  },
};

export default connect(UpdateHospitalDetails);
