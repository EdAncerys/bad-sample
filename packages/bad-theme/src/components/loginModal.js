import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { connect } from "frontity";
import { Modal } from "react-bootstrap";

import Iframe from "react-iframe";
import ActionPlaceholder from "../components/actionPlaceholder";
import CloseIcon from "@mui/icons-material/Close";

import { colors } from "../config/imports";
import RowButton from "./rowButton";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setLoginModalAction,
  setCreateAccountModalAction,
  loginAction,
  authenticateAppAction,
  getUserAction,
} from "../context";

const LoginModal = ({ state, actions }) => {
  const dispatch = useAppDispatch();
  const { loginModalAction, isFetching } = useAppState();

  const codeRef = useRef(null);
  let myIframe = null; // iFrame window

  useLayoutEffect(() => {
    myIframe = document.getElementById("badLoginIframe");
    if (!myIframe) return console.log("No iFrame Detected");

    console.log("myIframe", myIframe);
    myIframe.addEventListener("load", iFrameHandler);
  }, [loginModalAction]);

  // HANDLERS ----------------------------------------------------
  const iFrameHandler = async () => {
    console.log("iFrameHandler triggered");

    try {
      const iframeLocation = myIframe.contentWindow.location.href;
      // const myLocation = `${window.location.protocol}//${windows.location.host}`;
      console.log("iframeLocation", iframeLocation);

      // ⏬⏬  CORS validation on old type browsers ⏬⏬
      // if (!/http:\/\/localhost:3000/i.test(iframeLocation))
      //   throw new Error("Wrong redirection url");

      const iqs = new URLSearchParams(myIframe.contentWindow.location.search);
      console.log("*** READ IFRAME INFORMATION OK **");
      console.log("iqs = %o", iqs.toString());

      if (iqs && iqs.has("transId")) {
        console.log("*** WE FOUND A TRANSACTION ID IN THE IFRAME **");
        console.log("transId", iqs.get("transId"));
        codeRef.current = iqs.get("transId");

        // await loginAction({ state, dispatch, transId: codeRef.current });
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
    console.log("getUserData triggered");
    // --------------------------------------------------------------------------
    // 📌 STEP: Log onto the API server and get the Bearer token
    // --------------------------------------------------------------------------
    const token = await authenticateAppAction({ state });
    // await getUserAction({ state, jwt, transId });

    if (!token) throw new Error("Cannot logon to server.");
    console.log("Getting user information....");

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
    if (user.success) {
      state.context.isActiveUser = user;
      setLoginModalAction({ dispatch, loginModalAction: false });
    }
    console.log("userInfo", user);
  };

  // SERVERS --------------------------------------------------
  const ServeCloseAction = () => {
    return (
      <div
        className="flex"
        onClick={() =>
          setLoginModalAction({ dispatch, loginModalAction: false })
        }
        style={{
          cursor: "pointer",
          justifyContent: "flex-end",
        }}
      >
        <CloseIcon style={{ fontSize: 24, fill: colors.softBlack }} />
      </div>
    );
  };
  const ServeModalContent = () => {
    const ServeFormInfo = () => {
      return (
        <div>
          <ServeCloseAction />
          <div style={{ marginTop: `2em` }}>
            <div className="mb-4">
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
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
        </div>
      );
    };

    const ServeIframe = () => {
      return (
        <div id="iFrame-container" style={{ paddingTop: `2em` }}>
          <Iframe
            // url={process.env.IFRAME_URL}
            url="https://bad-uat.powerappsportals.com/SignIn?returnUrl=%2fhandshake%3faction%3dlogin%2f"
            width="100%"
            height="1000px"
            id="badLoginIframe"
            display="initial"
            position="relative"
          />
        </div>
      );
    };

    return (
      <div className="flex m-4" style={{ flex: 2, paddingRight: `2em` }}>
        <div className="flex-col">
          <Modal.Body>
            {/* <ServeFormInfo /> */}
            <ServeCloseAction />
            <ServeIframe />
          </Modal.Body>
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
              margin: `4em 1em`,
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
        <ActionPlaceholder isFetching={isFetching} />

        <div className="flex-row">
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

export default connect(LoginModal);
