import { useState, useEffect, useRef } from "react";
import { connect } from "frontity";

import Loading from "./loading";
import { colors } from "../config/imports";
import TitleBlock from "./titleBlock";
import SearchDropDown from "./searchDropDown";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
// CONTEXT -----------------------------------------------------------
import {
  useAppDispatch,
  getPILsDataAction,
  getGuidelinesDataAction,
  setGoToAction,
  setIdFilterAction,
  muiQuery,
} from "../context";
import { TimerOutlined } from "@mui/icons-material";

const PilGuidelineSearch = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const dispatch = useAppDispatch();
  const { lg } = muiQuery();
  const { disable_vertical_padding, colour } = block;
  const ctaHeight = 45;
  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  const [isFetching, setFetching] = useState(false);
  const [filterData, setFilterData] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const useEffectRef = useRef(null);
  const timeoutId = useRef(null);

  // if (!block || !content) return <Loading />; // awaits pre fetch & data
  if (!block) return <Loading />;
  // HELPERS ---------------------------------------------
  const handleSearch = async () => {
    const input = inputValue.toLowerCase();

    try {
      setFetching(true);
      // ⬇️ apply data filters for search
      let fetching = await fetch(
        state.auth.WP_HOST +
          `wp-json/relevanssi/v1/search?keyword=${input}&type=guidelines_standards,pils&per_page=10&_fields=title,link&orderby=title&order=ASC`
      );
      let data = await fetching.json();
      setFetching(false);
      // if data is not array, return null
      if (!Array.isArray(data)) return null;

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
    } catch (e) {
      console.log(e);
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

    if (isFetching)
      return (
        <CircularProgress color="inherit" style={{ width: 25, height: 25 }} />
      );

    return <div onClick={handleClearSearch}>{icon}</div>;
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
    <div
      style={{ padding: `${marginVertical}px ${marginHorizontal}px` }}
      className="no-selector"
    >
      <div className="shadow" style={{ backgroundColor: colors.white }}>
        <div className="flex no-selector" style={{ padding: `2em` }}>
          <div className="flex-col">
            <div
              className="flex"
              style={{ flexDirection: !lg ? null : "column" }}
            >
              <div className="flex">
                <TitleBlock
                  block={{
                    text_align: "left",
                    title: "Search for PILs & Guidelines",
                  }}
                  margin="0 0 1em 0"
                />
              </div>
              <div
                className={!lg ? "flex" : "flex-col"}
                style={{ gap: !lg ? null : 10 }}
              >
                <ServeViewPILs />
                <ServeViewGuidelines />
              </div>
            </div>
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
                  isFetching={isFetching}
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

        <ServeFooter />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(PilGuidelineSearch);
