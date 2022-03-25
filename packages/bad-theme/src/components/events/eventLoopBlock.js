import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import Loading from "../loading";
import EventListView from "../eventListView";
import Card from "../card/card";
import TitleBlock from "../titleBlock";
import { colors } from "../../config/imports";
// CONTEXT --------------------------------------------------------
import {
  useAppDispatch,
  useAppState,
  setEventAnchorAction,
} from "../../context";
import { getEventsData } from "../../helpers";

import { muiQuery } from "../../context";
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
  // console.log("block", colour); // debug

  const [eventList, setEventList] = useState(null); // event data

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
    let data = state.source.events;

    let eventList = Object.values(data);
    console.log("eventList", eventList); // debug
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

    // sort events in order by date accenting from
    eventList = eventList.sort((a, b) => {
      // if !date_time return null;
      if (!a.date_time || !b.date_time) return null;
      new Date(a.acf.date_time[0].date) - new Date(b.acf.date_time[0].date);
    });

    // console.log("🚀 event list", eventList.length); // debug
    setEventList(eventList);
    setGradeFilterId(gradeFilter);

    // link to anchor for event
    if (eventAnchor) {
      setTimeout(() => {
        const anchor = document.getElementById(eventAnchor);
        if (anchor) anchor.scrollIntoView({ behavior: "smooth" });
      }, 500);
      // console.log("🚀 anchor to event list", eventAnchor); // debug

      setEventAnchorAction({ dispatch, eventAnchor: null }); // reset
    }

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, []);

  if (!eventList) return <Loading />;

  // RETURN ---------------------------------------------
  return (
    <div style={{ paddingBottom: `${marginVertical}px` }}>
      <TitleBlock
        block={{ title, text_align: "centre" }}
        margin={`0 0 ${marginVertical}px`}
      />
      <div style={STYLES}>
        {eventList.map((block, key) => {
          const { image, summary, public_or_members_only, date_time } =
            block.acf;
          const title = block.title.rendered;
          const event_grade = block.event_grade;
          const event_location = block.event_location;
          const event_specialty = block.event_specialty;

          // if page is set to events_archive return only events that date is in the past
          let isArchive = false;
          if (date_time) {
            // loop through date_time and check if date is in the past
            date_time.forEach((date) => {
              if (new Date(date.date) < new Date()) isArchive = true;
            });
          }
          // ⬇️ if events_archive show only past events else break
          if (events_archive) {
            if (!isArchive) return null;
          } else {
            if (isArchive) return null;
          }
          // ⬇️ show only events that event_grade object have in common gradeFilter
          if (gradeFilter.length > 0) {
            if (!event_grade) return null;
            let grade_match = false;
            event_grade.forEach((grade) => {
              gradeFilter.forEach((filter) => {
                if (grade === filter) grade_match = true;
              });
            });
            if (!grade_match) return null;
          }

          if (searchFilter) {
            if (!title && !summary) return null;
            if (
              title
                ? !title.toLowerCase().includes(searchFilter.toLowerCase())
                : null || summary
                ? !summary.toLowerCase().includes(searchFilter.toLowerCase())
                : null
            )
              return null;
          }
          // ⬇️ user select filtering
          if (gradesFilter) {
            if (!event_grade.includes(Number(gradesFilter))) return null;
          }
          if (locationsFilter) {
            if (!event_location.includes(Number(locationsFilter))) return null;
          }
          if (specialtyFilter) {
            if (!event_specialty.includes(Number(specialtyFilter))) return null;
          }
          if (yearFilter) {
            // get event month & year start
            const eventDate = date_time[0].date;
            const eventMont = new Date(eventDate).getMonth() + 1;
            const eventYear = new Date(eventDate).getFullYear();
            // get filter current month & year
            const filterMont = new Date(yearFilter).getMonth() + 1;
            const filterYear = new Date(yearFilter).getFullYear();

            // filter events based on mont & year start
            if (eventMont !== filterMont || eventYear !== filterYear)
              return null;
          }

          // ⬇️ if post_limit is set then show only post_limit posts
          if (post_limit) {
            if (postLimitRef.current >= post_limit) return null;
            postLimitRef.current++;
          }

          if (layoutOne) {
            const removeMargin = search && key === 0;
            return (
              <div key={key}>
                <EventListView
                  block={block}
                  removeMargin={removeMargin}
                  recommended_events={recommended_events ? true : false}
                />
              </div>
            );
          }

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
