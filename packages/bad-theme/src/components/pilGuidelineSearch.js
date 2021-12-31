import { useState, useEffect, useLayoutEffect } from "react";
import { connect } from "frontity";

import Loading from "./loading";
import { colors } from "../config/imports";
import { v4 as uuidv4 } from "uuid";
import { setGoToAction } from "../context";

import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

let tetsPil = null;

const PilGuidelineSearch = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const { disable_vertical_padding } = block;

  const ctaHeight = 45;
  const BANNER_HEIGHT = state.theme.bannerHeight;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  const [uniqueId, setEventKey] = useState(null);
  const [pilData, setPilData] = useState(null);
  const filter = state.theme.filter;

  useEffect(async () => {
    state.theme.pilFilter = null; // reset search filter
    const path = `/pils/`;
    await actions.source.fetch(path); // fetch CPT guidelines

    const guidelines = await state.source.get(path);
    const { totalPages, page, next } = guidelines; // check if guidelines have multiple pages
    // fetch guidelines via wp API page by page
    let isThereNextPage = next;
    while (isThereNextPage) {
      await actions.source.fetch(isThereNextPage); // fetch next page
      const nextPage = state.source.get(isThereNextPage).next; // check ifNext page & set next page
      isThereNextPage = nextPage;
    }

    const PIL_LIST = Object.values(state.source.pils); // add guidelines object to data array
    setPilData(PIL_LIST);
  }, []);

  // hook applies after React has performed all DOM mutations
  useLayoutEffect(() => {
    const blockId = uuidv4(); // add unique id
    setEventKey(blockId);
  }, []);

  if (!block || !pilData) return <Loading />; // awaits pre fetch & data

  // HELPERS ---------------------------------------------
  const handleInputSearch = () => {
    const searchInput = document
      .querySelector(`#pilSearch${uniqueId}`)
      .value.toLowerCase();
    if (!searchInput) return null;
    console.log(searchInput);

    const PIL_LIST = Object.values(state.source.pils); // add events object to data array
    let results = PIL_LIST.filter((pil) =>
      pil.title.rendered.toLowerCase().includes(searchInput)
    );

    if (!results.length) results = [{ title: { rendered: "No Pils Found" } }];
    // state.theme.filter = results;
    tetsPil = results;
    console.log(results);
  };

  // SERVERS ---------------------------------------------
  const ServeFooter = () => {
    return (
      <div
        style={{
          backgroundColor: colors.primary,
          marginTop: `2em`,
          height: 5,
          width: "100%",
        }}
      />
    );
  };

  const ServeDropDown = () => {
    if (!tetsPil) return null;

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
            {tetsPil.map((event, key) => {
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
            onClick={() => state.theme.pilFilter}
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

  const ServeSearchContainer = () => {
    return (
      <div
        className="flex"
        style={{
          height: ctaHeight,
          position: "relative",
        }}
      >
        <input
          id={`pilSearch${uniqueId}`}
          onChange={handleInputSearch}
          type="text"
          className="form-control"
          placeholder="Find Guidelines"
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
        <ServeDropDown />
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div className="event-input" style={{ margin: `${marginVertical}px 0` }}>
      <div
        className="primary-title"
        style={{
          fontSize: 36,
          fontWeight: "bold",
          color: colors.black,
          paddingBottom: `1em`,
        }}
      >
        PIL & Guidelines Quicklinks
      </div>
      <ServeSearchContainer />
      <ServeFooter />
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

export default connect(PilGuidelineSearch);
