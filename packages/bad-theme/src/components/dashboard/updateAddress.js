import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";

const UpdateAddress = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const marginVertical = state.theme.marginVertical;

  // HELPERS ----------------------------------------------------------------
  const handleAddressUpdate = () => {
    const addressLineOne = document.querySelector("#addressLineOne").value;
    const addressLineTwo = document.querySelector("#addressLineTwo").value;
    const city = document.querySelector("#city").value;
    const country = document.querySelector("#country").value;
    const postcode = document.querySelector("#postcode").value;

    const updateAddress = {
      addressLineOne,
      addressLineTwo,
      city,
      country,
      postcode,
    };
    console.log("updateAddress", updateAddress);
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
          <label>Address Line 1</label>
          <input
            id="addressLineOne"
            type="text"
            className="form-control"
            placeholder="Address Line 1"
            style={styles.input}
          />
          <label>Address Line 2</label>
          <input
            id="addressLineTwo"
            type="text"
            className="form-control"
            placeholder="Address Line 2"
            style={styles.input}
          />
        </div>

        <div className="form-group" style={{ display: "grid", gap: 10 }}>
          <label>City</label>
          <input
            id="city"
            type="text"
            className="form-control"
            placeholder="City"
            style={styles.input}
          />
          <label>Country</label>
          <input
            id="country"
            type="text"
            className="form-control"
            placeholder="Country"
            style={styles.input}
          />
        </div>

        <div className="form-group" style={{ display: "grid", gap: 10 }}>
          <label>Post Code</label>
          <input
            id="postcode"
            type="text"
            className="form-control"
            placeholder="Post Code"
            style={styles.input}
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
        <div type="submit" className="blue-btn" onClick={handleAddressUpdate}>
          Update
        </div>
      </div>
    );
  };

  return (
    <div
      className="shadow"
      style={{ padding: `2em 4em`, marginBottom: `${marginVertical}px` }}
    >
      <div className="primary-title" style={{ fontSize: 36 }}>
        Address Details:
      </div>
      <ServeForm />
      <ServeActions />
    </div>
  );
};

const styles = {
  input: {
    borderRadius: 10,
    color: colors.darkSilver,
  },
};

export default connect(UpdateAddress);
