import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";

const FundingHeader = ({ state, actions, libraries, fundingHeader }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  if (!fundingHeader) return null;

  const { title } = fundingHeader;
  const { information } = fundingHeader.acf;

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div className="primary-title" style={{ fontSize: 20 }}>
        <Html2React html={title.rendered} />
      </div>
    );
  };

  const ServeInfo = () => {
    if (!information) return null;

    return (
      <div
        className="flex-col"
        style={{
          fontSize: 20,
        }}
      >
        <Html2React html={information} />
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
        <ServeInfo />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(FundingHeader);
