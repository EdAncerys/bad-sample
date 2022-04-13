import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import DirectDebit from "../../img/svg/directDebit.svg";
import Loading from "../loading";
import ActionPlaceholder from "../actionPlaceholder";
// CONTEXT ----------------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  getDirectDebitAction,
  createDirectDebitAction,
  setErrorAction,
  setDebitHandlerAction,
} from "../../context";

const DirectDebitPayment = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { isActiveUser, directDebitPath, refreshJWT } = useAppState();

  const [isFetching, setFetching] = useState(false);
  const marginVertical = state.theme.marginVertical;

  if (!isActiveUser) return <Loading />;

  // HELPERS ----------------------------------------------------------------
  const handleDirectDebitSetup = async () => {
    if (!directDebitPath) return null;

    const { data } = directDebitPath;

    try {
      setFetching(true);
      const debitResponse = await createDirectDebitAction({
        state,
        id: isActiveUser.contactid,
        data: {
          bad_transactiontype: "0S",
          core_name: data.core_name,
          core_accountnumber: data.core_accountnumber,
          core_sortcode: data.core_sortcode,
        },
        dispatch,
        refreshJWT,
      });

      if (debitResponse.success) {
        await getDirectDebitAction({
          state,
          dispatch,
          id: isActiveUser.contactid,
          refreshJWT,
        });
        setDebitHandlerAction({
          dispatch,
          directDebitPath: { page: "billing" },
        }); // redirect to payment
        setErrorAction({
          dispatch,
          isError: { message: "Direct debit has been successfully setup" },
        });
      } else {
        // console.log("⬇️ Failed to create direct debit ⬇️");
        // console.log(debitResponse);

        setErrorAction({
          dispatch,
          isError: {
            message: "Failed to create setup direct debit. Please try again.",
          },
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  };

  // HELPERS ----------------------------------------------------------------
  const handleBack = () => {
    setDebitHandlerAction({
      dispatch,
      directDebitPath: { page: "directDebitSetup" },
    });
  };

  // SERVERS ---------------------------------------------
  const ServeInfo = () => {
    if (!directDebitPath) return null;

    const { data } = directDebitPath;
    // get current year
    const currentYear = new Date().getFullYear();

    const ServeDataString = ({ title, value, paddingTop }) => {
      return (
        <div
          className="flex-row primary-title"
          style={{ paddingTop: paddingTop || "1em" }}
        >
          <div>{title}</div>
          <div style={{ fontWeight: "normal", paddingLeft: "0.5em" }}>
            {value}
          </div>
        </div>
      );
    };

    return (
      <div style={{ padding: `2em 0 1em 0` }}>
        <ServeDataString title="Email:" value={data.py3_email} paddingTop="0" />
        <ServeDataString title="Account Name:" value={data.core_name} />
        <ServeDataString
          title="Account Number:"
          value={data.core_accountnumber}
        />
        <ServeDataString title="Sort Code:" value={data.core_sortcode} />
        <ServeDataString title="Frequency:" value="Annual Collection" />
        <ServeDataString
          title="Date of Collection:"
          value={`1st of February ${
            currentYear + 1
          } or first working day thereafter`}
        />
        <ServeDataString
          title="Name to appears on your statement:"
          value="The British Association of Dermatologists"
        />
      </div>
    );
  };

  const ServeConditions = () => {
    return (
      <div style={{ paddingTop: "1em" }}>
        You will receive advance notice of at least 5 days of any amount to be
        debited under the instruction. Payments will show as ‘British
        Association of Dermatologists’ on your bank statement. After you
        complete the set up an email confirmation will be sent to (enter email)
        within 3 working days.
      </div>
    );
  };

  const ServeDirectDebitInfo = () => {
    if (!DirectDebit) return null;

    return (
      <div style={{ width: "100%", height: "100%", paddingTop: `2em` }}>
        <Image
          src={DirectDebit}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    );
  };

  const ServeActions = () => {
    return (
      <div
        className="flex"
        style={{ justifyContent: "flex-end", padding: `2em 0 0` }}
      >
        <div
          className="transparent-btn"
          style={{ marginRight: `2em` }}
          onClick={handleBack}
        >
          Back
        </div>
        <div className="blue-btn" onClick={handleDirectDebitSetup}>
          Confirm And Setup Direct Debit
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------
  return (
    <div>
      <div style={{ position: "relative" }}>
        <ActionPlaceholder isFetching={isFetching} background="transparent" />
        <div
          className="shadow"
          style={{ padding: `2em 4em`, marginBottom: `${marginVertical}px` }}
        >
          <div className="primary-title" style={{ fontSize: 36 }}>
            Confirmation of details for submission
          </div>
          <ServeInfo />

          <ServeConditions />
          <ServeActions />
        </div>
      </div>
      <div
        className="shadow"
        style={{ padding: `2em 4em`, marginBottom: `${marginVertical}px` }}
      >
        <div className="primary-title" style={{ fontSize: 20 }}>
          Your payments are protected by the direct debit guarantee:
        </div>
        <ServeDirectDebitInfo />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(DirectDebitPayment);
