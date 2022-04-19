import { useState, useEffect, useRef } from "react";
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
import {
  useAppDispatch,
  useAppState,
  muiQuery,
  setNesMediaIdFilterAction,
} from "../../context";

const NewsAndMedia = ({ state, actions, libraries, block }) => {
  const { sm, md, lg, xl } = muiQuery();

  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.
  const dispatch = useAppDispatch();
  const { newsMediaCategoryId } = useAppState();

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
  const [dateValue, setDateValue] = useState("");
  const [yearValue, setYearValue] = useState("");

  const searchFilterRef = useRef("");
  const postChunkRef = useRef(Number(post_limit) || 8);

  const marginHorizontal = state.theme.marginHorizontal;
  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  useEffect(async () => {
    // pre fetch post data
    let iteration = 0;
    let data = Object.values(state.source.post);
    while (data.length === 0) {
      // if iteration is greater than 10, break
      if (iteration > 15) break;
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

    if (state.source.category) {
      const catList = Object.values(state.source.category);
      setCategoryList(catList);
    }

    setPostList(data);

    return () => {
      searchFilterRef.current = ""; // clean up function
    };
  }, []);

  useEffect(() => {
    let data = Object.values(state.source.post);
    // apply sort by date functionality
    data = data.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (searchValue) {
      data = data.filter((news) =>
        news.title.rendered.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (newsMediaCategoryId)
      data = data.filter((news) =>
        news.categories.includes(Number(newsMediaCategoryId))
      );

    // apply date filter & sort by date latest first
    if (dateValue === "Date Descending")
      data = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (dateValue === "Date Ascending")
      data = data.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (yearValue)
      data = data.filter(
        (news) => new Date(news.date).getFullYear() === Number(yearValue)
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

    // if all filters are not applied, apply limit on posts
    if (!newsMediaCategoryId && !searchValue && !dateValue && !yearValue) {
      data = data.slice(0, Number(postChunkRef.current)); // apply limit on posts
    }

    setPostList(data); // set post data
  }, [newsMediaCategoryId, searchValue, dateValue, yearValue]);

  if (!postList || !categoryList) return <Loading />;

  if (postList.length === 0 && !has_search) return null; // hide block if no posts

  // HELPERS ----------------------------------------------------------------
  const handleLoadMoreFilter = () => {
    let data = Object.values(state.source.post); // add postList object to data array

    // apply sort by date functionality
    data = data.sort((a, b) => new Date(b.date) - new Date(a.date));

    // increment postChunkRef by 8
    postChunkRef.current = postChunkRef.current + Number(post_limit) || 8;

    // apply limity on posts
    if (post_limit && Number(post_limit) !== 0)
      data = data.slice(0, Number(postChunkRef.current)); // apply limit on posts

    setPostList(data); // set post data
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
            value={newsMediaCategoryId}
            onChange={(e) =>
              setNesMediaIdFilterAction({
                dispatch,
                newsMediaCategoryId: Number(e.target.value),
              })
            }
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
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
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
            value={yearValue}
            onChange={(e) => setYearValue(e.target.value)}
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
          <div className="filter-icon" onClick={() => setSearchValue("")}>
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
      if (!newsMediaCategoryId) return null;

      let catName = categoryList.filter(
        (category) => category.id === Number(newsMediaCategoryId)
      );
      catName = catName[0] ? catName[0].name : "N/A";

      return (
        <div className="shadow filter">
          <div>
            <Html2React html={catName} />
          </div>
          <div
            className="filter-icon"
            onClick={() =>
              setNesMediaIdFilterAction({
                dispatch,
                newsMediaCategoryId: "",
              })
            }
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
          <div className="filter-icon" onClick={() => setDateValue("")}>
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
          <div className="filter-icon" onClick={() => setYearValue("")}>
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
                handleSearch={() =>
                  setSearchValue(searchFilterRef.current.value)
                }
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
    // newsMediaCategoryId, searchValue, dateValue
    if (
      newsMediaCategoryId ||
      searchValue ||
      dateValue ||
      yearValue ||
      postList.length < postChunkRef.curent
    )
      return null;

    return (
      <div
        className="flex"
        style={{
          justifyContent: "center",
          padding: `${state.theme.marginVertical}px 0`,
        }}
      >
        <div className="transparent-btn" onClick={handleLoadMoreFilter}>
          Load More
        </div>
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
