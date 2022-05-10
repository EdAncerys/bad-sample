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
  handleSortFilter,
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
  const [isPostLimit, setLimit] = useState(post_limit && post_limit !== "0");
  const [moreAction, setMoreAction] = useState(false); // event data
  const useEffectRef = useRef(null);
  const curentPageRef = useRef(1);

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
    if (!events) return;

    curentPageRef.current++;
    // if page is set to events_archive return only events that date is in the past
    if (events_archive) {
      events = events.filter((event) => {
        let eventDate = event.acf.date_time;
        if (!eventDate) return false;
        console.log("🐞 ", eventDate);

        let [month, date, year] = eventDate[0].date.split("/");
        let eventDateObj = new Date(year, month, date);
        let today = new Date();

        return eventDateObj < today;
      });
    }

    // ⬇️⬇ sort events by date
    events = handleSortFilter({ list: events });

    if (isPostLimit && events) {
      // ⬇️ if post_limit is set then show only post_limit posts
      if (events.lenght <= Number(post_limit)) return null;
      // apply limit to eventList array length if post_limit is set & less than post_limit
      events = events.slice(0, Number(post_limit));
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
  const handleLoadMoreFilter = async () => {
    // ⬇️ handle load more filter
    let events = await getEventsData({ state, page: curentPageRef.current });
    if (!events) {
      setMoreAction(false);
      return;
    }
    curentPageRef.current++;

    let updatedEvents = [...eventList, ...events];

    // ⬇️⬇ sort events by date
    updatedEvents = handleSortFilter({ list: updatedEvents });

    // add events to eventList
    setEventList(updatedEvents);
    setFilter(updatedEvents);
  };

  if (!eventFilter) return <Loading />;

  // SERVERS ---------------------------------------------------------------
  const ServeMoreAction = () => {
    if (
      isPostLimit ||
      searchFilter ||
      gradesFilter ||
      locationsFilter ||
      specialtyFilter ||
      yearFilter ||
      moreAction // disable more action if no more events
    )
      return null;

    return (
      <div
        className="flex"
        style={{
          justifyContent: "center",
          paddingTop: `2em`,
        }}
      >
        <div className="transparent-btn" onClick={handleLoadMoreFilter}>
          Load More
        </div>
      </div>
    );
  };

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
      <ServeMoreAction />
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
