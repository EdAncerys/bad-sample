import { useContext } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../config/colors";
import { muiQuery } from "../context";

const Event = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const data = state.source.get(state.router.link);
  const event = state.source[data.type][data.id];

  const marginHorizontal = state.theme.marginHorizontal;
  console.log("event ", event.acf);

  const { sm, md, lg, xl } = muiQuery();
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
  } = event.acf;

  // SERVERS ----------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div
        style={{
          fontSize: 36,
          fontWeight: "bold",
          color: colors.black,
          paddingBottom: `0.5em`,
        }}
      >
        <Html2React html={title} />
      </div>
    );
  };

  const ServeCardImage = () => {
    if (!image) return null;
    const alt = title || "BAD";

    return (
      <div style={{ width: "100%", height: 350 }}>
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

  const ServeEventInfo = () => {
    const ServeDateTime = () => {
      if (!date_time) return null;

      return (
        <div style={{ paddingBottom: `1em` }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: colors.black,
            }}
          >
            Date & Time:
          </div>
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
            <div className="flex">
              {date_time.map((block, key) => {
                const { date, end_time, start_time } = block;

                return (
                  <div key={key} style={{ fontSize: 12, paddingRight: `1em` }}>
                    <Html2React html={end_time} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    };

    const ServeVenue = () => {
      if (!venue) return null;

      return (
        <div style={{ paddingBottom: `1em` }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: colors.black,
            }}
          >
            Venue:
          </div>
          <Html2React html={venue} />
        </div>
      );
    };

    const ServeCommittee = () => {
      if (!scientific_committee) return null;

      return (
        <div style={{ paddingBottom: `1em` }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: colors.black,
            }}
          >
            Venue:
          </div>
          <Html2React html={scientific_committee} />
        </div>
      );
    };

    const ServeEmail = () => {
      if (!email) return null;

      return (
        <div style={{ paddingBottom: `1em` }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: colors.black,
            }}
          >
            Email:
          </div>
          <Html2React html={email} />
        </div>
      );
    };

    return (
      <div className="flex-col">
        <ServeDateTime />
        <ServeVenue />
        <ServeCommittee />
        <ServeEmail />
      </div>
    );
  };

  const ServeRegisterLink = () => {
    if (!title) return null;

    return (
      <div
        className="flex"
        style={{
          backgroundColor: colors.silverFill,
          justifyContent: "center",
          padding: `2em`,
          margin: `2em 0`,
        }}
      >
        <button
          type="submit"
          className="btn"
          style={{
            backgroundColor: colors.primary,
            color: colors.white,
            padding: `1em 2em`,
          }}
          // onClick={() => setLoginAction({ dispatch, loginAction: true })}
        >
          Register for this Event
        </button>
      </div>
    );
  };

  const ServeSummary = () => {
    if (!summary) return null;

    return (
      <div>
        <div
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: colors.black,
          }}
        >
          Summary
        </div>
        <Html2React html={summary} />
      </div>
    );
  };

  return (
    <div style={{ margin: `0 ${marginHorizontal}px` }}>
      <div style={styles.container}>
        <div>
          <ServeTitle />
          <div style={styles.eventInfo}>
            <ServeCardImage />
            <ServeEventInfo />
          </div>
          <ServeRegisterLink />
          <ServeSummary />
        </div>
        <div className="pink"></div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `2fr 1fr`,
    gap: 20,
  },
  eventInfo: {
    display: "grid",
    gridTemplateColumns: `1fr 1fr`,
    gap: 40,
  },
};

export default connect(Event);
