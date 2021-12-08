import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../config/colors";
import Loading from "../components/loading";
import DownloadFileBlock from "../components/downloadFileBlock";
import EventListView from "../components/eventListView";

const Post = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

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
        margin: `${marginVertical}px ${marginHorizontal}px`,
      }}
    >
      {eventList.map((block, key) => {
        return (
          <div key={key}>
            <EventListView block={block} />
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Post);
