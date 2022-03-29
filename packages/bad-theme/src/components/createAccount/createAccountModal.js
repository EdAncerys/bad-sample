import { useState } from "react";
import { connect } from "frontity";
import { Modal } from "react-bootstrap";

import { colors } from "../../config/imports";
import Form from "./form";
import ContactPreferences from "./contactPreferences";
import FormSubmitted from "./formSubmitted";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setLoginModalAction,
  setCreateAccountModalAction,
} from "../../context";

const loginModal = ({ state, actions }) => {
  const dispatch = useAppDispatch();
  const { createAccountAction } = useAppState();
  const data = state.source.get(state.router.link);

  const [formComplete, setFormComplete] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // HANDLERS ----------------------------------------------------
  const handleConfirmDetailsAction = () => {
    const password = document.querySelector(`#password`).value;
    const confirmPassword = document.querySelector(`#confirmPassword`).value;

    const firstName = document.querySelector(`#firstName`).value;
    const lastName = document.querySelector(`#lastName`).value;
    const emailAddress = document.querySelector(`#emailAddress`).value;
    const confirmEmailAddress =
      document.querySelector(`#confirmEmailAddress`).value;

    const agreeTermsAndConditions = document.querySelector(
      "#agreeTermsAndConditions"
    ).checked;
    const agreeMarketing = document.querySelector("#agreeMarketing").checked;

    const accountDetails = {
      password,
      confirmPassword,
      firstName,
      lastName,
      emailAddress,
      confirmEmailAddress,
      agreeTermsAndConditions,
      agreeMarketing,
    };
  };

  // SERVERS --------------------------------------------------
  const ServeModalContent = () => {
    if (formComplete) return null;
    if (formSubmitted) return null;

    const ServeFormInfo = () => {
      return (
        <div style={{ marginTop: `3em` }}>
          <div className="mb-4">
            <div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
          </div>
          <div>
            <div
              value="Already a member? Login"
              className="caps-btn"
              onClick={() => {
                setCreateAccountModalAction({
                  dispatch,
                  createAccountAction: false,
                });
                setLoginModalAction({
                  dispatch,
                  loginModalAction: true,
                });
              }}
            >
              Already a member? Login
            </div>
          </div>
        </div>
      );
    };

    const ServeActions = () => {
      return (
        <Modal.Footer
          style={{
            borderTop: `1px solid ${colors.darkSilver}`,
            marginTop: `2em`,
          }}
        >
          <div
            className="transparent-btn"
            onClick={() =>
              setCreateAccountModalAction({
                dispatch,
                createAccountAction: false,
              })
            }
          >
            Back
          </div>

          <div className="blue-btn" onClick={handleConfirmDetailsAction}>
            Confirm
          </div>
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
            className="primary-title"
            style={{
              fontSize: 20,
              borderBottom: `1px solid ${colors.darkSilver}`,
              padding: `1em 1em 1em 0`,
              margin: `3em 1em`,
            }}
          >
            <div>Register with the BAD website</div>
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
            setFormSubmitted={setFormSubmitted}
          />
          <FormSubmitted
            formSubmitted={formSubmitted}
            setFormSubmitted={setFormSubmitted}
          />
        </div>
      </Modal>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(loginModal);
