import { connect } from "frontity";
import { Modal } from "react-bootstrap";

import { colors } from "../config/imports";
import Image from "@frontity/components/image";
import CheckMark from "../img/svg/checkMark.svg";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState, setErrorAction } from "../context";

const ErrorModal = ({ state, actions }) => {
  const dispatch = useAppDispatch();
  const { isError } = useAppState();

  const bannerHeight = state.theme.bannerHeight;

  if (!isError) return null; // error handler

  // HANDLERS ----------------------------------------------------
  const actionHandler = () => {
    setErrorAction({ dispatch, isError: null });
  };

  // SERVERS --------------------------------------------------
  const ServeActions = () => {
    return (
      <div>
        <div
          className="flex"
          style={{
            justifyContent: "flex-end",
            paddingTop: `2em`,
          }}
        >
          <div className="blue-btn" onClick={actionHandler}>
            Close
          </div>
        </div>
      </div>
    );
  };

  const ServeModalContent = () => {
    const { message } = isError;

    return (
      <div
        className="flex"
        style={{ padding: `1em 2em`, minHeight: bannerHeight }}
      >
        <div className="flex-col">
          <Modal.Body className="flex-col">
            {CheckMark && (
              <div
                style={{
                  width: 180,
                  maxHeight: 180,
                  margin: "0 auto",
                }}
              >
                <Image
                  src={CheckMark}
                  alt="BAD Complete"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>
            )}

            <div
              className="flex primary-title"
              style={{
                display: "grid",
                textAlign: "center",
                paddingTop: `3em`,
              }}
            >
              {message}
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
