import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import date from "date-and-time";

import { colors } from "../../config/imports";
import ElectionInfo from "./electionInfo";

import { muiQuery } from "../../context";

const DATE_MODULE = date;

const CardBody = ({
  state,
  actions,
  libraries,
  title,
  body,
  bodyLimit,
  date,
  publicationDate,
  seatNumber,
  heroBanner,
  TEXT_ALIGN,
  isFrom4Col,
  electionInfo,
  limitBodyLength,
  limitTitleLength,
  opacity,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const { sm, md, lg, xl } = muiQuery();

  let CONTENT_ALIGNMENT = 0;
  if (heroBanner) CONTENT_ALIGNMENT = `auto 0`;

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
          fontSize: heroBanner ? (!lg ? `2.25rem` : 25) : 20,
          minHeight: TITLE_HEIGHT,
          maxHeight: isFrom4Col ? "7em" : "auto", // restricting title height
          overflow: "hidden",
          fontWeight: "bold",
          color: heroBanner ? colors.trueBlack : colors.softBlack,
          alignItems: "flex-start",
          opacity: opacity || 1,
        }}
      >
        <Html2React html={titlePreview} />
      </div>
    );
  };

  const ServeBody = () => {
    if (!body) return null;

    let bodyPreview = body;
    const MAX_CHAR = bodyLimit || 76;
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
          color: colors.blue,
          fontStyle: "italic",
          textTransform: "capitalize",
          paddingBottom: `1em`,
        }}
      >
        <Html2React html={"TBC Seats remaining"} />
      </div>
    );
  };

  const ServeDate = () => {
    if (!date) return null;

    return (
      <div className="flex" style={{ paddingTop: `1em` }}>
        {date.map((block, key) => {
          const { end_time, start_time } = block;

          const dateObject = new Date(block.date);
          const formattedDate = DATE_MODULE.format(dateObject, "DD MMM YYYY");

          return (
            <div
              key={key}
              style={{
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              <Html2React html={formattedDate} />
              {key + 1 < date.length ? " - " : null}
            </div>
          );
        })}
      </div>
    );
  };

  const ServePublicationDate = () => {
    if (!publicationDate) return null;

    const dateObject = new Date(publicationDate);
    const formattedDate = DATE_MODULE.format(dateObject, "DD MMM YYYY");

    return (
      <div className="flex" style={{ paddingTop: `1em` }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: "bold",
          }}
        >
          <Html2React html={formattedDate} />
        </div>
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
        <ServePublicationDate />
        <ElectionInfo electionInfo={electionInfo} opacity={opacity} />
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
