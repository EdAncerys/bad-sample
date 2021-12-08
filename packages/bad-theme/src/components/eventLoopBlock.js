import { useState, useEffect } from "react";
import { connect } from "frontity";

import { colors } from "../config/colors";
import Loading from "../components/loading";
import DownloadFileBlock from "../components/downloadFileBlock";
import EventListView from "../components/eventListView";

const Post = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const marginHorizontal = state.theme.marginHorizontal;
  const marginVertical = state.theme.marginVertical;

  const [eventList, setEventList] = useState(null);

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

  // SERVERS ---------------------------------------------
  const EventLoopBlock = () => {
    if (!pil.title) return null;

    return (
      <div className="flex">
        <div
          style={{
            fontSize: 36,
            fontWeight: "bold",
            padding: `0.5em 1em`,
            color: colors.black,
            backgroundColor: colors.white,
            borderBottom: `5px solid ${colors.danger}`,
          }}
        >
          <Html2React html={pil.title.rendered} />
        </div>
      </div>
    );
  };

  const ServeBody = () => {
    if (!pil.content) return null;

    return (
      <div
        style={{
          backgroundColor: colors.white,
          padding: `2em 1em`,
          margin: `2em 0`,
        }}
      >
        <Html2React html={pil.content.rendered} />
      </div>
    );
  };

  const ServeDownload = () => {
    if (!pil.acf) return null;

    return (
      <div style={{ margin: `4em 0` }}>
        <DownloadFileBlock block={pil.acf} disableMargin />
      </div>
    );
  };

  return (
    <div
      style={{
        margin: `${marginVertical}px ${marginHorizontal}px`,
      }}
    >
      {/* <EventListView /> */}
      hello
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Post);
