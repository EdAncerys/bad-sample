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
import {
  useAppDispatch,
  useAppState,
  muiQuery,
  setNesMediaIdFilterAction,
  getNewsData,
  getMediaCategories,
  hasPermisionLevel,
  Parcer,
} from "../../context";

const NewsAndMedia = ({ state, actions, libraries, block }) => {
  const { sm, md, lg, xl } = muiQuery();

  const dispatch = useAppDispatch();
  const { newsMediaCategoryId, isActiveUser, dynamicsApps } = useAppState();

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
  // console.log("🐞 N&M", block); // debug

  const isLayoutOne = layout === "layout_one";

  const [postList, setPostList] = useState(null);
  const [filterList, setFilterList] = useState(null);
  const [categoryList, setCategoryList] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [yearValue, setYearValue] = useState("");
  const [isSearch, setIsSearch] = useState(false);

  const searchFilterRef = useRef("");
  const postChunkRef = useRef(8);

  let marginVertical = state.theme.marginVertical;
  if (disable_vertical_padding) marginVertical = 0;

  // HELPERS --------------------------------------------------------------------------
  const handleMembersOnlyAccess = ({ data, categoryData }) => {
    // --------------------------------------------------------------------------------
    // 📌  Handle members only access permision
    // --------------------------------------------------------------------------------

    let membersOnly = ["circular", "newsletter", "bulletin"];
    let membersOnlyList = [];

    // 📌 check if user has permission to view news & media
    if (
      isActiveUser &&
      isActiveUser.bad_selfserviceaccess === state.theme.serviceAccess &&
      isActiveUser.core_membershipstatus !== state.theme.frozenMembership
    )
      return data;

    // 📌 apply filters on news & media data
    // get id of all categories that include members only
    if (categoryData)
      membersOnlyList = categoryData.filter((item) => {
        const catName = item.name.toLowerCase();
        let isMemberOnly = false;

        membersOnly.forEach((item) => {
          if (catName.includes(item)) isMemberOnly = true;
        });

        if (isMemberOnly) return item.id;
      });

    data = data.filter((post) => {
      let categories = post.categories;
      let isMemberOnly = false;
      // map threach membersOnlyList and check if id is present in categories
      membersOnlyList.forEach((item) => {
        if (categories && categories.includes(item.id)) isMemberOnly = true;
      });

      return !isMemberOnly;
    });

    return data;
  };

  useEffect(async () => {
    let categoryData = await getMediaCategories({ state });
    let data = await getNewsData({ state });
    if (post_limit) postChunkRef.current = Number(post_limit);
    data = handleMembersOnlyAccess({ data, categoryData });

    if (site_section) {
      // convert site_section to Object

      data = data.filter((item) => {
        let postSections = item.site_sections;
        if (!postSections) return false;

        // convert site_section to Object
        const sectionFilters = Object.values(site_section);

        // check if postSections array contains site_section ids
        let isMatch = sectionFilters.some((section) => {
          return postSections.includes(section);
        });

        return isMatch;
      });
    }
    // return data if site_section array includes filters
    if (category_filter) {
      data = data.filter((item) => {
        let categories = item.categories;
        if (!categories) return false;

        return categories.some((item) => category_filter.includes(item));
      });
    }

    // apply sort by date
    data = data.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    let filterList = data;
    if (newsMediaCategoryId) {
      // ⚠️ if newsMediaCategoryId is set, filter data by category
      filterList = filterList.filter((item) => {
        let categories = item.categories;
        if (!categories) return false;

        return categories.includes(newsMediaCategoryId);
      });
    }

    setCategoryList(categoryData);
    setIsSearch(has_search);
    setPostList(data);
    // 📌 data component with post limits applied
    setFilterList(filterList.slice(0, postChunkRef.current));

    return () => {
      searchFilterRef.current = ""; // clean up function
    };
  }, [isActiveUser]);

  useEffect(() => {
    // --------------------------------------------------------------------------------
    // 📌  serach & filters
    // --------------------------------------------------------------------------------

    if (!postList || !isSearch) return null; // component state bug. If isSearch dont update post list state
    let data = postList;

    // if all filters are applied are null then set filterList to postList
    if (!searchValue && !dateValue && !yearValue && !newsMediaCategoryId) {
      setFilterList(data.slice(0, postChunkRef.current));
      return;
    }

    // apply sort by date functionality
    data = data.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (searchValue) {
      data = data.filter((news) =>
        news.title.rendered.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (newsMediaCategoryId)
      data = data.filter((news) => {
        let categories = news.categories;
        if (!categories) return false;
        return categories.includes(newsMediaCategoryId); // filter by category
      });

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
      data = data.slice(0, postChunkRef.current); // apply limit on posts
    }

    setFilterList(data); // set post data
  }, [newsMediaCategoryId, searchValue, dateValue, yearValue]);

  if (!filterList || !categoryList) return <Loading />;

  if (postList.length === 0 && !isSearch) return null; // hide block if no posts

  // SERVERS ---------------------------------------------
  const ServeFilter = () => {
    if (!isSearch) return null;

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
              // doon't show Uncategorized category
              if (item.name === "Uncategorized") return null;
              // check if name includes circular newsletters bulletin
              let membersOnly = ["circular", "newsletter", "bulletin"].some(
                (word) => item.name.toLowerCase().includes(word)
              );
              let serviceAccess = false;
              if (
                isActiveUser &&
                isActiveUser.core_membershipstatus !==
                  state.theme.frozenMembership
              )
                serviceAccess =
                  isActiveUser.bad_selfserviceaccess ===
                  state.theme.serviceAccess;
              // 📌 if user has permission to view news & media
              if (membersOnly && !serviceAccess) return null;

              // apply filters for selected category in category_filter
              //render only taxonomy categories that are selected in category_filter in wp
              if (category_filter && !category_filter.includes(item.id))
                return null;

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
            <Parcer libraries={libraries} html={catName} />
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

  const ServeMoreOption = () => {
    const postLength = postList.length;
    let moreOption = postLength > postChunkRef.current;
    // 📌 hide if any of the filter is selected
    if (
      newsMediaCategoryId ||
      dateValue ||
      yearValue ||
      searchValue ||
      !post_limit ||
      isLayoutOne // if layout is carousel then hide more option
    )
      moreOption = false;

    const handleLoadMore = () => {
      // increment postChunkRef chunk size by 8
      let newChunkSize = postChunkRef.current + 8;
      postChunkRef.current = newChunkSize;

      setFilterList(postList.slice(0, postChunkRef.current));
    };

    if (!moreOption) return null;

    return (
      <div
        className="flex"
        style={{ alignContent: "center", justifyContent: "center" }}
      >
        <div
          className="blue-btn"
          style={{ width: "fit-content" }}
          onClick={handleLoadMore}
        >
          See More
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
        <TitleBlock block={block} margin={isSearch ? 0 : `0 0 1em 0`} />
      </BlockWrapper>
      <ServeFilter />
      <BlockWrapper>
        <ServeLayout />
        <ServeMoreOption />
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
