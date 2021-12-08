import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../config/colors";
import Loading from "../components/loading";
import DownloadFileBlock from "../components/downloadFileBlock";
import EventListView from "../components/eventListView";
import Card from "../components/card/card";

const Post = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;
  const LAYOUT = block.layout;
  const layoutOne = LAYOUT === "layout_one";
  const layoutTwo = LAYOUT === "layout_two";
  const layoutThree = LAYOUT === "layout_three";
  const STYLES = layoutTwo ? styles.layoutTwo : {};

  const [eventList, setEventList] = useState(null); // event data

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

    const EVENT_LIST = Object.values(state.source.events); // add pill object to data array
    setEventList(EVENT_LIST);
  }, []);

  if (!eventList) return <Loading />;

  // RETURN ---------------------------------------------
  return (
    <div
      style={{
        ...STYLES,
        margin: `${marginVertical}px ${marginHorizontal}px`,
      }}
    >
      {eventList.map((block, key) => {
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
          title,
          filter_one,
          filter_two,
          filter_three,
        } = block.acf;

        console.log("block", block);

        if (layoutOne)
          return (
            <div key={key}>
              <EventListView block={block} />
            </div>
          );

        if (layoutTwo)
          return (
            <div key={key}>
              <Card
                title={title}
                body={summary}
                url={image}
                link={block.link}
              />
            </div>
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
};

export default connect(Post);
