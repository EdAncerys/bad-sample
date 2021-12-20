import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import Loading from "./loading";
import { colors } from "../config/colors";
import { setGoToAction } from "../context";

const EventListView = ({ state, actions, libraries, block, removeMargin }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  if (!block) return <Loading />;

  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  let MARGIN = `${marginVertical}px 0 0`;
  if (removeMargin) MARGIN = 0;

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
    summary,
    title,
    venue,
  } = block.acf;
  const GRADES = Object.values(state.source.event_grade);
  const eventGradeIds = Object.values(block.event_grade);
  const eventGrades = GRADES.filter((item) => {
    if (eventGradeIds.includes(item.id)) return item;
  });

  // SERVERS ----------------------------------------------------------------
  const ServeCardImage = () => {
    if (!image) return null;
    const alt = <Html2React html={title} /> || "BAD";

    return (
      <div style={{ width: "100%", height: "100%" }}>
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

    const ServeTitle = () => {
      if (!title) return null;

      return (
        <div
          style={{
            fontSize: 20,
            fontFamily: 'Roboto',
            fontWeight: "bold",
            padding: `1em 0`,
            cursor: "pointer",
          }}
          onClick={() => setGoToAction({ path: block.link, actions })}
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
        <div
          className="flex"
          style={{ fontSize: 16, color: colors.blue, fontStyle: "italic" }}
        >
          <ServeEventVenue />
          <ServeEventOrganizer />
          <ServeEventCommittee />
        </div>
      );
    };

    const ServeSummary = () => {
      if (!summary) return null;

      // Manage max string Length
      const MAX_LENGTH = 300;
      let summaryPreview = `${summary.substring(0, MAX_LENGTH)}...`;
      if (summary.length < MAX_LENGTH) summaryPreview = summary;

      return (
        <div style={{ fontSize: 16, padding: `1em 0 0` }}>
          <Html2React html={summaryPreview} />
        </div>
      );
    };

    const ServeCondition = () => {
      if (!conditions) return null;

      const ServeFilterCondition = ({ filter }) => {
        return (
          <div style={styles.action}>
            <Html2React html={filter.post_title} />
          </div>
        );
      };

      return (
        <div className="flex-row" style={{ flexWrap: "wrap" }}>
          {conditions.map((filter, key) => {
            return (
              <div key={key}>
                <ServeFilterCondition filter={filter} />
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <div className="flex-col" style={{ padding: `2em 4em` }}>
        <ServeDate />
        <ServeTitle />
        <ServeInformation />
        <ServeSummary />
        <ServeCondition />
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: MARGIN }}>
      <div
        style={{
          minHeight: `${BANNER_HEIGHT / 1.5}`,
          backgroundColor: colors.silverFillOne,
        }}
      >
        <div style={styles.container}>
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
  },
  action: {
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: `0.5em 1.5em`,
    margin: `1em 1em 0 0`,
    cursor: "pointer",
  },
  divider: {
    margin: `5px 0.5em`,
    borderRight: `1px solid ${colors.blue}`,
  },
};

export default connect(EventListView);
