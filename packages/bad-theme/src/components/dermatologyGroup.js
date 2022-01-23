import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import parse from "html-react-parser";

import TitleBlock from "./titleBlock";
import Card from "./card/card";
import Loading from "./loading";
import { colors } from "../config/imports";
import BlockWrapper from "./blockWrapper";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

const DermatologyGroup = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const {
    colour,
    background_colour,
    post_limit,
    disable_vertical_padding,
    add_search_function,
  } = block;

  const ctaHeight = 45;

  const [dermGroupe, setDermGroupe] = useState(null);
  const [groupeType, setGroupeType] = useState(null);

  const searchFilterRef = useRef(null);
  const typeFilterRef = useRef(null);
  const loadMoreRef = useRef(null);

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // DATA pre FETCH ----------------------------------------------------------------
  useEffect(async () => {
    const path = `/derm_groups_charity/`;
    await actions.source.fetch(path); // fetch CPT dermGroupeData

    let dermGroupeData = state.source.get(path);
    const { totalPages, page, next } = dermGroupeData; // check if dermGroupeData have multiple pages
    // fetch dermGroupeData via wp API page by page
    let isThereNextPage = next;
    while (isThereNextPage) {
      await actions.source.fetch(isThereNextPage); // fetch next page
      const nextPage = state.source.get(isThereNextPage).next; // check ifNext page & set next page
      isThereNextPage = nextPage;
    }

    const GROUPE_DATA = Object.values(state.source.derm_groups_charity);
    const GROUPE_TYPE = Object.values(state.source.dermo_group_type);

    setDermGroupe(GROUPE_DATA);
    setGroupeType(GROUPE_TYPE);

    return () => {
      searchFilterRef.current = false; // clean up function
    };
  }, []);
  // DATA pre FETCH ----------------------------------------------------------------
  if (!dermGroupe || !groupeType) return <Loading />;

  // HELPERS ----------------------------------------------------------------
  const handleClearFilter = ({ clearInput, clearCategory }) => {
    if (clearInput) searchFilterRef.current = null;
    if (clearCategory) categoryFilterRef.current = null;

    handleFilterSearch();
  };

  const handleLoadMoreFilter = () => {
    const limit = post_limit || 6;
    let POST_LIST = Object.values(state.source.post); // add dermGroupe object to data array
    if (loadMoreRef.current) POST_LIST = POST_LIST.slice(0, Number(limit)); // apply limit on posts

    setDermGroupe(POST_LIST);
    loadMoreRef.current = !loadMoreRef.current;
  };

  const handleFilterSearch = () => {
    const searchInput = searchFilterRef.current.value;

    console.log(searchInput);

    // const categoryInput = document.querySelector(
    //   `#category-filter-${uniqueId}`
    // ).value;

    // if (!!searchInput) searchFilterRef.current = searchInput;
    // if (!!categoryInput) categoryFilterRef.current = categoryInput;

    // let filter = Object.values(state.source.post);

    // const searchInputValue = !!searchInput
    //   ? searchInput
    //   : searchFilterRef.current;
    // if (searchInputValue) {
    //   const INPUT = searchInputValue.toLowerCase();
    //   filter = filter.filter((news) =>
    //     news.title.rendered.toLowerCase().includes(INPUT)
    //   );
    // }

    // const searchCategoryValue = !!categoryInput
    //   ? categoryInput
    //   : categoryFilterRef.current;
    // if (searchCategoryValue)
    //   filter = filter.filter((news) =>
    //     news.categories.includes(Number(searchCategoryValue))
    //   );

    // // apply date filter
    // const searchDateValue = !!dateInput ? dateInput : dateFilterRef.current;
    // if (searchDateValue === "Date Descending")
    //   filter = filter.sort((a, b) => new Date(b.date) - new Date(a.date));
    // if (searchDateValue === "Date Ascending")
    //   filter = filter.sort((a, b) => new Date(a.date) - new Date(b.date));

    // const searchYearValue = !!yearInput ? yearInput : yearFilterRef.current;
    // if (searchYearValue)
    //   filter = filter.filter(
    //     (news) => new Date(news.date).getFullYear() === Number(searchYearValue)
    //   );
    // setDermGroupe(filter);
  };

  // SERVERS ---------------------------------------------
  const ServeFilter = () => {
    if (!add_search_function) return null;

    const ServeTitle = () => {
      return (
        <div
          className="flex primary-title"
          style={{
            fontSize: 36,
            alignItems: "center",
            paddingBottom: `0.5em`,
          }}
        >
          Search for Dermatology Groupe & Charities
        </div>
      );
    };

    const ServeSearchContainer = () => {
      return (
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
              ref={searchFilterRef}
              type="text"
              className="form-control"
              placeholder="Find An Event"
              style={styles.input}
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
              <SearchIcon />
            </div>
          </div>
          <div
            style={{
              display: "grid",
              alignItems: "center",
              paddingLeft: `2em`,
            }}
          >
            <button
              type="submit"
              className="blue-btn"
              onClick={handleFilterSearch}
            >
              Search
            </button>
          </div>
        </div>
      );
    };

    const ServeSearchFilter = () => {
      if (!searchFilterRef.current) return null;

      return (
        <div className="shadow filter">
          <div>{searchFilterRef.current}</div>
          <div
            className="filter-icon"
            onClick={() => handleClearFilter({ clearInput: true })}
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
    };

    const ServeTypeFilter = () => {
      if (!typeFilterRef.current) return null;

      let value = groupeType.filter(
        (type) => type.id === Number(typeFilterRef.current)
      );

      return (
        <div className="shadow filter">
          <div>
            <Html2React html={value[0].name} />
          </div>
          <div
            className="filter-icon"
            onClick={() => handleClearFilter({ clearCategory: true })}
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
    };

    const ServeTypeFilters = () => {
      if (!groupeType) return null;

      const ServeTitle = () => {
        return (
          <div
            className="flex primary-title"
            style={{
              fontSize: 30,
              alignItems: "center",
            }}
          >
            Search Groupe
          </div>
        );
      };

      return (
        <div>
          <ServeTitle />
          <div className="flex-row" style={{ flexWrap: "wrap" }}>
            {groupeType.map((type, key) => {
              return (
                <div
                  key={key}
                  className="filter-action"
                  onClick={() => console.log(type.id)}
                >
                  <Html2React html={type.name} />
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    return (
      <div
        style={{
          backgroundColor: colors.silverFillTwo,
          marginBottom: `${state.theme.marginVertical}px`,
          padding: `2em 0`,
        }}
      >
        <BlockWrapper>
          <div style={{ position: "relative", padding: `1em 0`, width: `70%` }}>
            <div className="flex-col">
              <ServeTitle />
              <ServeSearchContainer />
            </div>
            <div className="flex" style={{ marginTop: "0.5em" }}>
              <ServeSearchFilter />
              <ServeTypeFilter />
            </div>
          </div>
          <ServeTypeFilters />
        </BlockWrapper>
      </div>
    );
  };

  const ServeLayout = () => {
    return (
      <div style={styles.container}>
        {dermGroupe.map((block, key) => {
          const { title, content, link } = block;

          return (
            <Card
              key={key}
              title={title.rendered}
              link_label="Read More"
              link={link}
              colour={colour}
              // body={content.rendered}
              shadow
            />
          );
        })}
      </div>
    );
  };

  const ServeMoreAction = () => {
    const value = loadMoreRef.current ? "Less" : " Load More";

    return (
      <div
        className="flex"
        style={{
          justifyContent: "center",
          paddingTop: `2em`,
        }}
      >
        <button
          type="submit"
          className="transparent-btn"
          onClick={handleLoadMoreFilter}
        >
          {value}
        </button>
      </div>
    );
  };

  // RETURN ---------------------------------------------------
  return (
    <div
      style={{
        padding: `${marginVertical}px 0`,
        backgroundColor: background_colour,
      }}
    >
      <BlockWrapper>
        <TitleBlock
          block={block}
          margin={{
            marginBottom: `${
              add_search_function ? 0 : state.theme.marginVertical
            }px`,
          }}
        />
      </BlockWrapper>
      <ServeFilter />
      <BlockWrapper>
        <ServeLayout />
        <ServeMoreAction />
      </BlockWrapper>
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: `repeat(4, 1fr)`,
    justifyContent: "space-between",
    gap: 20,
  },
  input: {
    borderRadius: 10,
    paddingRight: 35,
  },
  action: {
    position: "relative",
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: `0.5em 1.5em`,
    marginRight: `1em`,
    width: "fit-content",
  },
  closeAction: {
    display: "grid",
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: colors.white,
    cursor: "pointer",
    borderRadius: "50%",
  },
};

export default connect(DermatologyGroup);
