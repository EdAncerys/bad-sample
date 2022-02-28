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

const EventLoopBlock = ({
  state,
  actions,
  libraries,
  block,
  searchFilter,
  gradesFilter,
  locationsFilter,
  specialtyFilter,
  yearFilter,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

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
  } = block;

  const [eventList, setEventList] = useState(null); // event data

  const [gradeFilterId, setGradeFilterId] = useState(null); // data
  const mountedRef = useRef(true);

  const layoutOne = layout === "layout_one";
  const layoutTwo = layout === "layout_two";
  const layoutThree = layout === "layout_three";
  const search = add_search_function;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  let STYLES = {};
  if (layoutTwo) STYLES = styles.layoutTwo;
  if (layoutThree) STYLES = styles.layoutThree;

  // DATA get for EVENTS ----------------------------------------------------------------
  useEffect(async () => {
    // events data pre fetch via beforeCSR
    if (!state.source.events) {
      console.log("Error. Failed to fetch events data"); // debug
      return null;
    }
    let eventList = Object.values(state.source.events); // add events object to data array
    const grades = Object.values(state.source.event_grade);

    let gradeFilterId = grades.filter(
      (filter) => filter.name === grade_filter
    )[0];

    if (gradeFilterId) gradeFilterId = gradeFilterId.id;
    if (post_limit) eventList = eventList.slice(0, Number(post_limit)); // apply limit on posts

    setGradeFilterId(gradeFilterId);

    // sort events in order by date accenting from
    let filterByDate = eventList.sort(
      (a, b) =>
        new Date(a.acf.date_time[0].date) - new Date(b.acf.date_time[0].date)
    );

    setEventList(filterByDate);

    // link to anchor for event
    if (eventAnchor) {
      setTimeout(() => {
        const anchor = document.getElementById(eventAnchor);
        if (anchor) anchor.scrollIntoView({ behavior: "smooth" });
      }, 500);
      console.log("🚀 anchor to event list", eventAnchor); // debug

      setEventAnchorAction({ dispatch, eventAnchor: null }); // reset
    }

    return () => {
      mountedRef.current = false; // clean up function
    };
  }, [state.source.events]);
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

          if (!event_grade.includes(gradeFilterId) && gradeFilterId !== 97)
            return null;
          if (!!searchFilter) {
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
          // select filtering config
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

          if (layoutOne) {
            const removeMargin = search && key === 0;
            return (
              <div key={key}>
                <EventListView block={block} removeMargin={removeMargin} />
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
                seatNumber="seatNumber"
                cardHeight="100%"
                shadow
              />
            );

          if (layoutThree)
            return (
              <Card
                key={key}
                title={title}
                link_label="Read More"
                link={block.link}
                colour={colour}
                eventHeader={block.acf}
                isFrom4Col
                titleLimit={1}
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
  layoutThree: {
    display: "grid",
    gridTemplateColumns: `repeat(4, 1fr)`,
    gap: 20,
  },
};

export default connect(EventLoopBlock);
