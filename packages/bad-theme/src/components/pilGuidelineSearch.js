import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { connect } from "frontity";

import Loading from "./loading";
import { colors } from "../config/imports";
import { setGoToAction } from "../context";

import SearchDropDown from "./searchDropDown";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const PilGuidelineSearch = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const { disable_vertical_padding, colour } = block;

  const ctaHeight = 45;

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  const [pilData, setPilData] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [filterData, setFilterData] = useState(null);
  const useEffectRef = useRef(null);

  useEffect(async () => {
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

    setPilData(Object.values(state.source.pils));

    return () => {
      useEffectRef.current = false; // clean up function
    };
  }, []);

  if (!block || !pilData) return <Loading />; // awaits pre fetch & data

  // HELPERS ---------------------------------------------
  const handleSearch = (e) => {
    const input = e.target.value.toLowerCase();

    let data = pilData;
    data = data.filter((pil) => {
      const title = pil.title.rendered.toLowerCase().includes(input);
      const body = pil.content.rendered.toLowerCase().includes(input);

      // console.log(title, body); // debug

      return title || body;
    });

    // refactor data to match dropdown format
    data = data.map((item) => {
      return {
        title: item.title.rendered,
        link: item.link,
      };
    });

    setInputValue(input);
    if (input) setFilterData(data);
    if (!data.length || !input) setFilterData(null);

    // console.log("filterData", data); // debug
  };

  const onClickHandler = ({ item }) => {
    console.log("item", item);
    setGoToAction({ path: item.link, actions });
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

  const ServeTitle = () => {
    return (
      <div
        className="primary-title"
        style={{
          fontSize: 26,
          alignItems: "center",
          paddingBottom: `0.5em`,
        }}
      >
        Search for Guidelines
      </div>
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
        <div className="flex no-selector" style={{ padding: `2em` }}>
          <div className="flex-col">
            <ServeTitle />
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
                  onClickHandler={onClickHandler}
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
  );
};

const styles = {
  action: {
    backgroundColor: colors.white,
    borderRadius: 5,
    width: "fit-content",
  },
};

export default connect(PilGuidelineSearch);
