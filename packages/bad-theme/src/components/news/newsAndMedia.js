import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { connect } from "frontity";
import { Form } from "react-bootstrap";
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
import { muiQuery } from "../../context";

const NewsAndMedia = ({ state, actions, libraries, block }) => {
  const { sm, md, lg, xl } = muiQuery();

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  if (!block) return <Loading />;

  const {
    layout,
    background_colour,
    post_limit,
    disable_vertical_padding,
    has_search,
    category_filter,
    site_section,
  } = block;

  const isLayoutOne = layout === "layout_one";

  const [postList, setPostList] = useState(null);
  const [categoryList, setCategoryList] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [yearValue, setYearValue] = useState("");

  const searchFilterRef = useRef("");
  const categoryFilterRef = useRef("");
  const dateFilterRef = useRef("");
  const yearFilterRef = useRef("");
  const loadMoreRef = useRef(true);

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  useEffect(async () => {
    // pre fetch post data
    let iteration = 0;
    let data = Object.values(state.source.post);
    while (data.length === 0) {
      // if iteration is greater than 10, break
      if (iteration > 10) break;
      // set timeout for async
      await new Promise((resolve) => setTimeout(resolve, 500));
      await getPostData({ state, actions });
      data = Object.values(state.source.post);
      iteration++;
    }

    // if !data then break
    if (data.length === 0) return;

    // apply category_filter & site_section filters if applicable
    // return data if site_section array includes filters
    if (site_section) {
      data = data.filter((item) => {
        let postSections = item.site_sections;
        // check if postSections array contains site_section ids
        return postSections.some((item) => site_section.includes(item));
      });
    }
    // return data if site_section array includes filters
    if (category_filter) {
      data = data.filter((item) => {
        let categories = item.categories;
        // check if category_filter array contains site_section ids
        return categories.some((item) => category_filter.includes(item));
      });
    }
    // apply sort by date functionality
    data = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (post_limit && Number(post_limit) !== 0) {
      data = data.slice(0, Number(post_limit)); // apply limit on posts
    }

    setPostList(data);
    if (state.source.category) {
      const catList = Object.values(state.source.category);
      setCategoryList(catList);
    }

    return () => {
      searchFilterRef.current = ""; // clean up function
    };
  }, []);

  if (!postList || !categoryList) return <Loading />;

  if (postList.length === 0 && !has_search) return null; // hide block if no posts

  // HELPERS ----------------------------------------------------------------
  const handleClearFilter = ({
    clearInput,
    clearCategory,
    clearDate,
    clearYear,
  }) => {
    if (clearInput) {
      searchFilterRef.current.value = "";
      setSearchValue("");
    }
    if (clearCategory) {
      categoryFilterRef.current.value = "";
      setCategoryValue("");
    }
    if (clearDate) {
      dateFilterRef.current.value = "";
      setDateValue("");
    }
    if (clearYear) {
      yearFilterRef.current.value = "";
      setYearValue("");
    }

    handleSearch();
  };

  const handleLoadMoreFilter = () => {
    let data = Object.values(state.source.post); // add postList object to data array

    // apply sort by date functionality
    data = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    // apply category_filter & site_section filters if applicable
    // return data if site_section array includes filters
    if (site_section) {
      data = data.filter((item) => {
        let postSections = item.site_sections;
        // check if postSections array contains site_section ids
        return postSections.some((item) => site_section.includes(item));
      });
    }
    // return data if site_section array includes filters
    if (category_filter) {
      data = data.filter((item) => {
        let categories = item.categories;
        // check if category_filter array contains site_section ids
        return categories.some((item) => category_filter.includes(item));
      });
    }

    // if loadMore is truthy display all postList posts
    if (loadMoreRef.current) {
      setPostList(data);
      loadMoreRef.current = false;
    } else {
      // if loadMore is falsy display only limit posts
      if (post_limit) data = data.slice(0, Number(post_limit)); // apply limit on posts
      setPostList(data);
      loadMoreRef.current = true;
    }
  };

  const handleSearch = () => {
    const input = searchFilterRef.current.value.toLowerCase();

    const category = categoryFilterRef.current.value;
    const date = dateFilterRef.current.value;
    const year = yearFilterRef.current.value;

    let data = Object.values(state.source.post);
    data = data.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (input) {
      const INPUT = input.toLowerCase();
      data = data.filter((news) =>
        news.title.rendered.toLowerCase().includes(INPUT)
      );
    }

    if (category)
      data = data.filter((news) => news.categories.includes(Number(category)));

    // apply date filter & sort by date latest first
    if (date === "Date Descending")
      data = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (date === "Date Ascending")
      data = data.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (year)
      data = data.filter(
        (news) => new Date(news.date).getFullYear() === Number(year)
      );

    // apply category_filter & site_section filters if applicable
    // return data if site_section array includes filters
    if (site_section) {
      data = data.filter((item) => {
        let postSections = item.site_sections;
        // check if postSections array contains site_section ids
        return postSections.some((item) => site_section.includes(item));
      });
    }
    // return data if site_section array includes filters
    if (category_filter) {
      data = data.filter((item) => {
        let categories = item.categories;
        // check if category_filter array contains site_section ids
        return categories.some((item) => category_filter.includes(item));
      });
    }

    if (input) setSearchValue(input);
    if (category) setCategoryValue(category);
    if (date) setDateValue(date);
    if (year) setYearValue(year);

    setPostList(data);
  };

  // SERVERS ---------------------------------------------
  const ServeFilter = () => {
    if (!has_search) return null;

    const ServeTitle = () => {
      return (
        <div
          className="flex primary-title"
          style={{ fontSize: 26, alignItems: "center", paddingBottom: `0.5em` }}
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
            gridTemplateColumns: !lg ? `100px 1fr 1fr 1fr` : "1fr",
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
          <div
            style={{
              position: "relative",
              padding: !lg ? `1em 0` : `1em`,
              width: !lg ? `70%` : `100%`,
            }}
          >
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
        <NewsCarouselComponent block={postList} categoryList={categoryList} />
      );

    return (
      <div>
        <NewsBlock
          block={postList}
          categoryList={categoryList}
          layout={layout}
        />
      </div>
    );
  };

  const ServeMoreAction = () => {
    // if postList is empty || lest than post_limit return null
    if (
      isLayoutOne ||
      postList.length === 0 ||
      postList.length < post_limit ||
      !post_limit ||
      post_limit === "0"
    )
      return null;

    const value = !loadMoreRef.current ? "Less" : " Load More";

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
