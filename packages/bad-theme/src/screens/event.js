import { useContext } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import Link from "@frontity/components/link";

import { colors } from "../config/imports";
import { setGoToAction } from "../context";
import { muiQuery } from "../context";
import RowButton from "../components/rowButton";

import Facebook from "../img/svg/facebookBlack.svg";
import Twitter from "../img/svg/twitterBlack.svg";
import Instagram from "../img/svg/instagramBlack.svg";
import Linkedin from "../img/svg/linkedinBlack.svg";
import Connect from "../img/svg/connectBlack.svg";
import WebPage from "../img/svg/webPageBlack.svg";
// BLOCK WIDTH WRAPPER -------------------------------------------------------
import BlockWrapper from "../components/blockWrapper";

const Event = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const data = state.source.get(state.router.link);
  const event = state.source[data.type][data.id];

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

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
        className="primary-title"
        style={{
          fontSize: 36,
          fontWeight: "bold",
          color: colors.softBlack,
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
            className="primary-title"
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: colors.softBlack,
            }}
          >
            Date & Time:
          </div>
          <div>
            <div className="flex-col">
              {date_time.map((block, key) => {
                const { date, end_time, start_time } = block;
                if (!date && !end_time && !start_time) return null;

                const ServeDate = () => {
                  if (!date) return null;

                  return (
                    <div style={styles.date}>
                      <Html2React html={date} />
                    </div>
                  );
                };

                const ServeStartTime = () => {
                  if (!start_time) return null;

                  return (
                    <div style={styles.date}>
                      <Html2React html={start_time} />
                    </div>
                  );
                };

                const ServeEndTime = () => {
                  if (!end_time) return null;

                  return (
                    <div style={styles.date}>
                      <Html2React html={end_time} />
                    </div>
                  );
                };

                return (
                  <div
                    key={key}
                    className="flex"
                    style={{ fontSize: 12, paddingRight: `1em` }}
                  >
                    <ServeDate />
                    <ServeStartTime />
                    <ServeEndTime />
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
            className="primary-title"
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: colors.softBlack,
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
            className="primary-title"
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: colors.softBlack,
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
            className="primary-title"
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: colors.softBlack,
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
          backgroundColor: colors.silverFillOne,
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
          onClick={() => setGoToAction({ path: `/`, actions })}
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
            color: colors.softBlack,
          }}
        >
          Summary
        </div>
        <Html2React html={summary} />
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
      <div
        className="flex-row"
        style={{
          flexWrap: "wrap",
          marginTop: `2em`,
          padding: `2em 0`,
          borderTop: `1px solid ${colors.darkSilver}`,
        }}
      >
        <ServeFilterOne />
        <ServeFilterTwo />
        <ServeFilterThree />
      </div>
    );
  };

  const ServeSocials = () => {
    return (
      <div className="flex-col" style={{ width: `50%` }}>
        <div
          className="flex-row"
          style={{ justifyContent: "space-between", padding: `2em 0` }}
        >
          <div
            className="primary-title"
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: colors.softBlack,
            }}
          >
            Share
          </div>
          <div
            className="primary-title"
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: colors.softBlack,
            }}
          >
            Add to calendar
          </div>
        </div>
        <div className="flex" style={{ justifyContent: "space-between" }}>
          <div style={styles.socials}>
            <Link link={`https://www.facebook.com/`} target="_blank">
              <Image src={Facebook} className="d-block h-100" alt="Facebook" />
            </Link>
          </div>
          <div style={styles.socials}>
            <Link link={`https://www.twitter.com/`} target="_blank">
              <Image src={Twitter} className="d-block h-100" alt="Twitter" />
            </Link>
          </div>
          <div style={styles.socials}>
            <Link link={`https://www.instagram.com/`} target="_blank">
              <Image
                src={Instagram}
                className="d-block h-100"
                alt="Instagram"
              />
            </Link>
          </div>
          <div style={styles.socials}>
            <Link link={`https://www.linkedin.com/`} target="_blank">
              <Image src={Linkedin} className="d-block h-100" alt="Instagram" />
            </Link>
          </div>
          <div style={styles.socials}>
            <Link link={`https://www.linkedin.com/`} target="_blank">
              <Image src={Connect} className="d-block h-100" alt="Instagram" />
            </Link>
          </div>
          <div style={styles.socials}>
            <Link link={`https://www.linkedin.com/`} target="_blank">
              <Image src={WebPage} className="d-block h-100" alt="Instagram" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <BlockWrapper>
      <div style={{ backgroundColor: colors.white }}>
        <div style={{ padding: `${marginVertical}px ${marginHorizontal}px` }}>
          <div style={styles.container}>
            <div>
              <ServeTitle />
              <div style={styles.eventInfo}>
                <ServeCardImage />
                <ServeEventInfo />
              </div>
              <ServeRegisterLink />
              <ServeSummary />
              <ServeSocials />
              <ServeFilters />
            </div>
            <div style={{ backgroundColor: colors.lightSilver }}></div>
          </div>
        </div>
      </div>

      <div style={{ padding: `${marginVertical}px ${marginHorizontal}px` }}>
        <RowButton
          block={{
            title: "If you would like more information please contact us",
          }}
          onClick={() => setGoToAction({ path: `/`, actions })}
          buttonWidth="60%"
        />
      </div>
    </BlockWrapper>
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
  date: {
    paddingRight: 5,
  },
  action: {
    backgroundColor: colors.silverFillOne,
    borderRadius: 5,
    padding: `0.5em 1.5em`,
    margin: `1em 1em 0 0`,
    cursor: "pointer",
  },
  socials: {
    width: 35,
    height: 35,
    cursor: "pointer",
  },
};

export default connect(Event);
