import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import parse from "html-react-parser";

import NewsBlock from "./newsBlock";
import NewsCarouselComponent from "./newsCarouselComponent";
import TitleBlock from "../titleBlock";
import Loading from "../loading";
import { colors } from "../../config/imports";
import BlockWrapper from "../blockWrapper";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import SearchContainer from "../../components/searchContainer";

const NewsAndMedia = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const {
    layout,
    background_colour,
    post_limit,
    disable_vertical_padding,
    has_search,
  } = block;

  const isLayoutOne = layout === "layout_one";
  const ctaHeight = 45;

  const [uniqueId, setUniqueId] = useState(null);

  const [filterList, setFilterList] = useState(null);
  const [categoryList, setCategoryList] = useState(null);

  const [searchValue, setSearchValue] = useState(null);
  const [categoryValue, setCategoryValue] = useState(null);
  const [dateValue, setDateValue] = useState(null);
  const [yearValue, setYearValue] = useState(null);

  const searchFilterRef = useRef(null);
  const categoryFilterRef = useRef(null);
  const dateFilterRef = useRef(null);
  const yearFilterRef = useRef(null);
  const loadMoreRef = useRef(false);

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // hook applies after React has performed all DOM mutations
  useLayoutEffect(() => {
    const blockId = uuidv4(); // add unique id
    setUniqueId(blockId);
  }, []);

  useEffect(() => {
    if (!state.source.post) return null;

    let POST_LIST = Object.values(state.source.post); // add filterList object to data array
    if (post_limit) POST_LIST = POST_LIST.slice(0, Number(post_limit)); // apply limit on posts

    if (state.source.category) {
      const CATEGORY = Object.values(state.source.category);
      setCategoryList(CATEGORY);
    }

    setFilterList(POST_LIST);
  }, [state.source.post]);

  if (!filterList || !categoryList) return <Loading />;

  // HELPERS ----------------------------------------------------------------
  const handleClearFilter = ({
    clearInput,
    clearCategory,
    clearDate,
    clearYear,
  }) => {
    if (clearInput) {
      searchFilterRef.current = null;
      setSearchValue(null);
    }
    if (clearCategory) {
      categoryFilterRef.current = null;
      setCategoryValue(null);
    }
    if (clearDate) {
      dateFilterRef.current = null;
      setDateValue(null);
    }
    if (clearYear) {
      yearFilterRef.current = null;
      setYearValue(null);
    }

    handleSearch();
  };

  const handleLoadMoreFilter = () => {
    const limit = post_limit || 6;
    let POST_LIST = Object.values(state.source.post); // add filterList object to data array
    if (loadMoreRef.current) POST_LIST = POST_LIST.slice(0, Number(limit)); // apply limit on posts

    setFilterList(POST_LIST);
    loadMoreRef.current = !loadMoreRef.current;
  };

  const handleSearch = () => {
    const searchInput = searchFilterRef.current.value;

    const categoryInput = categoryFilterRef.current.value;
    const dateInput = dateFilterRef.current.value;
    const yearInput = yearFilterRef.current.value;

    console.log("searchInput", searchInput);
    console.log("categoryInput", categoryInput);
    console.log("dateInput", dateInput);
    console.log("yearInput", yearInput);

    let filter = Object.values(state.source.post);

    if (searchInput) {
      const INPUT = searchInput.toLowerCase();
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

    console.log(filter);
    if (searchInput) setSearchValue(searchInput);
    if (categoryInput) setSearchValue(setCategoryValue);
    if (dateInput) setDateValue(dateInput);
    if (yearInput) setYearValue(yearInput);
    // setFilterList(filter);
  };

  // SERVERS ---------------------------------------------
  const ServeFilter = () => {
    if (!has_search) return null;

    const ServeTitle = () => {
      return (
        <div
          className="flex primary-title"
          style={{ fontSize: 36, alignItems: "center", paddingBottom: `0.5em` }}
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
            <button type="submit" className="blue-btn" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      );
    };

    const ServeFilters = () => {
      const ServeTitle = () => {
        return (
          <div className="primary-title" style={{ fontSize: 20 }}>
            Filter:
          </div>
        );
      };

      const ServeCategoryFilter = () => {
        return (
          <Form.Select ref={categoryFilterRef} style={styles.input}>
            <option value="null" hidden>
              Category
            </option>
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
          <Form.Select ref={dateFilterRef} style={styles.input}>
            <option value="null" hidden>
              Sort By
            </option>
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
          <Form.Select ref={yearFilterRef} style={styles.input}>
            <option value="null" hidden>
              Filter By Year
            </option>
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
      if (!searchValue) return null;

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

    const ServeSelectedCategoryFilter = () => {
      if (!categoryValue) return null;

      let value = categoryList.filter(
        (category) => category.id === Number(categoryFilterRef.current)
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

    const ServeSelectedDateFilter = () => {
      if (!dateValue) return null;

      return (
        <div className="shadow filter">
          <div>{dateFilterRef.current}</div>
          <div
            className="filter-icon"
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
      if (!yearValue) return null;

      return (
        <div className="shadow filter">
          <div>{yearFilterRef.current}</div>
          <div
            className="filter-icon"
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
          margin: `${marginVertical}px 0 ${state.theme.marginVertical}px 0`,
        }}
      >
        <BlockWrapper>
          <div style={{ position: "relative", padding: `1em 0`, width: `70%` }}>
            <div className="flex-col">
              <ServeTitle />
              <SearchContainer
                searchFilterRef={searchFilterRef}
                handleSearch={handleSearch}
              />
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
    if (isLayoutOne)
      return (
        <NewsCarouselComponent
          block={block}
          newsList={filterList}
          categoryList={categoryList}
        />
      );

    return (
      <div>
        <NewsBlock
          block={block}
          newsList={filterList}
          categoryList={categoryList}
        />
      </div>
    );
  };

  const ServeMoreAction = () => {
    if (isLayoutOne) return null;

    const value = loadMoreRef.current ? "Less" : " Load More";

    return (
      <div
        className="flex"
        style={{
          justifyContent: "center",
          padding: `${state.theme.marginVertical}px 0`,
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
};

export default connect(NewsAndMedia);
