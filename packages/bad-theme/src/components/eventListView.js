import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import date from "date-and-time";

import Loading from "./loading";
import { colors } from "../config/imports";
// CONTEXT --------------------------------------------------------
import {
  useAppDispatch,
  setGoToAction,
  setEventAnchorAction,
} from "../context";

const DATE_MODULE = date;

const EventListView = ({ state, actions, libraries, block, removeMargin }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  if (!block) return <Loading />;

  const dispatch = useAppDispatch();

  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  let MARGIN = `${marginVertical}px 0 0`;
  if (removeMargin) MARGIN = 0;

  const HEIGHT = BANNER_HEIGHT / 1.4;

  const {
    date_time,
    conditions,
    email,
    image,
    layout,
    organizer,
    public_or_members_only,
    registration_page_link,
    registration_type,
    scientific_committee,
    show_add_to_calendar,
    show_sharing_buttons,
    preview_summary,
    venue,
  } = block.acf;

  const title = block.title.rendered;
  const anchor = "id-" + title.replace(/ /g, "-").toLowerCase(); // set title to anchor

  const GRADES = Object.values(state.source.event_grade);
  const eventGradeIds = Object.values(block.event_grade);
  const eventGrades = GRADES.filter((item) => {
    if (eventGradeIds.includes(item.id)) return item;
  });

  // HANDLERS ---------------------------------------------------------------
  const handleClick = () => {
    setEventAnchorAction({ dispatch, eventAnchor: anchor });
    setGoToAction({ path: block.link, actions });
  };

  // SERVERS ----------------------------------------------------------------
  const ServeCardImage = () => {
    if (!image) return null;
    const alt = <Html2React html={title} /> || "BAD";

    return (
      <div style={{ width: "100%", height: HEIGHT }}>
        <Image
          src={image}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    );
  };

  const ServeCardContent = () => {
    // SERVERS ---------------------------------------------
    const ServeDate = () => {
      if (!date_time) return null;

      return (
        <div>
          <div className="flex">
            {date_time.map((block, key) => {
              const { date, end_time, start_time } = block;

              const dateObject = new Date(date);
              const formattedDate = DATE_MODULE.format(
                dateObject,
                "DD MMM YYYY"
              );

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

    const ServeTitle = () => {
      if (!title) return null;

      return (
        <div
          className="primary-title body-limit"
          style={{ fontSize: 20, padding: `0.5em 0`, WebkitLineClamp: 1 }}
        >
          <Html2React html={title} />
        </div>
      );
    };

    const ServeInformation = () => {
      const ServeEventVenue = () => {
        if (!venue) return null;
        return (
          <div>
            <Html2React html={venue} />
          </div>
        );
      };

      const ServeEventOrganizer = () => {
        if (!organizer) return null;
        return (
          <div>
            <div className="flex">
              {venue && <div style={styles.divider} />}
              <Html2React html={organizer} />
            </div>
          </div>
        );
      };

      const ServeEventCommittee = () => {
        if (!scientific_committee) return null;
        return (
          <div className="flex">
            {(organizer || venue) && <div style={styles.divider} />}
            <Html2React html={scientific_committee} />
          </div>
        );
      };

      return (
        <div>
          <div
            className="flex"
            style={{ fontStyle: "italic", color: colors.blue }}
          >
            <ServeEventVenue />
            <ServeEventOrganizer />
            <ServeEventCommittee />
          </div>
        </div>
      );
    };

    const ServeSummary = () => {
      if (!preview_summary) return null;

      console.log(preview_summary.length);

      return (
        <div
          className="body-limit"
          style={{ justifyItems: "center", WebkitLineClamp: 4 }}
        >
          <Html2React html={preview_summary} />
        </div>
      );
    };

    return (
      <div
        className="flex-col"
        style={{ padding: `2em 0 2em 2em`, overflowY: "auto", height: HEIGHT }}
      >
        <ServeDate />
        <ServeTitle />
        <ServeInformation />
        <ServeSummary />
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: MARGIN }}>
      <div
        style={{
          height: `${HEIGHT}px`,
          backgroundColor: colors.silverFillOne,
        }}
      >
        <div id={anchor} style={styles.container} onClick={handleClick}>
          <ServeCardContent />
          <ServeCardImage />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `2.5fr 1fr`,
    gap: 20,
    cursor: "pointer",
  },
  divider: {
    margin: `5px 0.5em`,
    borderRight: `1px solid ${colors.blue}`,
  },
};

export default connect(EventListView);
