import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";
import Image from "@frontity/components/image";

import { colors } from "../config/imports";
import RowButton from "../components/rowButton";
import ShareToSocials from "../components/card/shareToSocials";

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
} from "../context";
import { getEventsData } from "../helpers";

const Event = ({ state, actions, libraries }) => {
  const { sm, md, lg, xl } = muiQuery();

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const data = state.source.get(state.router.link);
  const event = state.source[data.type][data.id];
  // console.log("event data: ", event); // debug

  const dispatch = useAppDispatch();

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const [eventList, setEventList] = useState(null);
  const [gradeList, setGradeList] = useState(null);
  const [locationList, setLocationList] = useState(null);
  const [specialtyList, setSpecialtyList] = useState(null);
  const useEffectRef = useRef(null);

  useEffect(async () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // force scrolling to top of page
    document.documentElement.scrollTop = 0; // for safari

    // get related event content
    let eventList = null;
    let categoryList = null;
    let locationList = null;
    let specialtyList = null;

    // pre fetch events data
    let iteration = 0;
    let data = state.source.events;

    while (!data) {
      // if iteration is greater than 10, break
      if (iteration > 10) break;
      // set timeout for async
      await new Promise((resolve) => setTimeout(resolve, 500));
      await getEventsData({ state, actions });
      data = state.source.post;
      iteration++;
    }

    // if !data then break
    if (!data) return;
    eventList = Object.values(data);

    if (state.source.event_grade)
      categoryList = Object.values(state.source.event_grade);
    if (state.source.event_location)
      locationList = Object.values(state.source.event_location);
    if (state.source.event_specialty)
      specialtyList = Object.values(state.source.event_specialty);

    setEventList(eventList);
    setGradeList(categoryList);
    setLocationList(locationList);
    setSpecialtyList(specialtyList);

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
        style={{
          fontSize: !lg ? 36 : 25,
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

  // const ServeSocials = () => {
  //   return (
  //     <div className="flex-col" style={{ width: !lg ? `50%` : `100%` }}>
  //       <div
  //         className={!lg ? "flex-row" : "flex-col"}
  //         style={{
  //           flexDirection: "column-reverse",
  //           justifyContent: "space-between",
  //           padding: `2em 0 0 0`,
  //         }}
  //       >
  //         <div
  //           className="primary-title"
  //           style={{ fontSize: 20, marginTop: !lg ? null : "1em" }}
  //         >
  //           Share
  //         </div>
  //         <div className="primary-title" style={{ fontSize: 20 }}>
  //           Add to calendar
  //         </div>
  //       </div>
  //       <div className="flex" style={{ justifyContent: "space-between" }}>
  //         <div style={styles.socials}>
  //           <Link link={`https://www.facebook.com/`} target="_blank">
  //             <Image src={Facebook} className="d-block h-100" alt="Facebook" />
  //           </Link>
  //         </div>
  //         <div style={styles.socials}>
  //           <Link link={`https://www.twitter.com/`} target="_blank">
  //             <Image src={Twitter} className="d-block h-100" alt="Twitter" />
  //           </Link>
  //         </div>
  //         <div style={styles.socials}>
  //           <Link link={`https://www.instagram.com/`} target="_blank">
  //             <Image
  //               src={Instagram}
  //               className="d-block h-100"
  //               alt="Instagram"
  //             />
  //           </Link>
  //         </div>
  //         <div style={styles.socials}>
  //           <Link link={`https://www.linkedin.com/`} target="_blank">
  //             <Image src={Linkedin} className="d-block h-100" alt="Instagram" />
  //           </Link>
  //         </div>
  //         <div style={styles.socials}>
  //           <Link link={`https://www.linkedin.com/`} target="_blank">
  //             <Image src={Connect} className="d-block h-100" alt="Instagram" />
  //           </Link>
  //         </div>
  //         <div style={styles.socials}>
  //           <Link link={`https://www.linkedin.com/`} target="_blank">
  //             <Image src={WebPage} className="d-block h-100" alt="Instagram" />
  //           </Link>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  const ServeRegisterBanner = () => {
    return (
      <div
        className="shadow"
        style={{
          backgroundColor: colors.primary,
          color: colors.white,
          marginTop: `2em`,
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
          onClick={() => setGoToAction({ path: "/membership", actions })}
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
    let startDate = new Date();
    if (date_time) startDate = Object.values(date_time)[0].date;

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
    if (!eventList) return null;

    // get current event taxonomy types
    const currentPostGrade = event.event_grade[0];
    const currentPostLocation = event.event_location[0];
    const currentPostSpecialty = event.event_specialty[0];
    // get category name from category list
    let gradeName = "Grade";
    gradeName = gradeList.filter(
      (category) => category.id === Number(currentPostGrade)
    );
    if (gradeName[0]) gradeName = gradeName[0].name;
    // get list of events where category is the same as the current event
    let relatedGradeList = eventList.filter((event) => {
      return event.event_grade.includes(currentPostGrade);
    });
    // get latest events from the list
    relatedGradeList = eventList.slice(0, 3);
    if (!eventList.length) return null; // dont render if no events

    // get related event location list from the list
    let locationName = "Location";
    locationName = locationList.filter(
      (location) => location.id === Number(currentPostLocation)
    );
    if (locationName[0]) locationName = locationName[0].name;
    // get list of events where location is the same as the current event
    let relatedLocationList = eventList.filter((event) => {
      return event.event_location.includes(currentPostLocation);
    });
    // get latest events from the list
    relatedLocationList = eventList.slice(0, 3);

    const ServeRelatedEvents = ({ list, name }) => {
      if (!list.length) return null;

      return (
        <div>
          {relatedGradeList.map((event, key) => {
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
                    backgroundColor: colors.lightSilver,
                    textTransform: "capitalize",
                    width: "fit-content",
                  }}
                >
                  {formattedDate}
                </div>

                <div
                  className="primary-title"
                  style={{ fontSize: 16, padding: "1em 0", cursor: "pointer" }}
                  onClick={() => setGoToAction({ path: event.link, actions })}
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

    return (
      <div>
        <div className="shadow" style={{ padding: "1em" }}>
          <div
            className="primary-title"
            style={{ fontSize: 20, padding: "1em 0" }}
          >
            Related Content
          </div>
          <ServeRelatedEvents list={relatedGradeList} name={gradeName} />
          <ServeRelatedEvents list={relatedLocationList} name={locationName} />
        </div>
        <ServeFooter />
      </div>
    );
  };

  return (
    <BlockWrapper>
      <div style={{ backgroundColor: colors.white }}>
        <div style={{ padding: `${marginVertical}px ${marginHorizontal}px` }}>
          <ServeTitle />
          <div style={!lg ? styles.container : styles.containerMobile}>
            <div>
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
              {/* <div className="shadow">
                <div style={{ padding: "2em" }}>
                  <h3>Related events</h3>
                </div>
                <EventLoopBlock
                  block={{
                    acf_fc_layout: "events_loop_block",
                    background_colour: "transparent",
                    disable_vertical_padding: false,
                    add_search_function: false,
                    title: "",
                    body: "",
                    locations: false,
                    grades: false,
                    event_type: false,
                    layout: "layout_one",
                    view_all_link: false,
                    passed_grade_filter_id: event.event_grade[0],
                    post_limit: "3",
                    colour: "#F5F6F7",
                  }}
                  recommended_events
                />
              </div> */}
            </div>
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
