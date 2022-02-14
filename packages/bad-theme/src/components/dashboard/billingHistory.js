import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import { padding } from "@mui/system";

import { muiQuery } from "../../context";
const BillingHistory = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const { sm, md, lg, xl } = muiQuery();

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const PAYMENTS = [1, 2, 3];

  // HELPERS ----------------------------------------------------------------
  const handleDownloadPayment = () => {
    console.log("API call download payment");
  };

  // SERVERS ---------------------------------------------
  const ServePayments = ({ block, item }) => {
    const ServeInfo = () => {
      const isLastItem = PAYMENTS.length === item + 1;

      return (
        <div
          className="flex"
          style={{
            borderBottom: isLastItem
              ? "none"
              : `1px solid ${colors.darkSilver}`,
            padding: `1em`,
            marginRight: marginHorizontal * 2,
          }}
        >
          <div className="flex" style={styles.textInfo}>
            <div>Details of the invoice to be paid.</div>
          </div>
          <div className="flex" style={styles.textInfo}>
            <div>01/12/2021</div>
          </div>
        </div>
      );
    };

    return (
      <div className="flex-row">
        <ServeInfo />
      </div>
    );
  };

  const ServeSubTitle = ({ title }) => {
    const ServeActions = () => {
      return (
        <div style={{ margin: `auto 0` }}>
          <div
            className="flex"
            style={{ alignItems: "center", padding: !lg ? `0 2em` : 0 }}
          >
            <div
              type="submit"
              className="blue-btn"
              onClick={handleDownloadPayment}
            >
              Download Payment
            </div>
          </div>
        </div>
      );
    };

    return (
      <div
        className="flex"
        style={{ padding: `1em 0`, flexDirection: !lg ? null : "column" }}
      >
        <div className="flex" style={{ justifyItems: "center" }}>
          {title}
        </div>
        <ServeActions />
      </div>
    );
  };

  return (
    <div
      className="shadow"
      style={{
        padding: !lg ? `2em 4em` : "1em",
        marginBottom: `${marginVertical}px`,
      }}
    >
      <div className="primary-title" style={{ fontSize: 20 }}>
        Billing History:
      </div>
      <ServeSubTitle title="2021" />
      {PAYMENTS.map((block, key) => {
        return <ServePayments key={key} block={block} item={key} />;
      })}

      <div
        className="flex"
        style={{
          borderBottom: `1px solid ${colors.darkSilver}`,
          margin: `1em 0`,
        }}
      />

      <ServeSubTitle title="2020" />
      {PAYMENTS.map((block, key) => {
        return <ServePayments key={key} block={block} item={key} />;
      })}
    </div>
  );
};

const styles = {
  textInfo: {
    textInfo: 12,
  },
};

export default connect(BillingHistory);
