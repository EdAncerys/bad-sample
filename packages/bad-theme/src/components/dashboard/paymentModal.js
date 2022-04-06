//

import { connect } from "frontity";
import { Modal } from "react-bootstrap";

import CloseIcon from "@mui/icons-material/Close";

// CONTEXT ----------------------------------------------------------------
import {
  setErrorAction,
  getApplicationStatus,
  useAppDispatch,
  useAppState,
} from "../../context";
const PaymentModal = ({ state, actions, payment_url, resetPaymentUrl }) => {
  const dispatch = useAppDispatch();
  const { isActiveUser, refreshJWT } = useAppState();

  if (!payment_url) return null;
  const iFrameHandler = async (e) => {
    const iFrame = e.currentTarget;

    try {
      const iFramePath = iFrame.contentWindow.location.pathname;

      const iqs = new URLSearchParams(iFrame.contentWindow.location.search);

      setErrorAction({
        dispatch,
        isError: { message: "Your payment has been accepted." },
      });

      await getApplicationStatus({
        state,
        dispatch,
        contactid: isActiveUser.contactid,
        refreshJWT,
      });
      resetPaymentUrl();
      if (iqs && iqs.has("transId")) {
        const transId = iqs.get("transId");
        // console.log("*** WE FOUND A TRANSACTION ID IN THE IFRAME ** ", transId); // debug
        setId(transId);
      } else {
        console.log("Error getting transId from iFrame"); // debug
      }
    } catch (error) {
      console.log("*** ERROR GETTING IFRAME CONTENT - CROSS-ORIGIN **"); // debug
      console.log(error); // debug
    }
  };
  return (
    <Modal size="xl" centered show={payment_url ? true : false}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          cursor: "pointer",
        }}
      >
        <CloseIcon onClick={resetPaymentUrl} />
      </div>
      <Modal.Body>
        <iframe
          className="contain"
          id="badPaymentFrame"
          onLoad={iFrameHandler}
          width="100%"
          height="1000"
          src={payment_url}
        ></iframe>
      </Modal.Body>
    </Modal>
  );
};

const styles = {
  container: {},
};

export default connect(PaymentModal);
