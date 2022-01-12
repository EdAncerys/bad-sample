import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";

const FindDermatologistOptions = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const marginVertical = state.theme.marginVertical;

  // HELPERS ----------------------------------------------------------------
  const handlePreferenceUpdate = () => {
    const includeInFindDermatologist = document.querySelector(
      "#includeInFindDermatologist"
    ).checked;
    const mainHospitalWebAddress = document.querySelector(
      "#mainHospitalWebAddress"
    ).value;
    const privatePracticeWebAddressOne = document.querySelector(
      "#privatePracticeWebAddressOne"
    ).value;
    const privatePracticeWebAddressTwo = document.querySelector(
      "#privatePracticeWebAddressTwo"
    ).value;
    const privatePracticeWebAddressThree = document.querySelector(
      "#privatePracticeWebAddressThree"
    ).value;

    const aboutText = document.querySelector("#aboutText").value;
    const compositeText = document.querySelector("#compositeText").value;
    const contactBlurb = document.querySelector("#contactBlurb").value;

    const updatePreferences = {
      includeInFindDermatologist,
      mainHospitalWebAddress,
      privatePracticeWebAddressOne,
      privatePracticeWebAddressTwo,
      privatePracticeWebAddressThree,
      aboutText,
      compositeText,
      contactBlurb,
    };
    console.log("updatePreferences", updatePreferences);
  };

  // SERVERS ---------------------------------------------
  const ServeForm = () => {
    return (
      <div
        style={{
          display: "grid",
          padding: `2em 0 0`,
        }}
      >
        <div className="flex-col">
          <div>
            <div className="flex-row" style={styles.wrapper}>
              <input
                id="includeInFindDermatologist"
                type="checkbox"
                className="form-check-input"
                style={styles.checkBox}
              />
              <div style={styles.textInfo}>Include in Find a Dermatologist</div>
            </div>
          </div>

          <div style={{ paddingTop: `1em` }}>Website Address</div>
          <div>
            <div className="flex-col">
              <input
                id="mainHospitalWebAddress"
                type="text"
                className="form-control"
                placeholder="Main Hospital Web Address"
                style={styles.input}
              />
              <input
                id="privatePracticeWebAddressOne"
                type="text"
                className="form-control"
                placeholder="Private Practice Web Address 1"
                style={styles.input}
              />
              <input
                id="privatePracticeWebAddressTwo"
                type="text"
                className="form-control"
                placeholder="Private Practice Web Address 2"
                style={styles.input}
              />
              <input
                id="privatePracticeWebAddressThree"
                type="text"
                className="form-control"
                placeholder="Private Practice Web Address 3"
                style={styles.input}
              />
            </div>
          </div>

          <div style={{ paddingTop: `1em` }}>About Text</div>
          <div>
            <div className="flex-col">
              <textarea
                id="aboutText"
                type="text"
                className="form-control"
                placeholder="Find a Dermatologist About Text"
                rows="10"
                style={styles.input}
              />
              <textarea
                id="compositeText"
                type="text"
                className="form-control"
                placeholder="Composite Find A Dermatologist Text"
                rows="10"
                style={styles.input}
              />
              <textarea
                id="contactBlurb"
                type="text"
                className="form-control"
                placeholder="Contact Blurb"
                rows="10"
                style={styles.input}
              />
            </div>
          </div>
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
        <div
          type="submit"
          className="blue-btn"
          onClick={handlePreferenceUpdate}
        >
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
      <div className="primary-title" style={{ fontSize: 20 }}>
        Find a Dermatologist:
      </div>
      <ServeForm />
      <ServeActions />
    </div>
  );
};

const styles = {
  input: {
    borderRadius: 10,
    margin: `0.5em 0`,
  },
  checkBox: {
    borderRadius: "50%",
    width: 20,
    height: 20,
    paddingRight: 10,
    margin: `auto 0`,
  },
  textInfo: {
    fontSize: 12,
    paddingLeft: `1em`,
  },
  wrapper: {
    paddingTop: `1em`,
  },
};

export default connect(FindDermatologistOptions);
