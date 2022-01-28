import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/imports";
import DirectDebit from "../../img/svg/directDebit.svg";
// CONTEXT ----------------------------------------------------------------
import { useAppState } from "../../context";

const DirectDebitSetup = ({ state, actions, libraries, setPage }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const { isActiveUser } = useAppState();

  const marginVertical = state.theme.marginVertical;

  // HELPERS ----------------------------------------------------------------
  const handleDirectDebitSetup = () => {
    const email = document.querySelector("#email").value;
    const accountName = document.querySelector("#accountName").value;
    const accountNumber = document.querySelector("#accountNumber").value;
    const sortCode = document.querySelector("#sortCode").value;

    const detailSummary = {
      email,
      accountName,
      accountNumber,
      sortCode,
    };
    console.log("detailSummary", detailSummary);
  };

  // HELPERS ----------------------------------------------------------------
  const handlePayment = () => {
    setPage({ page: "billing" });
  };

  // SERVERS ---------------------------------------------
  const ServeInfo = () => {
    return (
      <div style={{ padding: `1em 0` }}>
        By submitting this direct debit request you are verifying that you are
        the account holder and therefore the payer and also that you are the
        only person required to authorise debits from the account. If you are
        not the account holder or more than one person has to authorise debits
        from the account then you must complete a paper direct debit mandate. If
        this is the case, please contact us at membership@bad.org.uk to arrange.
        When you set up your direct debit all of you BAD and Special Interest
        Groups subscriptions will be collected via this method. Your
        instructions will be collected on the 1st January each year, or nearest
        working day thereafter.
      </div>
    );
  };

  const ServeConditions = () => {
    return (
      <div style={{ paddingTop: `2em` }}>
        You will receive advance notice of at least 5 days of any amount to be
        debited under the instruction. Payments will show as ‘British
        Association of Dermatologists’ on your bank statement. After you
        complete the set up an email confirmation will be sent to (enter email)
        within 3 working days.
      </div>
    );
  };

  const ServeImage = () => {
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

  const ServeForm = () => {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `1fr 1fr`,
          gap: `5px 20px`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `1fr`,
            gridTemplateRows: `repeat(4, 70px)`,
            gap: `20px`,
            paddingTop: `1em`,
          }}
        >
          <div>
            <label>Email</label>
            <input
              id="email"
              type="text"
              className="form-control"
              placeholder="Email"
              defaultValue={isActiveUser.emailaddress1}
              style={styles.input}
            />
          </div>
          <div>
            <label>Account Name</label>
            <input
              id="accountName"
              type="text"
              className="form-control"
              placeholder="Account Name"
              style={styles.input}
            />
          </div>
          <div>
            <label>Account Number</label>
            <input
              id="accountNumber"
              type="text"
              className="form-control"
              placeholder="Account Number"
              style={styles.input}
            />
          </div>
          <div>
            <label>Sort Code</label>
            <input
              id="sortCode"
              type="text"
              className="form-control"
              placeholder="Sort Code"
              style={styles.input}
            />
          </div>
        </div>
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
          type="submit"
          className="transparent-btn"
          style={{ marginRight: `2em` }}
          onClick={handlePayment}
        >
          Cancel
        </div>
        <div
          type="submit"
          className="blue-btn"
          onClick={handleDirectDebitSetup}
        >
          Click here to setup your direct debit
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------
  return (
    <div>
      <div
        className="shadow"
        style={{ padding: `2em 4em`, marginBottom: `${marginVertical}px` }}
      >
        <div className="primary-title" style={{ fontSize: 20 }}>
          Direct Debit Details
        </div>
        <ServeInfo />

        <div
          className="primary-title"
          style={{ fontSize: 20, paddingTop: `1em` }}
        >
          Please enter your direct debit details:
        </div>
        <ServeForm />
        <ServeConditions />

        <ServeActions />
      </div>
      <div
        className="shadow"
        style={{ padding: `2em 4em`, marginBottom: `${marginVertical}px` }}
      >
        <div className="primary-title" style={{ fontSize: 20 }}>
          Your payments are protected by the direct debit guarantee:
        </div>
        <ServeImage />
      </div>
    </div>
  );
};

const styles = {
  input: {
    borderRadius: 10,
  },
  summary: {
    fontSize: 12,
    color: colors.darkSilver,
    border: `1px solid ${colors.silver}`,
    borderRadius: 10,
    padding: `0.375rem 0.75rem`,
    margin: `10px 0`,
  },
};

export default connect(DirectDebitSetup);
