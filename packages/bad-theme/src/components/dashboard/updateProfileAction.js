import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";

const UpdateProfileAction = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const marginVertical = state.theme.marginVertical;

  // HELPERS ----------------------------------------------------------------
  const handleProfileUpdate = () => {
    const firstName = document.querySelector("#fistName").value;
    const lastName = document.querySelector("#lastName").value;
    const password = document.querySelector("#password").value;
    const email = document.querySelector("#email").value.toLowerCase();

    const updateCredentials = {
      firstName,
      lastName,
      email,
      password,
    };
    console.log("updateCredentials", updateCredentials);
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
          <label>Your First Name</label>
          <input
            id="fistName"
            type="text"
            className="form-control"
            placeholder="Your First Name"
            style={styles.input}
          />
          <label>Your Last Name</label>
          <input
            id="lastName"
            type="text"
            className="form-control"
            placeholder="Your Last Name"
            style={styles.input}
          />
        </div>

        <div className="form-group" style={{ display: "grid", gap: 10 }}>
          <label>Your Contact E-mail Address</label>
          <input
            id="email"
            type="email"
            className="form-control"
            placeholder="Your Contact E-mail Address"
            style={styles.input}
          />
          <label>Password</label>
          <input
            id="password"
            type="password"
            className="form-control"
            placeholder="Password"
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
        <div type="submit" className="blue-btn" onClick={handleProfileUpdate}>
          Save
        </div>
      </div>
    );
  };

  return (
    <div className="shadow" style={{ padding: `2em 4em` }}>
      <div className="primary-title" style={{ fontSize: 36 }}>
        Personal Details:
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

export default connect(UpdateProfileAction);
