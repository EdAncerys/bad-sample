import React from "react";
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
  muiQuery,
  Parcer,
} from "../context";

const DATE_MODULE = date;

const EventListView = ({
  state,
  actions,
  libraries,
  block,
  removeMargin,
  recommended_events,
}) => {
  if (!block) return <Loading />;
  const { lg } = muiQuery();

  const dispatch = useAppDispatch();

  const BANNER_HEIGHT = state.theme.bannerHeight;
  const marginVertical = state.theme.marginVertical;
  let MARGIN = `${marginVertical}px 0 0`;
  if (removeMargin) MARGIN = 0;

  const HEIGHT = !lg ? BANNER_HEIGHT / 1.4 : BANNER_HEIGHT / 2.2;

  const {
    date_time,
    image,
    organizer,
    scientific_committee,
    preview_summary,
    venue,
  } = block.acf;

  const title = block.title.rendered;
  const anchor = "id-" + title.replace(/ /g, "-").toLowerCase(); // set title to anchor

  // HANDLERS ---------------------------------------------------------------
  const handleClick = () => {
    setEventAnchorAction({ dispatch, eventAnchor: anchor });
    setGoToAction({ state, path: block.link, actions });
  };

  // SERVERS ----------------------------------------------------------------
  const ServeCardImage = () => {
    if (!image) return null;
    const alt = <Parcer libraries={libraries} html={title} /> || "BAD";

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
          <div className={!lg ? "flex" : "flex-col"}>
            {date_time.map((block, key) => {
              const { end_time, start_time } = block;

              const dateObject = new Date(block.date);
              const formattedDate = DATE_MODULE.format(
                dateObject,
                "DD MMM YYYY"
              );

              return (
                <div
                  key={key}
                  style={{
                    fontSize: !lg ? 16 : 12,
                    fontWeight: "bold",
                  }}
                >
                  <Parcer libraries={libraries} html={formattedDate} />
                  {key + 1 < date_time.length ? "  -  " : null}
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    const ServeTitle = () => {
      if (!title) return null;
      const titleClass = !lg ? "primary-title body-limit" : "primary-title";
      return (
        <div
          className={titleClass}
          style={{
            fontSize: !lg ? 20 : 16,
            padding: `0.5em 0`,
            WebkitLineClamp: !lg ? 1 : 3,
          }}
        >
          <Parcer libraries={libraries} html={title} />
        </div>
      );
    };

    const ServeInformation = () => {
      const ServeEventVenue = () => {
        if (!venue) return null;
        return (
          <div>
            <Parcer libraries={libraries} html={venue} />
          </div>
        );
      };

      const ServeEventOrganizer = () => {
        if (!organizer) return null;
        return (
          <div>
            <div className="flex">
              {venue && <div style={styles.divider} />}
              <Parcer libraries={libraries} html={organizer} />
            </div>
          </div>
        );
      };

      const ServeEventCommittee = () => {
        if (!scientific_committee) return null;
        return (
          <div className="flex">
            {(organizer || venue) && <div style={styles.divider} />}
            <Parcer libraries={libraries} html={scientific_committee} />
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

      return (
        <div
          className="body-limit"
          style={{ justifyItems: "center", WebkitLineClamp: 4 }}
        >
          <Parcer libraries={libraries} html={preview_summary} />
        </div>
      );
    };

    return (
      <div
        className="flex-col"
        style={{
          padding: !lg ? `2em 0 2em 2em` : "1em",
          overflowY: "auto",
          height: HEIGHT,
        }}
      >
        <ServeDate />
        <ServeTitle />
        {!lg ? !recommended_events ? <ServeInformation /> : null : null}
        {!lg ? !recommended_events ? <ServeSummary /> : null : null}
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div
      style={{ margin: !recommended_events ? MARGIN : 10 }}
      className="shadow-on-hover"
    >
      <div
        style={{
          height: !recommended_events ? `${HEIGHT}px` : null,
          backgroundColor: !recommended_events ? colors.silverFillOne : "white",
        }}
      >
        <div
          style={!lg ? styles.container : styles.containerMobile}
          onClick={handleClick}
          id={anchor}
        >
          <ServeCardContent />
          {!recommended_events ? <ServeCardImage /> : null}
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
  containerMobile: {
    display: "grid",
    gridTemplateColumns: `1fr 1fr`,
    gap: 20,
    cursor: "pointer",
  },
  divider: {
    margin: `5px 0.5em`,
    borderRight: `1px solid ${colors.blue}`,
  },
};

export default connect(EventListView);
