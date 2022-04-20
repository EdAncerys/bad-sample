import { useState } from "react";
import { connect } from "frontity";

import { Modal } from "react-bootstrap";
import Image from "@frontity/components/image";
import { colors } from "../../config/imports";
import BadBadgeLogo from "../../img/svg/badBadgeLogoPrimary.svg";
import CloseIcon from "@mui/icons-material/Close";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  loginAction,
  setCreateAccountModalAction,
  muiQuery,
} from "../../context";

const CreateAccountModal = ({ state, actions }) => {
  const dispatch = useAppDispatch();
  const { createAccountAction } = useAppState();
  const data = state.source.get(state.router.link);
  const { lg } = muiQuery();
  // HANDLERS -------------------------------------------------

  // SERVERS --------------------------------------------------
  const ServeFormInfo = () => {
    return (
      <div style={{ marginTop: `3em` }}>
        <div className="flex-col">
          <div className="primary-title" style={{ fontSize: 24 }}>
            Welcome to the new BAD website logged in area. This is the BAD
            account registration page.
          </div>
          <div style={{ padding: "2em 0" }}>Dear User,</div>
          <div>
            We are delighted to announce our new website is now live. To access
            your existing account or to sign up as a new user please follow the
            instructions below.
          </div>
        </div>
      </div>
    );
  };

  const ServeExistingMembers = () => {
    return (
      <div className="flex-col">
        <div
          className="primary-title"
          style={{ fontSize: 24, padding: "1em 0 0.5em 0" }}
        >
          Existing BAD User:
        </div>
        <div>
          If you have already have a registered account with us and are an
          existing user of the BAD website you will need to follow the link
          below and press ‘Sign up now’. You will need to have access to the
          email account registered with the BAD in order to receive the
          verficiation code that will be sent to you.
        </div>
        <div
          className="blue-btn"
          style={{ margin: "1em 0", alignSelf: "flex-start" }}
          onClick={() => loginAction({ state })}
        >
          Register
        </div>
      </div>
    );
  };

  const ServeNewRegistrations = () => {
    return (
      <div className="flex-col">
        <div
          className="primary-title"
          style={{ fontSize: 24, padding: "1em 0 0.5em 0" }}
        >
          New registration:
        </div>
        <div>
          If you are new to the BAD and do not have an existing account and
          would like to register with us so you can apply for BAD and Special
          Interest Group membership, register for events, and much more, then
          you can sign up here:
        </div>
        <div
          className="blue-btn"
          style={{ margin: "1em 0", alignSelf: "flex-start" }}
          onClick={() => loginAction({ state })}
        >
          Create an account
        </div>
      </div>
    );
  };

  const ServeLogin = () => {
    return (
      <div className="flex-col">
        <div style={{ paddingTop: "1em" }}>
          If you have already completed either of the steps above,
        </div>
        <div className="primary-title" style={{ fontSize: 24 }}>
          Please log in here:
        </div>
        <div
          className="blue-btn"
          style={{ margin: "1em 0", alignSelf: "flex-start" }}
          onClick={() => loginAction({ state })}
        >
          Login
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
          className="blue-btn"
          onClick={() =>
            setCreateAccountModalAction({
              dispatch,
              createAccountAction: false,
            })
          }
        >
          Close
        </div>
      </Modal.Footer>
    );
  };

  const ServeModalContent = () => {
    return (
      <div
        className="flex m-4"
        style={{ flex: 2, paddingRight: !lg ? `2em` : 0 }}
      >
        <div className="flex-col">
          <Modal.Body style={{ padding: 0 }}>
            <ServeFormInfo />
            <ServeExistingMembers />
            <ServeNewRegistrations />
            <ServeLogin />
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
          <div className="flex-col">
            {lg && (
              <div
                onClick={() =>
                  setCreateAccountModalAction({
                    dispatch,
                    createAccountAction: false,
                  })
                }
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <CloseIcon />
              </div>
            )}
            <div
              className="primary-title"
              style={{
                fontSize: 20,
                borderBottom: `1px solid ${colors.darkSilver}`,
                paddingBottom: `1em`,
                margin: `3em 1em 2em 1em`,
              }}
            >
              <div>Login / Register</div>
            </div>
            <div
              style={{
                width: 200,
                height: 200,
                overflow: "hidden",
                margin: "auto",
              }}
            >
              <Image
                src={BadBadgeLogo}
                alt="BAD"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        </Modal.Body>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div>
      <Modal show={createAccountAction} size="xl" centered>
        <div className={!lg ? "flex-row" : "flex-col"}>
          <ServeModalInfo />
          <ServeModalContent />
        </div>
      </Modal>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(CreateAccountModal);
