import { connect } from "frontity";
import { Modal } from "react-bootstrap";

import { colors } from "../../config/imports";
// --------------------------------------------------------------------------------
import { setGoToAction, Parcer } from "../../context";

import CloseIcon from "@mui/icons-material/Close";

const GeneralModal = ({ state, actions, libraries, modalData, handler }) => {
  if (!modalData) return null;

  const { title, link, body } = modalData;

  // HELPERS --------------------------------------------------

  // SERVERS --------------------------------------------------
  const ServeModalContent = () => {
    const ServeHeader = () => {
      return (
        <div className="flex">
          <div className="flex primary-title" style={{ fontSize: 20 }}>
            {title}
          </div>
          <div
            onClick={handler}
            className="toggle-icon-color"
            style={{ cursor: "pointer" }}
          >
            <CloseIcon style={{ fontSize: 24, fill: colors.softBlack }} />
          </div>
        </div>
      );
    };

    const ServeFormInfo = () => {
      if (!body) return null;

      return (
        <div style={{ padding: `2em 0` }}>
          <Parcer libraries={libraries} html={body} />
        </div>
      );
    };

    const ServeMoreLink = () => {
      if (!link) return null;

      return (
        <div
          className="blue-btn"
          onClick={() => setGoToAction({ state, path: link, actions })}
        >
          Read more here
        </div>
      );
    };

    const ServeActions = () => {
      return (
        <Modal.Footer
          style={{
            justifyContent: "flex-start",
            padding: 0,
            border: "none",
            marginTop: `1em`,
          }}
        >
          <ServeMoreLink />
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
      <Modal show={body} centered>
        <ServeModalContent />
        <ServeFooter />
      </Modal>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(GeneralModal);
