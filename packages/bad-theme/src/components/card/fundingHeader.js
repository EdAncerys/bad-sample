import { useState, useEffect } from "react";
import { connect } from "frontity";

import date from "date-and-time";
const DATE_MODULE = date;

import { colors } from "../../config/imports";

const FundingHeader = ({ state, actions, libraries, fundingHeader }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  if (!fundingHeader) return null;

  const { title } = fundingHeader;
  const { amount, opening_date } = fundingHeader.acf;

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div className="primary-title" style={{ fontSize: 20 }}>
        <Html2React html={title.rendered} />
      </div>
    );
  };

  const ServeAmount = () => {
    if (!amount) return null;

    return (
      <div
        className="primary-title flex-col"
        style={{
          fontSize: 20,
        }}
      >
        <Html2React html={amount} />
      </div>
    );
  };

  const ServeDate = () => {
    if (!opening_date) return null;

    const dateObject = new Date(opening_date);
    const formattedDate = DATE_MODULE.format(dateObject, "DD MMMM");

    console.log(formattedDate);

    return (
      <div
        className="flex-col"
        style={{
          fontSize: 20,
        }}
      >
        {`${formattedDate} each year`}
      </div>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: 150,
        padding: `2em`,
        backgroundColor: colors.lightSilver,
        overflow: "auto",
      }}
    >
      <div className="flex-col" style={{ height: "100%" }}>
        <ServeTitle />
        <ServeAmount />
        <ServeDate />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(FundingHeader);
