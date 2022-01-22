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
    layout,
    background_colour,
    post_limit,
    disable_vertical_padding,
    has_search,
  } = block;

  const ctaHeight = 45;

  const [dermGroupe, setDermGroupe] = useState(null);
  const [groupeType, setGroupeType] = useState(null);

  const searchFilterRef = useRef(null);
  const typeFilterRef = useRef(null);

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
  console.log(dermGroupe, groupeType);

  return null;

  // HELPERS ----------------------------------------------------------------
  const handleClearFilter = ({
    clearInput,
    clearCategory,
    clearDate,
    clearYear,
  }) => {
    if (clearInput) searchFilterRef.current = null;
    if (clearCategory) categoryFilterRef.current = null;
    if (clearDate) dateFilterRef.current = null;
    if (clearYear) yearFilterRef.current = null;

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
    const searchInput = document.querySelector(
      `#search-input-${uniqueId}`
    ).value;

    const categoryInput = document.querySelector(
      `#category-filter-${uniqueId}`
    ).value;
    const dateInput = document.querySelector(`#date-filter-${uniqueId}`).value;
    const yearInput = document.querySelector(`#year-filter-${uniqueId}`).value;

    if (!!searchInput) searchFilterRef.current = searchInput;
    if (!!categoryInput) categoryFilterRef.current = categoryInput;
    if (!!dateInput) dateFilterRef.current = dateInput;
    if (!!yearInput) yearFilterRef.current = yearInput;

    let filter = Object.values(state.source.post);

    const searchInputValue = !!searchInput
      ? searchInput
      : searchFilterRef.current;
    if (searchInputValue) {
      const INPUT = searchInputValue.toLowerCase();
      filter = filter.filter((news) =>
        news.title.rendered.toLowerCase().includes(INPUT)
      );
    }

    const searchCategoryValue = !!categoryInput
      ? categoryInput
      : categoryFilterRef.current;
    if (searchCategoryValue)
      filter = filter.filter((news) =>
        news.categories.includes(Number(searchCategoryValue))
      );

    // apply date filter
    const searchDateValue = !!dateInput ? dateInput : dateFilterRef.current;
    if (searchDateValue === "Date Descending")
      filter = filter.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (searchDateValue === "Date Ascending")
      filter = filter.sort((a, b) => new Date(a.date) - new Date(b.date));

    const searchYearValue = !!yearInput ? yearInput : yearFilterRef.current;
    if (searchYearValue)
      filter = filter.filter(
        (news) => new Date(news.date).getFullYear() === Number(searchYearValue)
      );
    setDermGroupe(filter);
  };

  // SERVERS ---------------------------------------------
  const ServeFilter = () => {
    if (!has_search) return null;

    const ServeTitle = () => {
      return (
        <div
          className="flex primary-title"
          style={{
            fontSize: 36,
            color: colors.softBlack,
            alignItems: "center",
            paddingBottom: `0.5em`,
          }}
        >
          Search for News & Media
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
              id={`search-input-${uniqueId}`}
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

    const ServeFilters = () => {
      const ServeTitle = () => {
        return (
          <div
            className="primary-title"
            style={{
              fontSize: 20,
              color: colors.softBlack,
            }}
          >
            Filter:
          </div>
        );
      };

      const ServeCategoryFilter = () => {
        return (
          <Form.Select
            id={`category-filter-${uniqueId}`}
            aria-label="Default select example"
            style={styles.input}
          >
            <option value="">Category</option>
            {categoryList.map((item, key) => {
              return (
                <option key={key} value={item.id}>
                  {parse(item.name)}
                </option>
              );
            })}
          </Form.Select>
        );
      };

      const ServeDateFilter = () => {
        return (
          <Form.Select
            id={`date-filter-${uniqueId}`}
            aria-label="Default select example"
            style={styles.input}
          >
            <option value="">Sort By</option>
            <option value="Date Descending">Date Descending</option>
            <option value="Date Ascending">Date Ascending</option>
          </Form.Select>
        );
      };

      const ServeYearFilter = () => {
        const now = new Date().getUTCFullYear();
        const years = Array(now - (now - 10))
          .fill("")
          .map((v, idx) => now - idx);

        return (
          <Form.Select
            id={`year-filter-${uniqueId}`}
            aria-label="Default select example"
            style={styles.input}
          >
            <option value="">Filter By Year</option>
            {years.map((year, key) => {
              return (
                <option key={key} value={year}>
                  {year}
                </option>
              );
            })}
          </Form.Select>
        );
      };

      return (
        <div
          style={{
            padding: `1em 0`,
            alignItems: "center",
            display: "grid",
            gridTemplateColumns: `100px 1fr 1fr 1fr`,
            gap: `1em`,
          }}
        >
          <ServeTitle />
          <ServeDateFilter />
          <ServeCategoryFilter />
          <ServeYearFilter />
        </div>
      );
    };

    const ServeSearchFilter = () => {
      if (!searchFilterRef.current) return null;

      return (
        <div className="shadow" style={styles.action}>
          <div>{searchFilterRef.current}</div>
          <div
            style={styles.closeAction}
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

    const ServeSelectedCategoryFilter = () => {
      if (!categoryFilterRef.current) return null;

      let value = categoryList.filter(
        (category) => category.id === Number(categoryFilterRef.current)
      );

      return (
        <div className="shadow" style={styles.action}>
          <div>
            <Html2React html={value[0].name} />
          </div>
          <div
            style={styles.closeAction}
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

    const ServeSelectedDateFilter = () => {
      if (!dateFilterRef.current) return null;

      return (
        <div className="shadow" style={styles.action}>
          <div>{dateFilterRef.current}</div>
          <div
            style={styles.closeAction}
            onClick={() => handleClearFilter({ clearDate: true })}
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

    const ServeSelectedYearFilter = () => {
      if (!yearFilterRef.current) return null;

      return (
        <div className="shadow" style={styles.action}>
          <div>{yearFilterRef.current}</div>
          <div
            style={styles.closeAction}
            onClick={() => handleClearFilter({ clearYear: true })}
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

    return (
      <div
        style={{
          backgroundColor: colors.silverFillTwo,
          margin: `${state.theme.marginVertical}px 0`,
        }}
      >
        <BlockWrapper>
          <div style={{ position: "relative", padding: `1em 0`, width: `70%` }}>
            <div className="flex-col">
              <ServeTitle />
              <ServeSearchContainer />
              <ServeFilters />
            </div>
            <div className="flex" style={{ marginTop: "0.5em" }}>
              <ServeSearchFilter />
              <ServeSelectedCategoryFilter />
              <ServeSelectedDateFilter />
              <ServeSelectedYearFilter />
            </div>
          </div>
        </BlockWrapper>
      </div>
    );
  };

  const ServeLayout = () => {
    return (
      <div>
        <Card
          block={block}
          dermGroupe={dermGroupe}
          categoryList={categoryList}
        />
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
            marginBottom: `${has_search ? 0 : state.theme.marginVertical}px`,
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
