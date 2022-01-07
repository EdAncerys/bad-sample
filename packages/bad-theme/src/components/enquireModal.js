import React, { useState, useLayoutEffect, useRef } from "react";
import { connect } from "frontity";
import { Modal } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

import { colors } from "../config/imports";
import CloseIcon from "@mui/icons-material/Close";
import Loading from "./loading";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setEnquireAction,
  sendEmailEnquireAction,
} from "../context";

const EnquireModal = ({ state, actions }) => {
  const dispatch = useAppDispatch();
  const { enquireAction, isFetching } = useAppState();

  const [uniqueId, setUniqueId] = useState(null);

  // hook applies after React has performed all DOM mutations
  useLayoutEffect(() => {
    const blockId = uuidv4(); // add unique id
    setUniqueId(blockId);
  }, []);

  // HANDLERS ----------------------------------------------------
  const handleContactFormSubmit = ({ agreement }) => {
    if (!agreement) return null;

    const fullName = document.querySelector(`#full-name-${uniqueId}`).value;
    const email = document.querySelector(`#email-${uniqueId}`).value;
    const phoneNumber = document.querySelector(
      `#phone-number-${uniqueId}`
    ).value;
    const enquireReason = document.querySelector(
      `#enquiry-reason-${uniqueId}`
    ).value;
    const message = document.querySelector(`#message-${uniqueId}`).value;
    const isFileUpload = document.querySelector(`#attachments-${uniqueId}`);
    let attachments = null;
    if (isFileUpload) attachments = isFileUpload.files;

    const formData = {
      fullName,
      email,
      phoneNumber,
      enquireReason,
      message,
    };
    const recipients = enquireAction.recipients;

    sendEmailEnquireAction({
      state,
      dispatch,
      formData,
      attachments,
      recipients,
    });
  };

  // SERVERS --------------------------------------------------
  const ServeModalContent = () => {
    const ServeFileUpload = () => {
      if (!enquireAction) return null;
      if (!enquireAction.allow_attachments) return null;

      return (
        <div style={styles.inputContainer}>
          <label className="form-label">File Attachments</label>
          <input
            id={`attachments-${uniqueId}`}
            className="form-control"
            type="file"
            multiple
          />
        </div>
      );
    };

    const ServeForm = () => {
      const ServeActions = () => {
        const [agreement, setAgreement] = useState(null);

        return (
          <div>
            <div className="flex mb-3 form-check">
              <label className="form-check-label">
                <input
                  type="checkbox"
                  className="form-check-input"
                  style={styles.checkBox}
                  onClick={() => setAgreement(!agreement)}
                />
                <span style={styles.TC}>I agree</span> - justo donec enim diam
                vulputate ut pharetra sit. Purus semper eget duis at tellus at.
                Sed adipiscing diam.
              </label>
            </div>
            <Modal.Footer
              style={{ justifyContent: "flex-start", padding: `1em 0 0` }}
            >
              <div
                className="blue-btn"
                style={{ opacity: agreement ? 1 : 0.7 }}
                onClick={() => handleContactFormSubmit({ agreement })}
              >
                Send Enquiry
              </div>
            </Modal.Footer>
          </div>
        );
      };

      return (
        <form>
          <div style={styles.inputContainer}>
            <label className="form-label">Full Name</label>
            <input
              id={`full-name-${uniqueId}`}
              type="text"
              className="form-control"
            />
          </div>
          <div style={styles.inputContainer}>
            <label className="form-label">Email Address</label>
            <input
              id={`email-${uniqueId}`}
              type="email"
              className="form-control"
            />
          </div>
          <div style={styles.inputContainer}>
            <label className="form-label">Phone Number</label>
            <input
              id={`phone-number-${uniqueId}`}
              type="number"
              className="form-control"
            />
          </div>
          <div style={styles.inputContainer}>
            <label className="form-label">Subject</label>
            <input
              id={`subject-${uniqueId}`}
              type="text"
              className="form-control"
            />
          </div>
          <div style={styles.inputContainer}>
            <label className="form-label">Reason For Enquiry</label>
            <input
              id={`enquiry-reason-${uniqueId}`}
              type="text"
              className="form-control"
            />
          </div>
          <div style={styles.inputContainer}>
            <label className="form-label">Message</label>
            <textarea
              id={`message-${uniqueId}`}
              type="text"
              rows="3"
              className="form-control"
            />
          </div>
          <ServeFileUpload />
          <ServeActions />
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

    return (
      <div className="flex-col">
        <Modal.Body>
          <ServeFormInfo />
          <ServeForm />
        </Modal.Body>
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

  const ServeIndicator = () => {
    if (!isFetching) return null;

    return (
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          width: "100%",
          height: "100%",
          display: "grid",
          justifyItems: "center",
          backgroundColor: colors.bgLight,
        }}
      >
        <Loading />
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <Modal show={enquireAction} size="xl" centered>
      <div
        style={{ backgroundColor: colors.silverFillOne, position: "relative" }}
      >
        <ServeIndicator />
        <div
          className="flex"
          onClick={() => setEnquireAction({ dispatch, enquireAction: null })}
          style={{
            padding: `2em 4em 1em`,
            cursor: "pointer",
            justifyContent: "flex-end",
          }}
        >
          <CloseIcon style={{ fontSize: 24, fill: colors.softBlack }} />
        </div>
        <div style={styles.container}>
          <ServeModalInfo />
          <ServeModalContent />
        </div>
      </div>
    </Modal>
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
    marginTop: 10,
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
