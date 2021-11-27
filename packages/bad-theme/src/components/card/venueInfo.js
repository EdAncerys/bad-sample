import { useState, useEffect } from "react";
import { connect } from "frontity";

const VenueInfo = ({ state, actions, libraries, venueInfo }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!venueInfo) return null;
  const { capacity, title } = venueInfo;

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div style={{ fontSize: 22, fontWeight: "bold" }}>
        <Html2React html={title} />
      </div>
    );
  };

  const ServeCapacity = () => {
    if (!capacity) return null;

    return (
      <div style={{ fontSize: 14, textTransform: "uppercase" }}>
        <Html2React html={capacity} />
      </div>
    );
  };

  return (
    <div>
      <div
        className="flex-row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <ServeTitle />
        <ServeCapacity />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(VenueInfo);
