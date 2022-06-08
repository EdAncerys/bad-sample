import React, { useState, useEffect, useRef } from "react";
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
  handleSortFilter,
  getEventGrades,
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
  console.log("🐞 BLOCK", block);

  const [eventList, setEventList] = useState(null); // event data
  const [eventFilter, setFilter] = useState(null); // event data
  const curentPageRef = useRef(1);
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
    let events = await getEventsData({ state, page: curentPageRef.current });
    let grades = await getEventGrades({ state });
    if (!!post_limit) postLimitRef.current = Number(post_limit);
    if (!events) return;

    curentPageRef.current++;

    // ⬇️⬇ sort events by date
    events = handleSortFilter({ list: events });

    // if page is set to events_archive return only events that date is in the past
    if (events_archive) {
      events = events.filter((event) => {
        let eventDate = event.acf.date_time;
        if (!eventDate) return false;

        let eventDateObj = new Date(eventDate[0].date);
        let today = new Date();
        // if event date is in the past return true
        const isPastEvent = eventDateObj < today;

        return isPastEvent;
      });
    } else {
      events = events.filter((event) => {
        let eventDate = event.acf.date_time;
        if (!eventDate) return false;

        // let [month, date, year] = eventDate[0].date.split("/");
        // let eventDateObj = new Date(year, month, date);
        let eventDateObj = new Date(eventDate[0].date);
        let today = new Date();
        // is event date in the future
        const isFuture = eventDateObj >= today;

        return isFuture;
      });
    }

    if (grade_filter && grades) {
      // apply grade filter to events list
      // apply to lower case to all filter title values
      let filters = Object.values(grade_filter);
      // break if filters are empty
      let filterTitlesToLowerCase = filters.map((grade) => grade.toLowerCase());

      // get list of grade id that match the filter titles
      let gradeIds = [];
      grades.map((grade) => {
        let gradeTitle = grade.name.toLowerCase();
        let isIncluded = filterTitlesToLowerCase.includes(gradeTitle);
        if (isIncluded) gradeIds.push(grade.id);
      });
      // console.log("🐞 gradeIds", gradeIds);

      // get events that match the grade ids
      // apply filters if grade_filter is set and grade_filter is not empty
      if (filters.length)
        events = events.filter((event) => {
          let eventGradeIds = event.event_grade;
          let isIncluded = eventGradeIds.some((gradeId) =>
            gradeIds.includes(gradeId)
          );

          return isIncluded;
        });
    }

    console.log("🐞 postLimitRef", postLimitRef.current);
    console.log("🐞 events", events.length);
    if (postLimitRef.current !== 0 && events) {
      // ⬇️ if post_limit is set then show only post_limit posts
      if (events.lenght <= postLimitRef.current) return null;
      // apply limit to eventList array length if post_limit is set & less than post_limit
      events = events.slice(0, postLimitRef.current);
    }

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
  }, []);

  useEffect(async () => {
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
        if (!grade) return false;
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
    if (events_archive) {
      filteredEvents = filteredEvents.filter((event) => {
        let eventDate = event.acf.date_time;
        if (!eventDate) return false;

        let [month, date, year] = eventDate[0].date.split("/");
        let eventDateObj = new Date(year, month, date);
        let today = new Date();

        return eventDateObj < today;
      });
    }

    // ⬇️⬇ sort events by date
    filteredEvents = handleSortFilter({ list: filteredEvents });

    // 📌 set filtered data to state
    setFilter(filteredEvents);
  }, [
    searchFilter,
    gradesFilter,
    locationsFilter,
    specialtyFilter,
    yearFilter,
  ]);

  // HANDLERS --------------------------------------------------------------

  if (!eventFilter) return <Loading />;

  // SERVERS ---------------------------------------------------------------

  // RETURN ----------------------------------------------------------------
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
