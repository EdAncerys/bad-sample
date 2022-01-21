import { useState, useEffect } from "react";
import { connect } from "frontity";

import date from "date-and-time";

import { colors } from "../../config/imports";

const DATE_MODULE = date;

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

            const dateObject = new Date(date);
            const formattedDate = DATE_MODULE.format(dateObject, "DD MMM YYYY");

            return (
              <div
                key={key}
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  paddingRight: `1em`,
                }}
              >
                <Html2React html={formattedDate} />
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
