import React, { useState, useLayoutEffect, useRef } from "react";
import { connect } from "frontity";

import { Modal } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import CloseIcon from "@mui/icons-material/Close";
import { Form } from "react-bootstrap";

import { colors } from "../config/imports";
import ActionPlaceholder from "./actionPlaceholder";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setEnquireAction,
  sendEmailEnquireAction,
  muiQuery,
} from "../context";

const EnquireModal = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const { lg } = muiQuery();
  const dispatch = useAppDispatch();
  const { enquireAction } = useAppState();

  const [uniqueId, setUniqueId] = useState(null);
  const [isFetching, setIsFetching] = useState(null);

  // hook applies after React has performed all DOM mutations
  useLayoutEffect(() => {
    const blockId = uuidv4(); // add unique id
    setUniqueId(blockId);
  }, []);

  // HANDLERS ----------------------------------------------------
  const handleContactFormSubmit = async () => {
    setIsFetching(true);

    const isFullName = document.querySelector(`#full-name-${uniqueId}`);
    const isEmail = document.querySelector(`#email-${uniqueId}`);
    const isPhoneNumber = document.querySelector(`#phone-number-${uniqueId}`);
    const isSubject = document.querySelector(`#subject-${uniqueId}`);
    const isSubjectDropDown = document.querySelector(
      `#subject-dropdown-${uniqueId}`
    );
    const isMessage = document.querySelector(`#message-${uniqueId}`);
    const isFileUpload = document.querySelector(`#attachments-${uniqueId}`);

    // optional fields
    let fullName = null;
    let email = null;
    let phoneNumber = null;
    let subject = null;
    let subjectDropDown = null;
    let message = null;
    let attachments = null;

    // validating & passing values is present
    if (isFullName) fullName = isFullName.value;
    if (isEmail) email = isEmail.value;
    if (isPhoneNumber) phoneNumber = isPhoneNumber.value;
    if (isSubject) subject = isSubject.value;
    if (isSubjectDropDown) subjectDropDown = isSubjectDropDown.value;
    if (isMessage) message = isMessage.value;
    if (isFileUpload) attachments = isFileUpload.files;

    const formData = {
      fullName,
      email,
      phoneNumber,
      subject,
      subjectDropDown,
      message,
    };
    const recipients = enquireAction.recipients;

    await sendEmailEnquireAction({
      state,
      dispatch,
      formData,
      attachments,
      recipients,
    });
    setIsFetching(false);
  };

  // SERVERS --------------------------------------------------
  const ServeModalContent = () => {
    if (!enquireAction) return null;

    const ServeFileUpload = () => {
      let attachments = enquireAction.allow_attachments;
      if (enquireAction.register_allow_attachments)
        attachments = enquireAction.register_allow_attachments;
      if (enquireAction.contact_allow_attachments)
        attachments = enquireAction.contact_allow_attachments;

      if (!attachments) return null;

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
      if (!enquireAction) return null;

      const ServeActions = () => {
        return (
          <Modal.Footer
            style={{ justifyContent: "flex-start", padding: `1em 0 0` }}
          >
            <div className="blue-btn" onClick={handleContactFormSubmit}>
              Submit
            </div>
          </Modal.Footer>
        );
      };

      const ServeFullName = () => {
        let fullName = enquireAction.full_name;
        if (enquireAction.register_full_name)
          fullName = enquireAction.register_full_name;
        if (enquireAction.contact_full_name)
          fullName = enquireAction.contact_full_name;

        if (!fullName) return null;

        return (
          <div style={styles.inputContainer}>
            <label className="form-label">Full Name</label>
            <input
              id={`full-name-${uniqueId}`}
              type="text"
              className="form-control"
            />
          </div>
        );
      };

      const ServeEmail = () => {
        let email = enquireAction.email_address;
        if (enquireAction.register_email) email = enquireAction.register_email;
        if (enquireAction.contact_email) email = enquireAction.contact_email;

        if (!email) return null;

        return (
          <div style={styles.inputContainer}>
            <label className="form-label">Email Address</label>
            <input
              id={`email-${uniqueId}`}
              type="email"
              className="form-control"
            />
          </div>
        );
      };

      const ServeNumber = () => {
        let phoneNumber = enquireAction.phone_number;
        if (enquireAction.register_phone_number)
          phoneNumber = enquireAction.register_phone_number;
        if (enquireAction.contact_phone_number)
          phoneNumber = enquireAction.contact_phone_number;

        if (!phoneNumber) return null;

        return (
          <div style={styles.inputContainer}>
            <label className="form-label">Phone Number</label>
            <input
              id={`phone-number-${uniqueId}`}
              type="text"
              className="form-control"
            />
          </div>
        );
      };

      const ServeSubject = () => {
        let subject = enquireAction.subject;
        if (enquireAction.register_subject)
          subject = enquireAction.register_subject;
        if (enquireAction.contact_subject)
          subject = enquireAction.contact_subject;

        if (!subject) return null;

        return (
          <div style={styles.inputContainer}>
            <label className="form-label">Subject</label>
            <input
              id={`subject-${uniqueId}`}
              type="text"
              className="form-control"
            />
          </div>
        );
      };

      const ServeSubjectDropDown = () => {
        let dropdown = enquireAction.subject_dropdown_options;
        if (enquireAction.register_subject_dropdown_options)
          dropdown = enquireAction.register_subject_dropdown_options;
        if (enquireAction.contact_subject_dropdown_options)
          dropdown = enquireAction.contact_subject_dropdown_options;

        if (!dropdown) return null;

        return (
          <div style={styles.inputContainer}>
            <label className="form-label">Subject</label>
            <Form.Select
              id={`subject-dropdown-${uniqueId}`}
              className="form-control"
            >
              <option value="null" hidden>
                Select the subject
              </option>
              {Object.values(dropdown).map((item, key) => {
                return (
                  <option key={key} value={item.field}>
                    {item.field}
                  </option>
                );
              })}
            </Form.Select>
          </div>
        );
      };

      const ServeMessage = () => {
        let message = enquireAction.message;
        if (enquireAction.register_message)
          message = enquireAction.register_message;
        if (enquireAction.contact_message)
          message = enquireAction.contact_message;

        if (!message) return null;

        return (
          <div style={styles.inputContainer}>
            <label className="form-label">Message</label>
            <textarea
              id={`message-${uniqueId}`}
              type="text"
              rows="3"
              className="form-control"
            />
          </div>
        );
      };

      return (
        <form>
          <ServeFullName />
          <ServeEmail />
          <ServeNumber />
          <ServeSubject />
          <ServeSubjectDropDown />
          <ServeMessage />
          <ServeFileUpload />
          <ServeActions />
        </form>
      );
    };

    const ServeFormHeader = () => {
      const ServeFormTitle = () => {
        let title = enquireAction.form_title;
        if (enquireAction.register_form_title)
          title = enquireAction.register_form_title;
        if (enquireAction.contact_form_title)
          title = enquireAction.contact_form_title;

        if (!title) return null;

        return (
          <div className="primary-title" style={{ fontSize: 20 }}>
            <Html2React html={title} />
          </div>
        );
      };

      const ServeFormBody = () => {
        let body = enquireAction.form_body;
        if (enquireAction.register_form_body)
          body = enquireAction.register_form_body;
        if (enquireAction.contact_form_body)
          body = enquireAction.contact_form_body;

        if (!body) return null;

        return (
          <div style={{ paddingTop: `1em` }}>
            <Html2React html={body} />
          </div>
        );
      };

      return (
        <div
          style={{
            borderBottom: `1px solid ${colors.darkSilver}`,
            paddingBottom: `2em`,
          }}
        >
          <ServeFormTitle />
          <ServeFormBody />
        </div>
      );
    };

    return (
      <div className="flex-col">
        <Modal.Body>
          <ServeFormHeader />
          <ServeForm />
        </Modal.Body>
      </div>
    );
  };

  const ServeModalInfo = () => {
    if (!enquireAction) return null;

    const ServePublicEmail = () => {
      let email = enquireAction.contact_public_email;
      if (enquireAction.register_public_email)
        email = enquireAction.register_public_email;
      if (enquireAction.contact_public_email)
        email = enquireAction.contact_public_email;

      if (!email) return null;

      return (
        <div>
          <div style={styles.infoTitle}>
            <div>Email Address</div>
          </div>
          <div>
            <div>{email}</div>
          </div>
        </div>
      );
    };

    const ServePublicPhone = () => {
      let phoneNumber = enquireAction.contact_public_phone_number;
      if (enquireAction.register_public_phone_number)
        phoneNumber = enquireAction.register_public_phone_number;

      if (!phoneNumber) return null;

      return (
        <div>
          <div style={styles.infoTitle}>
            <div>Phone Number</div>
          </div>
          <div style={styles.infoText}>
            <div>{phoneNumber}</div>
          </div>
        </div>
      );
    };

    return (
      <div className="flex">
        <Modal.Body>
          <div
            className="primary-title"
            style={{
              borderBottom: `1px solid ${colors.darkSilver}`,
              paddingBottom: `2em`,
              fontSize: 20,
            }}
          >
            Contact Details
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
            <ServePublicEmail />
            <ServePublicPhone />
          </div>
        </Modal.Body>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <Modal show={enquireAction} size="xl" centered>
      <div
        style={{ backgroundColor: colors.silverFillOne, position: "relative" }}
      >
        <ActionPlaceholder isFetching={isFetching} />
        <div
          className="flex"
          onClick={() => setEnquireAction({ dispatch, enquireAction: null })}
          style={{
            padding: !lg ? `2em 4em 1em` : "1em",
            cursor: "pointer",
            justifyContent: "flex-end",
          }}
        >
          <CloseIcon style={{ fontSize: 24, fill: colors.softBlack }} />
        </div>
        <div style={!lg ? styles.container : { display: "grid" }}>
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
