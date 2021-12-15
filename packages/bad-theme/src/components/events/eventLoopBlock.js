import { useState, useEffect } from "react";
import { connect } from "frontity";
import BlockWrapper from "../blockWrapper";
import Loading from "../loading";
import EventListView from "../eventListView";
import Card from "../card/card";
import { colors } from "../../config/colors";

const Post = ({
  state,
  actions,
  libraries,
  block,
  searchFilter,
  gradesFilter,
  locationsFilter,
}) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const [eventList, setEventList] = useState(null); // event data
  const [grades, setGrades] = useState(null); // data
  const [locations, setLocations] = useState(null); // data
  const [types, setTypes] = useState(null); // data
  const [gradeFilterId, setGradeFilterId] = useState(null); // data
  const search = block.add_search_function;
  const { layout, grade_filter } = block;

  const layoutOne = layout === "layout_one";
  const layoutTwo = layout === "layout_two";
  const layoutThree = layout === "layout_three";

  let STYLES = {};
  if (layoutTwo) STYLES = styles.layoutTwo;
  if (layoutThree) STYLES = styles.layoutThree;

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    const path = `/events/`;
    await actions.source.fetch(path); // fetch CPT events

    const events = state.source.get(path);
    const { totalPages, page, next } = events; // check if events have multiple pages
    // fetch events via wp API page by page
    let isThereNextPage = next;
    while (isThereNextPage) {
      await actions.source.fetch(isThereNextPage); // fetch next page
      const nextPage = state.source.get(isThereNextPage).next; // check ifNext page & set next page
      isThereNextPage = nextPage;
    }
    if (!state.source.events) return null;

    const EVENT_LIST = Object.values(state.source.events); // add events object to data array
    const GRADES = Object.values(state.source.event_grade);
    const LOCATIONS = Object.values(state.source.event_location);
    const TYPES = Object.values(state.source.event_type);
    let GRADE_FILTER_ID = GRADES.filter(
      (filter) => filter.name === grade_filter
    )[0];
    if (GRADE_FILTER_ID) GRADE_FILTER_ID = GRADE_FILTER_ID.id;

    setGradeFilterId(GRADE_FILTER_ID);

    setEventList(EVENT_LIST);
    setGrades(GRADES);
    setLocations(LOCATIONS);
    setTypes(TYPES);
  }, []);
  // DATA pre FETCH ----------------------------------------------------------------
  if (!eventList) return <Loading />;

  // RETURN ---------------------------------------------
  return (
    <div style={{ ...STYLES }}>
      {eventList.map((block, key) => {
        const {
          colour,
          image,
          summary,
          title,
          public_or_members_only,
          date_time,
        } = block.acf;
        const event_grade = block.event_grade;
        const event_location = block.event_location;
        const event_type = block.event_type;

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
            <div key={key}>
              <Card
                title={title}
                url={image}
                link={block.link}
                colour={colour}
                date={date_time}
                seatNumber="seatNumber"
                cardHeight="100%"
                cardWidth="100%"
              />
            </div>
          );

        if (layoutThree)
          return (
            <BlockWrapper background={block.background_colour}>
              <div key={key}>
                <Card
                  title={title}
                  link_label="Read More"
                  link={block.link}
                  colour={colour}
                  eventHeader={block.acf}
                  isFrom4Col
                />
              </div>
            </BlockWrapper>
          );
      })}
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

export default connect(Post);
