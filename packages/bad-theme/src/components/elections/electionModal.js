import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { Modal } from "react-bootstrap";

import { colors } from "../../config/imports";
import { setGoToAction } from "../../context";

import CloseIcon from "@mui/icons-material/Close";

const ElectionModal = ({
  state,
  actions,
  libraries,
  modalData,
  setModalData,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!modalData) return null;

  const { title, link } = modalData;
  const { description, nomination_form_upload } = modalData.acf;
  // HELPERS ---------------------------------------------
  console.log(modalData);

  // SERVERS --------------------------------------------------
  const ServeModalContent = () => {
    const ServeHeader = () => {
      return (
        <div className="flex">
          <div
            className="flex primary-title"
            style={{ fontSize: 20, color: colors.black }}
          >
            <Html2React html={title.rendered} />
          </div>
          <div onClick={() => setModalData(null)} style={{ cursor: "pointer" }}>
            <CloseIcon style={{ fontSize: 24, fill: colors.textMain }} />
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
      const ServeFormDownloaded = () => {
        if (!nomination_form_upload) return null;

        return (
          <div className="blue-btn">
            <a
              href={nomination_form_upload}
              target="_blank"
              download
              style={{ color: colors.white }}
            >
              Download Form
            </a>
          </div>
        );
      };
      return (
        <Modal.Footer
          style={{
            flexDirection: "row-reverse",
            padding: 0,
            border: "none",
            marginTop: `1em`,
          }}
        >
          <ServeFormDownloaded />

          <button
            className="blue-btn"
            onClick={() => setGoToAction({ path: link, actions })}
          >
            Read More
          </button>
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
