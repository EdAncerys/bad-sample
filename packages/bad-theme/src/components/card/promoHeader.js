import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/colors";

const PromoHeader = ({ state, actions, libraries, fundingPromo }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  if (!fundingPromo) return null;

  const { title, amount, deadline } = fundingPromo;

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: colors.black,
        }}
      >
        <Html2React html={title} />
      </div>
    );
  };

  const ServeAmount = () => {
    if (!amount) return null;

    return (
      <div
        className="flex"
        style={{
          fontSize: 20,
        }}
      >
        <Html2React html={amount} />
      </div>
    );
  };

  const ServeDeadline = () => {
    if (!deadline) return null;

    return (
      <div
        style={{
          fontSize: 16,
        }}
      >
        <Html2React html={deadline} />
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
        <ServeDeadline />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(PromoHeader);
