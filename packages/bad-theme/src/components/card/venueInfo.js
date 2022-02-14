import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";
import { setGoToAction } from "../../context";
import { muiQuery } from "../../context";

const VenueInfo = ({ state, actions, libraries, venueInfo }) => {
  const { sm, md, lg, xl } = muiQuery();

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!venueInfo) return null;

  const { title, link } = venueInfo;
  const { capacity_options } = venueInfo.acf;

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div
        className="primary-title"
        style={{ fontSize: 22, cursor: "pointer" }}
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
                <span>
                  <Html2React html={item.capacity} />{" "}
                  {key < capacity_options.length - 1 ? "/" : null}
                </span>
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
        className={!lg ? "flex-row" : "flex-col"}
        style={{
          justifyContent: "space-between",
          alignItems: !lg ? "center" : "flex-start",
          color: colors.softBlack,
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
