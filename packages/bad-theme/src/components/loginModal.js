//

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { connect } from "frontity";
import { Modal } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import { colors } from "../config/imports";

// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setLoginModalAction,
  loginAction,
  getUserDataByContactId,
} from "../context";

const LoginModal = ({ state, actions }) => {
  const dispatch = useAppDispatch();
  const { loginModalAction } = useAppState();

  const [id, setId] = useState(null);
  const iFrameRef = useRef(null);

  useEffect(async () => {
    if (!id) return null;

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
    // 👉 iFrame have to have correct redirect url se to for redirect to work.
    // Redirect url set in dynamics server.

    try {
      const iFramePath = iFrame.contentWindow.location.pathname;

      const iqs = new URLSearchParams(iFrame.contentWindow.location.search);
      if (iqs && iqs.has("transId")) {
        const transId = iqs.get("transId");
        // console.log("*** WE FOUND A TRANSACTION ID IN THE IFRAME ** ", transId);
        setId(transId);
      } else {
        // console.log("Error getting transId from iFrame");
      }
    } catch (error) {
      // console.log("*** ERROR GETTING IFRAME CONTENT - CROSS-ORIGIN **"); // debug
      // console.log(error); // debug
    }
  };

  // SERVERS --------------------------------------------------
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
            <div>Login / Register</div>
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
