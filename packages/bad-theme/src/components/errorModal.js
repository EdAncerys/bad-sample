import { useEffect } from "react";
import { connect } from "frontity";
import { Modal } from "react-bootstrap";

import Image from "@frontity/components/image";
import CheckMark from "../img/svg/checkMark.svg";
import Error from "../img/svg/error.svg";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setErrorAction,
  setGoToAction,
  muiQuery,
  Parcer,
} from "../context";

const ErrorModal = ({ state, actions, libraries }) => {
  const dispatch = useAppDispatch();
  const { isError } = useAppState();
  const { lg } = muiQuery();
  const bannerHeight = state.theme.bannerHeight;

  // HANDLERS ----------------------------------------------------
  const handleKeyPress = (e) => {
    // handle close modal on enter key
    if (isError && e.key === "Enter") actionHandler();
  };

  const actionHandler = () => {
    setErrorAction({ dispatch, isError: null });
  };

  // add DOM event listener on key press to close modal
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  });

  if (!isError) return null; // error handler

  const gotToActionHandler = ({ path }) => {
    setGoToAction({ state, path, actions });
    setErrorAction({ dispatch, isError: null });
  };

  // SERVERS --------------------------------------------------
  const ServeActions = () => {
    const ServeGoToAction = () => {
      if (!isError.goToPath) return null;

      return (
        <div
          className="blue-btn"
          title={isError?.goToPath?.label}
          style={{ marginRight: "1em", fontSize: !lg ? null : 13 }}
          onClick={() => gotToActionHandler({ path: isError.goToPath.path })}
        >
          {isError?.goToPath?.label}
        </div>
      );
    };

    const ServeAction = () => {
      if (!isError.action) return null;

      return (
        <div>
          <div
            className={!lg ? "flex" : "flex-col"}
            style={{ gap: !lg ? null : 20 }}
          >
            {isError.action.map((action, index) => {
              return (
                <div
                  key={index}
                  className="blue-btn"
                  title={action?.label}
                  style={{ marginRight: !lg ? "1em" : null }}
                  onClick={action.handler}
                >
                  {action.label}
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      <div>
        <div
          className={!lg ? "flex" : "flex-col"}
          style={{
            justifyContent: "flex-end",
            gap: !lg ? null : 20,
            marginTop: !lg ? null : "1em",
          }}
        >
          <ServeGoToAction />
          <ServeAction />
          <div
            className="blue-btn"
            onClick={actionHandler}
            // 👇 testing purposes attribute
            data-type="close-modal"
            onKeyPress={(e) => handleKeyPress(e)}
          >
            Close
          </div>
        </div>
      </div>
    );
  };

  const ServeModalContent = () => {
    const { message, image } = isError;

    const ServeImage = () => {
      // error msg image options
      const errorImage = {
        Error,
        CheckMark,
      };
      let modalImage = image ? errorImage[image] : CheckMark;

      return (
        <div
          style={{
            width: !lg ? 250 : 100,
            maxHeight: 250,
            margin: "0 auto",
          }}
        >
          <Image
            src={modalImage}
            alt="BAD Error Image"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      );
    };
    return (
      <div
        className="flex"
        style={{ padding: !lg ? `1em 2em` : "1em", minHeight: bannerHeight }}
      >
        <div className="flex-col">
          <Modal.Body className="flex-col">
            <ServeImage />

            <div
              className="flex primary-title"
              style={{
                display: "grid",
                textAlign: "center",
                padding: !lg ? `2em 0` : 0,
                fontSize: message.length < 300 ? (!lg ? 26 : 16) : 16,
                marginTop: !lg ? null : "1em",
              }}
            >
              <Parcer libraries={libraries} html={message} />
            </div>
            <ServeActions />
          </Modal.Body>
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div>
      <Modal show={isError} size="lg" centered>
        <div className="flex-row">
          <ServeModalContent />
        </div>
      </Modal>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(ErrorModal);
