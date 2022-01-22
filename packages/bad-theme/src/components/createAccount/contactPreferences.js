import { useState, useEffect } from "react";
import { connect } from "frontity";
import { Modal } from "react-bootstrap";

import { colors } from "../../config/imports";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, setCreateAccountModalAction } from "../../context";

const ContactPreferences = ({
  state,
  actions,
  formComplete,
  setFormComplete,
  setFormSubmitted,
}) => {
  if (!formComplete) return null;
  const dispatch = useAppDispatch();

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    return (
      <Modal.Footer>
        <button
          type="submit"
          className="btn btn-outline-secondary"
          onClick={() => setFormComplete(false)}
        >
          Back
        </button>

        <button
          type="submit"
          className="btn"
          style={{ backgroundColor: colors.primary, color: colors.white }}
          onClick={() => {
            setFormComplete(false);
            setFormSubmitted(true);

            // resetting the state & closing the module with time out
            setTimeout(() => {
              setCreateAccountModalAction({
                dispatch,
                createAccountAction: true,
              });
            }, 2000);
            setTimeout(() => {
              setFormSubmitted(false);
            }, 2500);
          }}
        >
          Confirm
        </button>
      </Modal.Footer>
    );
  };

  const ServeContent = () => {
    return (
      <div style={{ marginTop: `3em` }}>
        <div className="primary-title" style={{ fontSize: 20 }}>
          Contact Preferences:
        </div>
        <div style={{ color: colors.darkSilver, margin: `1em 0` }}>
          You can change these preferences at any time via your Members
          Dashboard
        </div>

        <div className="flex mb-3 form-check">
          <div className="flex">
            <div>
              <input
                type="checkbox"
                className="form-check-input"
                style={styles.checkBox}
              />
            </div>
            <div>
              <label className="form-check-label">
                I would like to receive the Members Bulletin
              </label>
            </div>
          </div>
        </div>
        <div className="flex mb-3 form-check">
          <div className="flex">
            <div>
              <input
                type="checkbox"
                className="form-check-input"
                style={styles.checkBox}
              />
            </div>
            <div>
              <label className="form-check-label">
                I would like to receive the BAD Newsletter
              </label>
            </div>
          </div>
        </div>
        <div className="flex mb-3 form-check">
          <div className="flex">
            <div>
              <input
                type="checkbox"
                className="form-check-input"
                style={styles.checkBox}
              />
            </div>
            <div>
              <label className="form-check-label">
                I would like to receive the Lorem ipsum dolor sit amet
              </label>
            </div>
          </div>
        </div>
        <div className="flex mb-3 form-check">
          <div className="flex">
            <div>
              <input
                type="checkbox"
                className="form-check-input"
                style={styles.checkBox}
              />
            </div>
            <div>
              <label className="form-check-label">
                I would like to receive the Lorem ipsum dolor sit amet
              </label>
            </div>
          </div>
        </div>

        <div className="divider mt-4 mb-4" />

        <div className="flex mb-3 form-check">
          <div className="flex">
            <div>
              <input
                type="checkbox"
                className="form-check-input"
                style={styles.checkBox}
              />
            </div>
            <div>
              <label className="form-check-label">
                I have read the{" "}
                <span
                  style={styles.TC}
                  onClick={() =>
                    setCreateAccountModalAction({
                      dispatch,
                      createAccountAction: true,
                    })
                  }
                >
                  BAD Constitution
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex mb-3 form-check">
          <div className="flex">
            <div>
              <input
                type="checkbox"
                className="form-check-input"
                style={styles.checkBox}
              />
            </div>
            <div>
              <label className="form-check-label">
                <span
                  style={styles.TC}
                  onClick={() =>
                    setCreateAccountModalAction({
                      dispatch,
                      createAccountAction: true,
                    })
                  }
                >
                  I agree - GDPR
                </span>{" "}
                - justo donec enim diam vulputate ut pharetra sit. Purus semper
                eget duis at tellus at. Sed adipiscing diam.
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------
  return (
    <div className="flex m-4" style={{ flex: 2, paddingRight: `2em` }}>
      <div className="flex-col">
        <Modal.Body style={{ padding: 0 }}>
          <ServeContent />
        </Modal.Body>
        <ServeActions />
      </div>
    </div>
  );
};

const styles = {
  formContainer: {
    display: "grid",
    gridTemplateColumns: `repeat(2, 1fr)`,
    justifyContent: "space-between",
    gap: 20,
    margin: `2em 0 2em 0`,
  },
  TC: {
    textDecoration: "underline",
    textUnderlineOffset: 5,
    cursor: "pointer",
  },
  checkBox: {
    borderRadius: "50%",
    width: 20,
    height: 20,
    marginRight: 10,
  },
};

export default connect(ContactPreferences);
