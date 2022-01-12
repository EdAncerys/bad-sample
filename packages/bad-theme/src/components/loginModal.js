import React, { useState, useEffect } from "react";
import { connect } from "frontity";
import { Modal } from "react-bootstrap";

import { colors } from "../config/imports";
import RowButton from "./rowButton";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setLoginModalAction,
  setCreateAccountModalAction,
  loginAction,
} from "../context";

const LoginModal = ({ state, actions }) => {
  const dispatch = useAppDispatch();
  const { loginModalAction } = useAppState();

  // HANDLERS ----------------------------------------------------
  const handleLoginAction = () => {
    const username = document.querySelector(`#username`).value;
    const password = document.querySelector(`#password`).value;
    const rememberMe = document.querySelector("#rememberMe").checked;

    const loginData = {
      username,
      password,
      rememberMe,
    };

    loginAction({
      state,
      dispatch,
      loginData,
    });
  };

  // SERVERS --------------------------------------------------
  const ServeModalContent = () => {
    const ServeForm = () => {
      return (
        <form>
          <div style={{ margin: `2em 0` }}>
            <label className="form-label">Email address</label>
            <input
              id="username"
              type="email"
              className="form-control"
              placeholder="Email Address"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Password"
            />
          </div>
          <div className="flex">
            <div className="flex-row" style={styles.wrapper}>
              <div>
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="form-check-input"
                  style={styles.checkBox}
                />
              </div>
              <div className="flex" style={styles.textInfo}>
                Remember Me
              </div>
              <div className="caps-btn" onClick={handleLoginAction}>
                Forgotten Password?
              </div>
            </div>
          </div>
        </form>
      );
    };

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
          <RowButton
            block={{
              title: "Not yet registered? Register here",
            }}
            onClick={() => {
              setCreateAccountModalAction({
                dispatch,
                createAccountAction: true,
              });
              setLoginModalAction({ dispatch, loginModalAction: false });
            }}
            buttonWidth="60%"
          />
        </div>
      );
    };

    const ServeActions = () => {
      return (
        <Modal.Footer>
          <div
            className="transparent-btn"
            onClick={() =>
              setLoginModalAction({
                dispatch,
                loginModalAction: !loginModalAction,
              })
            }
          >
            Exit
          </div>

          <div
            className="blue-btn"
            onClick={() => loginAction({ state, dispatch })}
          >
            Login
          </div>
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
            className="primary-title"
            style={{
              fontSize: 20,
              borderBottom: `1px solid ${colors.darkSilver}`,
              padding: `1em 1em 1em 0`,
              margin: `3em 1em`,
            }}
          >
            <div>Login</div>
          </div>
        </Modal.Body>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div>
      <Modal show={loginModalAction} size="xl" centered>
        <div className="flex-row">
          <ServeModalInfo />
          <ServeModalContent />
        </div>
      </Modal>
    </div>
  );
};

const styles = {
  checkBox: {
    borderRadius: "50%",
    width: 20,
    height: 20,
    marginRight: 10,
  },
  wrapper: {
    paddingTop: `1em`,
  },
  textInfo: {
    textInfo: 12,
  },
};

export default connect(LoginModal);
