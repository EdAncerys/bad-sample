import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";

import { muiQuery } from "../../context";
const PrivacyPreferences = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const { sm, md, lg, xl } = muiQuery();

  const marginVertical = state.theme.marginVertical;

  // HELPERS ----------------------------------------------------------------
  const handlePreferenceUpdate = () => {
    const badEmailAlerts = document.querySelector("#badEmailAlerts").checked;
    const badECircular = document.querySelector("#badECircular").checked;
    const badAlerts = document.querySelector("#badAlerts").checked;
    const presidentsBullate =
      document.querySelector("#presidentsBullate").checked;

    const phone = document.querySelector("#phone").checked;
    const email = document.querySelector("#email").checked;
    const badAllContactBlock = document.querySelector(
      "#badAllContactBlock"
    ).checked;

    const updatePreferences = {
      badEmailAlerts,
      badECircular,
      badAlerts,
      presidentsBullate,
      phone,
      email,
      badAllContactBlock,
    };
  };

  // SERVERS ---------------------------------------------
  const ServeForm = () => {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: !lg ? `1fr 1fr` : "1fr",
          gap: 20,
          padding: `2em 0 0`,
        }}
      >
        <div className="flex-col">
          <div>I am happy to receive:</div>
          <div>
            <div className="flex-row" style={styles.wrapper}>
              <input
                id="badEmailAlerts"
                type="checkbox"
                className="form-check-input check-box"
              />
              <div style={styles.textInfo}>BAD Email Alerts</div>
            </div>
          </div>
          <div>
            <div className="flex-row" style={styles.wrapper}>
              <input
                id="badECircular"
                type="checkbox"
                className="form-check-input check-box"
              />
              <div style={styles.textInfo}>BAD e-circular</div>
            </div>
          </div>
          <div>
            <div className="flex-row" style={styles.wrapper}>
              <input
                id="badAlerts"
                type="checkbox"
                className="form-check-input check-box"
              />
              <div style={styles.textInfo}>BAD Alerts</div>
            </div>
          </div>
          <div>
            <div className="flex-row" style={styles.wrapper}>
              <input
                id="presidentsBullate"
                type="checkbox"
                className="form-check-input check-box"
              />
              <div style={styles.textInfo}>President's Bulletin</div>
            </div>
          </div>
        </div>

        <div className="flex-col ">
          <div>I am happy to be contacted by:</div>
          <div>
            <div className="flex-row" style={styles.wrapper}>
              <input
                id="phone"
                type="checkbox"
                className="form-check-input check-box"
              />
              <div style={styles.textInfo}>Phone</div>
            </div>
          </div>
          <div>
            <div className="flex-row" style={styles.wrapper}>
              <input
                id="email"
                type="checkbox"
                className="form-check-input check-box"
              />
              <div style={styles.textInfo}>Email</div>
            </div>
          </div>

          <div style={{ paddingTop: `1em` }}>Universal unsubscribe:</div>
          <div>
            <div className="flex-row" style={styles.wrapper}>
              <input
                id="badAllContactBlock"
                type="checkbox"
                className="form-check-input check-box"
              />
              <div style={styles.textInfo}>
                Choose to universally unsubscribe from all BAD membership mass
                communications
              </div>
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
      style={{
        padding: !lg ? `2em 4em` : "1em",
        marginBottom: `${marginVertical}px`,
      }}
    >
      <div className="primary-title" style={{ fontSize: 20 }}>
        Privacy and contact preferences:
      </div>
      <ServeForm />
      <ServeActions />
    </div>
  );
};

const styles = {
  textInfo: {
    fontSize: 12,
    paddingLeft: `1em`,
  },
  wrapper: {
    paddingTop: `1em`,
  },
};

export default connect(PrivacyPreferences);
