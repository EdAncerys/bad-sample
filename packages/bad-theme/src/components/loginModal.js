//

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { connect } from "frontity";
import { Modal } from "react-bootstrap";

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
  getUserDataByContactId,
  authenticateAppAction,
} from "../context";

const LoginModal = ({ state, actions }) => {
  const dispatch = useAppDispatch();
  const { loginModalAction, isFetching } = useAppState();

  const [id, setId] = useState(null);
  const iFrameRef = useRef(null);

  useEffect(async () => {
    if (!id) return null;

    console.log("useEffect trigeted. ID ", id);
    await loginAction({ state, dispatch, transId: id });

    return () => {
      iFrameRef.current = false; // clean up function
    };
  }, [id]);

  useLayoutEffect(() => {
    setId(null);
  }, [loginModalAction]);

  // HANDLERS ----------------------------------------------------
  const iFrameHandler = async (e) => {
    const iFrame = e.currentTarget;

    // development env default login action
    if (state.auth.ENVIRONMENT === "DEVELOPMENT") {
      const jwt = await authenticateAppAction({ state, dispatch });
      await getUserDataByContactId({
        state,
        dispatch,
        jwt,
        contactid: "cc9a332a-3672-ec11-8943-000d3a43c136", // andy
        // contactid: "969ba377-a398-ec11-b400-000d3aaedef5", // emilia
      });
      setLoginModalAction({ dispatch, loginModalAction: false });
      return;
    }

    try {
      const iFramePath = iFrame.contentWindow.location.pathname;
      // console.log("iFramePath", iFramePath); // debug

      // ⏬⏬  CORS validation on old type browsers ⏬⏬
      // if (
      //   !iframeLocation.includes(`3000`) ||
      //   !iframeLocation.includes(state.auth.APP_URL)
      // )
      //   throw new Error("Wrong redirection url");

      const iqs = new URLSearchParams(iFrame.contentWindow.location.search);
      console.log("iFrameRef iqs", iqs);
      if (iqs && iqs.has("transId")) {
        const transId = iqs.get("transId");
        console.log("*** WE FOUND A TRANSACTION ID IN THE IFRAME ** ", transId);
        setId(transId);
      } else {
        console.log("Error getting transId from iFrame");
      }
    } catch (error) {
      console.log("*** ERROR GETTING IFRAME CONTENT - CROSS-ORIGIN **");
      // console.log(error); // debug
    }
  };

  // SERVERS --------------------------------------------------
  const ServeFormInfo = () => {
    return (
      <div>
        {/* <ServeCloseAction /> */}
        <div style={{ marginTop: `2em` }}>
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
      </div>
    );
  };

  const ServeModalContent = () => {
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

    const ServeIframe = () => {
      if (id) return null;

      return (
        <div id="iFrame-container" style={{ paddingTop: `2em` }}>
          <iframe
            className="contain"
            id="badLoginIframe"
            onLoad={iFrameHandler}
            width="100%"
            height="1000"
            src={state.auth.IFRAME_URL}
          ></iframe>
        </div>
      );
    };

    return (
      <div
        className="flex m-4"
        style={{ flex: 2, paddingRight: `2em`, minHeight: 1150 }}
      >
        <div className="flex-col">
          <Modal.Body>
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
