import { useState, useLayoutEffect } from "react";
import { connect } from "frontity";

import Loading from "../loading";
import { colors } from "../../config/imports";
import { v4 as uuidv4 } from "uuid";
import { setGoToAction } from "../../context";

import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

const SearchInput = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const [eventKey, setEventKey] = useState(null);
  const [events, setEvents] = useState(null);

  const BANNER_HEIGHT = state.theme.bannerHeight;
  const ctaHeight = 45;
  // hook applies after React has performed all DOM mutations
  useLayoutEffect(() => {
    const blockId = uuidv4(); // add unique id
    setEventKey(blockId);
  }, []);

  // HELPERS ---------------------------------------------
  const handleInputSearch = () => {
    const searchInput = document
      .querySelector(`#eventSearch${eventKey}`)
      .value.toLowerCase();
    if (searchInput.length < 3 && !searchInput) return null;

    const EVENT_LIST = Object.values(state.source.events); // add events object to data array
    let results = EVENT_LIST.filter((event) =>
      event.title.rendered.toLowerCase().includes(searchInput)
    );

    console.log(searchInput);
    if (!results.length) results = [{ title: { rendered: "No Events Found" } }];
    setEvents(results);
  };

  // SERVERS ---------------------------------------------
  const ServeDropDown = () => {
    if (!events) return null;

    return (
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          left: 0,
          top: ctaHeight,
          right: 0,
          marginTop: 10,
          border: `1px solid ${colors.silver}`,
          borderRadius: 10,
          backgroundColor: colors.white,
        }}
      >
        <div className="flex">
          <div
            style={{
              minHeight: ctaHeight,
              maxHeight: BANNER_HEIGHT / 2,
              borderRadius: 10,
              padding: `0.5em 1em`,
              overflow: "auto",
            }}
          >
            {events.map((event, key) => {
              if (!event.title) return null;

              console.log(event);

              const { link, title } = event;

              return (
                <div
                  className="event-search-title"
                  key={key}
                  style={{ padding: `0.5em 0`, cursor: "pointer" }}
                  onClick={() => {
                    setGoToAction({ path: link, actions });
                    setEvents(null);
                  }}
                >
                  <Html2React html={title.rendered} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const ServeIcon = () => {
    if (!events) {
      return <SearchIcon />;
    } else {
      return (
        <div style={styles.action}>
          <div
            style={styles.closeAction}
            onClick={() => {
              setEvents(null);
              document.querySelector(`#eventSearch${eventKey}`).value = "";
            }}
          >
            <CloseIcon
              style={{
                fill: colors.darkSilver,
                padding: 0,
              }}
            />
          </div>
        </div>
      );
    }
  };

  // RETURN ---------------------------------------------
  return (
    <div
      className="event-input"
      style={{ position: "relative", width: "100%" }}
    >
      <div
        className="flex"
        style={{
          flex: 1,
          height: ctaHeight,
          position: "relative",
        }}
      >
        <input
          id={`eventSearch${eventKey}`}
          onChange={handleInputSearch}
          type="text"
          className="form-control"
          placeholder="Find An Event"
          style={styles.input}
        />
        <div
          className="input-group-text"
          style={{
            position: "absolute",
            right: 0,
            height: ctaHeight,
            border: "none",
            background: "transparent",
            alignItems: "center",
            color: colors.darkSilver,
            cursor: "pointer",
          }}
        >
          <ServeIcon />
        </div>
      </div>
      <ServeDropDown />
    </div>
  );
};

const styles = {
  input: {
    borderRadius: 10,
    paddingRight: 35,
    color: colors.darkSilver,
  },
  action: {
    backgroundColor: colors.white,
    borderRadius: 5,
    width: "fit-content",
  },
};

export default connect(SearchInput);
