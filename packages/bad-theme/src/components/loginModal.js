import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { connect } from "frontity";
import { Modal } from "react-bootstrap";

import Iframe from "react-iframe";

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

  const codeRef = useRef(null);
  let myIframe = null; // iFrame window

  useEffect(() => {
    myIframe = document.getElementById("inlineBADLogon");
    if (!myIframe) return console.log("No iFrame Detected");

    console.log("myIframe", myIframe);
    myIframe.addEventListener("load", iFrameHandler);
  }, [loginModalAction]);

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

  const iFrameHandler = async () => {
    console.log("iFrameHandler triggered");
    const iFrameContainer = document.querySelector(`#iFrame-container`);

    try {
      // let currentWin = `${window.location.protocol}//${windows.location.host}`;
      // let iFrameWin = `${myIframe.contentWindow.location.protocol}//${myIframe.contentWindow.location.host}`;
      // console.log(`${window.location.protocol}//${windows.location.host}`);
      // console.log(`${myIframe.contentWindow.location.protocol}//${myIframe.contentWindow.location.host}`);
      // // ⏬⏬  compares iFrame & window location url. Imitates cross origin error ⏬⏬
      // if (currentWin !== iFrameWin) throw new Error("CROSS-ORIGIN ERROR");

      const currentWin = myIframe.contentWindow.location.href;
      // ⏬⏬ You will need to change the line below to have the correct regex expression for your site. ⏬⏬
      if (!/http:\/\/localhost:3000/i.test(currentWin))
        throw new Error("Wrong redirection url");

      const iqs = new URLSearchParams(myIframe.contentWindow.location.search);
      console.log("*** READ IFRAME INFORMATION OK **");
      console.log("iqs = %o", iqs.toString());

      if (iqs && iqs.has("transId")) {
        console.log("*** WE FOUND A TRANSACTION ID IN THE IFRAME **");
        console.log("transId", iqs.get("transId"));

        if (iFrameContainer) iFrameContainer.style.display = "none"; // hide iFrame if transId received
        const transId = iqs.get("transId");
        codeRef.current = transId;
        // loginAction({ state, dispatch, transId });

        setTimeout(async () => {
          await getUserData();
        }, 100);
      }
      // --------------------------------------------------------------------------
    } catch (error) {
      // 😎 This is not an error handler - it's an error ignorer.
      console.log("*** ERROR GETTING IFRAME CONTENT - CROSS-ORIGIN **");
    }
  };

  const getUserData = async () => {
    console.log("😎😎😎😎😎😎😎😎😎😎 MY_CODE 😎😎😎😎😎😎😎😎😎😎");
    // --------------------------------------------------------------------------
    // 📌 STEP: Check to see if we have a query parameter, of we do not then show
    //          the logon iframe
    // --------------------------------------------------------------------------
    console.log("Query ", codeRef.current);
    if (codeRef.current) {
      // we will now process the trans
      // fr.style.display = "none"; // hide iFrame
      console.log("hide iFrame");
    } else {
      // return (fr.style.display = "inherit");
      console.log("error. No codeRef found");
    }

    // --------------------------------------------------------------------------
    // 📌 STEP: Log onto the API server and get the Bearer token
    // --------------------------------------------------------------------------
    console.log("Loging in to API server....");
    let res = await fetch(
      "https://skylarkdev.digital/dynamicsbridge/users/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "chris.cullen",
          password: "IDUAF-eozv7",
        }),
      }
    );
    res = await res.json();
    console.log(JSON.stringify(res, null, 2));
    let token;
    if ("token" in res) token = res.token;
    if (!token) throw new Error("Cannot logon to server.");
    console.log("Getting transId information....");

    let user = await fetch(
      "https://skylarkdev.digital/dynamicsbridge/redirect/CoreModule.aspx/trans",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          transId: codeRef.current,
        }),
      }
    );

    user = await user.json();

    setLoginModalAction({ dispatch, loginModalAction: false });
    state.context.isActiveUser = JSON.stringify(user, null, 2);
    console.log("userInfo", JSON.stringify(user, null, 2));
  };

  // SERVERS --------------------------------------------------
  const ServeModalContent = () => {
    const ServeForm = () => {
      return (
        <div>
          {/* <form>
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
          </form> */}

          <div id="iFrame-container" style={{ paddingTop: `2em` }}>
            <Iframe
              url="https://bad-uat.powerappsportals.com/SignIn?returnUrl=%2fhandshake%3faction%3dlogin%2f"
              width="100%"
              height="600px"
              id="inlineBADLogon"
              className="myClassname"
              display="initial"
              position="relative"
            />
          </div>
        </div>
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
            // onClick={() => loginAction({ state, dispatch })}
            onClick={handleLoginAction}
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
          {/* <ServeActions /> */}
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
