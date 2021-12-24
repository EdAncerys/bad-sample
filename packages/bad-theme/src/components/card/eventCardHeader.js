import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../../config/imports";

const EventCardHeader = ({ state, actions, libraries, eventHeader }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!eventHeader || !eventHeader.date_time) return null;

  const { date_time } = eventHeader;

  // SERVERS ---------------------------------------------
  const ServeDate = () => {
    if (!date_time) return null;

    return (
      <div>
        <div className="flex">
          {date_time.map((block, key) => {
            const { date, end_time, start_time } = block;

            return (
              <div
                key={key}
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  paddingRight: `1em`,
                }}
              >
                <Html2React html={date} />
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
        className="flex"
        style={{
          padding: `0.5em`,
          backgroundColor: colors.lightSilver,
          fontSize: 12,
          letterSpacing: 2,
          borderRadius: 5,
          textTransform: "uppercase",
          marginBottom: `2em`,
          flexWrap: "wrap",
        }}
      >
        <ServeDate />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(EventCardHeader);
