import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";
import { colors } from "../config/colors";
import RowButton from "../components/rowButton";
import ShareToSocials from "../components/card/shareToSocials";
import Loading from "../components/loading";
import BadBadgeLogo from "../img/svg/badBadgeLogo.svg";

import date from "date-and-time";
const DATE_MODULE = date;
// BLOCK WIDTH WRAPPER -------------------------------------------------------
import BlockWrapper from "../components/blockWrapper";
// CONTEXT -------------------------------------------------------------------
import {
  useAppDispatch,
  setEnquireAction,
  setGoToAction,
  muiQuery,
  useAppState,
  setErrorAction,
} from "../context";
import { getEventsData } from "../helpers";

const Event = ({ state, actions, libraries }) => {
  const { sm, md, lg, xl } = muiQuery();
  const { isActiveUser } = useAppState();
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const data = state.source.get(state.router.link);
  const event = state.source[data.type][data.id];

  const dispatch = useAppDispatch();

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const [eventList, setEventList] = useState(null);
  const [gradeList, setGradeList] = useState(null);
  const [locationList, setLocationList] = useState(null);
  const [position, setPosition] = useState(null);
  const useEffectRef = useRef(null);

  useEffect(async () => {
    // ⬇️ on component load defaults to window position TOP
    window.scrollTo({ top: 0, behavior: "smooth" }); // force scrolling to top of page
    document.documentElement.scrollTop = 0; // for safari

    // get related event content
    let eventList = null;
    let categoryList = null;
    let locationList = null;

    // pre fetch events data
    let data = state.source.events;
    let isCurrentOnly = false;
    // on page re-fresh check if is current only
    if (data && Object.keys(data).length === 1) isCurrentOnly = true;
    if (isCurrentOnly) {
      await getEventsData({ state, actions });
    }

    let iteration = 0;
    while (!data) {
      // if iteration is greater than 10, break
      if (iteration > 10) break;
      // set timeout for async
      await getEventsData({ state, actions });
      await new Promise((resolve) => setTimeout(resolve, 500));
      data = state.source.events;
      iteration++;
    }

    // if !data then break
    if (!data) return;
    eventList = Object.values(data);

    if (state.source.event_grade)
      categoryList = Object.values(state.source.event_grade);
    if (state.source.event_location)
      locationList = Object.values(state.source.event_location);

    setEventList(eventList);
    setGradeList(categoryList);
    setLocationList(locationList);
    setPosition(true);

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, []);

  const {
    date_time,
    email,
    event_type,
    image,
    layout,
    organizer,
    registration_page_link,
    registration_type,
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
    register_recipients,
    registration_status_email,
    registration_status_eventsforce,
    registration_status_external,
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
    contact_recipients,
  } = event.acf;
  const { title, id } = event;
  // console.log("event", event); // debug
  if (!position) return <Loading />;
  const handleLogin = () => {
    setErrorAction({ dispatch, isError: null });
    loginAction({ state });
  };
  // SERVERS ----------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div
        className="primary-title"
        style={{
          fontSize: !lg ? 26 : 20,
          paddingBottom: `${marginVertical}px`,
        }}
      >
        <Html2React html={title.rendered} />
      </div>
    );
  };

  const ServeImage = () => {
    if (!image) return null;
    const alt = title.rendered || "BAD";

    return (
      <div style={{ width: "100%", height: 350, backgroundColor: "white" }}>
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
                  const dateObject = new Date(date);
                  const formattedDate = DATE_MODULE.format(
                    dateObject,
                    "DD MMM YYYY"
                  );

                  return (
                    <div style={styles.date}>
                      <Html2React html={formattedDate} />
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
    if (!registration_page_link) return null;
    let isArchive = false;
    if (date_time) {
      // loop through date_time and check if date is in the past
      date_time.forEach((date) => {
        if (new Date(date.date) < new Date()) isArchive = true;
      });
    }
    // dont display component if event isArchive
    if (isArchive) return null;
    const ServeInformationForUser = () => {
      if (registration_type === "events_force" && !isActiveUser) {
        return (
          <div style={{ padding: "1em 0", textAlign: "center" }}>
            Please login to your BAD account and use your registered email
            address for signing up to this event, this will enable us to link
            your registration to your BAD account
          </div>
        );
      }
      if (registration_type === "events_force" && isActiveUser) {
        return (
          <div style={{ padding: "1em 0" }}>
            Please ensure you register for this event using your
            <span className="primary-title">
              {" " + isActiveUser.emailaddress1}
            </span>{" "}
            email address in order to link your registration to your BAD account
          </div>
        );
      }
      return null;
    };

    const handleRegistrationClick = () => {
      // if (!isActiveUser) {
      //   setErrorAction({
      //     dispatch,
      //     isError: {
      //       message: `Please log in to the BAD website in order to register for this event`,
      //       image: "Error",
      //       action: [{ label: "Login", handler: handleLogin }],
      //     },
      //   });
      //   return;
      // }
      if (
        (registration_type === "email" &&
          registration_status_email === "registration_not_open") ||
        (registration_type === "events_force" &&
          registration_status_eventsforce === "registration_not_open") ||
        (registration_type === "external" &&
          registration_status_external === "registration_not_open")
      ) {
        setErrorAction({
          dispatch,
          isError: {
            message: `Registration for this event is not open. `,
            image: "Error",
          },
        });
      }

      if (
        registration_type === "events_force" ||
        registration_type === "external"
      ) {
        // open page in new window
        window.open(registration_page_link, "_blank");
      }

      if (
        registration_type === "email" &&
        registration_status_email === "register"
      ) {
        setEnquireAction({
          dispatch,
          enquireAction: {
            contact_public_email: "conference@bad.org.uk",
            form_title: register_form_title || "Event Contact Form",
            form_body:
              register_form_body || `Register for ${title.rendered} event.`,
            subject: `Registration for ${title.rendered} event.`,
            full_name: true,
            email_address: true,
            phone_number: true,
            recipients: state.contactList.DEFAULT_CONTACT_LIST,
            registerForEvent: title.rendered,
            // default email subject & template name
            emailSubject: `Register for ${title.rendered} event.`,
            emailTemplate: "StandardEnquiryForm",
          },
        });
      }
      if (
        registration_type === "email" &&
        registration_status_email === "register_an_interest"
      ) {
        setEnquireAction({
          dispatch,
          enquireAction: {
            contact_public_email: "conference@bad.org.uk",
            form_title:
              register_form_title ||
              "Event Contact Form (register an interest)",
            form_body:
              register_form_body ||
              `Register an interest for ${title.rendered} event.`,
            subject: `Interest registration for ${title.rendered} event.`,
            full_name: true,
            email_address: true,
            phone_number: true,
            recipients: state.contactList.DEFAULT_CONTACT_LIST,
            registerForEvent: title.rendered,
            // default email subject & template name
            emailSubject: `Register an interest for ${title.rendered} event.`,
            emailTemplate: "StandardEnquiryForm",
          },
        });
      }
    };
    const ButtonTitle = () => {
      if (registration_type) {
        if (registration_status_email) {
          if (registration_status_email === "register")
            return "Register for event";
          if (registration_status_email === "register_an_interest")
            return "Register an interest";
          if (registration_status_email === "registration_not_open")
            return "Registration not open";
        }
        if (
          registration_type === "events_force" &&
          registration_status_eventsforce === "register"
        )
          return "Register for event";
        if (
          registration_type === "events_force" &&
          registration_status_eventsforce === "registration_not_open"
        )
          return "Registration not open";
        if (
          registration_type === "external" &&
          registration_status_external === "registration_not_open"
        )
          return "Registration not open";
        if (
          registration_type === "external" &&
          registration_status_external === "register"
        )
          return "Register for event";
      }
      return "Error";
    };

    const checkIfdisabled = () => {
      switch (disabled) {
        case registration_status_email === "registration_not_open":
        case registration_status_external === "registration_not_open":
        case registration_status_eventsforce === "registration_not_open":
          return true;

        default:
          return false;
      }
    };

    const checkColor = () => {
      console.log("HIT CHECK COLOUR");
      switch (disabled) {
        case registration_status_email === "registration_not_open":
        case registration_status_external === "registration_not_open":
        case registration_status_eventsforce === "registration_not_open":
          return "blue-btn";
        default:
          return "blue-btn";
      }
    };
    return (
      <div
        className="flex"
        style={{
          backgroundColor: colors.white, // optional background color
          justifyContent: "center",
          padding: `2em`,
          margin: `0`,
          flexDirection: "column",
          alignItems: "center",
          marginTop: "1em",
        }}
      >
        <ServeInformationForUser />
        <button
          className={
            (registration_type === "email" &&
              registration_status_email === "registration_not_open") ||
            (registration_type === "external" &&
              registration_status_external === "registration_not_open") ||
            (registration_type === "events_force" &&
              registration_status_eventsforce === "registration_not_open")
              ? "disabled-btn"
              : "blue-btn-reverse"
          }
          style={{
            padding: `1em 2em`,
            width: 250,
            marginTop: 10,
          }}
          onClick={handleRegistrationClick}
        >
          <ButtonTitle />
        </button>
      </div>
    );
  };

  const ServeSummary = () => {
    if (!summary) return null;

    return (
      <div className="text-body">
        <div
          className="primary-title"
          style={{ fontSize: 20, paddingTop: "1em" }}
        >
          Summary
        </div>
        <Html2React html={summary} />
      </div>
    );
  };

  const ServeRegisterBanner = () => {
    return (
      <div
        className="shadow"
        style={{
          backgroundColor: colors.primary,
          color: colors.white,
          padding: `2em`,
        }}
      >
        <div style={{ width: 100, height: 100, overflow: "hidden" }}>
          <Image
            src={BadBadgeLogo}
            alt="BAD"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <div
          className="primary-title"
          style={{ padding: `1em 0`, fontSize: 20, color: colors.white }}
        >
          Not a Member of British Association Dermatology?
        </div>

        <div
          className="blue-btn"
          style={{
            backgroundColor: colors.white,
            color: colors.primary,
            width: "fit-content",
            paddingTop: `1em`,
          }}
          onClick={() => setGoToAction({ state, path: "/membership", actions })}
        >
          Join Us Here
        </div>
      </div>
    );
  };

  const ServeSocials = () => {
    // remove first / from string if its exist in the url
    const removeFirstSlash = (url) => {
      if (url.startsWith("/")) {
        return url.substring(1);
      }
      return url;
    };
    const shareUrl = state.auth.APP_URL + removeFirstSlash(state.router.link);

    // event start date
    let startDate = date_time;
    if (startDate[0]) startDate = startDate[0].date;

    return (
      <div className="flex-col" style={{ width: `55%` }}>
        <div
          className="flex-row"
          style={{ justifyContent: "space-between", padding: `2em 0 0 0` }}
        >
          <div className="primary-title" style={{ fontSize: 20 }}>
            Share
          </div>
          <div className="primary-title" style={{ fontSize: 20 }}>
            Add to calendar
          </div>
        </div>
        <div className="flex-col" style={{ width: `75%` }}>
          <ShareToSocials
            shareTitle={title.rendered}
            description={summary}
            shareUrl={shareUrl}
            date={startDate}
            location={venue}
            isCalendarLink
          />
        </div>
      </div>
    );
  };

  const ServeSideBar = () => {
    if (!eventList || !locationList) return null;

    // get current event taxonomy types
    const currentPostGrade = event.event_grade[0];
    const currentPostLocation = event.event_location[0];
    const currentPostSpecialty = event.event_specialty[0];
    const eventListIds = [];

    // get category name from category list
    let gradeName = "Grade";
    gradeName = gradeList.filter(
      (category) => category.id === Number(currentPostGrade)
    );
    if (gradeName[0]) gradeName = gradeName[0].name;
    // get list of events where category is the same as the current event
    let relatedGradeList = eventList.filter((event) => {
      // return events that not current event id & include the same category  as the current event
      return event.id !== id && event.event_grade.includes(currentPostGrade);
    });
    // map through rendered event list and get ids of the events
    relatedGradeList.map((event) => {
      eventListIds.push(event.id);
    });
    // get latest events from the list
    relatedGradeList = relatedGradeList.slice(0, 3);

    // get related event location list from the list
    let locationName = "Location";
    locationName = locationList.filter(
      (location) => location.id === Number(currentPostLocation)
    );
    if (locationName[0]) locationName = locationName[0].name;
    // get list of events where location is the same as the current event
    let relatedLocationList = eventList.filter((event) => {
      // return events that not current event id & include the same category  as the current event & not already in the list of ids
      if (eventListIds.includes(event.id)) return false;
      return (
        event.id !== id && event.event_location.includes(currentPostLocation)
      );
    });

    // get latest events from the list
    relatedLocationList = relatedLocationList.slice(0, 3);

    const ServeRelatedEvents = ({ list }) => {
      if (!list.length) return null;

      return (
        <div>
          {list.map((event, key) => {
            let eventDate = event.date;
            if (event.acf.date_time) eventDate = event.acf.date_time[0];

            const dateObject = new Date(eventDate.date);
            const formattedDate = DATE_MODULE.format(dateObject, "DD MMM YYYY");

            return (
              <div
                key={key}
                style={{
                  marginBottom: `1em`,
                  borderBottom: `1px solid ${colors.lightSilver}`,
                }}
              >
                <div
                  style={{
                    padding: `0.5em`,
                    fontSize: 12,
                    backgroundColor: colors.lightSilver,
                    textTransform: "capitalize",
                    width: "fit-content",
                  }}
                >
                  {formattedDate}
                </div>

                <div
                  className="primary-title title-link-animation"
                  style={{ fontSize: 16, padding: "1em 0", cursor: "pointer" }}
                  onClick={() =>
                    setGoToAction({ state, path: event.link, actions })
                  }
                >
                  {event.title.rendered}
                </div>
              </div>
            );
          })}
        </div>
      );
    };

    const ServeFooter = () => {
      return (
        <div
          style={{
            backgroundColor: colors.turquoise,
            height: 5,
            width: "100%",
          }}
        />
      );
    };

    if (!relatedGradeList.length && !relatedLocationList.length) return null;

    return (
      <div style={{ marginBottom: "2em", backgroundColor: "white" }}>
        <div className="shadow" style={{ padding: "1em" }}>
          <div
            className="primary-title"
            style={{ fontSize: 20, padding: "1em 0" }}
          >
            Related Content
          </div>
          <ServeRelatedEvents list={relatedGradeList} />
          <ServeRelatedEvents list={relatedLocationList} />
        </div>
        <ServeFooter />
      </div>
    );
  };

  return (
    <BlockWrapper background={colors.silverFillOne}>
      <div style={{ backgroundColor: colors.silverFillOne }}>
        <div style={{ padding: `${marginVertical}px ${marginHorizontal}px` }}>
          <div style={!lg ? styles.container : styles.containerMobile}>
            <div>
              <ServeTitle />
              <div style={!lg ? styles.eventInfo : styles.eventInfoMobile}>
                <ServeImage />
                <ServeEventInfo />
              </div>
              <ServeRegisterLink />
              <ServeSummary />
              <ServeSocials />
            </div>
            <div className="flex-col">
              <ServeSideBar />
              <ServeRegisterBanner />
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: `${marginVertical}px ${marginHorizontal}px`,
          backgroundColor: colors.lightSilver,
        }}
      >
        <RowButton
          block={{
            title: "If you would like more information please contact us",
          }}
          onClick={() =>
            setEnquireAction({
              dispatch,
              enquireAction: {
                contact_public_email:
                  contact_public_email || "conference@bad.org.uk",
                contact_public_phone_number,
                form_title: contact_form_title || "Event Information Form",
                form_body:
                  contact_form_body || `Enquire about ${title.rendered} event.`,
                full_name: true,
                email_address: true,
                phone_number: true,
                subject: true,
                message: true,
                allow_attachments: contact_allow_attachments,
                recipients:
                  contact_recipients || state.contactList.DEFAULT_CONTACT_LIST,
                // default email subject & template name
                emailSubject: `Enquire about ${title.rendered} event.`,
                emailTemplate: "StandardEnquiryForm",
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
  containerMobile: {
    display: "grid",
    gridTemplateColumns: `1fr`,
    gap: 20,
  },
  eventInfo: {
    display: "grid",
    gridTemplateColumns: `1fr 1fr`,
    gap: 40,
  },
  eventInfoMobile: {
    display: "grid",
    gridTemplateColumns: `1fr`,
    gap: 40,
  },
  date: {
    paddingRight: 5,
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "uppercase",
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
