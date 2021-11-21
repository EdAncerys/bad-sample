import React, { useState, useEffect } from "react";
import { connect } from "frontity";
import { Modal } from "react-bootstrap";

import { colors } from "../config/colors";

const EnquireModal = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const enquireAction = state.context.enquireAction;

  console.log("enquireAction", enquireAction);

  // SERVERS --------------------------------------------------
  const ServeModalContent = () => {
    const ServeForm = () => {
      return (
        <form>
          <div style={{ margin: `1em 0` }}>
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" />
          </div>
          <div style={{ margin: `1em 0` }}>
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" />
          </div>
          <div style={{ margin: `1em 0` }}>
            <label className="form-label">Phone Number</label>
            <input type="number" className="form-control" />
          </div>
          <div style={{ margin: `1em 0` }}>
            <label className="form-label">Subject</label>
            <input type="text" className="form-control" />
          </div>
          <div style={{ margin: `1em 0` }}>
            <label className="form-label">Reason For Enquiry</label>
            <input type="text" className="form-control" />
          </div>
          <div style={{ margin: `1em 0` }}>
            <label className="form-label">Message</label>
            <textarea type="text" rows="3" className="form-control" />
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
                    onClick={actions.context.setCreateAccountAction}
                  >
                    I agree
                  </span>{" "}
                  - justo donec enim diam vulputate ut pharetra sit. Purus
                  semper eget duis at tellus at. Sed adipiscing diam.
                </label>
              </div>
            </div>
          </div>
        </form>
      );
    };

    const ServeFormInfo = () => {
      return (
        <div
          style={{
            borderBottom: `1px solid ${colors.darkSilver}`,
            padding: `0.5em 0 1em`,
            margin: `2em 0`,
          }}
        >
          <h4>Enquire About Education & Training </h4>
        </div>
      );
    };

    const ServeActions = () => {
      return (
        <Modal.Footer style={{ justifyContent: "flex-start" }}>
          <button
            type="submit"
            className="btn"
            style={{ backgroundColor: colors.primary, color: colors.white }}
            onClick={actions.context.setEnquireAction}
          >
            Send Enquiry
          </button>
        </Modal.Footer>
      );
    };

    return (
      <div className="flex m-4" style={{ flex: 2, paddingRight: `2em` }}>
        <div className="flex-col">
          <Modal.Body>
            <ServeFormInfo />
            <ServeForm />
          </Modal.Body>
          <ServeActions />
        </div>
      </div>
    );
  };

  const ServeModalInfo = () => {
    return (
      <div
        className="flex"
        style={{
          backgroundColor: colors.lightSilver,
        }}
      >
        <Modal.Body>
          <div
            style={{
              borderBottom: `1px solid ${colors.darkSilver}`,
              padding: `1em 1em 1em 0`,
              margin: `3em 1em`,
            }}
          >
            <h4>Contact Details</h4>
          </div>
          <div
            style={{
              padding: `0 1em 1em 0`,
              margin: `3em 1em`,
            }}
          >
            <div style={styles.infoTitle}>
              <div>Address</div>
            </div>
            <div style={styles.infoText}>
              <div>British Association of Dermatologists</div>
              <div>Willan House</div>
              <div>4 Fitzroy square</div>
              <div>London, W1T 5HQ</div>
            </div>

            <div style={styles.infoTitle}>
              <div>Email Address</div>
            </div>
            <div>
              <div>education@bad.org.uk</div>
            </div>

            <div style={styles.infoTitle}>
              <div>Phone Number</div>
            </div>
            <div style={styles.infoText}>
              <div>+44 (0)207 383 0266</div>
            </div>
          </div>
        </Modal.Body>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div>
      <Modal show={enquireAction} size="xl" centered>
        <div className="flex-row">
          <ServeModalInfo />
          <ServeModalContent />
        </div>
      </Modal>
    </div>
  );
};

const styles = {
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
  infoTitle: {
    fontSize: 10,
    margin: `1em 0`,
    color: colors.darkSilver,
    textTransform: "uppercase",
  },
  infoText: {
    textTransform: "capitalize",
  },
};

export default connect(EnquireModal);
