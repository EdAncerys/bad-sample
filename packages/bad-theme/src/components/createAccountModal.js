import React, { useState, useEffect } from "react";
import { connect } from "frontity";
import { Modal } from "react-bootstrap";

import { colors } from "../config/colors";

const loginModal = ({ state, actions }) => {
  const data = state.source.get(state.router.link);
  const createAccountAction = state.context.createAccountAction;

  // SERVERS --------------------------------------------------
  const ServeModalContent = () => {
    const ServeForm = () => {
      return (
        <form>
          <div style={styles.formContainer}>
            <div className="flex-col">
              <label className="form-label">Your First Name*</label>
              <input type="text" className="form-control" />
            </div>
            <div className="flex-col">
              <label className="form-label">Your Contact E-mail Address</label>
              <input type="email" className="form-control" />
            </div>

            <div className="flex-col">
              <label className="form-label">Your Last Name*</label>
              <input type="text" className="form-control" />
            </div>
            <div className="flex-col">
              <label className="form-label">
                Confirm Contact E-mail Address
              </label>
              <input type="email" className="form-control" />
            </div>
          </div>

          <div
            style={{
              ...styles.formContainer,
              borderTop: `1px solid ${colors.darkSilver}`,
              borderBottom: `1px solid ${colors.darkSilver}`,
              padding: `2em 0`,
            }}
          >
            <div className="flex-col">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" />
            </div>
            <div className="flex-col">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-control" />
            </div>
          </div>

          <div className="flex mb-3 form-check">
            <div className="flex">
              <input
                type="checkbox"
                className="form-check-input"
                style={{ borderRadius: "50%", marginRight: 10 }}
              />
              <div>
                <label className="form-check-label">
                  I Agree with the{" "}
                  <span
                    style={styles.TC}
                    onClick={actions.context.setCreateAccountAction}
                  >
                    Terms & Conditions
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex mb-3 form-check">
            <div className="flex">
              <input
                type="checkbox"
                className="form-check-input"
                style={{ borderRadius: "50%", marginRight: 10 }}
              />
              <div>
                <label className="form-check-label">
                  I Agree with the{" "}
                  <span
                    style={styles.TC}
                    onClick={actions.context.setCreateAccountAction}
                  >
                    Marketing
                  </span>
                </label>
              </div>
            </div>
          </div>
        </form>
      );
    };

    const ServeFormInfo = () => {
      return (
        <div>
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
            onClick={actions.context.setCreateAccountAction}
          >
            Confirm
          </button>
        </Modal.Footer>
      );
    };

    return (
      <div className="flex m-4" style={{ flex: 2, paddingRight: `2em` }}>
        <div className="flex-col">
          <Modal.Body>
            <ServeFormInfo />
            <ServeForm />
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
              margin: `1em`,
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
        </div>
      </Modal>
    </div>
  );
};

const styles = {
  border: {
    borderBottom: `1px solid ${colors.darkSilver}`,
  },
  TC: {
    textDecoration: "underline",
    textUnderlineOffset: 5,
    cursor: "pointer",
  },
  formContainer: {
    display: "grid",
    gridTemplateColumns: `repeat(2, 1fr)`,
    justifyContent: "space-between",
    gap: 20,
    margin: `2em 0 2em 0`,
  },
};

export default connect(loginModal);
