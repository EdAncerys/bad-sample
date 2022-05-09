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
          <div style={{ padding: "2em 0" }}>
            Dear User,
            <br />
            We are delighted to announce our new website is now live. To access
            your existing BAD account or to sign-up as a new user, please follow
            the instructions below.
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
          New Members
        </div>
        <div>
          If you are new to the BAD and do not have an existing account and
          would like to register, then you should follow steps 1 & 2 as above.
          This will enable you to apply for BAD and Special Interest Group
          memberships, register for events, and more.
        </div>
        {/* <div
          className="blue-btn"
          style={{ margin: "1em 0", alignSelf: "flex-start" }}
          onClick={() => loginAction({ state })}
        >
          Create an account
        </div> */}
      </div>
    );
  };

  const ServeLogin = () => {
    return (
      <div className="flex-col">
        <div
          className="primary-title"
          style={{ fontSize: 24, paddingTop: "0.5em" }}
        >
          Those with an existing BAD log in
        </div>
        <div style={{ paddingTop: "1em" }}>
          If you had already set-up an account on the old BAD website, you will
          need to:{" "}
          <p style={{ marginTop: 10 }}>
            <span style={{ fontWeight: "bold" }}>Step 1:</span> Click on the
            ‘Login/Register’ button below
          </p>{" "}
          <p>
            <span style={{ fontWeight: "bold" }}>Step 2:</span> On the following
            page, click the ‘sign up now’ button
          </p>
          <p style={{ marginBottom: 10 }}>
            <span style={{ fontWeight: "bold" }}>Step 3:</span> Use the email
            account you currently have registered with the BAD to create an
            account on the new website.
          </p>{" "}
          If you do not use the email associated with your BAD membership
          account, then you will not be reregistered. If you have any issues
          with this process, please email membership@bad.org.uk.
        </div>
      </div>
    );
  };

  const ServeProceedButton = () => {
    return (
      <div className="flex-col">
        <div>
          <p
            className="primary-title"
            style={{ fontSize: 24, paddingTop: "1em" }}
          >
            Already completed either of these steps?
          </p>
          <p>Please proceed to the login below</p>
        </div>
        <div
          className="blue-btn"
          style={{ margin: "1em 0", alignSelf: "flex-start" }}
          onClick={() => loginAction({ state })}
        >
          Login / Register
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
            <ServeLogin />
            <ServeNewRegistrations />
            <ServeProceedButton />
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
