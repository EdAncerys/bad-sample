import { useContext } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import Link from "@frontity/components/link";

import { colors } from "../config/imports";
import { setGoToAction } from "../context";
import RowButton from "../components/rowButton";

import Facebook from "../img/svg/facebookBlack.svg";
import Twitter from "../img/svg/twitterBlack.svg";
import Instagram from "../img/svg/instagramBlack.svg";
import Linkedin from "../img/svg/linkedinBlack.svg";
import Connect from "../img/svg/connectBlack.svg";
import WebPage from "../img/svg/webPageBlack.svg";
// BLOCK WIDTH WRAPPER -------------------------------------------------------
import BlockWrapper from "../components/blockWrapper";
// CONTEXT -------------------------------------------------------------------
import { useAppDispatch, setEnquireAction, muiQuery } from "../context";

const Event = ({ state, actions, libraries }) => {
  const { sm, md, lg, xl } = muiQuery();

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const data = state.source.get(state.router.link);
  const event = state.source[data.type][data.id];

  const dispatch = useAppDispatch();

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
    register_public_email,
    register_public_phone_number,
    register_form_title,
    register_form_body,
    register_full_name,
    register_email,
    register_phone_number,
    register_subject,
    register_subject_dropdown_options,
    register_message,
    register_allow_attachments,

    contact_public_email,
    contact_public_phone_number,
    contact_form_title,
    contact_form_body,
    contact_full_name,
    contact_email,
    contact_phone_number,
    contact_subject,
    contact_subject_dropdown_options,
    contact_message,
    contact_allow_attachments,
  } = event.acf;
  const { title } = event;

  // SERVERS ----------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div
        className="primary-title"
        style={{ fontSize: !lg ? 36 : 25, paddingBottom: `1em` }}
      >
        <Html2React html={title.rendered} />
      </div>
    );
  };

  const ServeImage = () => {
    if (!image) return null;
    const alt = title.rendered || "BAD";

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
          <div className="primary-title" style={{ fontSize: 20 }}>
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
          <div className="primary-title" style={{ fontSize: 20 }}>
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
          <div className="primary-title" style={{ fontSize: 20 }}>
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
          <div className="primary-title" style={{ fontSize: 20 }}>
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
        <div
          className="blue-btn"
          style={{
            backgroundColor: colors.primary,
            color: colors.white,
            padding: `1em 2em`,
          }}
          onClick={() =>
            setEnquireAction({
              dispatch,
              enquireAction: {
                register_public_email,
                register_public_phone_number,
                register_form_title,
                register_form_body,
                register_full_name,
                register_email,
                register_phone_number,
                register_subject,
                register_subject_dropdown_options,
                register_message,
                register_allow_attachments,
              },
            })
          }
        >
          Register for this Event
        </div>
      </div>
    );
  };

  const ServeSummary = () => {
    if (!summary) return null;

    return (
      <div className="text-body">
        <div className="primary-title" style={{ fontSize: 20 }}>
          Summary
        </div>
        <Html2React html={summary} />
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
          <div className="primary-title" style={{ fontSize: 20 }}>
            Share
          </div>
          <div className="primary-title" style={{ fontSize: 20 }}>
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
                <ServeImage />
                <ServeEventInfo />
              </div>
              <ServeRegisterLink />
              <ServeSummary />
              <ServeSocials />
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
          onClick={() =>
            setEnquireAction({
              dispatch,
              enquireAction: {
                contact_public_email,
                contact_public_phone_number,
                contact_form_title,
                contact_form_body,
                contact_full_name,
                contact_email,
                contact_phone_number,
                contact_subject,
                contact_subject_dropdown_options,
                contact_message,
                contact_allow_attachments,
              },
            })
          }
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
