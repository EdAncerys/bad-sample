import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import Loading from "./loading";
import { colors } from "../config/imports";
import TitleBlock from "./titleBlock";
import SearchDropDown from "./searchDropDown";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

// CONTEXT -----------------------------------------------------------
import {
  useAppDispatch,
  getPILsDataAction,
  getGuidelinesDataAction,
  setGoToAction,
  setIDFilterAction,
} from "../context";

const PilGuidelineSearch = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { disable_vertical_padding, colour } = block;
  const ctaHeight = 45;
  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  const [content, setContent] = useState(null);
  const [filterData, setFilterData] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const useEffectRef = useRef(null);

  useEffect(async () => {
    // CPT search content data
    let searchData = {};
    let pils = state.source.pils;
    let guidelines = state.source.guidelines_standards;
    // console.log("data", pils, guidelines); // debug

    if (!pils) {
      await getPILsDataAction({ state, actions });
      pils = state.source.pils;
    }
    if (!guidelines) {
      await getGuidelinesDataAction({ state, actions });
      guidelines = state.source.guidelines_standards;
    }

    // merge pils and guidelines data
    searchData = { ...pils, ...guidelines };
    setContent(Object.values(searchData));

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, []);

  if (!block || !content) return <Loading />; // awaits pre fetch & data

  // HELPERS ---------------------------------------------
  const handleSearch = (e) => {
    const input = e.target.value.toLowerCase();

    // ⬇️ apply data filters for search
    let data = content;
    data = data.filter((item) => {
      const title = item.title.rendered.toLowerCase().includes(input);
      // const body = item.content.rendered.toLowerCase().includes(input); // include body

      return title;
    });

    // ⬇️ refactor data to match dropdown format
    data = data.map((item) => {
      // link overwrite
      const isGuidelines = item.type === "guidelines_standards";

      return {
        title: item.title.rendered,
        link: isGuidelines
          ? "/guidelines-and-standards/clinical-guidelines/"
          : item.link,
        type: item.type,
        id: item.id,
      };
    });
    // sort data alphabetically by title
    data.sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });

    // if data is empty, set filterData to null
    if (data.length === 0) {
      setFilterData(null);
      setInputValue(input);
      return;
    }

    if (data && input) {
      setFilterData(data);
      setInputValue(input);
    } else {
      setFilterData(null);
      setInputValue("");
    }
    // console.log("filterData", data.length); // debug
    // console.log("input", input); // debug
  };

  const selectHandler = ({ item }) => {
    const isGuidelines = item.type === "guidelines_standards";
    console.log("item", item);
    if (isGuidelines) {
      setIDFilterAction({ dispatch, idFilter: item.id });
    }

    setGoToAction({ state, path: item.link, actions });
  };

  // SERVERS ---------------------------------------------
  const ServeFooter = () => {
    return (
      <div
        style={{
          backgroundColor: colour,
          height: 5,
          width: "100%",
        }}
      />
    );
  };

  const ServeIcon = () => {
    const searchIcon = <SearchIcon />;
    const closeIcon = <CloseIcon />;
    const icon = inputValue ? closeIcon : searchIcon;

    const handleClearSearch = () => {
      if (!inputValue) return;

      setInputValue("");
      setFilterData(null);
    };

    return <div onClick={handleClearSearch}>{icon}</div>;
  };

  const ServeSearchButton = () => {
    return (
      <div
        style={{
          display: "grid",
          alignItems: "center",
          paddingLeft: `2em`,
        }}
      >
        <button type="submit" className="blue-btn">
          Search
        </button>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div
      style={{ padding: `${marginVertical}px ${marginHorizontal}px` }}
      className="no-selector"
    >
      <div className="shadow" style={{ backgroundColor: colors.white }}>
        <div className="shadow" style={{ backgroundColor: colors.white }}>
          <div className="flex no-selector" style={{ padding: `2em` }}>
            <div className="flex-col">
              <TitleBlock
                block={{
                  text_align: "left",
                  title: "Search for PILs & Guidelines",
                }}
                margin="0 0 1em 0"
              />
              <div className="flex-row">
                <div
                  className="flex"
                  style={{
                    flex: 1,
                    height: ctaHeight,
                    position: "relative",
                    margin: "auto 0",
                  }}
                >
                  <input
                    value={inputValue}
                    onChange={handleSearch}
                    type="text"
                    className="form-control input"
                    placeholder="Search"
                  />
                  <div
                    className="input-group-text toggle-icon-color"
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
                  <SearchDropDown
                    filter={filterData}
                    mapToName="title.rendered"
                    onClickHandler={selectHandler}
                    marginTop={ctaHeight + 10}
                  />
                </div>
                <ServeSearchButton />
              </div>
            </div>
          </div>

          <ServeFooter />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(PilGuidelineSearch);
