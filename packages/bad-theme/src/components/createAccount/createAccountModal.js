import React, { useState, useEffect } from "react";
import { connect } from "frontity";
import { Modal } from "react-bootstrap";

import { colors } from "../../config/colors";
import Form from "./form";
import ContactPreferences from "./contactPreferences";

const loginModal = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const [formComplete, setFormComplete] = useState(false);

  const createAccountAction = state.context.createAccountAction;

  // SERVERS --------------------------------------------------
  const ServeModalContent = () => {
    if (formComplete) return null;

    const ServeFormInfo = () => {
      return (
        <div style={{ marginTop: `3em` }}>
          <div className="mb-4">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
          <div>
            <label
              className="form-check-label"
              style={{ ...styles.TC, color: colors.blue }}
              onClick={actions.context.setActionFlipper}
            >
              Already a member? Login
            </label>
          </div>
        </div>
      );
    };

    const ServeActions = () => {
      return (
        <Modal.Footer>
          <button
            type="submit"
            className="btn btn-outline-secondary"
            onClick={actions.context.setCreateAccountAction}
          >
            Back
          </button>

          <button
            type="submit"
            className="btn"
            style={{ backgroundColor: colors.primary, color: colors.white }}
            onClick={() => setFormComplete(true)}
          >
            Confirm
          </button>
        </Modal.Footer>
      );
    };

    return (
      <div className="flex m-4" style={{ flex: 2, paddingRight: `2em` }}>
        <div className="flex-col">
          <Modal.Body style={{ padding: 0 }}>
            <ServeFormInfo />
            <Form />
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
            <h4>Register with the BAD website</h4>
          </div>
        </Modal.Body>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div>
      <Modal show={createAccountAction} size="xl" centered>
        <div className="flex-row">
          <ServeModalInfo />
          <ServeModalContent />
          <ContactPreferences
            formComplete={formComplete}
            setFormComplete={setFormComplete}
          />
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
};

export default connect(loginModal);
