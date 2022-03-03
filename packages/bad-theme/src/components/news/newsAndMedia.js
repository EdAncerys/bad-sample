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

import CloseIcon from "@mui/icons-material/Close";
import SearchContainer from "../../components/searchContainer";
// CONTEXT -----------------------------------------------------------------
import { getPostData } from "../../helpers";

const NewsAndMedia = ({ state, actions, libraries, block }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const {
    layout,
    background_colour,
    post_limit,
    disable_vertical_padding,
    has_search,
    category_filter,
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

  const searchFilterRef = useRef("");
  const categoryFilterRef = useRef("");
  const dateFilterRef = useRef("");
  const yearFilterRef = useRef("");
  const loadMoreRef = useRef("");

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // hook applies after React has performed all DOM mutations
  useLayoutEffect(() => {
    const blockId = uuidv4(); // add unique id
    setUniqueId(blockId);
  }, []);

  useEffect(async () => {
    // pre fetch post data
    let iteration = 0;
    let data = state.source.post;
    while (!!data) {
      // if iteration is greater than 10, break
      if (iteration > 10) break;
      // set timeout for async
      await new Promise((resolve) => setTimeout(resolve, 500));
      await getPostData({ state, actions });
      data = state.source.post;
      iteration++;
    }

    // if !data then break
    if (!data) return;
    let postList = Object.values(data);
    // apply date filter
    postList = postList.sort((a, b) => new Date(b.date) - new Date(a.date));
    // filter by categories
    if (category_filter && category_filter !== "0")
      postList = postList.filter((item) =>
        item.categories.includes(Number(category_filter))
      );

    setFilterList(postList);
    if (state.source.category) {
      const CATEGORY = Object.values(state.source.category);
      setCategoryList(CATEGORY);
    }

    return () => {
      searchFilterRef.current = ""; // clean up function
    };
  }, []);

  if (!filterList || !categoryList) return <Loading />;

  if (filterList.length === 0 && !has_search) return null; // hide block if no posts

  // HELPERS ----------------------------------------------------------------
  const handleClearFilter = ({
    clearInput,
    clearCategory,
    clearDate,
    clearYear,
  }) => {
    if (clearInput) {
      searchFilterRef.current.value = "";
      setSearchValue(null);
    }
    if (clearCategory) {
      categoryFilterRef.current.value = "";
      setCategoryValue(null);
    }
    if (clearDate) {
      dateFilterRef.current.value = "";
      setDateValue(null);
    }
    if (clearYear) {
      yearFilterRef.current.value = "";
      setYearValue(null);
    }

    handleSearch();
  };

  const handleLoadMoreFilter = () => {
    const limit = post_limit || 6;
    let postList = Object.values(state.source.post); // add filterList object to data array
    if (loadMoreRef.current) postList = postList.slice(0, Number(limit)); // apply limit on posts

    setFilterList(postList);
    loadMoreRef.current = !loadMoreRef.current;
  };

  const handleSearch = () => {
    const input = searchFilterRef.current.value.toLowerCase();

    const category = categoryFilterRef.current.value;
    const date = dateFilterRef.current.value;
    const year = yearFilterRef.current.value;

    let filter = Object.values(state.source.post);

    if (input) {
      const INPUT = input.toLowerCase();
      filter = filter.filter((news) =>
        news.title.rendered.toLowerCase().includes(INPUT)
      );
    }

    if (category)
      filter = filter.filter((news) =>
        news.categories.includes(Number(category))
      );

    // apply date filter
    if (date === "Date Descending")
      filter = filter.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (date === "Date Ascending")
      filter = filter.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (year)
      filter = filter.filter(
        (news) => new Date(news.date).getFullYear() === Number(year)
      );

    if (input) setSearchValue(input);
    if (category) setCategoryValue(category);
    if (date) setDateValue(date);
    if (year) setYearValue(year);

    setFilterList(filter);
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
          <Form.Select
            ref={categoryFilterRef}
            value={categoryValue}
            onChange={handleSearch}
            style={styles.input}
          >
            <option value="" hidden>
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
          <Form.Select
            ref={dateFilterRef}
            value={dateValue}
            onChange={handleSearch}
            style={styles.input}
          >
            <option value="" hidden>
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
          <Form.Select
            ref={yearFilterRef}
            value={yearValue}
            onChange={handleSearch}
            style={styles.input}
          >
            <option value="" hidden>
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
          <div>{searchValue}</div>
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

      let catName = categoryList.filter(
        (category) => category.id === Number(categoryValue)
      );
      catName = catName[0] ? catName[0].name : "N/A";

      return (
        <div className="shadow filter">
          <div>
            <Html2React html={catName} />
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
          <div>{dateValue}</div>
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
          <div>{yearValue}</div>
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
        className="no-selector"
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
        <NewsCarouselComponent block={filterList} categoryList={categoryList} />
      );

    return (
      <div>
        <NewsBlock
          block={filterList}
          categoryList={categoryList}
          layout={layout}
        />
      </div>
    );
  };

  const ServeMoreAction = () => {
    if (isLayoutOne || filterList.length === 0) return null;

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
