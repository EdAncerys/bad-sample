import React, { useState, useEffect } from "react";
import { connect } from "frontity";
import { Modal } from "react-bootstrap";

import { colors } from "../config/imports";
import CloseIcon from "@mui/icons-material/Close";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState, setEnquireAction } from "../context";

const EnquireModal = ({ state, actions }) => {
  const dispatch = useAppDispatch();
  const { enquireAction } = useAppState();

  const [agreement, setAgreement] = useState(null);

  // SERVERS --------------------------------------------------
  const ServeModalContent = () => {
    const ServeForm = () => {
      return (
        <form>
          <div style={styles.inputContainer}>
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" />
          </div>
          <div style={styles.inputContainer}>
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" />
          </div>
          <div style={styles.inputContainer}>
            <label className="form-label">Phone Number</label>
            <input type="number" className="form-control" />
          </div>
          <div style={styles.inputContainer}>
            <label className="form-label">Subject</label>
            <input type="text" className="form-control" />
          </div>
          <div style={styles.inputContainer}>
            <label className="form-label">Reason For Enquiry</label>
            <input type="text" className="form-control" />
          </div>
          <div style={styles.inputContainer}>
            <label className="form-label">Message</label>
            <textarea type="text" rows="3" className="form-control" />
          </div>

          <div className="flex mb-3 form-check">
            <div className="flex">
              <div className="flex" style={{ alignItems: "center" }}>
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
                    onClick={() => {
                      console.log("agree");
                      setAgreement(true);
                    }}
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
            paddingBottom: `2em`,
          }}
        >
          <h4>Enquire About Education & Training </h4>
        </div>
      );
    };

    const ServeActions = () => {
      return (
        <Modal.Footer
          style={{ justifyContent: "flex-start", padding: `1em 0 0` }}
        >
          <button
            className="blue-btn"
            onClick={() => {
              if (!agreement) return null; // agreement is required

              setEnquireAction({
                dispatch,
                createAccountAction: true,
              });
            }}
          >
            Send Enquiry
          </button>
        </Modal.Footer>
      );
    };

    return (
      <div className="flex">
        <div className="flex-col">
          <Modal.Body>
            <ServeFormInfo />
            <ServeForm />
            <ServeActions />
          </Modal.Body>
        </div>
      </div>
    );
  };

  const ServeModalInfo = () => {
    return (
      <div className="flex">
        <Modal.Body>
          <div
            style={{
              borderBottom: `1px solid ${colors.darkSilver}`,
              paddingBottom: `2em`,
            }}
          >
            <h4>Contact Details</h4>
          </div>
          <div style={{ padding: `1em 0` }}>
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
        <div style={{ backgroundColor: colors.silverFillOne }}>
          <div
            className="flex"
            onClick={() => setEnquireAction({ dispatch, enquireAction: null })}
            style={{
              padding: `2em 4em 1em`,
              cursor: "pointer",
              justifyContent: "flex-end",
            }}
          >
            <CloseIcon style={{ fontSize: 24, fill: colors.textMain }} />
          </div>
          <div style={styles.container}>
            <ServeModalInfo />
            <ServeModalContent />
          </div>
        </div>
      </Modal>
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `1fr 1.5fr`,
    gap: `4em`,
    padding: `0em 3em 3em`,
  },
  inputContainer: {
    margin: `1em 0`,
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
