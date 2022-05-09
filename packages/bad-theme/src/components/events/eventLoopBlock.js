import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import Loading from "../loading";
import EventListView from "../eventListView";
import Card from "../card/card";
import TitleBlock from "../titleBlock";

// CONTEXT --------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setEventAnchorAction,
  muiQuery,
  getEventsData,
} from "../../context";

const EventLoopBlock = ({
  state,
  actions,
  libraries,
  block,
  searchFilter,
  gradesFilter,
  locationsFilter,
  recommended_events,
  specialtyFilter,
  yearFilter,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;
  const { sm, md, lg, xl } = muiQuery();

  const dispatch = useAppDispatch();
  const { eventAnchor } = useAppState();

  const {
    post_limit,
    disable_vertical_padding,
    add_search_function,
    layout,
    grade_filter,
    title,
    colour,
    events_archive,
  } = block;

  const [eventList, setEventList] = useState(null); // event data
  const [eventFilter, setFilter] = useState(null); // event data
  const [gradeFilter, setGradeFilterId] = useState(null); // data
  const useEffectRef = useRef(null);
  const postLimitRef = useRef(0);

  const layoutOne = layout === "layout_one";
  const layoutTwo = layout === "layout_two";
  const layoutThree = layout === "layout_three";
  const search = add_search_function;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  let STYLES = {};
  if (layoutTwo) STYLES = !lg ? styles.layoutTwo : styles.layoutTwoMobile;
  if (layoutThree) STYLES = !lg ? styles.layoutThree : styles.layoutTwoMobile;

  // DATA get for EVENTS ----------------------------------------------------------------
  useEffect(async () => {
    // let data = state.source.events;
    const events = await getEventsData({ state });
    console.log("🐞 ", events);
    setEventList(events); // set event data
    setFilter(events); // set event filter data

    // ⬇️ set link to anchor for event
    if (eventAnchor) {
      setTimeout(() => {
        const anchor = document.getElementById(eventAnchor);
        if (anchor) anchor.scrollIntoView({ behavior: "smooth" });
      }, 500);
      // console.log("🚀 anchor to event list", eventAnchor); // debug

      setEventAnchorAction({ dispatch, eventAnchor: null }); // reset
    }

    return;

    const fetching = await fetch(
      "https://controlpanel.bad.org.uk/wp-json/wp/v2/events?_fields=title,link,event_grade,acf.date_time,acf.organizer,acf.venue,acf.preview_summary,acf.image"
    );
    const data = await fetching.json();
    console.log("EVENT DATA", data);
    let eventList = Object.values(data);
    const grades = Object.values(state.source.event_grade);

    let gradeFilter = [];
    let isArray = Array.isArray(grade_filter); // verify data type
    if (grades && isArray) {
      grades.filter((filter) => {
        // map grade_filter & if grade name matches grade_filter then return id
        grade_filter.map((grade) => {
          if (filter.name.toLowerCase() === grade.toLowerCase())
            gradeFilter.push(filter.id);
        });
      });
    }

    // 📌 uncoment to sort by data
    // 📌 sort events by date newest first
    eventList.sort((a, b) => {
      let dateA = a.acf.date_time;
      let dateB = b.acf.date_time;
      if (dateA) dateA = dateA[0].date;
      if (dateB) dateB = dateB[0].date;
      // convert to date object
      dateA = new Date(dateA);
      dateB = new Date(dateB);

      if (dateA > dateB) return -1;
      if (dateA < dateB) return 1;
      return 0;
    });

    // 📌 sort eventList by closest to today first (if date is set)
    eventList.sort((a, b) => {
      let dateA = a.acf.date_time;
      let dateB = b.acf.date_time;
      if (dateA) dateA = dateA[0].date;
      if (dateB) dateB = dateB[0].date;

      // convert to date object
      dateA = new Date(dateA);
      dateB = new Date(dateB);

      // get today's date
      let today = new Date();

      // get date difference
      let diffA = Math.abs(dateA - today);
      let diffB = Math.abs(dateB - today);

      if (diffA > diffB) return 1;
      if (diffA < diffB) return -1;

      return 0;
    });

    setEventList(eventList);
    setGradeFilterId(gradeFilter);

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, []);

  useEffect(() => {
    // ⬇️ handle serach filter change

    if (
      !searchFilter &&
      !gradesFilter &&
      !locationsFilter &&
      !specialtyFilter &&
      !yearFilter
    ) {
      // if no search filter applied then return all prefetched events
      setFilter(eventList);
      return;
    }

    let filteredEvents = eventList;

    if (searchFilter) {
      // if search filter applied then filter events
      filteredEvents = eventList.filter((event) => {
        // filter events by search filter
        let search = searchFilter.toLowerCase();

        const isInTitle = event.title.rendered.toLowerCase().includes(search);
        const isInPreview = event.acf.preview_summary
          .toLowerCase()
          .includes(search);
        const isInOrganizer = event.acf.organizer
          .toLowerCase()
          .includes(search);

        if (isInTitle || isInPreview || isInOrganizer) {
          return event;
        } else {
          return null;
        }
      });
    }

    if (gradesFilter) {
      // if grades filter applied then filter events
      filteredEvents = filteredEvents.filter((event) => {
        // filter events by grades filter
        let grade = event.event_grade;
        let isInGrade = grade.includes(Number(gradesFilter));

        return isInGrade;
      });
    }

    if (locationsFilter) {
      // if locations filter applied then filter events
      filteredEvents = filteredEvents.filter((event) => {
        // filter events by locations filter
        let location = event.event_location;
        let isInLocation = location.includes(Number(locationsFilter));

        return isInLocation;
      });
    }

    if (specialtyFilter) {
      // if specialty filter applied then filter events
      filteredEvents = filteredEvents.filter((event) => {
        // filter events by specialty filter
        let specialty = event.event_specialty;
        let isInSpecialty = specialty.includes(Number(specialtyFilter));

        return isInSpecialty;
      });
    }

    if (yearFilter) {
      let [fMonth, fDay, fYear] = yearFilter.split(" ");

      // if year filter applied then filter events
      filteredEvents = filteredEvents.filter((event) => {
        let isIncluded = false;
        // filter events by year filter
        let date = event.acf.date_time;
        // map date to year and compare to year filter
        if (date) {
          date.map((eventDate) => {
            // get year from date
            let [eMonth, eDate, eYear] = eventDate.date.split("/");
            // if month have 0 in front then remove it
            if (eMonth[0] === "0") eMonth = eMonth.slice(1);
            let isInYear = fMonth === eMonth && fYear === eYear;

            if (isInYear) {
              isIncluded = true;
            }
          });
        }

        return isIncluded;
      });
    }

    // if page is set to events_archive return only events that date is in the past
    // let isArchive = false;
    // if (date_time) {
    //   // loop through date_time and check if date is in the past
    //   date_time.forEach((date) => {
    //     if (new Date(date.date) < new Date()) isArchive = true;
    //   });
    // }

    // 📌 set filtered data to state
    setFilter(filteredEvents);
  }, [
    searchFilter,
    gradesFilter,
    locationsFilter,
    specialtyFilter,
    yearFilter,
  ]);

  if (!eventFilter) return <Loading />;

  // RETURN ---------------------------------------------
  return (
    <div style={{ paddingBottom: `${marginVertical}px` }}>
      <TitleBlock
        block={{ title, text_align: "centre" }}
        margin={`0 0 ${marginVertical}px`}
      />
      <div style={STYLES}>
        {eventFilter.map((block, key) => {
          const { image, summary, date_time } = block.acf;
          const title = block.title.rendered;
          const event_grade = block.event_grade;
          const event_location = block.event_location;
          const event_specialty = block.event_specialty;

          // ⬇️ if events_archive show only past events else break
          // if (events_archive) {
          //   if (!isArchive) return null;
          // } else {
          //   if (isArchive) return null;
          // }
          // ⬇️ show only events that event_grade object have in common gradeFilter
          /* if (gradeFilter.length > 0) {
            if (!event_grade) return null;
            let grade_match = false;
            event_grade.forEach((grade) => {
              gradeFilter.forEach((filter) => {
                if (grade === filter) grade_match = true;
              });
            });
            if (!grade_match) return null;
          } */

          // // ⬇️ if post_limit is set then show only post_limit posts
          // if (post_limit) {
          //   if (postLimitRef.current >= post_limit) return null;
          //   postLimitRef.current++;
          // }

          // list view
          if (layoutOne) {
            const removeMargin = search && key === 0;
            return (
              <div
                key={key}
                data-aos="fade"
                data-aos-easing="ease-in-sine"
                data-aos-delay={`${key * 50}`}
                data-aos-duration="1000"
                data-aos-offset="-120"
              >
                <EventListView
                  block={block}
                  removeMargin={removeMargin}
                  recommended_events={recommended_events ? true : false}
                />
              </div>
            );
          }

          // 2x card view
          if (layoutTwo)
            return (
              <Card
                key={key}
                title={title}
                url={image}
                imgHeight={200}
                link_label="Read More"
                link={block.link}
                colour={colour}
                date={date_time}
                delay={key}
                seatNumber="seatNumber"
                cardHeight="100%"
                shadow
              />
            );

          // 4x card vew
          if (layoutThree)
            return (
              <Card
                delay={key}
                key={key}
                title={title}
                link_label="Read More"
                link={block.link}
                colour={colour}
                eventHeader={block.acf}
                isFrom4Col
                titleLimit={4}
                shadow
              />
            );
        })}
      </div>
    </div>
  );
};

const styles = {
  layoutTwo: {
    display: "grid",
    gridTemplateColumns: `1fr 1fr`,
    gap: 20,
  },
  layoutTwoMobile: {
    display: "grid",
    gridTemplateColumns: `1fr`,
    gap: 20,
  },
  layoutThree: {
    display: "grid",
    gridTemplateColumns: `repeat(4, 1fr)`,
    gap: 20,
  },
};

export default connect(EventLoopBlock);
