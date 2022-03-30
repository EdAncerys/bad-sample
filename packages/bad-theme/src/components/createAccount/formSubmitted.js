import { connect } from "frontity";
import { Modal } from "react-bootstrap";
import Image from "@frontity/components/image";

import { colors } from "../../config/imports";
import Tick from "../../img/svg/tick.svg";

const FormSubmitted = ({ state, actions, formSubmitted }) => {
  if (!formSubmitted) return null;

  const ServeCardImage = () => {
    const alt = "Completed";

    return (
      <div style={{ width: 260, height: 260, overflow: "hidden" }}>
        <Image src={Tick} className="d-block h-100" alt={alt} />
      </div>
    );
  };

  // RETURN ---------------------------------------------
  return (
    <div className="flex m-4" style={{ flex: 2, paddingRight: `2em` }}>
      <div className="flex-col">
        <Modal.Body style={{ padding: 0 }}>
          <div className="flex-center-col">
            <ServeCardImage />
            <div style={{ color: colors.darkSilver, margin: `1em 0` }}>
              We have sent a confirmation email for your response. Please ensure
              to check your spam box incase you can’t find it your inbox.
            </div>
          </div>
        </Modal.Body>
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(FormSubmitted);
