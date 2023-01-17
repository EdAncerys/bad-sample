import React, { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import { colors } from "../config/imports";
import SearchDropDown from "./searchDropDown";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

// CONTEXT -----------------------------------------------------------
import {
  useAppDispatch,
  getPILsDataAction,
  getGuidelinesDataAction,
  setGoToAction,
  setIdFilterAction,
  muiQuery,
  fetchDataHandler,
} from "../context";
import { TimerOutlined } from "@mui/icons-material";

const SearchBar = ({ state, actions, libraries, block, search_type }) => {
  const dispatch = useAppDispatch();
  const { lg } = muiQuery();
  const ctaHeight = 45;
  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  const { colour } = block;
  const [dataLoading, setDataLoading] = useState(false);
  const [filterData, setFilterData] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const useEffectRef = useRef(null);
  const timeoutId = useRef(null);
  const typeOfSearch = {
    events: "events",
    "guidelines-pils": "guidelines_standards,pils",
    pils: "pils",
  };
  useEffect(async () => {
    // CPT search content data
    let searchData = {};
    let pils = state.source.pils;
    let guidelines = state.source.guidelines_standards;

    // if (!pils) {
    //   await getPILsDataAction({ state, actions });
    //   pils = state.source.pils;
    // }
    // if (!guidelines) {
    //   await getGuidelinesDataAction({ state, actions });
    //   guidelines = state.source.guidelines_standards;
    // }

    // // merge pils and guidelines data
    // searchData = { ...pils, ...guidelines };
    // setContent(Object.values(searchData));

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, []);

  // if (!block || !content) return <Loading />; // awaits pre fetch & data
  //   if (!block) return <Loading />;
  // HELPERS ---------------------------------------------
  const handleSearch = async () => {
    const input = inputValue.toLowerCase();
    setDataLoading(true);
    // ⬇️ apply data filters for search

    const path =
      state.auth.WP_HOST +
      `/wp-json/relevanssi/v1/search?keyword=${input}&type=${typeOfSearch[search_type]}&per_page=5&_fields=title,link&orderby=title&order=ASC`;
    let fetching = await fetchDataHandler({ path, state });
    let data = await fetching.json();
    setDataLoading(false);
    // data = data.map((item) => {
    //   const title = item.title.rendered;
    //   // const body = item.content.rendered.toLowerCase().includes(input); // include body

    //   return title;
    // });

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
    // // sort data alphabetically by title
    // data.sort((a, b) => {
    //   if (a.title < b.title) return -1;
    //   if (a.title > b.title) return 1;
    //   return 0;
    // });

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
  };

  const handleKeyUp = () => {
    if (timeoutId.current) clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(handleSearch, 1000);
  };
  const selectHandler = ({ item }) => {
    const isGuidelines = item.type === "guidelines_standards";
    if (isGuidelines) {
      setIdFilterAction({ dispatch, idFilter: item.id });
    }

    setGoToAction({ state, path: item.link, actions });
  };

  // SERVERS ---------------------------------------------
  const ServeFooter = () => {
    return (
      <div
        style={{
          backgroundColor: block.background_colour,
          //   backgroundColor: "white",
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
          paddingLeft: !lg ? `2em` : 0,
          paddingTop: !lg ? 0 : `0.5em`,
        }}
      >
        <div className="blue-btn">Search</div>
      </div>
    );
  };

  const ServeViewPILs = () => {
    return (
      <div
        style={{
          display: "grid",
          alignItems: "center",
          padding: !lg ? `0 2em 1.5em 0` : 0,
          minWidth: !lg ? 200 : "40%",
        }}
      >
        <div
          className="blue-btn-reverse"
          onClick={() =>
            setGoToAction({
              state,
              path: `/patient-information-leaflets/`,
              actions,
            })
          }
        >
          View all PILs
        </div>
      </div>
    );
  };

  const ServeViewGuidelines = () => {
    return (
      <div
        style={{
          display: "grid",
          alignItems: "center",
          paddingBottom: !lg ? `1.5em` : 0,
          minWidth: !lg ? 200 : "40%",
        }}
      >
        <div
          className="blue-btn-reverse"
          onClick={() =>
            setGoToAction({
              state,
              path: `/guidelines-and-standards/`,
              actions,
            })
          }
        >
          View all Guidelines
        </div>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div style={{ padding: 0 }} className="no-selector">
      <div
        className="shadow"
        style={{ backgroundColor: block.background_colour }}
      >
        <div className="flex no-selector" style={{ padding: `2em` }}>
          <div className="flex-col">
            <div
              className={!lg ? "flex-row" : "flex-col"}
              style={{ marginTop: "1em" }}
            >
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
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyUp={handleKeyUp}
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
                  dataLoading={dataLoading}
                  filter={filterData}
                  mapToName="title.rendered"
                  onClickHandler={selectHandler}
                  marginTop={ctaHeight + 10}
                />
              </div>
              {/* <ServeSearchButton /> */}
            </div>
          </div>
        </div>

        {/* <ServeFooter /> */}
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(SearchBar);
