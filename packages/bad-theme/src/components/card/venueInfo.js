import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/colors";
import { setGoToAction } from "../../context";

const VenueInfo = ({ state, actions, libraries, venueInfo }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!venueInfo) return null;

  const { title, link } = venueInfo;
  const { capacity_options } = venueInfo.acf;

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div
        style={{ fontSize: 22, fontWeight: "bold", cursor: "pointer" }}
        onClick={() => setGoToAction({ path: link, actions })}
      >
        <Html2React html={title.rendered} />
      </div>
    );
  };

  const ServeCapacity = () => {
    if (!capacity_options) return null;

    return (
      <div>
        <div
          className="flex-row"
          style={{ fontSize: 14, textTransform: "capitalize" }}
        >
          <div style={{ textTransform: "uppercase", paddingRight: 5 }}>
            Capacity:
          </div>
          {capacity_options.map((item, key) => {
            return (
              <div key={key} style={{ paddingRight: 5 }}>
                <Html2React html={item.capacity} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div
        className="flex-row"
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          color: colors.black,
        }}
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
