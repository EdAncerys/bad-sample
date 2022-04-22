import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import PoundSterling from "../../img/svg/pound-sterling.svg";

import { colors } from "../../config/imports";
import ElectionInfo from "./electionInfo";
import ShareToSocials from "./shareToSocials";
import date from "date-and-time";
const DATE_MODULE = date;

// CONTEXT ------------------------------------------------
import { anchorScrapper, muiQuery } from "../../context";

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
  noVideoCategory,
  shareToSocials,
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

    const ServePaidIcon = () => {
      if (!videoArchive || !videoArchive.acf) return null;
      let price = videoArchive.acf.price;

      if (videoArchive.acf.private && videoArchive.acf.price)
        return (
          <div>
            <div className="flex">
              <div>{price}</div>
              <svg
                width="25"
                height="25"
                style={{ color: "red", marginLeft: 5 }}
              >
                <image
                  href={PoundSterling}
                  src="yourfallback.png"
                  width="25"
                  height="25"
                />
              </svg>
            </div>
          </div>
        );
      return null;
    };

    return (
      <div
        className={
          videoArchive ? "flex primary-title" : "flex primary-title body-limit"
        }
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
          justifyContent: "space-between",
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
          const dateObject = new Date(block.date);
          const formattedDate = DATE_MODULE.format(dateObject, "DD MMM YYYY");

          return (
            <div
              key={key}
              style={{
                fontSize: 12,
                fontWeight: "bold",
                textTransform: videoArchive ? "uppercase" : null,
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
    if (!videoArchive || !videoArchive.event_specialty) return null;
    if (noVideoCategory) return null;

    const event_specialties = videoArchive.event_specialty;
    if (event_specialties.length === 0) return null;

    const specialties = state.source["event_specialty"];

    let antresto = [];
    for (let i = 0; i < videoArchive.event_specialty.length; i++) {
      antresto.push(specialties[event_specialties[i]]);
    }

    const ServeSpecialty = ({ name }) => {
      return (
        <div
          style={{
            backgroundColor: colors.silverFillOne,
            padding: "1em",
            textTransform: "uppercase",
            fontSize: 12,
            color: colors.darkSilver,
            textAlign: "center",
          }}
        >
          {name}
        </div>
      );
    };

    if (specialties)
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
            marginTop: "1em",
            marginBottom: "1em",
          }}
        >
          {specialties &&
            antresto.map((special) => {
              return <ServeSpecialty name={special.name} />;
            })}
        </div>
      );

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
            textTransform: videoArchive ? "uppercase" : null,
          }}
        >
          <Html2React html={formattedDate} />
        </div>
      </div>
    );
  };

  const ServeSocials = () => {
    if (!shareToSocials) return null;

    return (
      <div style={{ width: "50%" }}>
        <div className="primary-title" style={{ fontSize: 20 }}>
          Share
        </div>
        <ShareToSocials />
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
        <ServeSocials />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(CardBody);
