import { useState, useEffect } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import Loading from "./loading";
import { colors } from "../config/colors";
import { setGoToAction } from "../context";

const EventListView = ({ state, actions, libraries, block, reverse }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  if (!block) return <Loading />;

  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const {
    date_time,
    email,
    event_type,
    image,
    layout,
    organizer,
    registration_page_link,
    scientific_committee,
    summary,
    venue,
    title,
    filter_one,
    filter_two,
    filter_three,
  } = block.acf;

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
                <div key={key} style={{ fontSize: 12, paddingRight: `1em` }}>
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
            fontSize: 22,
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
      const ServeEventType = () => {
        if (!event_type) return null;

        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => setGoToAction({ path: block.link, actions })}
          >
            <Html2React html={event_type} />
          </div>
        );
      };

      const ServeEventOrganizer = () => {
        if (!organizer) return null;
        return (
          <div>
            <Html2React html={organizer} />
          </div>
        );
      };

      const ServeEventCommittee = () => {
        if (!scientific_committee) return null;
        return (
          <div>
            <Html2React html={scientific_committee} />
          </div>
        );
      };

      return (
        <div className="flex" style={{ fontSize: 16, color: colors.blue }}>
          <ServeEventType />
          {organizer && <div style={styles.divider} />}
          <ServeEventOrganizer />
          {scientific_committee && <div style={styles.divider} />}
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

    const ServeFilters = () => {
      const ServeFilterOne = () => {
        if (!filter_one) return null;

        return (
          <div style={styles.action}>
            <Html2React html={filter_one[0].post_title} />
          </div>
        );
      };

      const ServeFilterTwo = () => {
        if (!filter_two) return null;

        return (
          <div style={styles.action}>
            <Html2React html={filter_two[0].post_title} />
          </div>
        );
      };

      const ServeFilterThree = () => {
        if (!filter_three) return null;

        return (
          <div style={styles.action}>
            <Html2React html={filter_three[0].post_title} />
          </div>
        );
      };

      return (
        <div className="flex-row" style={{ flexWrap: "wrap" }}>
          <ServeFilterOne />
          <ServeFilterTwo />
          <ServeFilterThree />
        </div>
      );
    };

    return (
      <div className="flex-col" style={{ padding: `2em 4em` }}>
        <ServeDate />
        <ServeTitle />
        <ServeInformation />
        <ServeSummary />
        <ServeFilters />
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div style={{ margin: `${marginVertical}px 0` }}>
      <div
        style={{
          minHeight: `${BANNER_HEIGHT / 1.5}`,
          backgroundColor: colors.silverFill,
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
