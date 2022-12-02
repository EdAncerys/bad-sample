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
  block,
  searchFilter,
  gradesFilter,
  locationsFilter,
  recommended_events,
  specialtyFilter,
  yearFilter,
}) => {
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
  const [filteredEvents, setFilteredEvents] = useState(null); // event data
  const [eventFilter, setFilter] = useState(null); // event data
  const currentPageRef = useRef(1);
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
    let response = await getEventsData({
      state,
      page: currentPageRef.current,
    });
    let events = response;
    let grades = await getEventGrades({ state });
    if (!!post_limit) postLimitRef.current = Number(post_limit);
    if (!events) return;

    currentPageRef.current++;

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

        let eventStartDateObj = new Date(eventDate?.[0]?.date);
        let eventCloseDateObj = new Date(eventDate?.[1]?.date);
        let today = new Date();
        // is event date in the future | is event close date in the future
        const isFuture =
          eventStartDateObj >= today || eventCloseDateObj >= today;

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
    response = events; // 👉 apply all logics before slice data to post limit

    if (postLimitRef.current !== 0 && events) {
      // ⬇️ if post_limit is set then show only post_limit posts
      if (events.length <= postLimitRef.current) return null;
      // apply limit to eventList array length if post_limit is set & less than post_limit
      events = events.slice(0, postLimitRef.current);
    }

    setEventList(response); // set event data
    setFilteredEvents(events); // set event data
    setFilter(events); // set event filter data

    // ⬇️ set link to anchor for event
    if (eventAnchor) {
      setTimeout(() => {
        const anchor = document.getElementById(eventAnchor);
        if (anchor) anchor.scrollIntoView({ behavior: "smooth" });
      }, 500);

      setEventAnchorAction({ dispatch, eventAnchor: null }); // reset
    }
  }, []);

  useEffect(() => {
    if (!eventList) return; // await data to be set

    if (
      !searchFilter &&
      !gradesFilter &&
      !locationsFilter &&
      !specialtyFilter &&
      !yearFilter
    ) {
      setFilter(eventList?.slice(0, postLimitRef.current)); // 👉 reset filters
      return;
    }

    let filtered = eventList; // 👉 initial state

    if (searchFilter) {
      // if search filter applied then filter events
      filtered = filtered.filter((event) => {
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
      filtered = filtered.filter((event) => {
        // filter events by grades filter
        let grade = event.event_grade;
        if (!grade) return false;
        let isInGrade = grade.includes(Number(gradesFilter));

        return isInGrade;
      });
    }
    if (locationsFilter) {
      // if locations filter applied then filter events
      filtered = filtered.filter((event) => {
        // filter events by locations filter
        let location = event.event_location;
        let isInLocation = location.includes(Number(locationsFilter));

        return isInLocation;
      });
    }
    if (specialtyFilter) {
      // if specialty filter applied then filter events
      filtered = filtered.filter((event) => {
        // filter events by specialty filter
        let specialty = event.event_specialty;
        let isInSpecialty = specialty.includes(Number(specialtyFilter));

        return isInSpecialty;
      });
    }

    if (yearFilter) {
      const fMonth = new Date(yearFilter).getMonth() + 1;
      const fYear = new Date(yearFilter).getFullYear();

      // if year filter applied then filter events
      filtered = filtered.filter((event) => {
        // filter events by year & month filter (if month filter is applied)
        let eventDate = event.acf.date_time;
        if (!eventDate) return false;

        const monthOp = +eventDate?.[0]?.date?.split("/")?.[0];
        const yearOp = +eventDate?.[0]?.date?.split("/")?.[2];
        const monthCl = +eventDate?.[1]?.date?.split("/")?.[0];
        const yearCl = +eventDate?.[1]?.date?.split("/")?.[2];

        // --------------------------------------------------------------------------------
        // 📌  if month filter is applied then filter by month & year
        // --------------------------------------------------------------------------------
        let isInMonth = monthOp === fMonth || monthCl === fYear;
        let isInYear = yearOp === fYear || yearCl === fYear;

        return isInMonth && isInYear;
      });
    }

    // ⬇️⬇ sort events by date
    filtered = handleSortFilter({ list: filtered });

    // 📌 set filtered data to state
    setFilter(filtered);
  }, [
    searchFilter,
    gradesFilter,
    locationsFilter,
    specialtyFilter,
    yearFilter,
  ]);

  if (!eventFilter) return <Loading />;

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
