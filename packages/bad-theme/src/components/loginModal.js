import React, { useState, useEffect } from "react";
import { connect } from "frontity";
import Link from "@frontity/components/link";
import Image from "@frontity/components/image";
import { Modal } from "react-bootstrap";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState, setLoginAction } from "../context";
import { colors } from "../config/colors";

const loginModal = ({ state, actions }) => {
  const dispatch = useAppDispatch();
  const { setLogin } = useAppState();
  const data = state.source.get(state.router.link);

  // HELPERS ----------------------------------------------------
  const handleSetLoading = () => {
    setLoginAction({ dispatch, setLogin: false });
  };

  return (
    <div>
      <Modal
        show={setLogin}
        onHide={handleSetLoading}
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Custom Modal Styling
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Ipsum molestiae natus adipisci modi eligendi? Debitis amet quae unde
            commodi aspernatur enim, consectetur. Cumque deleniti temporibus
            ipsam atque a dolores quisquam quisquam adipisci possimus
            laboriosam. Quibusdam facilis doloribus debitis! Sit quasi quod
            accusamus eos quod. Ab quos consequuntur eaque quo rem! Mollitia
            reiciendis porro quo magni incidunt dolore amet atque facilis ipsum
            deleniti rem!
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const styles = {
  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "500",
    color: colors.primary,
  },
};

export default connect(loginModal);
