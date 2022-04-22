import React, { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import { Modal } from "react-bootstrap";
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
  const { enquireAction, isActiveUser, refreshJWT } = useAppState();
  // console.log("enquireAction", enquireAction); // debug

  const [isFetching, setIsFetching] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    jobtitle: "",
    bad_memberid: "",
    emailaddress1: "",
    mobilephone: "",
    subject: "",
    subject_dropdown_options: "",
    message: "",
    attachments: "",
    currentHospitalName: "",
    hospitalChangeName: "",
    date: new Date().toDateString(),
    recipientsList: "",
  });
  const [hospitalData, setHospitalData] = useState(null);
  const hospitalSearchRef = useRef("");

  // pre-fill user data with logged in user
  useEffect(() => {
    if (!isActiveUser) return null;
    setFormData((prevFormData) => ({
      ...prevFormData,
      ["jobtitle"]: isActiveUser.jobtitle || "",
      ["fullname"]: isActiveUser.fullname || "",
      ["emailaddress1"]: isActiveUser.emailaddress1 || "",
      ["mobilephone"]: isActiveUser.mobilephone || "",
      ["currentHospitalName"]:
        isActiveUser[
          "_parentcustomerid_value@OData.Community.Display.V1.FormattedValue"
        ] || "",
      ["bad_memberid"]: isActiveUser.bad_memberid || "",
    }));
  }, [isActiveUser]);

  if (!enquireAction) return null;
  // HANDLERS ----------------------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // if name is attachments set formData with attachments
    if (name === "attachments") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleContactFormSubmit = async () => {
    // check if formData is valid
    const recipients = enquireAction.recipients;

    try {
      setIsFetching(true);
      const response = await sendEmailEnquireAction({
        state,
        dispatch,
        formData,
        recipients,
        attachments: formData.attachments,
        emailSubject: enquireAction.emailSubject, // email default subject title
        template: enquireAction.emailTemplate, // email default template
        refreshJWT,
      });
      if (!response) throw new Error("Error sending email");
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

      if (enquireAction.isHospitalChange) {
        setErrorAction({
          dispatch,
          isError: {
            message: `Hospital change request to ${formData.hospitalChangeName} submitted successfully.`,
          },
        });
        return;
      }

      if (enquireAction.registerForEvent) {
        setErrorAction({
          dispatch,
          isError: {
            message: `You have successfully registered your interest for ${enquireAction.registerForEvent}. We will be in touch soon.`,
          },
        });
        return;
      }

      setErrorAction({
        dispatch,
        isError: {
          message: `Your have successfully submitted your enquiry. We will be in touch soon.`,
        },
      });
    }
  };

  const handleHospitalLookup = async () => {
    const input = hospitalSearchRef.current.value;
    if (input.length < 2) return; // API call after 2 characters

    let hospitalData = await getHospitalsAction({
      state,
      dispatch,
      input,
      refreshJWT,
    });
    // refactor hospital data to match dropdown format
    hospitalData = hospitalData.map((hospital) => {
      return {
        title: hospital.name,
        link: hospital.accountid,
      };
    });
    console.log("🐞 hospitalData ", hospitalData);

    if (hospitalData.length > 0) setHospitalData(hospitalData);
    if (!hospitalData.length || !input) setHospitalData(null);

    // console.log("Hospitals", hospitalData); // debug
  };

  const handleSelectHospital = ({ item }) => {
    // update formData data with selected hospital
    setFormData((prevFormData) => ({
      ...prevFormData,
      hospitalChangeName: item.title,
    }));
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

  const ServeActions = () => {
    return (
      <Modal.Footer
        style={{ justifyContent: "flex-start", padding: `1em 0 0` }}
      >
        <div className="blue-btn" onClick={handleContactFormSubmit}>
          {enquireAction.registerForEvent ? "Register" : "Submit"}
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
          <div>
            <ServeFormHeader />
            {enquireAction.full_name && (
              <div style={styles.inputContainer}>
                <label className="form-label">Full Name</label>
                <input
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                />
              </div>
            )}

            {enquireAction.email_address && (
              <div style={styles.inputContainer}>
                <label className="form-label">Email Address</label>
                <input
                  name="email"
                  value={formData.emailaddress1}
                  onChange={handleChange}
                  type="email"
                  className="form-control"
                />
              </div>
            )}

            {enquireAction.phone_number && (
              <div style={styles.inputContainer}>
                <label className="form-label">Phone Number</label>
                <input
                  name="mobilephone"
                  value={formData.mobilephone}
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                />
              </div>
            )}

            {enquireAction.subject && (
              <div
                style={styles.inputContainer}
                hidden={enquireAction.registerForEvent}
              >
                <label className="form-label">Subject</label>
                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                />
              </div>
            )}

            {enquireAction.subject_dropdown_options && (
              <div style={styles.inputContainer}>
                <label className="form-label">Subject</label>
                <Form.Select
                  name="subject_dropdown_options"
                  value={formData.subject_dropdown_options}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="null" hidden>
                    Select the subject
                  </option>
                  {Object.values(enquireAction.subject_dropdown_options).map(
                    (item, key) => {
                      return (
                        <option key={key} value={item.field}>
                          {item.field}
                        </option>
                      );
                    }
                  )}
                </Form.Select>
              </div>
            )}

            {enquireAction.isHospitalChange && (
              <div>
                <label className="form-label">
                  Main Hospital / Place of Work / Medical School details
                </label>
                <div style={{ position: "relative" }}>
                  {formData.hospitalChangeName && (
                    <div className="form-control input">
                      <div className="flex-row">
                        <div
                          style={{
                            position: "relative",
                            width: "fit-content",
                            paddingRight: 15,
                          }}
                        >
                          {formData.hospitalChangeName}
                          <div
                            className="filter-icon"
                            style={{ top: -7 }}
                            onClick={() => {
                              setFormData({
                                ...formData,
                                hospitalChangeName: null,
                              });
                            }}
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
                  {!formData.hospitalChangeName && (
                    <div>
                      <input
                        ref={hospitalSearchRef}
                        onChange={handleHospitalLookup}
                        type="text"
                        className="form-control input"
                        placeholder="Main Hospital / Place of Work / Medical School details"
                      />
                    </div>
                  )}
                  <SearchDropDown
                    filter={hospitalData}
                    onClickHandler={handleSelectHospital}
                  />
                </div>
              </div>
            )}

            {enquireAction.job_title && (
              <div style={styles.inputContainer}>
                <label className="form-label">Job Title</label>
                <input
                  name="jobtitle"
                  value={formData.jobtitle}
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  placeholder="Enter your job title"
                  // disabled={isActiveUser.jobtitle} // disabled if user has job title
                />
              </div>
            )}

            {enquireAction.message && (
              <div style={styles.inputContainer}>
                <label className="form-label">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  type="text"
                  rows="3"
                  className="form-control"
                />
              </div>
            )}

            {enquireAction.allow_attachments && (
              <div style={styles.inputContainer}>
                <label className="form-label">File Attachments</label>
                <input
                  name="attachments"
                  onChange={handleChange}
                  className="form-control"
                  type="file"
                  multiple
                />
              </div>
            )}

            <ServeActions />
          </div>
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
