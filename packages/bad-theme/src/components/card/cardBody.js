import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import date from "date-and-time";
import PaidIcon from "@mui/icons-material/Paid";

import { colors } from "../../config/imports";
import ElectionInfo from "./electionInfo";

import { anchorScrapper, muiQuery } from "../../context";

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
  titleLimit,
  opacity,
  videoArchive,
  limitTitleLength,
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
    const maxChar = 45;
    if (title.length > maxChar && isFrom4Col)
      titlePreview = `${title.slice(0, maxChar)}...`;
    if (!body) titlePreview = title;
    if (!body && isFrom4Col) titlePreview = `${title.slice(0, 80)}`;
    if (limitTitleLength) titlePreview = `${title.slice(0, maxChar)}...`;

    const ServePaidIcon = () => {
      if (!videoArchive) return null;
      if (videoArchive.acf.price) return <PaidIcon />;
      return null;
    };
    return (
      <div
        className="flex primary-title body-limit"
        style={{
          fontSize: heroBanner ? (!lg ? `2.25rem` : 25) : 20,
          minHeight: "auto",
          maxHeight: isFrom4Col ? "7em" : "auto", // restricting title height
          overflow: "hidden",
          fontWeight: "bold",
          color: heroBanner ? colors.trueBlack : colors.softBlack,
          alignItems: "flex-start",
          opacity: opacity || 1,
          WebkitLineClamp: titleLimit || "unset",
        }}
      >
        <Html2React html={title} />
        <ServePaidIcon />
      </div>
    );
  };

  const ServeBody = () => {
    if (!body) return null;

    return (
      <div
        className="body-limit"
        style={{
          fontSize: 16,
          paddingTop: title ? `1em` : 0,
          WebkitLineClamp: bodyLimit || "unset",
        }}
      >
        <Html2React html={body} />
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

  const ServeVideoArchiveCategories = () => {
    if (!videoArchive) return null;
    const event_specialties = videoArchive.event_specialty;
    if (event_specialties.length === 0) return null;

    const specialties = state.source["event_specialty"];

    let antresto = [];

    for (let i = 0; i < videoArchive.event_specialty.length; i++) {
      antresto.push(specialties[event_specialties[i]]);
    }

    if (specialties) {
      return antresto.map((special) => {
        return special.name;
      });
    }

    return "Error fetching categories";
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
        <ServeVideoArchiveCategories />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(CardBody);
