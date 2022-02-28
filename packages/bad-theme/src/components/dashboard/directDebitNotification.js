import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
// CONTEXT ------------------------------------------------------------------
import { useAppState } from "../../context";

const DirectDebitNotification = ({
  state,
  actions,
  libraries,
  setPage,
  visible,
  setVisible,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const { sm, md, lg, xl } = muiQuery();

  const { isDirectDebit } = useAppState();

  const marginVertical = state.theme.marginVertical;

  const [isDebitSetup, setDebitSetup] = useState(false);

  useEffect(() => {
    if (!isDirectDebit) return null;
    let debitStatus = false;

    isDirectDebit.map((debit) => {
      if (debit.statecode === "Active") debitStatus = true;
    });

    setDebitSetup(debitStatus);
  }, []);

  if (!visible || !isDirectDebit || isDebitSetup) return null;

  // HELPERS ----------------------------------------------------------------
  const handlePayment = () => {
    setPage({ page: "directDebitSetup" });
  };

  // SERVERS ---------------------------------------------
  const ServeActions = () => {
    return (
      <div className="flex" style={{ margin: `auto 0` }}>
        <div style={{ padding: !lg ? `0 2em` : "1em" }}>
          <div type="submit" className="blue-btn" onClick={handlePayment}>
            Setup Direct Debit
          </div>
        </div>
        <div>
          <div
            type="submit"
            className="transparent-btn"
            onClick={() => setVisible(false)}
          >
            Dismiss
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="shadow"
      style={{
        display: "grid",
        gridTemplateColumns: !lg ? `1fr auto` : `1fr`,
        gap: "1em",
        padding: !lg ? `2em 4em` : "1em",
        marginBottom: `${marginVertical}px`,
      }}
    >
      <div
        className="primary-title flex"
        style={{ fontSize: 20, alignItems: "center" }}
      >
        Please complete the Direct Debit Guarantee to automatically renew your
        membership.
      </div>
      <ServeActions />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(DirectDebitNotification);
