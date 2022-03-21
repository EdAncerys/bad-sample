import React, { useState, useLayoutEffect, useRef } from "react";
import { connect } from "frontity";

import { Modal } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import CloseIcon from "@mui/icons-material/Close";
import { Form } from "react-bootstrap";
import SearchDropDown from "./searchDropDown";
import { colors } from "../config/imports";
import ActionPlaceholder from "./actionPlaceholder";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setEnquireAction,
  sendEmailEnquireAction,
  muiQuery,
  getHospitalsAction,
  setErrorAction,
} from "../context";

const EnquireModal = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const { lg } = muiQuery();
  const dispatch = useAppDispatch();
  const { enquireAction, isActiveUser } = useAppState();

  const [uniqueId, setUniqueId] = useState(null);
  const [isFetching, setIsFetching] = useState(null);

  const [hospitalData, setHospitalData] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const hospitalSearchRef = useRef("");

  // hook applies after React has performed all DOM mutations
  useLayoutEffect(() => {
    const blockId = uuidv4(); // add unique id
    setUniqueId(blockId);
  }, []);

  // HANDLERS ----------------------------------------------------
  const handleContactFormSubmit = async () => {
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

    let formData = {
      fullName,
      email,
      phoneNumber,
      subject,
      subjectDropDown,
      message,
    };
    // if change of hospital update form object
    if (enquireAction.isHospitalChange)
      formData = {
        subject: "Hospital Change Request",
        hospitalName: selectedHospital,
        message,
        userData: isActiveUser,
      };
    const recipients = enquireAction.recipients;
    // console.log("formData", formData); // debug
    // console.log("recipients", recipients); // debug

    try {
      setIsFetching(true);
      const response = await sendEmailEnquireAction({
        state,
        dispatch,
        formData,
        attachments,
        recipients,
      });
      if (!response) throw new Error("Error sending email");

      if (enquireAction.isHospitalChange)
        setErrorAction({
          dispatch,
          isError: {
            message: `Hospital change request to ${selectedHospital} submitted successfully.`,
          },
        });
    } catch (error) {
      console.log(error);
      setErrorAction({
        dispatch,
        isError: {
          message: `Failed to send message. Please try again.`,
          image: "Error",
        },
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleHospitalLookup = async () => {
    const input = hospitalSearchRef.current.value;
    // if (input.length < 2) return; // API call after 2 characters

    let hospitalData = await getHospitalsAction({
      state,
      input,
    });
    // refactor hospital data to match dropdown format
    hospitalData = hospitalData.map((hospital) => {
      return {
        title: hospital.name,
        link: hospital.accountid,
      };
    });

    if (hospitalData.length > 0) setHospitalData(hospitalData);
    if (!hospitalData.length || !input) setHospitalData(null);

    // console.log("Hospitals", hospitalData); // debug
  };

  const handleSelectHospital = ({ item }) => {
    setSelectedHospital(item.title);
    setHospitalData(null); // clear hospital data for dropdown
    console.log("selected hospital", item); // debug
  };

  // SERVERS --------------------------------------------------
  const ServeHeaderActions = () => {
    return (
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
    );
  };

  const ServeMessage = () => {
    if (!enquireAction.message) return null;

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

  const ServeFormHeader = () => {
    const ServeFormTitle = () => {
      if (!enquireAction.form_title) return null;

      return (
        <div className="primary-title" style={{ fontSize: 20 }}>
          <Html2React html={enquireAction.form_title} />
        </div>
      );
    };

    const ServeFormBody = () => {
      if (!enquireAction.form_body) return null;

      return (
        <div style={{ paddingTop: `1em` }}>
          <Html2React html={enquireAction.form_body} />
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

  const ServeModalContent = () => {
    if (!enquireAction) return null;

    const ServeFileUpload = () => {
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
      if (!enquireAction) return null;

      const ServeFullName = () => {
        if (!enquireAction.full_name) return null;

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
        if (!enquireAction.email_address) return null;

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
        if (!enquireAction.phone_number) return null;

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
        if (!enquireAction.subject) return null;

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
        if (!enquireAction.subject_dropdown_options) return null;

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

  if (enquireAction && enquireAction.isHospitalChange) {
    return (
      <Modal show={enquireAction} size="xl" centered>
        <div
          style={{
            backgroundColor: colors.silverFillOne,
            position: "relative",
          }}
        >
          <ActionPlaceholder isFetching={isFetching} background="transparent" />
          <ServeHeaderActions />
          <div style={styles.container}>
            <ServeModalInfo />
            <div style={styles.inputContainer}>
              <ServeFormHeader />

              <label className="form-label">
                Main Place of Work / Medical School
              </label>
              <div style={{ position: "relative" }}>
                {selectedHospital && (
                  <div className="form-control input">
                    <div className="flex-row">
                      <div
                        style={{
                          position: "relative",
                          width: "fit-content",
                          paddingRight: 15,
                        }}
                      >
                        {selectedHospital}
                        <div
                          className="filter-icon"
                          style={{ top: -7 }}
                          onClick={() => setSelectedHospital(null)}
                        >
                          <CloseIcon
                            style={{
                              fill: colors.darkSilver,
                              padding: 0,
                              width: "0.7em",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {!selectedHospital && (
                  <div>
                    <input
                      ref={hospitalSearchRef}
                      onChange={handleHospitalLookup}
                      type="text"
                      className="form-control input"
                      placeholder="Main Hospital/Place of work"
                    />
                  </div>
                )}
                <SearchDropDown
                  filter={hospitalData}
                  onClickHandler={handleSelectHospital}
                />
              </div>
              <ServeMessage />
              <ServeActions />
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  // RETURN ---------------------------------------------------
  return (
    <Modal show={enquireAction} size="xl" centered>
      <div
        style={{ backgroundColor: colors.silverFillOne, position: "relative" }}
      >
        <ActionPlaceholder isFetching={isFetching} background="transparent" />
        <ServeHeaderActions />
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
