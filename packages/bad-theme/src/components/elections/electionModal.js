import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Modal } from "react-bootstrap";

import { colors } from "../../config/imports";
import { setGoToAction } from "../../context";

import CloseIcon from "@mui/icons-material/Close";
// CONTEXT ------------------------------------------------
import { useAppDispatch, setEnquireAction } from "../../context";

const ElectionModal = ({
  state,
  actions,
  libraries,
  modalData,
  setModalData,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const dispatch = useAppDispatch();

  if (!modalData) return null;

  const { title } = modalData;
  const { description, nomination_form_upload, job_description_upload } =
    modalData.acf;

  // HELPERS ---------------------------------------------
  const handleApply = () => {
    setModalData(null);

    const {
      contact_public_email,
      contact_public_phone_number,
      contact_form_title,
      contact_form_body,
      contact_full_name,
      contact_email,
      contact_phone_number,
      contact_subject,
      contact_subject_dropdown_options,
      contact_message,
      contact_allow_attachments,
      contact_recipients,
    } = modalData.acf;

    console.log(modalData);

    setEnquireAction({
      dispatch,
      enquireAction: {
        contact_public_email: contact_public_email || "harriet@bag.org.uk",
        contact_public_phone_number,
        form_title: contact_form_title || "Application Form",
        form_body: contact_form_body || `Apply to ${title.rendered} position.`,
        full_name: contact_full_name || true,
        email_address: contact_email || true,
        phone_number: contact_phone_number || true,
        subject: contact_subject || true,
        subject_dropdown_options: contact_subject_dropdown_options,
        message: contact_message || true,
        allow_attachments: contact_allow_attachments || true,
        recipients: contact_recipients || state.contactList.defaultContactList,
      },
    });
  };

  // SERVERS --------------------------------------------------
  const ServeModalContent = () => {
    const ServeHeader = () => {
      return (
        <div className="flex">
          <div className="flex primary-title" style={{ fontSize: 20 }}>
            <Html2React html={title.rendered} />
          </div>
          <div
            className="toggle-icon-color"
            onClick={() => setModalData(null)}
            style={{ cursor: "pointer" }}
          >
            <CloseIcon style={{ fontSize: 24, fill: colors.softBlack }} />
          </div>
        </div>
      );
    };

    const ServeFormInfo = () => {
      if (!description) return null;

      return (
        <div style={{ padding: `2em 0` }}>
          <Html2React html={description} />
        </div>
      );
    };

    const ServeActions = () => {
      const ServeFormDownload = () => {
        if (!nomination_form_upload) return null;

        return (
          <div className="blue-btn">
            <a
              href={nomination_form_upload}
              target="_blank"
              download
              style={{ color: colors.white }}
            >
              Download Application Form
            </a>
          </div>
        );
      };

      const ServeJobDescriptionDownload = () => {
        if (!job_description_upload) return null;

        return (
          <div className="blue-btn">
            <a
              href={job_description_upload}
              target="_blank"
              download
              style={{ color: colors.white }}
            >
              Download Job Description
            </a>
          </div>
        );
      };

      const ServeSubmitApplication = () => {
        return (
          <div className="blue-btn" onClick={handleApply}>
            Submit your application
          </div>
        );
      };

      return (
        <Modal.Footer
          style={{
            justifyContent: "flex-start",
            padding: 0,
            border: "none",
            marginTop: `1em`,
          }}
        >
          <ServeFormDownload />
          <ServeJobDescriptionDownload />
          <ServeSubmitApplication />
        </Modal.Footer>
      );
    };

    return (
      <div className="flex-col" style={{ padding: `2em` }}>
        <Modal.Body style={{ padding: 0 }}>
          <ServeHeader />
          <ServeFormInfo />
        </Modal.Body>
        <ServeActions />
      </div>
    );
  };

  const ServeFooter = () => {
    return (
      <div
        style={{
          backgroundColor: colors.primary,
          height: 5,
          width: "100%",
        }}
      />
    );
  };

  return (
    <div style={styles.container}>
      <Modal show={modalData} size="xl" centered>
        <ServeModalContent />
        <ServeFooter />
      </Modal>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(ElectionModal);
