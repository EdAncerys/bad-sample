import { useState, useEffect, useLayoutEffect } from "react";
import { connect } from "frontity";

import Loading from "../loading";
import { colors } from "../../config/imports";
import { v4 as uuidv4 } from "uuid";
import { setGoToAction } from "../../context";

import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

const SearchInput = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const ctaHeight = 45;
  const BANNER_HEIGHT = state.theme.bannerHeight;
  const [uniqueId, setUniqueId] = useState(null);
  const filter = state.theme.filter;

  // hook applies after React has performed all DOM mutations
  useLayoutEffect(() => {
    const blockId = uuidv4(); // add unique id
    setUniqueId(blockId);
  }, []);

  // HELPERS ---------------------------------------------
  const handleInputSearch = () => {
    const searchInput = document
      .querySelector(`#eventSearch${uniqueId}`)
      .value.toLowerCase();
    if (!searchInput) return null;

    const EVENT_LIST = Object.values(state.source.events); // add events object to data array
    let results = EVENT_LIST.filter((event) =>
      event.title.rendered.toLowerCase().includes(searchInput)
    );

    if (!results.length) results = [{ title: { rendered: "No Events Found" } }];
    state.theme.filter = results;
  };

  // SERVERS ---------------------------------------------
  const ServeDropDown = () => {
    if (!filter) return null;

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
            {filter.map((event, key) => {
              if (!event.title) return null;
              const { link, title } = event;

              return (
                <div
                  className="event-search-title"
                  key={key}
                  style={{ padding: `0.5em 0`, cursor: "pointer" }}
                  onClick={() => {
                    setGoToAction({ path: link, actions });
                    state.theme.filter = null;
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
    if (!filter) {
      return <SearchIcon />;
    } else {
      return (
        <div style={styles.action}>
          <div
            className="search-clear-icon"
            onClick={() => {
              state.theme.filter = null;
              document.querySelector(`#eventSearch${uniqueId}`).value = "";
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
      className="search-input"
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
          id={`eventSearch${uniqueId}`}
          onChange={handleInputSearch}
          type="text"
          className="form-control"
          placeholder="Search"
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
  },
  action: {
    backgroundColor: colors.white,
    borderRadius: 5,
    width: "fit-content",
  },
};

export default connect(SearchInput);
