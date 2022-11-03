import { connect } from "frontity";
import { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { colors } from "../../config/imports";
import CloseIcon from "@mui/icons-material/Close";

// CONTEXT --------------------------------------------------------
import { useAppDispatch, setEnquireAction, Parcer } from "../../context";

const ElectionModal = ({
  state,
  actions,
  libraries,
  modalData,
  setModalData,
}) => {
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

    setEnquireAction({
      dispatch,
      enquireAction: {
        contact_public_email: contact_public_email || "harriet@bag.org.uk",
        contact_public_phone_number,
        form_title: contact_form_title || "Application Form",
        // uncoment to use form body
        // form_body: contact_form_body || `Apply to ${title.rendered} position.`,
        full_name: true,
        email_address: true,
        phone_number: true,
        subject: true,
        subject_dropdown_options: contact_subject_dropdown_options,
        message: true,
        allow_attachments: true,
        recipients:
          contact_recipients || state.contactList.DEFAULT_CONTACT_LIST,
        // default email subject & template name
        emailSubject: `Apply to ${title.rendered} position.`,
      },
    });
  };

  // SERVERS --------------------------------------------------
  const ServeModalContent = () => {
    const ServeHeader = () => {
      return (
        <div className="flex">
          <div className="flex primary-title" style={{ fontSize: 20 }}>
            <Parcer libraries={libraries} html={title.rendered} />
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
          <Parcer libraries={libraries} html={description} />
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
