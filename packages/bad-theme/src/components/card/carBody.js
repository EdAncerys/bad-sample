import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../../config/imports";
import ElectionInfo from "./electionInfo";

const CardBody = ({
  state,
  actions,
  libraries,
  title,
  body,
  date,
  seatNumber,
  heroBanner,
  newsCarousel,
  TEXT_ALIGN,
  isFrom4Col,
  electionInfo,
  limitBodyLength,
  limitTitleLength,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  let CONTENT_ALIGNMENT = 0;
  if (heroBanner || newsCarousel) CONTENT_ALIGNMENT = `auto 0`;

  let PADDING = 0;
  if (heroBanner) PADDING = `1em 2em`;

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    let TITLE_HEIGHT = "auto";
    if (isFrom4Col) TITLE_HEIGHT = 60;

    let titlePreview = title;
    const MAX_CHAR = 45;
    if (title.length > MAX_CHAR && isFrom4Col)
      titlePreview = `${title.slice(0, MAX_CHAR)}...`;
    if (!body) titlePreview = title;
    if (!body && isFrom4Col) titlePreview = `${title.slice(0, 80)}`;
    if (limitTitleLength) titlePreview = `${title.slice(0, MAX_CHAR)}...`;

    return (
      <div
        className="flex primary-title"
        style={{
          fontSize: heroBanner ? `2.25rem` : 20,
          minHeight: TITLE_HEIGHT,
          maxHeight: isFrom4Col ? "7em" : "auto", // restricting title height
          overflow: "hidden",
          fontWeight: "bold",
          color: heroBanner ? colors.trueBlack : colors.black,
          alignItems: newsCarousel ? "center" : "flex-start",
        }}
      >
        <Html2React html={titlePreview} />
      </div>
    );
  };

  const ServeBody = () => {
    if (!body) return null;

    let bodyPreview = body;
    const MAX_CHAR = 90;
    if (body.length >= MAX_CHAR && isFrom4Col)
      bodyPreview = `${body.slice(0, MAX_CHAR)}...`;
    if (limitBodyLength) bodyPreview = `${body.slice(0, MAX_CHAR)}...`;

    return (
      <div
        style={{
          fontSize: 16,
          overflow: "auto",
          paddingTop: title ? `1em` : 0,
        }}
      >
        <Html2React html={bodyPreview} />
      </div>
    );
  };

  const ServeSeatsRemaining = () => {
    if (!seatNumber) return null;

    return (
      <div
        className="flex"
        style={{
          fontSize: 12,
          fontWeight: "bold",
          color: colors.ocean,
          fontStyle: "italic",
          textTransform: "capitalize",
          paddingBottom: `1em`,
        }}
      >
        {/* <Html2React html={date} /> */}
        TBC Seats remaining
      </div>
    );
  };

  const ServeDate = () => {
    if (!date) return null;

    return (
      <div className="flex" style={{ paddingTop: `1em` }}>
        {date.map((block, key) => {
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
    );
  };

  return (
    <div
      className="flex-col"
      style={{
        textAlign: `${TEXT_ALIGN}`,
        padding: PADDING,
      }}
    >
      <div style={{ margin: CONTENT_ALIGNMENT }}>
        <ServeSeatsRemaining />
        <ServeTitle />
        <ElectionInfo electionInfo={electionInfo} />
        <ServeBody />
        <ServeDate />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(CardBody);
